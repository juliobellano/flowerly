const authMiddleware = (req, res, next) => {
     // Check if the user is logged in (stored in session)
     req.user ? next() : res.sendStatus(401);
 };
 
 module.exports = authMiddleware;
 