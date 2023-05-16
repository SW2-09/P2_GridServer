export { ensureAuthenticated, checkLoggedIn, checkRole };

/**
 * Checks if the user is authenticated, if true, then proceed to the next middleware function.
 * Otherwise redirect to the homepage.
 *
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @param {function} - the next middelware function.
 */
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}

//
/**
 * Middelware function that ensures you can not redirect from buyer page to other pages if logged in
 *
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @param {function} - the next middelware function.
 */
function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/buyer");
    }
    next();
}

/**
 * Middelware function that redirects the user to the page corresponding to their role.
 *
 * @param {string} roleToCheck - The role to check for.
 */
function checkRole(roleToCheck) {
    return function (req, res, next) {
        if (!req.isAuthenticated()) {
            res.redirect("/");
        } else if (req.user.role === roleToCheck) {
            return next();
        } else if (req.user.role === "buyer") {
            res.redirect("/buyer");
        } else if (req.user.role === "admin") {
            res.redirect("/admin");
        }
    };
}
