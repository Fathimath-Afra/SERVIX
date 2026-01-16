const authorizeUser = (permittedRoles) => {
    return (req, res, next) => {
        if (permittedRoles.includes(req.role)) {
            next();
        }else {
            res.status(403).json({ message: "Forbidden: You don't have enough permissions" });
        }
    }
}

module.exports=authorizeUser;