const pool = require('../database/database');

exports.getProfile = async (req,res) => {
    try{
       
    const uuid = req.user.id;
    const result = await pool.query("SELECT email FROM  users where id = $1",[uuid]);
    if(result.rows.length === 0){
        return res.status(400).json(
            {msg:"no profile "}
        )
    }
   
    res.json(result.rows[0]);
    }
    catch(error){
        console.log(error);
        res.status(500).json(
            {message:"database failed"}
        )
    }
}