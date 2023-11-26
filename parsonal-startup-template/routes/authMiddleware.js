module.exports.isAuthUser = (req, res, next) =>
{
    if(req.isAuthenticated())
    {
        next();
    }
    else
    {
        res.status(401).json({msg: "your not authorized to view this resource"})
    }
}

module.exports.isAdmin = (req, res, next) =>
{
    if(req.isAuthenticated() && req.user.isAdmin)
    {
        next();
    }
    else
    {
        res.status(401).json({msg: "your not authorized to view this resource"})
    }
}