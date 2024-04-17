# Zuke-cli

- Server 上で実行される script 群
- `../zuke-gui/src/assets` 以下にも同じ script 群
  - gui 側で配信するか、github の raw content を参照するか未定

## `get_file_list.sh`

- server 上の file list を取得してくる script
- zuke-gui で読み込む

Usage:

```bash
./get_file_list.sh -d <depth> <file_path | dir_path>
```

## Backup script

- 実装案として、
  - 1. Backup policy を元に zuke-gui 側で自動生成する
  - 2. 前もって script を書いておき、policy を入力とする
- 内部で叩くコマンドとして、`rsync`, `s3`, `rclone`, etc.
  - macOS の TimeMachine も `rsync` の機構で実装されている
    - ref.: linux 版の TimeMachine
      - <https://github.com/cytopia/linux-timemachine>
- その他考慮するべき点として、
  - Disk io
    - `ionice -c2 -n7 rsync` などで、disk IO を制限するべき
  - CPU/Memory
    - `nice` command で制限する
  - Network IO
    - `tc tbf|netem` で上限を決める
  - 死活監視
    - Slack notification など

## 復旧方法

- 未定
- Upload 先の Data location を管理するのはやっておかなければならない
