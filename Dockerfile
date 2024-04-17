FROM node:20.11.1-bookworm

RUN apt update && \
    apt install -y --no-install-recommends \
    tini && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json /app/

RUN npm ci

COPY . .

EXPOSE 3000

ENTRYPOINT ["tini", "--"]
CMD ["sleep", "infinity"]
