require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const userRoutes = require('./routes/users/users');
const postRoutes = require('./routes/posts/posts');
const commentRoutes = require('./routes/comments/comments');
const globalErrorHandler = require('./middlewares/globalErrorHandler');
const app = express();
const ejs = require('ejs');
require('./config/dbConnect');

//middlewares
app.use(express.json()); //pass incoming data

app.use(express.urlencoded({extended: true})); //pass form data

app.use(methodOverride('_method')); //method override

//configure ejs
app.set('view engine', 'ejs');

//serve static files
app.use(express.static(__dirname + '/public'));

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

//save the logged in user into locals
app.use((req, res, next) => {
    if(req.session.userAuth) {
        res.locals.userAuth = req.session.userAuth;
    } else {
        res.locals.userAuth = null;
    }
    next();
})

//render homepage
app.get('/', (req, res) => {
    res.render('index');
})

//users route
app.use('/api/v1/users', userRoutes);

//posts route
app.use('/api/v1/posts', postRoutes);

//comments route
app.use('/api/v1/comments', commentRoutes);


//Error handler middlewares
app.use(globalErrorHandler);

//listen server
const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));