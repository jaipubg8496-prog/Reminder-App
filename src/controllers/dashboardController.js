const pool = require('../database/database');

exports.getDashboard = async (req,res) => {
    try{
    const uuid = req.user.id;
    const result = await pool.query("SELECT * FROM  progress_tasks where user_id = $1",[uuid]);
    if(result.rows.length === 0){
        return res.status(400).json(
            {msg:"list is empty"}
        )
    }
    res.json(result.rows);
    }
    catch(error){
        console.log(error);
        res.status(500).json(
            {message:"database failed"}
        )
    }
}