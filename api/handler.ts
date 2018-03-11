import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

import * as awsServerlessExpress from 'aws-serverless-express';
import app from './app';

const server = awsServerlessExpress.createServer(app);
export const express = (event: APIGatewayEvent, context: Context, cb: Callback) => awsServerlessExpress.proxy(server, event, context);