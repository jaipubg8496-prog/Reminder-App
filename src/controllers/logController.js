const pool = require('../database/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const transporter = require("../utils/mailer");

exports.registerUser = async(req, res) => {
    try{
        const { email , password } = req.body;
        const verifyEmail = await pool.query("SELECT * FROM users WHERE email = $1",[email]);
        if(verifyEmail.rows.length === 1){
            return res.status(404).json(
                {message:"user Already Exist"}
            )
        }
        const hash_pass = await bcrypt.hash(password,10);
        const result = await pool.query("INSERT INTO users (email,password_hash)VALUES ($1,$2) RETURNING id, email",[email,hash_pass]);
        res.json(result.rows[0]);
    }
    catch(error){
        console.log(error);
        res.status(500).json(
            {message:"server error"}
        )
    }
}
exports.loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
             return res.status(400).json({
            error: "Email and password required"
        })
        }
        const verifyEmail = await pool.query("SELECT * FROM users WHERE email = $1",[email]);
        if(verifyEmail.rows.length === 0){
            return res.status(404).json(
                {message:"Invalid credentials"}
            )
        }
        const user = verifyEmail.rows[0];
        const isValidPass = await bcrypt.compare(password,user.password_hash);
       
        if (!isValidPass) {
            return res.status(401).json({
                error: "Invalid credentials"
            })
        }

        const token = jwt.sign(
            {id:user.id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )

        if(!user.welcome_sent){

            await transporter.sendMail({
         from: process.env.EMAIL_USER,
         to: user.email,
         subject: "Welcome to Task Reminder 🎉",
         html: `
            <h2>Hi 👋</h2>
            <p>Welcome to <b>Task Reminder</b>.</p>
            <p>You can now create tasks and never miss reminders.</p>
            <br/>
            <p>Happy productivity 🚀</p>
         `
        });

            await pool.query(
                "UPDATE users SET welcome_sent = true WHERE id=$1",
            [user.id]
            );
        }

        res.json({ token });
    }
    catch(error){
        console.log(error);
        res.status(500).json(
            {message:"serverss error"}
        )
    }
}       

exports.deleteAccount = async (req, res) => {
    try{
        const userId = req.user.id;
        const client = await pool.connect();
        await client.query("BEGIN");

        await client.query(
            "DELETE FROM progress_tasks WHERE user_id = $1",
            [userId]
        );

        await client.query(
            "DELETE FROM remind WHERE user_id = $1",
            [userId]
        );

        await client.query(
            "DELETE FROM tasks WHERE user_id = $1",
            [userId]
        );

        await client.query(
            "DELETE FROM users WHERE id = $1",
            [userId]
        );

        await client.query("COMMIT");
        console.log('delete done');

        res.json(
            {message:"deletd succesfully"}
        )

    }
    catch(error){
        console.log(error);
        res.status(500).json(
            {error:"server error"}
        )
    }
}