#!/bin/bash
set -e

service mariadb start

# Create a database
mariadb -u root -e "CREATE DATABASE IF NOT EXISTS reparaturcafe;"
mariadb -u root -e "CREATE DATABASE IF NOT EXISTS sqitch;"
mysql -u root -e "CREATE USER IF NOT EXISTS 'oskar'@'localhost' IDENTIFIED BY 'rootpassword';"
mysql -u root -e "grant all privileges on reparaturcafe.* to 'oskar'@localhost;"
mysql -u root -e "grant all privileges on sqitch.* to 'oskar'@localhost;"
mysql -u root -e "flush privileges;"

sqitch deploy db:mysql:reparaturcafe

mariadb -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'rootpassword';"

rm /etc/nginx/sites-enabled/default
rm /etc/nginx/sites-available/default

cp nginx_conf/reparaturcafe.conf /etc/nginx/sites-available/reparaturcafe.conf
cp nginx_conf/proxy_forward.conf /etc/nginx/snippets/proxy_forward.conf
ln -s /etc/nginx/sites-available/reparaturcafe.conf /etc/nginx/sites-enabled/
service nginx start

python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python create_user.py
deactivate

npm install


