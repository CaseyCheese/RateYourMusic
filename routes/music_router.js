const express = require('express')
const router = express.Router()
const db = require('../db')
const ensureLoggedIn = require('../middlewares/ensure_logged_in')


router.get('/music', (req, res) => {
    db.query('SELECT * FROM music ORDER BY title;', (err, result) => {
        if (err) {
            console.log(err)
        }

        res.render('home', {
            library: result.rows
            // userId: req.session.userId
        })
    })
})

router.get('/music/add', ensureLoggedIn, (req, res) => {
    res.render('music_add')
})

router.get('/music/:id', (req, res) => {
    let music = []
    let rating = 0

    db.query('SELECT * FROM music WHERE id = $1;', [req.params.id], (err, result) => {
        if (err) {
            console.log(err)
        }

        music = result.rows[0]
    })

    db.query('SELECT rating FROM ratings WHERE music_id = $1;', [req.params.id], (err, result) => {
        if (err) {
            console.log(err)
        }

        for (let row of result.rows) {
            rating += Number(row.rating)
        }

        rating = rating / result.rows.length
    })

    setTimeout(() => 
        res.render('music_info', {
            music,
            rating
        })
    , 3000)
})

router.delete('/music/:id', ensureLoggedIn, (req, res) => {
    // Delete a song from the database.
    const sql = `
    DELETE FROM music
    WHERE id = $1
    RETURNING *;
    `

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.log(err)
        }

        console.log(result.rows)/////////////////////////////////////////////////////////////////
        
        res.redirect('/music')
    })
})

router.post('/music', ensureLoggedIn, (req, res) => {
    // Expect the URL to have the (title, image_url, artist, year, rating, rank, genre)
    // Save it in the database
    let title = req.body.title
    let artist = req.body.artist
    let image_url = req.body.image_url
    let year = req.body.year
    let genre = req.body.genre

    const sql = `
        INSERT INTO music (title, artist, image_url, year, genre)
        values ($1, $2, $3, $4, $5);
    `

    db.query(sql, [title, artist, image_url, year, genre], (err, result) => {
        if (err) {
            console.log()
        }
        res.redirect('/music')
    })
    
})

router.get('/music/:id/edit', (req, res) => {
    const sql = `
        SELECT *
        FROM music
        WHERE id = $1;
    `

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.log(err)
        }

        res.render('music_edit', {
            music: result.rows[0]
        })
    })
})

router.put('/music/:id', (req, res) => {
    let title = req.body.title
    let artist = req.body.artist
    let image_url = req.body.image_url
    let year = req.body.year
    let genre = req.body.genre
    let music_id = req.params.id

    const sql = `
    UPDATE music
    SET title = $1, artist = $2, image_url = $3, year = $4, genre = $5
    WHERE id = $6;
    `

    db.query(sql, [title, artist, image_url, year, genre, music_id], (err, result) => {
        if (err) {
            console.log(err)
        }

        res.redirect(`/music/${music_id}`)
    })
})

module.exports = router