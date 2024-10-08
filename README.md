# Install


## Create user and set password
```bash
useradd -m -s /bin/bash oskar
passwd oskar
su oskar
```

## Sudo privileges for oskar
```bash
usermod -aG sudo oskar
```

## Change to user oskar and switch to home directory
```bash
su oskar
cd ~
```

## Install required packages
```bash
sudo apt update
sudo apt install nginx build-essential libssl-dev libffi-dev python3-dev python3-venv mariadb-server
```

## Clone repo
```bash
git clone https://github.com/kamkalian/reparaturcafe3.git
```

## Configure nginx
```bash
sudo cp nginx_conf/reparaturcafe.conf /etc/nginx/sites-available/reparaturcafe.conf
sudo cp nginx_conf/proxy_forward.conf /etc/nginx/snippets/proxy_forward.conf 
```
Modify `/etc/nginx/repataturcafe.conf` for your domain and ssh keys.

## Activate config and restart nginx
```bash
sudo ln -s /etc/nginx/sites-available/reparaturcafe.conf /etc/nginx/sites-enabled/
sudo systemctl restart nginx 
```
if config file contains errors check with:
```bash
sudo nginx -t
```

## Configuring MariaDB
```bash
sudo mysql_secure_installation
```
Open mariadb terminal for the next steps:
```bash
sudo mariadb
```

### Create database 'reparaturcafe'
```sql
create database reparaturcafe;
```

### Create database user with all privileges for database 'reparaturcafe'
```sql
create user 'oskar'@localhost identified by 'password';
grant all privileges on reparaturcafe.* to 'oskar'@localhost;
```


# Getting started

## Start development server 
```bash
npm run dev
```

## Install venv and required modules
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Start api
```bash
.venv/bin/uvicorn --reload --port 8000 --app-dir "/home/oskar/reparaturcafe3/" api.main:app
```


# Sqitch

Create migration files (for deploy, revert, verify)
```
sqitch add tasks -n 'Creates tasks table.'
```

Deploy change:
```
sqitch deploy db:mysql:reparaturcafe
```

Rebase
```
sqitch rebase db:mysql:reparaturcafe --onto users
```