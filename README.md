# reparaturcafe


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