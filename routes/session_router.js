const express = require('express')
const router = express.Router()
const db = require('../db')
const bcrypt = require('bcrypt')


router.get('/accounts/login', (req, res) => {
    res.render('accounts_login')
})

router.post('/accounts/login', (req, res) => {
    const sql = `
    SELECT * FROM users
    WHERE email = $1;
    `
    
    // 1. check if user exists in the database via email address
    db.query(sql, [req.body.email], (err, result) => {
        if (err) {
            console.log(err)
            res.redirect('/accounts/login')
            return
        }

        if (result.rows.length === 0) {
            console.log('Email is invalid.')
            res.send(`<html>
                <body>
                    <h1>Invalid account details</h1>
                    <p>Click <a href="/accounts/login">here</a> to go back</p>
                </body>
            </html>`)
            return
        }

        const plainTextPass = req.body.password
        const hashedPass = result.rows[0].password_digest

        // 2. check password
        bcrypt.compare(plainTextPass, hashedPass, (err, isCorrect) => {
            if (!isCorrect) {
                console.log('Password is incorrect.')
                res.render('accounts_login')
                return
            }

            req.session.userId = result.rows[0].id
            res.redirect('/music')
        })
    })
})

router.delete('/accounts/logout', (req, res) => {
    req.session.userId = null
    res.redirect('/accounts/login')
})

router.get('/accounts/signup', (req, res) => {
    res.render('accounts_signup')
})

router.post('/accounts/signup', (req, res) => {
    const email = req.body.email
    const plaintextPass = req.body.password
    const saltRound = 10

    // 1. generate the salt
    bcrypt.genSalt(saltRound, (err, salt) => {

        // 2. hash the plain text password
        bcrypt.hash(plaintextPass, salt, (err, hashedPass) => {

            const sql = `
                INSERT INTO users (email, password_digest)
                VALUES ('${email}', '${hashedPass}')
                RETURNING id;
            `
            // 3. insert a new user record to database
            db.query(sql, (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('User created!')
                    console.log(result.rows)
                    res.redirect('/accounts/login')
                }
            })
        })
    })
})

router.delete('/accounts/delete', (req, res) => {
    const sql = `
    DELETE FROM users
    WHERE id = $1;
    `

    db.query(sql, [req.session.userId], (err, result) => {
        if (err) {
            console.log(err)
            res.render('/music')
            return
        }
        console.log('User deleted!')
        req.session.userId = null
        res.redirect('/music')
    })
})

router.get('/accounts', (req, res) => {
    res.redirect('/null')
})

module.exports = router