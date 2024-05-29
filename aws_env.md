# AWS 環境の作成

- Backup 先として、下記の環境をそれぞれ構築する
  - for incremental backup: AWS EC2 + EFS (low freq. access)
  - for full backup: S3
- この例は、Test 用の環境として作成しているため、要件に応じて、parameter の変更を行うこと

## AWS EC2 + EFS (low freq. access)

### 1. VPC の作成

- Name: `zuke-test`
- IPv4 CIDR ブロック: `10.0.0.0/24`
- IPv6 CIDR ブロック: `なし`
- AZ: `1 (ap-northeast-1a)`
  - **本番要件: 2 AZ 以上**
- Public Subnet: `1`
  - EC2 instance を配置する
- Private Subnet: `1`
  - EFS を配置する
- NAT Gateway: `なし`
- VPC エンドポイント: `S3 ゲートウェイ`

![create_vpc](https://github.com/dbcls/backup-system/assets/26019402/ee7e0ea6-6e30-4c93-8364-8475c816df9b)

### 2. Security Group の作成

- for Public Subnet
  - Name: `zuke-test-public-sg`
  - VPC: `zuke-test-vpc`
  - Inbound: `SSH (22)`
  - Outbound: `Anywhere`
- for Private Subnet
  - Name: `zuke-test-private-sg`
  - VPC: `zuke-test-vpc`
  - Inbound: `NFS (2049)`
  - Outbound: `Anywhere`

![create_public_subnet](https://github.com/dbcls/backup-system/assets/26019402/62f4ab09-39d7-4c90-8b30-18cb751e98eb)

![create_private_subnet](https://github.com/dbcls/backup-system/assets/26019402/4cb21860-4375-46a4-8e5e-ed2d837dccec)

### 3. EC2 instance の作成

- Name: `zuke-test-ec2`
- AMI: `Ubuntu Server 24.04 LTS`
- Instance Type: `t2.medium`
  - **本番要件: より大きなインスタンス**
- Key Pair: `zuke-test-key`
- Network
  - VPC: `zuke-test-vpc`
  - Subnet: `zuke-test-public-subnet`
  - Public IP: `Enable`
  - Security Group: `zuke-test-public-sg`
- Storage
  - Root: `8 GB`
  - **本番要件: もう少し大きなサイズ**

![create_ec2](https://github.com/dbcls/backup-system/assets/26019402/71162652-5c2c-4923-b487-1d2a7e77336b)

### 4. EFS の作成

- Name: `zuke-test-efs`
- File System Type: `1 zone`
  - **本番要件: 2 zone**
- Automatic Backup: `Disable`
- 低頻度アクセス への移行: `最後のアクセスから 7 日後`
- スループットモード: `Bursting`
- パフォーマンスモード: `General Purpose`
- Network
  - VPC: `zuke-test-vpc`
  - Mount Targets: `zuke-test-private-subnet`
  - Security Group: `zuke-test-private-sg`
- File System Policy: `null`

![create_efs_1](https://github.com/dbcls/backup-system/assets/26019402/56647de7-3756-47fe-9d68-52757b5feef2)

![create_efs_2](https://github.com/dbcls/backup-system/assets/26019402/8f51478e-550d-4a59-8518-4975e265f152)

### 5. EC2 instance と EFS の接続

- EC2 インスタンス画面から、`パブリック IPv4 DNS` を取得し、ssh で接続する

```bash
# At local machine
export EC2_DNS="ec2-54-249-105-211.ap-northeast-1.compute.amazonaws.com"
chmod 400 zuke-test-key.pem
ssh -i zuke-test-key.pem ubuntu@$EC2_DNS
```

- EC2 にて、EFS を mount する
  - EFS 画面から、`DNS 名` を取得する

```bash
sudo apt update
sudo apt upgrade

# Install amazon-efs-utils (ref.: https://github.com/aws/efs-utils?tab=readme-ov-file#on-other-linux-distributions)
sudo apt install -y git binutils rustc cargo pkg-config libssl-dev
git clone https://github.com/aws/efs-utils
cd efs-utils
./build-deb.sh
sudo apt install -y ./build/amazon-efs-utils*deb

# Mount EFS
sudo mkdir /mnt/efs
export EFS_DNS="fs-0d99b2cce71855b2a.efs.ap-northeast-1.amazonaws.com"
sudo mount -t efs -o tls $EFS_DNS /mnt/efs/
sudo chmod 777 /mnt/efs

# Check the mount
$ df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/root       6.8G  3.3G  3.5G  49% /
tmpfs           2.0G     0  2.0G   0% /dev/shm
tmpfs           783M  972K  782M   1% /run
tmpfs           5.0M     0  5.0M   0% /run/lock
/dev/xvda16     881M   76M  744M  10% /boot
/dev/xvda15     105M  6.1M   99M   6% /boot/efi
tmpfs           392M   12K  392M   1% /run/user/1000
127.0.0.1:/     8.0E     0  8.0E   0% /mnt/efs

# 自動マウント設定
sudo vi /etc/fstab
# Add the following line
fs-0d99b2cce71855b2a.efs.ap-northeast-1.amazonaws.com:/ /mnt/efs efs defaults,_netdev 0 0
```

- 適当なファイルを作成し、EFS に保存されることを確認する

```bash
echo "Hello, EFS" > /mnt/efs/hello.txt
dd if=/dev/urandom of=/mnt/efs/eg_file_16mb bs=1M count=16
```

## S3

- Name: `zuke-test-bucket`
- オブジェクト所有者: `ACL 無効`
- パブリックアクセス設定: `パブリックアクセスをすべてブロック`
  - 適切な認証情報をもったユーザからのアクセスは許可される
- バケットのバージョニング: `有効にする`
- 暗号化タイプ: `SSE-S3`

![create_s3](https://github.com/dbcls/backup-system/assets/26019402/809008bc-2a90-4962-b5bb-872ffcae8a3a)

- 更に要件に応じて以下を設定する
  - Transition actions: 30 日後に S3 Standard - Infrequent Access に移行するなど
  - 有効期限切れアクション: 90 日後に削除するなど

試しに適当な file を upload してみる

```bash
sudo apt install -y awscli
aws configure
echo "Hello, S3" > ./hello.txt
aws s3 cp ./hello.txt s3://zuke-test-bucket/
```
