#!/bin/bash

# Usage: .backup.sh [--dryrun] [--policy <daily|weekly|monthly>] [-h|--help]

set -euo pipefail

HERE=$(cd $(dirname $0); pwd)

BACKUP_FILES_NAME="backup_files.json"
POLICY_CONFIGS_NAME="policy_configs.json"
S3_CONFIG_NAME="s3_config.json"

# === Option Parsing ===

OPTION_DRYRUN=false
OPTION_POLICY=""

function usage() {
  echo "Usage: $0 [--dryrun] [--policy <daily|weekly|monthly>]"
  exit 1
}

while [[ $# -gt 0 ]]; do
  case $1 in
    --dryrun)
      OPTION_DRYRUN=true
      shift
      ;;
    --policy)
      OPTION_POLICY=$2
      shift 2
      ;;
    -h|--help)
      usage
      ;;
    *)
      usage
      ;;
  esac
done

if [[ -z $OPTION_POLICY ]]; then
  echo "Error: --policy option is required"
  usage
fi

if [[ $OPTION_POLICY != "daily" && $OPTION_POLICY != "weekly" && $OPTION_POLICY != "monthly" ]]; then
  echo "Error: --policy option must be one of daily, weekly, or monthly"
  usage
fi

function log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# === Load Configs ===

if [[ -f $HERE/$BACKUP_FILES_NAME ]]; then
  BACKUP_FILES=$(cat $HERE/$BACKUP_FILES_NAME)
else
  echo "Error: $BACKUP_FILES_NAME is not found"
  exit 1
fi

if [[ -f $HERE/$POLICY_CONFIGS_NAME ]]; then
  POLICY_CONFIGS=$(cat $HERE/$POLICY_CONFIGS_NAME)
else
  echo "Error: $POLICY_CONFIGS_NAME is not found"
  exit 1
fi

if [[ -f $HERE/$S3_CONFIG_NAME ]]; then
  S3_CONFIG=$(cat $HERE/$S3_CONFIG_NAME)
else
  echo "Error: $S3_CONFIG_NAME is not found"
  exit 1
fi

# === Backup Script ===

function s3_backup() {
  local path=$1
  local endpoint_url=$2
  local bucket_name=$3

  local dryrun_flag=""
  if [[ $OPTION_DRYRUN == true ]]; then
    dryrun_flag="--dryrun"
  fi

  if [[ -d $path ]]; then
    aws s3 sync \
      --endpoint-url $endpoint_url \
      $dryrun_flag \
      --exact-timestamps \
      --delete \
      $path s3://$bucket_name/${path#/}
  elif [[ -f $path ]]; then
    local dir=$(dirname $path)
    local filename=$(basename $path)
    aws s3 sync \
      --include $filename \
      --exclude "*" \
      --endpoint-url $endpoint_url \
      $dryrun_flag \
      --exact-timestamps \
      --delete \
      $dir s3://$bucket_name/${dir#/}
  else
    log "Warning: $path is not found, so skip backup"
  fi
}

function do_backup() {
  export AWS_ACCESS_KEY_ID=$(echo $S3_CONFIG | jq -r '.accessKeyId')
  export AWS_SECRET_ACCESS_KEY=$(echo $S3_CONFIG | jq -r '.secretAccessKey')
  local http_proxy=$(echo $S3_CONFIG | jq -r '.httpProxy')
  if [[ $http_proxy != "" ]]; then
    export HTTP_PROXY=$http_proxy
  fi

  local files=$(echo $BACKUP_FILES | jq -r ".${OPTION_POLICY}[]")

  for file in $files; do
    s3_backup $file
  done
}

function main() {
  log "Start $OPTION_POLICY backup"
  do_backup
  log "End $OPTION_POLICY backup"
}

main
