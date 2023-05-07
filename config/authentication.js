export { ensureAuthenticated, checkLoggedIn, checkRole };

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}

//Ensures you can not redirect from buyer page to other pages if logged in
function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/buyer");
    }
    next();
}
function checkRole(roleToCheck) {
    return function (req, res, next) {
        if (!req.isAuthenticated()) {
            res.redirect("/");
        }
        else if (req.user.role === roleToCheck) {
            return next();
        }
        else if(req.user.role === "buyer"){
            res.redirect("/buyer");
        } 
        else if(req.user.role === "admin"){
            res.redirect("/admin");
        }
    };
}