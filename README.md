# DBCLS Backup System: Zuke

A backup system for DBCLS internal physical servers.

Application is available at [https://dbcls.github.io/backup-system/](https://dbcls.github.io/backup-system/).

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
  - 1. `"File List の読み込み"`: Server 上で、script (`du` や `find`) を実行し、App に読み込ませる
  - 2. `"Backup Policy の設定"`: File ごとに、Policy (頻度や Backup 先) を設定する
  - 3. `"3. Server での設定"`: 生成された Backup script を Server 上に設定する
- 汎用的なものとして実装する
  - 一度、日本語で PoC を作成し、その結果をもって完全英語化するかを検討する

### ポリシーの事前設定

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

### Backup Script 生成

- Under development (TODO)
- Server Location や S3 Bucket の情報も渡さなければならない
- Discussion として、
  - GUI の画面上に、生成された script を表示する
  - `rsync`, `s3`, `rclone`, etc. などを実行する script になると思われる
  - 考慮するべき点として、
    - Disk IO
      - `ionice -c2 -n7 rsync` などで制限する？
    - CPU/Memory Usage
      - `nice` などで制限する？
    - Network IO
      - `tc tbf | netem` などで制限する？
    - 死活監視
      - Slack notification などを設定できるようにする？
- 複雑なことをしたくなると、CLI command を用意して、それに JSON を渡したくなるが、CLI command のメンテナンス性や寿命とのトレードオフになる (例えば、Python の Version の変更など)
  - -> なるべく、メンテナンスフリーで長期間稼働してほしい

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

## License

This project is licensed under [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0).
See the [LICENSE](./LICENSE) file for details.
