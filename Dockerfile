FROM ubuntu:23.04

RUN apt update && apt install -y nano curl

RUN apt update && apt install -y \
    nginx \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3 \
    python3-pip \
    python3-venv \
    mariadb-server \
    sqitch \
    npm

RUN service mariadb start

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash \
    && export NVM_DIR="$HOME/.nvm" \
    && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
    && [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" \
    && nvm install --lts



EXPOSE 8000
EXPOSE 3000


CMD ["tail", "-f", "/dev/null"]