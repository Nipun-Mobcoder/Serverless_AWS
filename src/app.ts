import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World' });
});

app.post('/data', (req: Request, res: Response) => {
  res.json({ message: 'Data received', data: req.body });
});

export default app;
