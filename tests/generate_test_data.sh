#!/bin/bash

# Usage: ./generate_test_data.sh
# Result: Generate test data at tests/test_data

set -u

HERE=$(
  cd $(dirname $0)
  pwd
)

DEST_DIR=$HERE/test_data
mkdir -p $DEST_DIR

INPUT_FILE="$HERE/../src/treeDataExample.jsonl"

while IFS= read -r line; do
  if [[ $line == "" ]]; then
    continue
  fi

  path=$(echo $line | jq -r '.path')
  size=$(echo $line | jq -r '.size')
  type=$(echo $line | jq -r '.type')

  # Fix path
  path="$DEST_DIR$path"

  # Fix size
  size=$((size / 1000))
  if [[ size -gt 4096 ]]; then
    size=4096
  fi

  if [[ $type == "directory" ]]; then
    mkdir -p "$path"
    echo "Created directory: $path"
  else
    dir=$(dirname "$path")
    mkdir -p "$dir"
    dd if=/dev/zero of="$path" bs=1 count="$size" status=none
    echo "Created file: $path"
  fi
done <"$INPUT_FILE"

# Remove empty directories
# find $DEST_DIR -type d -empty -delete
