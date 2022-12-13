const { Pool }  = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'redsocial',
    port: '5432'
})

const getUsers = async (req, res) => {
    const response = await pool.query('SELECT * FROM users ORDER BY userid DESC');
    res.status(200).json(response.rows);
    console.log('The server just get all the users');
}

const getUserById = async (req, res) => {
    const userid = req.params.id;
    const response = await pool.query('SELECT * FROM users WHERE userid = $1', [userid]);
    if (response.rows != false){
        res.json(response.rows[0]);
        console.log('The server just get one user ' + JSON.stringify(response.rows));
    }else{
        res.json({
            message: 'The user does not exist'
        });
        console.log('The user does not exist');
    }
}

const createUser = async (req, res) => {
    const { username, email, picture } = req.body;
    
    const verify = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (verify.rows == false){
        const response = await pool.query('INSERT INTO users (username, email, picture) VALUES ($1, $2, $3)', [username, email, picture]);
        const response2 = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        res.json({
            message: 'User Add Succesfully',
            body: {
                user: response2.rows[0]
            }
        });
        console.log('The server just add the user');
        
        const verify = await pool.query('WITH repeatedEmails AS ( SELECT MIN(userid) as userid, email FROM users GROUP BY email HAVING COUNT(*)>1) DELETE FROM users WHERE userid not IN ( SELECT userid FROM repeatedEmails) and email IN (SELECT email FROM repeatedEmails)')
    }else{
        res.json({
            message: 'User already exist',
            user: verify.rows[0]
        });
        console.log('User already exist');
    }
    
}
 
const updateUser = async (req, res) => {
    const userid = req.params.id;
    const { username, email, picture } = req.body;
    const verify = await pool.query('SELECT * FROM users WHERE userid = $1', [userid]);
    if (verify.rows != false){
        const response = await pool.query('UPDATE users SET username = $1, email = $2, picture = $3 WHERE userid = $4', [username, email, picture, userid]);
        
        res.send('User Updated Sucessfully');
        console.log('The server just to update the user '+response.rows)
    }else{
        res.json({
            message: 'The user does not exist'
        });
        console.log('The user does not exist');
    }
}

const deleteUser = async (req, res) => {
    const userid = req.params.id;
    const verify = await pool.query('SELECT * FROM users WHERE userid = $1', [userid]);
    if (verify.rows != false){
        const response = await pool.query('DELETE FROM users WHERE userid = $1', [userid]);
        res.json(`User ${userid} deleted succesfully`);
        console.log('The server just delete the user');
    }else{
        res.json({
            message: 'The user does not exist'
        });
        console.log('The user does not exist');
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}