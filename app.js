require('dotenv').config()
require('express-async-errors')
const express = require('express');
const app = express();
const session = require('express-session')
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

const connectDB = require('./db/connect')
const router = require('./routes/products')
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}
const notFound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')
require('./middleware/auth')
app.use(express.json())
app.use('/api/v1/products', router)
app.get('/', (req, res) => {
    res.send('<h1> Home Page</h1><br><a href="www.google.com">Google</a>')
})

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/error',
        successRedirect: '/success'
    })
);
app.get('/success', isLoggedIn, (req, res) => {
    res.send('welcome')
    console.log(req.user, req.user.displayName)

});
app.get('/error', (req, res) => res.send("error logging in"));
app.get('/logout', (req, res, next) => {
    // req.session.destroy();
    req.logout(function (err) {
    if (err) { return next(); }
    res.redirect('/')
    });


})
app.use(notFound)
app.use(errorHandler)
const port = process.env.PORT || 5000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log("Server is listening on port 5000")
        })
    } catch (error) {
        console.log(error)
    }
}
start()
