# Create ApAdmin user
sudo useradd -m -s /bin/bash apadmin

PASSWORD=$(curl http://metadata.google.internal/computeMetadata/v1/instance/attributes/instance-password -H "Metadata-Flavor: Google")

# Set password for apadmin
echo -e "$PASSWORD\n$PASSWORD" | passwd apadmin

# Turn on password authentication
sed -i "/^[^#]*PasswordAuthentication[[:space:]]no/c\PasswordAuthentication yes" /etc/ssh/sshd_config
service sshd restart

# Create workdir for this script
mkdir -p /etc/adpushup

# Download setup scripts
gsutil -m cp -r gs://logger-jar-bucket/remotedevenv /etc/adpushup

cd /etc/adpushup/remotedevenv

sudo chmod 700 setup

/bin/bash setup