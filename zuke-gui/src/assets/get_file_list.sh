#!/bin/bash

# TODO: JSON で吐けるようにする

# Usage: ./get_file_list.sh -d <depth> <file_path | dir_path>

set -u

depth=2

while getopts d: opt; do
    case $opt in
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

# argPath 以下に find や du して Permission Denied が出ないか確認

if ! find "$argPath" -type f >/dev/null 2>&1; then
    echo "Permission Denied error detected. Please change the permission or exec as root."
    exit 1
fi

# ホスト名、OS、ファイルサイズを取得
hostName=$(hostname)
os=$(lsb_release -d | cut -f2)

echo -e "\n=== 下の行を spreadsheet 最初のセルにコピペ (Command + Shift + V) してください ===\n"

if [ -d "$argPath" ]; then
    find "$argPath" -maxdepth $depth -type d | while read -r dirPath; do
        size=$(du -sh "$dirPath" | cut -f1)
        echo -e "$hostName\t$(realpath $dirPath)\t$os\t$size"
    done
elif [ -f "$argPath" ]; then
    size=$(du -sh "$argPath" | cut -f1)
    echo -e "$hostName\t$(realpath $argPath)\t$os\t$size"
else
    echo "The specified path: $argPath is not a directory or file."
    exit 1
fi
