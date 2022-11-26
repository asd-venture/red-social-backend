const { Pool }  = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'redsocial',
    port: '5432'
})

const getUsers = async (req, res) => {
    console.log('The server just received a request to get all users');
    const response = await pool.query('SELECT * FROM users');
    res.status(200).json(response.rows);
    console.log('The server just get all the users');
}

const getUserById = async (req, res) => {
    console.log('The server just received a request to get one user');
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (response.rows != false){
        res.json(response.rows);
        console.log('The server just get one user ' + JSON.stringify(response.rows));
    }else{
        res.json({
            message: 'The user does not exist'
        });
        console.log('The user does not exist');
    }
}

const createUser = async (req, res) => {
    console.log('The server just received data to add a new user');
    console.log(req.body);

    const { username, email, picture } = req.body;
    
    const verify = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (verify.rows == false){
        const response = await pool.query('INSERT INTO users (username, email, picture) VALUES ($1, $2, $3)', [username, email, picture]);
        res.json({
            message: 'User Add Succesfully',
            body: {
                user: {username, email, picture}
            }
        });
        console.log('The server just add the user');
        
        const verify = await pool.query('WITH repeatedEmails AS ( SELECT MIN(id) as id, email FROM users GROUP BY email HAVING COUNT(*)>1) DELETE FROM users WHERE id not IN ( SELECT id FROM repeatedEmails) and email IN (SELECT email FROM repeatedEmails)')
    }else{
        res.json({
            message: 'User already exist'
        });
        console.log('User already exist');
    }
    
}
 
const updateUser = async (req, res) => {
    const id = req.params.id;
    console.log('The server just received a request to update the user: ' + id);
    const { username, email, picture } = req.body;
    const verify = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (verify.rows != false){
        const response = await pool.query('UPDATE users SET username = $1, email = $2, picture = $3 WHERE id = $4', [username, email, picture, id]);
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
    const id = req.params.id;
    console.log('The server just received a request to delete the user: ' + id);
    const verify = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (verify.rows != false){
        const response = await pool.query('DELETE FROM users WHERE id = $1', [id]);
        console.log(response);
        res.json(`User ${id} deleted succesfully`);
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