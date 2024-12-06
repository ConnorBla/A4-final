import express from 'express';
import cors from 'cors';
// import homeRouter from './routes/home';
import usersRouter from "./routes/users.js"
import productsRouter from "./routes/products.js"
import session from 'express-session';

const port = process.env.PORT || 3000;
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(cors({
  credentials: true
}));

app.use(session({
  secret: '^hh!SLAo5jf3Gx%$678',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 3600000
  }
}))

app.use('/api/users',    usersRouter);
app.use('/api/products', productsRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});