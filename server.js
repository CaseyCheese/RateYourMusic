// Setup Variables
require('dotenv').config()
const express = require('express')
const app = express()
const port = 8080
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const db = require('./db')
const session = require('express-session')
const requestLogger = require('./middlewares/request_logger.js')
const setCurrentUser = require('./middlewares/set_current_user')
const musicRouter = require('./routes/music_router')
const sessionRouter = require('./routes/session_router')


// Setup Web-App
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(requestLogger)
app.use(
    session({
        secret: process.env.SECRET || "mistyrose",
        resave: false,
        saveUninitialized: true,
    })
)
app.use(setCurrentUser)
app.use(expressLayouts)
app.use(express.urlencoded({ extended: true }))


// Navigation
app.get('/', (req, res) => { res.redirect('/music') })
app.use(musicRouter)
app.use(sessionRouter)

app.get('/new-music', (req, res) => {
    db.query('SELECT * FROM music ORDER BY year DESC;', (err, result) => {
        if (err) {
            console.log(err)
        }

        res.render('music_new', {
            library: result.rows
        })
    })
})

app.get('/latest', (req, res) => {
    res.redirect('/null')
})

app.get('/charts', (req, res) => {
    res.redirect('/null')
})

app.get('/lists', (req, res) => {
    res.redirect('/null')
})

// app.get('/charts', (req, res) => {
//     let music = []
//     let ratingList = []

//     db.query('SELECT * FROM music ORDER BY music_id DESC;', (err, result) => {
//         if (err) {
//             console.log(err)
//         }

//         library = result.rows
//     })

//     for (let id = 0; id < result.rows[0].music_id; id++) {
//         db.query('SELECT music_id, rating FROM ratings WHERE music_id = $1 ORDER BY music_id DESC;', [id], (err, result) => {
//             if (err) {
//                 console.log(err)
//             }
//             let rating = 0
    
//             for (let row of result.rows) {
//                 rating += Number(row.rating)
//             }
    
//             ratingList.push(rating / result.rows.length)
//         })
//     }
//     console.log(ratingList)

//     setTimeout(() => 
//         res.render('music_charts', {
//             library,
//             rating
//         })
//     , 3000)
// })

app.get('/null', (req, res) => {
    res.render('null')
})


// Port
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
