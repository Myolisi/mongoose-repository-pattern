import { createConnection, set } from 'mongoose';
import UserModel from './models/UserModel';
import UserModel2 from './models/UserModel2';
import express from 'express';
import { pool } from '../src/connection';
const app = express();
const port = 8080;

//enable debugging
set('debug', true);

//first thing: we need to create our connection and pass options
pool([
  {
    url: 'mongodb://localhost:27017/',
    options: { useNewUrlParser: true }
  }
]);

app.get('/database1', (req, res) => {
  new UserModel()
    .getStuff()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.send(err);
    });
});

app.get('/database2', (req, res) => {
  new UserModel2()
    .getStuff()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.send(err);
    });

  const data = new UserModel2().insert({ name: 'James', surname: 'May' }, (err, prod) => {
    if (err) console.log(err);
    else if (prod) console.log(prod);
  });
});

app.set('port', process.env.PORT || 3000);
app.listen(port, () => {
  console.log('Server is running on ' + port);
});

export default app;
