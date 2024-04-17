# TODO: backup policy から自動生成する予定

AWS_S3_BUCKET=eg-backup
AWS_SECRET_ACCESS_KEY=""

rsync -av --delete /home/zukeyama/eg/ /home/zukeyama/eg_backup/
rsync -av --delete /home/zukeyama/eg/ /home/zukeyama/eg_backup/

s3 sync /home/zukeyama/eg_backup/ s3://eg-backup/ --delete
