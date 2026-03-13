const pool = require('../database/database');
exports.getRemindTasks = async(req,res)=>{
    try{
    const result = await pool.query(`
      SELECT * FROM remind;
    `);
    res.json(result.rows); 
    }
    catch(error){
      res.status(500).json(
            {message:"database failed"}
        )
    }
};