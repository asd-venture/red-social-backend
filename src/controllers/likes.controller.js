const { Pool }  = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'redsocial',
    port: '5432'
})

const getLikes = async (req, res)=>{
    console.log('The server just received a request to get all likes');
    const response = await pool.query('SELECT likes.id, likes.userid, users.username, users.email, users.picture, likes.postid, posts.content, posts.posttime FROM likes, users, posts WHERE likes.userid = users.id and likes.postid = posts.id ORDER BY likes.id DESC');
    res.status(200).json(response.rows);
    console.log('The server just get all the like');
}

const getLikeById = async (req, res)=>{
    console.log('The server just received a request to get one like');
    const id = req.params.id;
    const response = await pool.query('SELECT likes.id, likes.userid, users.username, users.email, users.picture, likes.postid, posts.content, posts.posttime FROM likes, users, posts WHERE likes.id = $1 and likes.userid=users.id and likes.postid=posts.id ORDER BY likes.id DESC', [id]);
    if (response.rows != false){
        res.json(response.rows);
        console.log('The server just get one like ' + JSON.stringify(response.rows));
    }else{
        res.json({
            message: 'The like does not exist'
        });
        console.log('The like does not exist');
    }
}

const getLikesByUserId = async (req, res) => {
    console.log("The server just received a request to get user's likes");
    const userid = req.params.userid;
    const response = await pool.query('SELECT likes.id, likes.userid, users.username, users.email, users.picture, likes.postid, posts.content, posts.posttime FROM likes, users, posts WHERE likes.userid=$1 and likes.postid=posts.id and likes.userid=users.id ORDER BY likes.userid DESC', [userid]);
    if (response.rows != false){
        res.json(response.rows);
        console.log("The server just get the user's like");
    }else{
        res.json({
            message: 'The user does not exist or that user does not have any like'
        });
        console.log('The user does not exist or that user does not have any like');
    }
}

const getLikesByPostId = async (req, res)=>{
    console.log("The server just received a request to get post's likes");
    const postid = req.params.postid;
    const response = await pool.query('SELECT likes.id, likes.postid, posts.content, posts.posttime, likes.userid, users.username, users.email, users.picture FROM likes, users, posts WHERE likes.postid=$1 and likes.postid=posts.id and likes.userid=users.id ORDER BY likes.userid DESC', [postid]);
    if (response.rows != false){
        res.json(response.rows);
        console.log("The server just get the post's likes");
    }else{
        res.json({
            message: 'The post does not exist or that post does not have any like'
        });
        console.log('The post does not exist or that post does not have any like');
    }
}

const createLike = async (req, res)=>{
    console.log('The server just received data to add a new like');
    console.log(req.body);
    const { userid, postid } = req.body;

    const verify = await pool.query('SELECT * FROM likes WHERE (userid = $1 and postid = $2)', [userid, postid]);

    if (verify.rows == false){

        const send = await pool.query('INSERT INTO likes (userid, postid) VALUES ($1, $2)', [userid, postid]);
        const response = await pool.query('SELECT * FROM likes WHERE (userid = $1 and postid = $2)', [userid, postid])
        const response2 = await pool.query('SELECT * FROM users WHERE id = $1', [userid])
        const response3 = await pool.query('SELECT * FROM posts WHERE id = $1', [postid])

        res.json({
            message: 'User Add Succesfully',
            body: {
                like: response.rows[0],
                user: response2.rows[0],
                post: response3.rows[0]
            }
        });
        console.log('The server just add the like');

    }else{
        res.json({
            message: 'Like already exist'
        });
        console.log('Like already exist');
    }
}

const deleteLike = async (req, res)=>{
    const id = req.params.id;
    console.log('The server just received a request to delete the like: ' + id);
    const verify = await pool.query('SELECT * FROM likes WHERE id = $1', [id]);
    if (verify.rows != false){
        const response = await pool.query('DELETE FROM likes WHERE id = $1', [id]);
        console.log(response);
        res.json(`Like ${id} deleted succesfully`);
        console.log('The server just delete the like');
    }else{
        res.json({
            message: 'The like does not exist'
        });
        console.log('The like does not exist');
    }
}

module.exports = {
    getLikes,
    getLikeById,
    getLikesByUserId,
    getLikesByPostId,
    createLike,
    deleteLike,
}