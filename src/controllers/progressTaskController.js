const pool = require('../database/database');
exports.moveToProgress = async (req, res) => {
  try {
    const uuid = req.user.id;
    const { task_id, title, description ,status} = req.body;
    await pool.query(
      "INSERT INTO progress_tasks(task_id,title, description,status,user_id) VALUES($1,$2,$3,$4,$5)",
      [ task_id,title, description,status,uuid]
    );
    await pool.query("Delete from remind where task_id = $1 and user_id=$2",[task_id,uuid]);
    res.json({ message: "Moved to progress" });
    await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2",[task_id,uuid]);
  } catch (err) {
      console.log(err); 
    res.status(500).json({ message: "Failed" });
  }
};