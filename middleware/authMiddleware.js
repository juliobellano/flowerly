const authMiddleware = (req, res, next) => {
     // Check if the user is logged in (stored in session)
     console.log("Session:", req.session);
     console.log("User:", req.user);
     req.user ? next() : res.sendStatus(401);
 };
 
 module.exports = authMiddleware;
 