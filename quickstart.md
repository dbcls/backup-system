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

## 2. mock データを生成する
