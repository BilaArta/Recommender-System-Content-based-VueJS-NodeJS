const express = require('express');
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors');

// const errorHandler = require('./middleware/error')
require('dotenv').config()

const movieRouter = require('./routes/movies/movies')
const userRouter = require('./routes/users/users')


const app = express()

app.use(cors());
app.use(bodyparser.json());
app.use(cookieParser(process.env.JWT_SECRET))

app.use(bodyparser.urlencoded({ extended: true }));

mongoose.Promise = Promise;
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false})

    .then(() => {
        console.log('connected to DB');
    })
    .catch((err) => {
        console.log(err);
    });


app.use('/movie', movieRouter)
app.use('/user', userRouter)

// app.use(errorHandler);

const PORT = process.env.PORT || 8000

const server = app.listen(PORT, () => console.log(` server running on port ${PORT}`));

process.on('exit', (code) => {
    console.log(`About to exit with code: ${code}`);
})