FROM node:20.11.1-bookworm

LABEL org.opencontainers.image.authors="DBCLS (Database Center for Life Science)"
LABEL org.opencontainers.image.url="https://github.com/dbcls/backup-system"
LABEL org.opencontainers.image.documentation="https://github.com/dbcls/backup-system/blob/main/README.md"
LABEL org.opencontainers.image.source="https://github.com/dbcls/backup-system/blob/main/Dockerfile"
LABEL org.opencontainers.image.version="0.1.0"
LABEL org.opencontainers.image.licenses="Apache-2.0"

RUN apt update && \
    apt install -y --no-install-recommends \
    tini && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json /app/

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["tini", "--"]
CMD ["npm", "run", "preview"]
