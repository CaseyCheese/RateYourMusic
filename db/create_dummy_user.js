require('dotenv').config()
const bcrypt = require('bcrypt')
const db = require('./index.js')

function createUserExample() {
    const email = 'user@example.com'
    const plaintextPass = 'password'
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
                    console.log('user created!')
                    console.log(result.rows)
                }
            })
        })
    })
}

function createUserFreddie() {
    const email = 'freddie@mercury.com'
    const plaintextPass = 'password'
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
                    console.log('user created!')
                    console.log(result.rows)
                }
            })
        })
    })
}

createUserExample()
createUserFreddie()