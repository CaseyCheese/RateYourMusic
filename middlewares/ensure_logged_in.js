function ensureLoggedIn(req, res, next) {
    if (req.session.userId) {
        next()
    } else {
        res.redirect('/accounts/login')
    }
}

module.exports = ensureLoggedIn