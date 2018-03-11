# Serlverless + Angular

## 1. Front in Angular

Run:
```
> sudo npm install -g @angular/cli
> ng new web
> cd web
> npm start
```

Navigate to `http://localhost:4200/`.

## 2. Backend in Serverless

Run:
```
> sudo npm install serverless -g
> cd api
> serverless create --template aws-nodejs-typescript
> npm install serverless-offline --save-dev
> npm install
```

Edit serverless.yml by adding:
```
plugins:
  - serverless-webpack
  - serverless-offline
```

Change hello endpoint in serverless.yml to:
```
path: api/hello
```

Run:
```
> serverless offline
```

Navigate to `http://localhost:3000/api/hello`


## 3. Connect Angular front to Serverless backend:

Create `proxy.conf.json`:
```
{
  "/api/*": {
    "target": "http://localhost:3000",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true
  }
}
```

Change start script in `package.json` to:
```
    "start": "ng serve --proxy-conf proxy.conf.json",
```

Update Angular api to send GET request to `/api/hello`.

Run:
```
> npm start
```
