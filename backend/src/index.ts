import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';

import registerRoutes from './routes/register';
import healthRoute from './routes/health';
import { firebaseReady } from './config/firebase';

const app = express();

app.use(helmet());
app.use(cors());
const bodyLimit = process.env.JSON_BODY_LIMIT || '5mb';
app.use(express.json({ limit: bodyLimit }));
app.use(morgan('dev'));

app.use('/api/register', registerRoutes);
app.use('/', healthRoute);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
  console.log(`Firebase ready: ${firebaseReady} project: ${process.env.FIREBASE_PROJECT_ID || 'N/A'}`);
});
