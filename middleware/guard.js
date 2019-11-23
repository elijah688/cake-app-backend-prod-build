const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY;

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, JWT_KEY);
        const id = decoded.id;
        const email = decoded.email;

        res.userData = {id:id, email:email}
        next();

    } catch (error) {
        res.status(403).json({
            message: "YOU ARE UNAUTHORIZED"
        });
        next(error);
    }
    
};

