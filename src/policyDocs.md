# 各 Policy の説明

## Daily

- Object Storage (AWS S3 標準) に Full Backup します
- 毎日 Backup し、7世代分保持します
- 更新頻度が高く、Size が小さいデータを想定しています
- 1ヶ月あたり `0.025 USD/GB` かかります

## Weekly

- File Storage (AWS EFS 低頻度アクセス) に `rsync` で Incremental Backup します
- 毎週 Backup し、4世代分保持します
- 更新頻度が比較的低いデータを想定しています
- 1ヶ月あたり `0.20 USD/GB` かかります
- 上のストレージのコストに加えて、EC2 インスタンスのコスト (e.g., t3.medium - `29.95 USD/month`) がかかります

## Monthly

- Object Storage (AWS S3 低頻度アクセス) に Full Backup します
- 毎月 Backup し、1世代分保持します
- 更新頻度が低いが、重要性が高いデータを想定しています
- 1ヶ月あたり `0.0125 USD/GB` かかります
