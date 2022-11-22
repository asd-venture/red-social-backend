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

    const { username, email, fullname } = req.body;

    try{

        const verify = await pool.query('SELECT * FROM users WHERE username = $1 AND email = $2 AND fullname = $3', [username, email, fullname]);
        
        if (verify.rows == false){
            
            const response = await pool.query('INSERT INTO users (username, email, fullname) VALUES ($1, $2, $3)', [username, email, fullname]);

            res.json({
                message: 'User Add Succesfully',
                body: {
                    user: {username, email, fullname}
                }
            });
            console.log('The server just add the user');
        }else{
            res.json({
                message: 'User already exist'
            });
            console.log('User already exist');
        }
    } catch{
        res.json({
            message: 'Something was wrong'
        })
        console.log('Something was wrong');
    }
}
 
const updateUser = async (req, res) => {
    const id = req.params.id;
    console.log('The server just received a request to update the user: ' + id);
    const { name, username, email, fullname } = req.body;
    const response = await pool.query('UPDATE users SET name = $1, username = $2, email = $3, fullname = $4 WHERE id = $5', [name, username, email, fullname, id]);
    res.send('User Updated Sucessfully');
    console.log('The server just to update the user '+response.rows)
}

const deleteUser = async (req, res) => {
    const id = req.params.id;
    console.log('The server just received a request to delete the user: ' + id);
    const response = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    console.log(response);
    res.json(`User ${id} deleted succesfully`);
    console.log('The server just delete the user');
}

module.exports = {
    getUsers,
    createUser,
    getUserById,
    deleteUser,
    updateUser
}