# Quick Start

zuke の使い方を簡単な例を通じて説明するためのドキュメント

## Overview

- ローカルに [minio](https://min.io) (S3 互換のオブジェクトストレージ) を立てて、そこにバックアップを取ります
- バックアップ対象のデータは、mock として生成します
- zuke 本体は、GitHub Pages に deploy されているものを使います

## Requirements

- Host Machine の Requirements として、以下が必要です
  - Docker and Docker Compose
  - jq
  - awscli (`aws` コマンド)
- また、Linux (Ubuntu) での動作確認しかしていません (恐らく macOS でも動くと思います)

## 1. ローカルに minio を立てる

[./compose.minio.yml](./compose.minio.yml) を使って、ローカルに minio を立てます

```bash
docker compose -f compose.minio.yml up -d
```

これで、`http://localhost:9000` にアクセスすると、minio の Web UI が表示されます

<img width="800" alt="minio_0" src="https://github.com/user-attachments/assets/98733fe8-252a-4b48-8d02-15e445377b35">

Username と Password は、上の compose file に設定されており、Default は、

- Username: `zuke-admin-user`
- Password: `zuke-admin-password`

です。`Create Bucket` から、Bucket を作っていきましょう。

<img width="800" alt="minio_1" src="https://github.com/user-attachments/assets/c459e2a7-7f9b-4828-bb38-689f23ab7b30">

適当な Bucket 名 (この例では `zuke-test-bucket`) をつけ、作成します。

次に、アクセスキーを生成します。左側のバーから、`Access Keys` を選択し、`Create Access Key` ボタンで、生成します。

<img width="800" alt="minio_2" src="https://github.com/user-attachments/assets/35792f16-cb6d-4c45-88c4-c9bf92a14440">

<img width="800" alt="minio_3" src="https://github.com/user-attachments/assets/44ca07be-be8d-4046-942c-727c37c4dd4f">

<img width="800" alt="minio_4" src="https://github.com/user-attachments/assets/46d88a2c-24ae-4eb7-9e7c-b7bd824ceff1">

生成された `Access Key` と `Secret Key` は、後ほど使うため、メモしてください。(もしくは、json file として download する。)

## 2. mock データを生成する

バックアップ対象のデータ の mock を生成します。[./tests/generate_test_data.sh](./tests/generate_test_data.sh) を使います。
この script は、`./tests/test_data` 以下に `dd` を使って適当な mock file を生成します。

```bash=
# dbcls/backup-system の GitHub repo. を clone してくる
$ ls
aws_env.md         Dockerfile         policy_config.md  tests
backup_policy.md   Dockerfile-dev     quickstart.md     tsconfig.json
compose.dev.yml    LICENSE            README.md         tsconfig.node.json
compose.minio.yml  package.json       release.sh        vite.config.ts
compose.yml        package-lock.json  src
$ cd tests
$ bash ./generate_test_data.sh 
Created directory: /home/suecharo/sandbox/backup-system/tests/test_data/var
Created directory: /home/suecharo/sandbox/backup-system/tests/test_data/var/data
Created directory: /home/suecharo/sandbox/backup-system/tests/test_data/var/data/config
...
$ tree ./test_data
./test_data
└── var
    ├── data
    │   ├── config
    │   │   ├── config1.json
    │   │   ├── config2.json
    │   │   └── config3.json
...
```

## 3. Zuke で Policy を設定する

[https://dbcls.github.io/backup-system/](https://dbcls.github.io/backup-system/) に zuke が deploy されているため、それを使います。

基本的に、上から順に実行します。
まず、`zuke - 1. File List の読み込み` として、`get_file_list.sh` を、先程の `test_data` dir 近くに download し、実行します。

```bash=
$ ls
generate_test_data.sh  get_file_list.sh  README.md  test_data
$ bash ./get_file_list.sh ./test_data > file_list.jsonl
$ head file_list.jsonl 
{"path": "/home/suecharo/sandbox/backup-system/tests/test_data", "size": 154003, "type": "directory"}
{"path": "/home/suecharo/sandbox/backup-system/tests/test_data/var", "size": 149907, "type": "directory"}
{"path": "/home/suecharo/sandbox/backup-system/tests/test_data/var/data", "size": 129427, "type": "directory"}
{"path": "/home/suecharo/sandbox/backup-system/tests/test_data/var/data/database.db", "size": 4096, "type": "file"}
{"path": "/home/suecharo/sandbox/backup-system/tests/test_data/var/data/logs", "size": 48128, "type": "directory"}
{"path": "/home/suecharo/sandbox/backup-system/tests/test_data/var/data/logs/logfile2.log", "size": 1024, "type": "file"}
{"path": "/home/suecharo/sandbox/backup-system/tests/test_data/var/data/logs/logfile3.log", "size": 1024, "type": "file"}
{"path": "/home/suecharo/sandbox/backup-system/tests/test_data/var/data/logs/logfile4.log", "size": 1024, "type": "file"}
{"path": "/home/suecharo/sandbox/backup-system/tests/test_data/var/data/logs/logfile5.log", "size": 1024, "type": "file"}
{"path": "/home/suecharo/sandbox/backup-system/tests/test_data/var/data/logs/logfile7.log", "size": 1024, "type": "file"}
```

生成された、`file_list.jsonl` を zuke に読み込ませます。

次に、`zuke - 2. Backup Policy の設定` として、適当な policy を設定します。

<img width="800" alt="zuke_0" src="https://github.com/user-attachments/assets/c7bbd350-e001-4956-8860-6dadaae5ffdc">

最後に、`zuke - 3. Server での設定` として、最初に立てた minio の bucket の情報を入力し、script がまとまった zip file を download します。

<img width="800" alt="zuke_1" src="https://github.com/user-attachments/assets/625869f5-0319-4055-b02b-9d4d25d3f0b4">

zip file の中にある、`backup.sh` を実行します。

```bash=
$ ls | grep zuke
zuke-scripts-240819-125849.zip
$ unzip zuke-scripts-240819-125849.zip
Archive:  zuke-scripts-240819-125849.zip
 extracting: backup.sh               
 extracting: backup_files.json       
 extracting: policy_configs.json     
 extracting: s3_config.json 
$ cd zuke-scripts-240819-125849
$ ls ./
backup.sh            policy_configs.json
backup_files.json    s3_config.json
$ bash ./backup.sh --policy daily
$ bash ./backup.sh --policy daily
[2024-08-19 13:03:34] Start daily backup
upload: sandbox/backup-system/tests/test_data/var/data/config/config1.json to s3://zuke-test-bucket/home/suecharo/sandbox/backup-system/tests/test_data/var/data/config/config1.json
upload: sandbox/backup-system/tests/test_data/var/data/config/config2.json to s3://zuke-test-bucket/home/suecharo/sandbox/backup-system/tests/test_data/var/data/config/config2.json
upload: sandbox/backup-system/tests/test_data/var/data/config/config3.json to s3://zuke-test-bucket/home/suecharo/sandbox/backup-system/tests/test_data/var/data/config/config3.json
...
```

minio の console に戻り、bucket の中身を確認すると、directory 構造を保ったまま、daily として設定した file 群が backup されています。

<img width="800" alt="minio_5" src="https://github.com/user-attachments/assets/4ea349a3-6852-4ce7-990a-e078135db165">

なので、`bash ./backup.sh --policy <daily|weekly|monthly>` などの command を crontab などに適切に設定し、実行する。
