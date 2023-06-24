require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const userRoutes = require('./routes/users/users');
const postRoutes = require('./routes/posts/posts');
const commentRoutes = require('./routes/comments/comments');
const globalErrorHandler = require('./middlewares/globalErrorHandler');
const app = express();
require('./config/dbConnect');

//middlewares
app.use(express.json()); //pass incoming data

//session config
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URL,
        ttl: 24 * 60 * 60 // 1 day
    }),
}))

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/comments', commentRoutes);


//Error handler middlewares
app.use(globalErrorHandler);

//listen server
const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));