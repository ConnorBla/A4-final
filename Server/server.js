import express from 'express';
import cors from 'cors';
import homeRouter from './routes/home';
import usersRouter from "./routes/users"
import productsRouter from "./routes/products"
import session from 'express-session';

const port = process.env.PORT || 3000;
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(cors({
  origin: 'http://localhost:5173',  //react client url
  credentials: true                 //allow cookies from client
}));

app.use(session({
  secret: '^hh!SLAo5jf3Gx%$678',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 3600000
  }
}))

// routes
app.use('/api/',         homeRouter);

app.use('/api/users',    usersRouter);
app.use('/api/products', productsRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});