const { Pool }  = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'redsocial',
    port: '5432'
})

const getPosts = async (req, res) => {
    console.log('The server just received a request to get all posts');
    const response = await pool.query('SELECT * FROM posts');

    
    // let postUser = []

    let postUser = await response.rows.map(async post=>{

        const userID = post.userid;
        const response2 = await pool.query('SELECT * FROM users WHERE id = $1', [userID])
        const user = response2.rows[0]

        postUser.push({
            post: post,
            user
        })
 
    })    

    console.log(await postUser[1])
    
    res.status(200).json(postUser);
    console.log('The server just get all the posts');
}

const getPostsById = async (req, res) => {
    console.log('The server just received a request to get one post');
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (response.rows != false){
        res.json(response.rows);
        console.log('The server just get one post ' + JSON.stringify(response.rows));
    }else{
        res.json({
            message: 'The post does not exist'
        });
        console.log('The post does not exist');
    }
}

const createPost = async (req, res) => {
    console.log('The server just received data to add a new post');
    console.log(req.body);

    const { content, userID } = req.body;

    if (content != false){

        const response = await pool.query('INSERT INTO posts (content, userid, posttime) VALUES ($1, $2, current_timestamp)', [content, userID]);

        const response2 = await pool.query('SELECT * FROM users WHERE id = $1', [userID])
        
        res.json({
            message: 'User Add Succesfully',
            body: {
                post: {content, userID},
                user: response2.rows
            }
        });
        console.log('The server just add the post');
    }else{
        res.json({
            message: 'User already exist'
        });
        console.log('User already exist');
    }
    
}

module.exports = {
    getPosts,
    getPostsById,
    createPost
}