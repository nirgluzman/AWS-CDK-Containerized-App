import express, { Request, Response } from 'express';

const PORT = process.env.PORT || 80;

const app = express();

app.get('/', (request: Request, response: Response): void => {
  response.send(`welcome to my express app!`);
});

app.listen(PORT, () => console.log(`The app is listening on port ${PORT}`));
