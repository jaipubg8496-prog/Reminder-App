const pool = require('../database/database');
exports.getTasks = async(req,res)=>{
    try{
    const uuid = req.user.id;
    const result = await pool.query("SELECT * FROM  tasks where user_id = $1",[uuid]);
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
};
exports.getTasksById = async(req,res)=>{
    try{
    const uuid = req.user.id;
    const id = Number(req.params.id);
    const result = await pool.query("SELECT * FROM  tasks where user_id =$1 AND id = $2",[uuid,id]);
    if(result.rows.length === 0){
        return res.status(400).json(
            {msg:"list is empty"}
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
};
exports.postTask = async (req, res) => {
    try{
     const { title, description, remind_at } = req.body;
     const uuid = req.user.id;
    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    const result = await pool.query("INSERT INTO tasks (user_id,title,description,remind_at) values ($1,$2,$3,$4) RETURNING *",[uuid,title,description,remind_at]);
    const task = result.rows[0];
    await pool.query( "INSERT INTO remind (task_id,title,description,remind_datetime,user_id) VALUES ($1,$2,$3,$4,$5)",[task.id,task.title,task.description,task.remind_at,uuid]);
    res.json(result.rows);
    }
    catch(error){
        console.log(error);
        res.status(500).json(
            {message:"database failed"}
        )
    }
};
exports.putTaskById =async (req,res) => {
    try{
     const uuid = req.user.id;
     const id = Number(req.params.id);
     const { title, description, remind_at } = req.body;

    if (!title || !description || !remind_at) {
      return res.status(400).json({ message: "feild is required" });
    }


    const result = await pool.query(`UPDATE tasks 
    SET title = $1, description = $2, remind_at = $3
    WHERE id = $4 AND user_id = $5
    RETURNING *`,
   [title, description, remind_at,id, uuid]);

   console.log(result.rows[0]);

   if (result.rows.length === 0) {
        return res.status(404).json({ message: "Task not found" });
    }
   
   const tasks = await pool.query(`
        SELECT * FROM tasks WHERE user_id = $1 AND id = $2 
    `,[uuid,id])
   const task = tasks.rows[0];
   console.log(task);
   await pool.query( `UPDATE remind 
    SET title=$1,description=$2,remind_datetime=$3 
    WHERE user_id = $4 AND task_id = $5`
    ,[task.title,task.description,task.remind_at,uuid,id]
    );


    res.json(result.rows);
    }
    catch(error){
        console.log(error);
        res.status(500).json(
            {message:"database failed"}
        )
    }
};
exports.deleteTaskById = async (req,res) => {
    try{
        const uuid = req.user.id;
        const id = Number(req.params.id);
        await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2",[id,uuid]);
        await pool.query("DELETE FROM remind WHERE task_id=$1 AND user_id = $2",[id,uuid]);
        res.json({message:"task deleted"});
        }
        catch(error){
            console.log(error);
            res.status(500).json(
                {message:"database failed"}
            )
        }
}