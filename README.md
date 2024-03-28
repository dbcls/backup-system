# DBCLS Backup System: Zuke

## 概要

- DBCLS 内の物理サーバ上のデータのバックアップを行うためのシステム
  - 天災や人災によるデータの損失に備える
- 単に `rsync` を設定するだけだと、コストが掛かりすぎる
- そのため、データごとにコスト感などを確認しつつ、バックアップポリシー (e.g., バックアップ頻度、バックアップ先) を管理しなければならない
  - -> GUI として、バックアップポリシー管理 app を実装する
- 更に、設定されたポリシー (実体としては Json) を元に、実際の backup 処理を行う script を実装する
  - この script を cron などで定期的に実行する

## Components

- `zuke-gui`
  - バックアップポリシー管理 app
  - script でさらってきた、file ストを展開して、User がそれぞれの file に対してバックアップポリシーを設定する
    - この際、コスト感などを意識しつつ、設定できるようにする
  - SPA として実装する
    - github.io などに deploy する
  - 状態の永続化は行わず、状態の import/export button を実装する
- `zuke-cli`
  - `zuke-gui` で設定されたポリシーを元に、実際の backup 処理を行う cli
  - cron などで定期的に実行する
    - cron の設定や、cli の command などは、`gui` の方で生成できるようにしておく

## Backup Policy

データに紐づくポリシーの設定項目として、以下が考えられる

- バックアップ頻度
  - e.g., daily, weekly, monthly
- バックアップ先
  - file storage (e.g., linux storage) or object storage (e.g., s3)
  - バックアップ方式により、決定される
    - incremental backup -> file storage
    - full backup -> object storage
  - object storage の中でも、更に tape storage なども選択に上がる
- バックアップ方式
  - full backup か incremental backup (差分 backup) か
- バックアップの世代管理 (保持期間)
  - incremental backup が 1 世代の場合、実質的に full backup と同じ
  - full backup を複数世代保持するということは、一旦考慮しない
- バックアップの暗号化
  - する or しない
  - -> 今回は storage 側の機能で暗号化する
- バックアップの圧縮
  - する or しない
  - -> 今回は、可能な限り圧縮を行う

それぞれのデータの特性に応じて、これらのポリシーを設定するべきであるが、同時に、コストも考慮しなければならない。
そのため、下記のようなバックアップポリシーとバックアップ方式 (コストを含む) の対応表を作成した。
ユーザは、ポリシーを細かく設定するのではなく (可能だがユーザの負担増、要 PoC)、ある程度整理されたバックアップ方式をコストを考慮しつつ選択する。

| 頻度 | 方式 | 世代管理 | バックアップ方式 |
| --- | --- | --- | --- |
| daily | full/inc. | 1 gen. | object storage に backup。更新頻度が高く、size が小さいデータを想定 |
| daily | full | 7 gen. | 考慮しない ("object storage に full" と "file storage に inc." のコスト感を後述する) |
| daily | inc. | 7 gen. | file storage に rsync。更新頻度が高く、size が小さいデータを想定 |
| weekly | full/inc. | 1 gen. | object storage に backup。更新頻度が比較的低いデータを想定 |
| weekly | inc. | 4 gen. | file storage に rsync。更新頻度が比較的低いデータを想定 |
| monthly | full/inc. | 1 gen. | object storage (tape) に backup。データ量が大きく重要性の高いデータを想定 |

- 上の表は網羅性としては、不十分である
  - 例えば、`monthly - inc. - 6 gen.` なども考えられるが、データ量が大きいものを file storage に差分 backup するのはコストが掛かりすぎて現実的でない部分もある
    - 保持し続けるだけでコストが掛かるため、可用性のための backup としては適切ではない
  - そのため、バックアップ方式を選ぶ UI からは、このような選択肢を削除する
    - ポリシーを細かく設定する UI も考えられる
      - 両方、検証してみて pros./cons. を検討する

## データの保存先の調査・検討

要件として、可用性や耐障害性が求められるため、機関インフラ内で NAS などを運用し、そこをデータの保存先とすることは考慮しない

### まとめ

下の内容をコストを考慮し先にまとめたもの

#### file storage (for rsync)

t3.medium 相当のインスタンス + 10 TB storage を利用すると想定 (data upload 料金はどこも基本的に無料)

- `さくらインターネット`
  - 114,620 yen/month
- `AWS EC2 + EBS (gp2, SSD)`
  - 274,514 yen/month
- `AWS EC2 + EBS (st1, HDD, アトランタ)`
  - 105,764 yen/month
- `AWS EC2 + EBS (sc1, コールド HDD, アトランタ)`
  - 38,264 yen/month
- `AWS EC2 + EFS (standard)`
  - 244,514 yen/month
- `AWS EC2 + EFS (low freq. access)`
  - 24,514 yen/month

#### object storage (for full backup)

1 GB あたりの料金を比較

- `さくらインターネット`
  - 4.95 yen/month (ただし、転送量 8.8 yen/GB)
- `S3 標準`
  - 3.75 yen/month
- `S3 標準 - 低頻度アクセス` (ミリ秒単位のアクセスが必要な、長期保管だがアクセス頻度の低いデータ)
  - 2.07 yen/month
- `S3 Glacier Instant Retrieval` (ミリ秒単位で瞬時に取り出し、四半期に 1 回アクセスするような長期保存のアーカイブデータ)
  - 0.75 yen/month

### 機関 object storage

- "オブジェクトストレージ@柏Ⅱ"
  - ActiveScale (S3 互換)
  - 300TB
  - S3 互換 API が提供されているが、そちらを利用せず、rsync 先の file storage として利用することも可能だと思われる

### さくらインターネット

- 大口としての契約は問い合わせが必要
- いわゆるインスタンス貸しは "さくらクラウド"
  - <https://cloud.sakura.ad.jp>
  - データの転送量は無料
  - 石狩リージョンと東京リージョンが選択可能
    - 石狩リージョンの方が安価かつ、可用性を考慮すると石狩の方が better
  - 12 TB で 132,000 yen/month
    - 11.0 yen/month
    - 2core + 4GB (t3.medium 相当) の使用料は 4,620 yen/month
- オブジェクトストレージ
  - <https://cloud.sakura.ad.jp/specification/object-storage/>
  - データの転送量は無料
    - だが、10 GB / month を超えると 1GB あたり 8.8円
    - upload or download かの記述はなし
  - S3 互換 API を提供
  - 1GB あたり 4.95円

### AWS

- わかりやすい資料として
  <https://pages.awscloud.com/rs/112-TZM-766/images/AWS-04_AWS_Summit_Online_2020_STG01.pdf>
- Block Storage (File Storage)
  - Amazon Elastic Block Store (EBS)
    - EC2 にアタッチして利用するブロックストレージ
      - rsync 的に世代 backup したいならこちら
      - <https://aws.amazon.com/jp/ebs/pricing/>
        - 東京・大阪リージョンの場合、`汎用 SSD (gp2) ボリューム` (SSD) しか利用できない
          - HDD だと `スループット最適化 HDD (st1)` や `コールド HDD (sc1)` がある (アトランタリージョン)
            - st1: 1 GB あたり 10.125 yen/month
            - sc1: 1 GB あたり 3.375 yen/month
        - 1 GB あたり 27 yen/month
          - -> さくらインターネットの方が安価
        - インターネット -> EC2 への転送量は無料
          - ref: <https://aws.amazon.com/jp/ec2/pricing/on-demand/#Data_Transfer>
        - EC2 instance t3.medium (2core, 4gb) の料金は 4514.4 yen/month
  - Amazon EC2 Instance Store
    - <https://repost.aws/ja/knowledge-center/instance-store-vs-ebs>
      - "インスタンスストアを一時的なストレージとして使用します。インスタンスストアボリュームに保存されたデータは、インスタンスの停止、終了、またはハードウェア障害が発生しても保持されません。"
      - -> EBS を使うべき
- File Storage
  - Amazon Elastic File System (EFS)
    - EC2 に NFS mount する storage
      - size はデータ量に応じて自動拡張される
    - EC2 からのデータ転送は無料
    - <https://aws.amazon.com/jp/efs/pricing/>
      - 大阪リージョンを想定
      - スタンダード: 1 GB あたり 24 yen/month
      - 低頻度アクセス (四半期に数回しかアクセスされないデータに対してコスト最適化): 1 GB あたり 2 yen/month
- Object Storage
  - Amazon Simple Storage Service (S3)
    - upload は無料
    - download は deep なほど高価 (e.g., S3 Glacier: 3.3 yen/GB)
    - <https://aws.amazon.com/jp/s3/pricing/>
      - 大阪リージョンを想定
      - S3 標準: 1 GB あたり 3.75 yen/month
      - S3 標準 - 低頻度アクセス (ミリ秒単位のアクセスが必要な、長期保管だがアクセス頻度の低いデータ): 1 GB あたり 2.07 yen/month
      - S3 Glacier Instant Retrieval (ミリ秒単位で瞬時に取り出し、四半期に 1 回アクセスするような長期保存のアーカイブデータ): 1 GB あたり 0.75 yen/month
      - S3 Glacier Deep Archive (1 年に 1〜2 回アクセスされ、12 時間以内に復元できる長期のデータアーカイブ): 1 GB あたり 0.3 yen/month
        - -> 最短保存期間が 180 日なので、今回の要件には合わないと思われる
