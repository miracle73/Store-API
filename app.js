require('dotenv').config()
require('express-async-errors')
const express = require('express');
const app = express();
const connectDB = require('./db/connect')
const router = require('./routes/products')
const notFound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')
app.use(express.json())
app.use('/api/v1/products',router)
app.get('/',(req,res) => {
    res.send('<h1> Home Page</h1><br><a href="www.google.com">Google</a>')
})

app.use(notFound)
app.use(errorHandler)
const port = process.env.PORT || 5000
const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log("Server is listening on port 5000")
        })
    } catch (error) {
        console.log(error)
    }
}
start()
