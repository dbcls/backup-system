# DBCLS Backup System: Zuke

A backup system for DBCLS internal physical servers.

Application is available at [https://dbcls.github.io/backup-system/](https://dbcls.github.io/backup-system/).

**ともかく、試してみたいという方向けのドキュメント -> [./quick_start.md](./quick_start.md)**

## Abstract

- DBCLS 内の物理サーバ上のデータのバックアップを行うためのシステム
  - 天災や人災によるデータの損失に備える
- 単に `rsync` を設定するだけだと、コストが掛かりすぎる
- そのため、データごとにコスト感などを確認しつつ、バックアップポリシー (e.g., バックアップ頻度、バックアップ先, etc.) を設定・管理しなければならない
  - GUI として、バックアップポリシー管理 app (Zuke)
- 更に、設定されたポリシー (実体としては JSON) を元に、実際の backup 処理を行う script も出力する
  - この script を cron などで定期的に実行することで、バックアップを実現する

## Zuke

- バックアップポリシー設定・管理 app
- 実体としては、React で書かれた Single Page Application (SPA)
  - 外部通信/情報の永続化などは行わない
    - -> 代わりに State の Import/Export 機能を実装する
  - GitHub Pages に deploy されている
    - -> [https://dbcls.github.io/backup-system/](https://dbcls.github.io/backup-system/)
- App 内の手順として、
  - `"1. File List の読み込み"`: Server 上で、script (`du` や `find`) を実行し、App に読み込ませる
  - `"2. Backup Policy の設定"`: File ごとに、Policy (頻度や Backup 先) を設定する
  - `"3. Server での設定"`: 生成された Backup script を Server 上に設定する
- 汎用的なものとして実装する
  - 一度、日本語で PoC を作成し、その結果をもって完全英語化するかを検討する

### FAQ

- "実際にどうやって backup しているの？"
  - 実処理は、[./src/public/backup.sh](./src/public/backup.sh) を参照
  - `aws s3 sync` を用いています
- "sync の基準は？"
  - s3 sync の仕様 でかつ `--delete` と `--exact-timestamps` を用いています
  - つまり、size が異なる or timestamp が異なるファイルは変更されたとみなされ、同期されます
  - また、同期元のファイルが削除された場合、同期先のファイルも削除されます
- "symlink はどうなる？"
  - S3 が symlink をサポートしていないため対応できません
- "Directory の中に新しく file や directory が追加された場合は？"
  - その parent directory の policy に従って、新しい file や directory が backup されます

### Zuke Server の建て方

基本的に、GitHub Pages に deploy されているものを使うことを想定していますが、S3 Config の default value などを変更する場合は、以下の手順で Server を建てることができます。

```bash
$ cat compose.yml | grep DEFAULT
    #   - ZUKE_S3_DEFAULT_ENDPOINT_URL=http://localhost:9000
    #   - ZUKE_S3_DEFAULT_BUCKET_NAME=
    #   - ZUKE_S3_DEFAULT_ACCESS_KEY_ID=
    #   - ZUKE_S3_DEFAULT_SECRET_ACCESS_KEY=
    #   - ZUKE_S3_DEFAULT_HTTP_PROXY=

# 必要に応じて、上記のコメントアウトを外して、必要な情報を記述する

$ docker compose up -d
# Access to http://localhost:3000
```

### ポリシーの事前設定 (for Admin)

- バックアップポリシーについての考察は、別 docs [./backup_policy.md](./backup_policy.md) を参照
- Admin は、ポリシー (e.g., バックアップ頻度、バックアップ先, etc.) を事前に設定する
  - [`./src/policyConfig.json`](./src/policyConfig.json) に記述する
  - [`./src/policyDocs.md`](./src/policyDocs.md) には、レンダリングしたいドキュメントを記述する
- この File の中身の例として、

```json
{
  "dollarToYen": 150,
  "policyConfig": [
    {
      "id": "daily",
      "label": "Daily",
      "generation": 7,
      "interval": 1,
      "diffRatio": 1,
      "costPerMonth": 0.025,
      "constCost": 0
    },
    {
      "id": "weekly",
      "label": "Weekly",
      "generation": 4,
      "interval": 7,
      "diffRatio": 0.1,
      "costPerMonth": 0.02,
      "constCost": 29.95
    },
  ]
}
```

それぞれの項目の説明として、

```typescript
/*
* - id: ポリシーの ID
* - label: ポリシーの Label (Button に表示される文字列)
* - generation: 何世代分保持するか
* - interval: 何日ごとに full backup するか (e.g., daily なら 1, weekly なら 7)
* - diffRatio: incremental backup の差分データ量の割合 (0.01 なら 1%)
*   - 1 の場合、Full Backup となる
* - costPerMonth: GB あたりの 1 ヶ月分のコスト (USD、0.01 USD/GB/month なら 0.01)
* - constCost: 固定コスト (e.g., AWS EC2 インスタンス, 月額 USD)
*/
export interface PolicyConfig {
  id: string
  label: string
  generation: number
  interval: number
  diffRatio: number
  costPerMonth: number
  constCost: number
}
```

必要に応じて、これらの File を変更することで、ポリシーの設定を変更できる。

- 補足:
  - 主に admin (zuke をあげる人) が設定するもの
  - このファイルを編集するような、細かい設定を行いたいユースケースは存在するが、ユーザの認知負荷とのトレードオフなため、一旦この項自体 Under development とする
    - ここまで、読んだ人すみません。。。

### AWS Environment

See [./aws_env.md](./aws_env.md) for details.

### 復旧方法

- Under development (TODO)
- 環境に強く依存する部分だから汎用化が難しい
  - 復旧する際は、そのまま戻すのではなく、環境自体 (e.g., サーバのハードウェア, etc.) が刷新されるはず

### Development

開発環境:

```bash
docker compose -f compose.dev.yml up -d --build
docker compose -f compose.dev.yml exec npm run dev
```

Release:

```bash
bash release.sh <version>
# 1. 設定ファイルの version を更新
# 2. git commit & tag & push
# (3. GitHub Actions で自動的に image/release/pages が生成・公開される)
```

### Tests

See [./tests/README.md](./tests/README.md) for details.

## License

This project is licensed under [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0).
See the [LICENSE](./LICENSE) file for details.
