const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {

    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Token required" });
        }

        const token = header.split(" ")[1];
       
        

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )
      
        req.user = decoded
   

        next()

    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                 error: "Token expired"
            })
         }

        res.status(401).json({
            error: "Invalid token"
        })

    }

}
