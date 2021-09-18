#!/bin/bash

# Create ApAdmin user
sudo useradd apadmin

# Download setup scripts
gsutil -m cp -r gs://logger-jar-bucket/remotedevenv /

cd /remotedevenv

sudo chmod 700 setup

sh setup