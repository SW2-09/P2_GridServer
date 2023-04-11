export {ensureAuthenticated}

function ensureAuthenticated (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/buyer/login')
}