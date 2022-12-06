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

    const response = await pool.query('SELECT * FROM posts, users WHERE users.userid=posts.useridpost ORDER BY posts.postid DESC');
    
    res.status(200).json(response.rows);
    console.log('The server just get all the posts');
}

const getPostsById = async (req, res) => {
    console.log('The server just received a request to get one post');
    const postid = req.params.id;
    const response = await pool.query('SELECT * FROM posts, users WHERE posts.postid = $1 and posts.useridpost=users.userid', [postid]);
    if (response.rows != false){
        res.json(response.rows[0]);
        console.log('The server just get one post ' + JSON.stringify(response.rows));
    }else{
        res.json({
            message: 'The post does not exist'
        });
        console.log('The post does not exist');
    }
}

const getPostsByUserId = async (req, res) => {
    const useridpost = req.params.userid;
    console.log('The server just received a request to get posts from the user ' + useridpost );
    const response = await pool.query('SELECT * FROM posts, users  WHERE users.userid=$1 and posts.useridpost=$1 ORDER BY posts.postid DESC', [useridpost]);
    if (response.rows != false){
        res.json(response.rows);
        console.log('The server just get posts');
    }else{
        res.json({
            message: 'The user does not have any post'
        });
        console.log('The user does not have any post');
    }
}

const createPost = async (req, res) => {
    console.log('The server just received data to add a new post');
    console.log(req.body);
    const { content, useridpost } = req.body;

    if (content != false){

        const response = await pool.query('INSERT INTO posts (content, useridpost, posttime) VALUES ($1, $2, current_timestamp)', [content, useridpost]);

        res.json({
            message: 'User Add Succesfully',
            post: { content, useridpost }
        });
        console.log('The server just add the post');

    }else{
        res.json({
            message: 'Post already exist'
        });
        console.log('Post already exist');
    }
}

const updatePost = async (req, res) => {
    const postid = req.params.id;
    console.log('The server just received a request to update the post: ' + postid);
    const { content, useridpost } = req.body;
    const verify = await pool.query('SELECT * FROM posts WHERE postid = $1', [postid]);
    if (verify.rows != false){
        const response = await pool.query('UPDATE posts SET content = $1, useridpost = $2 WHERE postid = $3', [content, useridpost, postid]);
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
    const postid = req.params.id;
    console.log('The server just received a request to delete the post: ' + postid);
    const verify = await pool.query('SELECT * FROM posts WHERE postid = $1', [postid]);
    if (verify.rows != false){
        const response = await pool.query('DELETE FROM posts WHERE postid = $1', [postid]);
        console.log(response);
        res.json(`Post ${postid} deleted succesfully`);
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