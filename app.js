const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');

const dotenv = require('dotenv');
dotenv.config();

// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categroyRoutes = require('./routes/category');
const bookRoutes = require('./routes/book');
const inventoryRoutes = require('./routes/inventory');

// app
const app = express();

// db connection
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true
  }
).then(() => {
  console.log('DB Connected')
})

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categroyRoutes);
app.use('/api', bookRoutes);
app.use('/api', inventoryRoutes);

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});






























// import express from 'express'; // framework for node.js
// import bodyParser from 'body-parser'; // enable us to make post requests
// import mongoose from 'mongoose'; // To create models schema
// import cors from 'cors'; // to make requests put, get, delete

// // import postRoutes from './routes/post.js';
// import bookRoutes from './routes/book.js';

// const app = express();

// // app.use('/posts', postRoutes);
// app.use('/books', bookRoutes);

// app.use(bodyParser.json({
//     limit: "30mb",
//     extended: true
// }));

// app.use(bodyParser.urlencoded({
//     limit: "30mb",
//     extended: true
// }));

// const CONNECTION_URL = 'mongodb+srv://Ramesh:ramesh1999@cluster0.yiakc.mongodb.net/library?retryWrites=true&w=majority';

// const PORT = process.env.PORT || 5000;

// mongoose.connect(CONNECTION_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true    
// }).then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
//   .catch((error) => console.log(error.message));

// mongoose.set('useFindAndModify', false); // To avoid warning in the console  

