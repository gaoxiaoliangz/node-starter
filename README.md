# node-starter

A simple express-based node starter

## Features

- ejs
- express
- multer
- a simple mongodb wrapper

## How to run

```
yarn install
yarn watch
yarn dev
```

## deploy to zeit-now

### adding env vars

<https://zeit.co/docs/v2/build-step/#adding-secrets>\
<https://zeit.co/blog/environment-variables-secrets>

set mongodb url as secret

```
now secret add mongodb-url <your-mongodb-url>
```

set env vars

```
now -e DB_NAME=node_starter -e DB_URI=@mongodb-url -e SECRET=<your-secret-string>
```
