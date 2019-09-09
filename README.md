# node-starter

A simple express-based node starter

## Features

- ejs
- express
- multer
- a simple mongodb wrapper
- ready to be deployed to zeit-now
- ready to be deployed using docker-compose
- a minimal ws server

## How to run

```
yarn install
yarn watch
yarn dev
```

## deploy to zeit-now

### adding env vars

- <https://zeit.co/docs/v2/build-step/#adding-secrets>
- <https://zeit.co/blog/environment-variables-secrets>
- <https://zeit.co/docs/v2/advanced/configuration#env>

set secrets

```
now secret add mongodb-url <your-mongodb-url>
now secret add secret <your-secret-string>
```

these secrets are referenced in `now.json`

## deploy using docker-compose

install deps & build ts

```
docker-compose run app bash -c "cd /app && NODE_ENV=development yarn && NODE_ENV=production yarn build"
```
