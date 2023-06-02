const express = require('express');
const mongoose = require('mongoose');
require('./db/mongoose');
const orderRouter = require('./routers/orderRouter');
const userRouter = require('./routers/userRouter');
const productRouter = require('./routers/productRouter');
const cartRouter = require('./routers/cartRouter');

const port = process.env.PORT || 5500;
const app = express();

app.use(express.json());
app.use(orderRouter);
app.use(userRouter);
app.use(productRouter);
app.use(cartRouter);

app.listen(port, () => console.log('Server is up and running...'));
