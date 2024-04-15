#!/bin/bash

# Usage: ./get_file_list.sh -d <depth> <file_path | dir_path> > output.jsonl

set -u

# Argument parsing
depth=2

while getopts d: OPT; do
    case $OPT in
    d) depth=$OPTARG ;;
    \?)
        echo "Usage: $0 [-d depth] <file_path | dir_path>"
        exit 1
        ;;
    esac
done

shift $((OPTIND - 1))

if [[ $# -ne 1 ]]; then
    echo "Usage: $0 [-d depth] <file_path | dir_path>"
    exit 1
fi

argPath=$1

# argPath 以下に find して Permission Denied が出ないか確認
if ! find "$argPath" -maxdepth "$depth" >/dev/null 2>&1; then
    echo "Permission Denied error detected. Please change the permission or exec as root."
    exit 1
fi

# path, size, type を JSON lines 形式で出力
find "$argPath" -maxdepth "$depth" | while read -r path; do
    realPath=$(realpath "$path")
    size=$(du --bytes --summarize "$realPath" | cut -f1)
    type=$([[ -d "$realPath" ]] && echo "directory" || echo "file")
    printf '{"path": "%s", "size": %d, "type": "%s"}\n' "$realPath" "$size" "$type"
done
