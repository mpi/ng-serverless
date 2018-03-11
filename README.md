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

## 4. Deploy on Lambda

### API:

Run (you will have to setup AWS Lambda Account & credentials):
```http://ng-serverless.s3-website.eu-central-1.amazonaws.com/
sreverless login
serverless deploy
```

### Frontend:

Run:
```
npm install serverless-finch
```

Create `serverless.yml`:
```
service: ng-serverless

plugins:
  - serverless-finch

provider:
  name: aws
  region: eu-central-1

custom:
  client:
    bucketName: ng-serverless
    distributionFolder: ./build
```

Run:

```
npm run build
serverless deploy
```

Navigate to: `http://ng-serverless.s3-website.eu-central-1.amazonaws.com/`

## 5. Configure CloudFront

Login to AWS Console:
`https://eu-central-1.console.aws.amazon.com/console`

Select `CloudFront` service.
Create new Web distribution.

In Origin Domain Name select: `ng-serverless.s3.amazonaws.com` and Create.
In `Origin` tab create new Origin.
In `Origin Domain Name` select your Lambda. In `Origin Path` set `/dev`.
In `Behaviour` tab create new behaviour. In `Path Pattern` put: `/api/*` in `Origin` select you lambda Origin.

Navigate to: `https://[cloudfront-hash].cloudfront.net`

### Add usefull scripts:

In `api/package.json` add:

```
  "local": "serverless offline",
  "deploy": "serverless deploy"
```

In `web/package.json` add:

```
  "predeploy": "ng build --prod",
  "deploy": "serverless client deploy"
```

## 6. Write Express-style endpoints:

Run:
```
> cd api
> npm install aws-serverless-express express --save
>
```

In `serverless.yml` replace `hello` endpoint with:
```
  express:
    handler: handler.express
    events:
     - http:
         path: api/{proxy+}
         method: any
         cors: true
```

Create `app.ts`:
```
import * as express from 'express';
import { eventContext } from 'aws-serverless-express/middleware';

const app = express();
app.use(eventContext());
app.get('/api/hello', (req, res) => {
  const event = (req as any).apiGateway.event;
  res.json({
    message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
    input: event
  });
});

export default app;
```

Replace `handler.ts` with:
```
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

import * as awsServerlessExpress from 'aws-serverless-express';
import app from './app';

const server = awsServerlessExpress.createServer(app);
export const express = (event: APIGatewayEvent, context: Context, cb: Callback) => awsServerlessExpress.proxy(server, event, context);
```

Run
```
> npm run local
```