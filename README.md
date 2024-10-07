# reparaturcafe

# Install

## Install nginx
```bash
apt update
apt install nginx
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
Modify `repataturcafe.conf` for your domain and ssh keys.

# Getting started

Start development server: 
```bash
npm run dev
```

Start api:
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