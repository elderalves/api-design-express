import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import router from './router';
import { protect } from './modules/auth';
import { createNewUser, signin } from './handlers/user';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  next();
})

app.get('/', (req, res, next) => {
  res.json({ message: 'Hello' });
})

app.use('/api', protect, router);


app.post('/user', createNewUser);
app.post('/signin', signin);

app.use((err, req, res, next) => {
  if(err.type === "auth") {
    res.status(401);
    res.json({ message: 'unauthorized' });
  } else if(err.type === "input") {
    res.status(400);
    res.json({ message: 'validation error' });
  } else {
    res.status(500);
    res.json({ message: 'internal server error' });
  }
});


export default app;