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

    const response = await pool.query('SELECT posts.id, posts.content, posts.posttime, posts.userid, users.username, users.email, users.picture FROM users, posts WHERE users.id=posts.userid ORDER BY posts.id DESC');
    
    res.status(200).json(response.rows);
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

const getPostsByUserId = async (req, res) => {
    console.log('The server just received a request to get one post');
    const userid = req.params.userid;
    const response = await pool.query('SELECT posts.id, posts.content, posts.posttime, posts.userid, users.username, users.email, users.picture FROM users, posts WHERE users.id=$1 and posts.userid=$1 ORDER BY posts.id DESC;', [userid]);
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
    const { content, userid } = req.body;

    const verify = await pool.query('SELECT * FROM posts WHERE (content = $1 and userid = $2)', [content, userid]);

    if (content != false && verify.rows == false){

        const response = await pool.query('INSERT INTO posts (content, userid, posttime) VALUES ($1, $2, current_timestamp)', [content, userid]);

        const response2 = await pool.query('SELECT * FROM users WHERE id = $1', [userid])

        res.json({
            message: 'User Add Succesfully',
            body: {
                post: {content, userid},
                user: response2.rows[0]
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

const updatePost = async (req, res) => {
    const id = req.params.id;
    console.log('The server just received a request to update the post: ' + id);
    const { content, userid } = req.body;
    const verify = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (verify.rows != false){
        const response = await pool.query('UPDATE posts SET content = $1, userid = $2 WHERE id = $3', [content, userid, id]);
        res.send('User Updated Sucessfully');
        console.log('The server just to update the post '+response.rows)
    }else{
        res.json({
            message: 'The post does not exist'
        });
        console.log('The post does not exist');
    }
}

const deletePost = async (req, res) => {
    const id = req.params.id;
    console.log('The server just received a request to delete the post: ' + id);
    const verify = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (verify.rows != false){
        const response = await pool.query('DELETE FROM posts WHERE id = $1', [id]);
        console.log(response);
        res.json(`Post ${id} deleted succesfully`);
        console.log('The server just delete the post');
    }else{
        res.json({
            message: 'The post does not exist'
        });
        console.log('The post does not exist');
    }
}

module.exports = {
    getPosts,
    getPostsById,
    getPostsByUserId,
    createPost,
    updatePost,
    deletePost
}