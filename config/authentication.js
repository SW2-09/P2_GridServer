export {ensureAuthenticated, checkLoggedIn}

function ensureAuthenticated (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/')
}

//Ensures you can not redirect from buyer page to other pages if logged in
function checkLoggedIn (req, res, next) {
    if (req.isAuthenticated()){
        return res.redirect('/buyer')
    }
    next()
    }