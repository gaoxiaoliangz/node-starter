# node-starter

A simple node starter

## Features

- written in TypeScript
- ejs as template engine
- express
- multer
- a simple mongodb wrapper
- ready to be deployed to zeit-now
- ready to be deployed using docker-compose
- a minimal ws server
- api e2e tests
- prettier

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
now secrets add mongodb-url <your-mongodb-url>
now secrets add secret <your-secret-string>
```

these secrets are referenced in `now.json`

## deploy using docker-compose

install deps & build ts

```
docker-compose run app bash -c "cd /app && NODE_ENV=development yarn && NODE_ENV=production yarn build"
```

