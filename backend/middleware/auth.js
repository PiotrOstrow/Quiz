
function checkAuthentication(roles) {
    if (typeof roles === 'string')
        roles = [roles];

    return (request, response, next) => {
        if (request.isAuthenticated() && roles.includes(request.user.role)) {
            next();
        } else {
            response.status(401).json({msg: 'Not authenticated'});
        }
    }
}

module.exports.checkAuthentication = checkAuthentication;

