const db = require('../db')
// setup an currentUser object to available everywhere when an user is logged in


function setCurrentUser(req, res, next) {
    res.locals.currentUser = {} // default to empty object

    // if user is not logged
    if (!req.session.userId) {
        return next()
    }

    // lets take t[he] user id to the database
    // to fetch the user record
    const sql = `
        SELECT * FROM users WHERE id = $1;
    `

    db.query(sql, [req.session.userId], (err, result) => {
        if (err) {
            console.log(err)
        }

        // set current user
        let user = result.rows[0]

        res.locals.currentUser = user
        next()
    })

}

module.exports = setCurrentUser