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
