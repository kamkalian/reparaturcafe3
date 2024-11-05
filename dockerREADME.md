# Start Using Docker

## before Starting 

Make sure you have installed Docker and Docker-Compose on your machine.

## Clone repo

```bash 
git clone https://github.com/kamkalian/reparaturcafe3.git
cd reparaturcafe3
```

## Start the containers

```bash
docker-compose up -d
```

## After the Containers are up

login to the Container

and run the following commands:

```bash
./setup.sh
./start.sh
``` 
These Scripts will install everything that is needed to run the application. And start the application.

## Access the Application

Open your browser and go to `https://localhost`

If you get a warning about the certificate, you can ignore it and proceed to the site.

The login credentials are:

```
username: root
password: rootpassword
```