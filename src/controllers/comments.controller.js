const { Pool }  = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'redsocial',
    port: '5432'
})

const getComments = async (req, res)=>{
    console.log('The server just received a request to get all comments');
    const response = await pool.query('SELECT comments.id, comments.commmentcontent, comments.userid, users.username, users.email, users.picture, comments.postid, posts.content, posts.posttime FROM comments, users, posts WHERE comments.userid = users.id and comments.postid = posts.id ORDER BY comments.id DESC');
    res.status(200).json(response.rows);
    console.log('The server just get all the comments');
}

const getCommentById = async (req, res)=>{
    console.log('The server just received a request to get one comment');
    const id = req.params.id;
    const response = await pool.query('SELECT comments.id, comments.commmentcontent, comments.userid, users.username, users.email, users.picture, comments.postid, posts.content, posts.posttime FROM comments, users, posts WHERE comments.id = $1 and comments.userid=users.id and comments.postid=posts.id ORDER BY comments.id DESC', [id]);
    if (response.rows != false){
        res.json(response.rows);
        console.log('The server just get one comment ' + JSON.stringify(response.rows));
    }else{
        res.json({
            message: 'The comment does not exist'
        });
        console.log('The comment does not exist');
    }
}

const getCommentsByUserId = async (req, res)=>{
    console.log("The server just received a request to get user's comments");
    const userid = req.params.userid;
    const response = await pool.query('SELECT comments.id, comments.commmentcontent, comments.userid, users.username, users.email, users.picture, comments.postid, posts.content, posts.posttime FROM comments, users, posts WHERE comments.userid=$1 and comments.postid=posts.id and comments.userid=users.id ORDER BY comments.userid DESC', [userid]);
    if (response.rows != false){
        res.json(response.rows);
        console.log("The server just get the user's comments");
    }else{
        res.json({
            message: 'The user does not exist or that user does not have any comment'
        });
        console.log('The user does not exist or that user does not have any comment');
    }
}


const getCommentsByPostId = async (req, res)=>{
    console.log("The server just received a request to get post's comments");
    const postid = req.params.postid;
    const response = await pool.query('SELECT comments.id, comments.commmentcontent, comments.postid, posts.content, posts.posttime, comments.userid, users.username, users.email, users.picture FROM comments, users, posts WHERE comments.postid=$1 and comments.postid=posts.id and comments.userid=users.id ORDER BY comments.userid DESC', [postid]);
    if (response.rows != false){
        res.json(response.rows);
        console.log("The server just get the post's comments");
    }else{
        res.json({
            message: 'The post does not exist or that post does not have any comment'
        });
        console.log('The post does not exist or that post does not have any comment');
    }
}

const createComment = async (req, res)=>{
    console.log('The server just received data to add a new comment');
    console.log(req.body);
    const { commmentcontent, userid, postid } = req.body;

    const verify = await pool.query('SELECT * FROM comments WHERE (userid = $1 and postid = $2)', [userid, postid]);

    if (verify.rows == false){

        const send = await pool.query('INSERT INTO comments (commmentcontent, userid, postid) VALUES ($1, $2, $3)', [commmentcontent, userid, postid]);
        const response = await pool.query('SELECT * FROM comments WHERE (userid = $1 and postid = $2)', [userid, postid])
        const response2 = await pool.query('SELECT * FROM users WHERE id = $1', [userid])
        const response3 = await pool.query('SELECT * FROM posts WHERE id = $1', [postid])

        res.json({
            message: 'User Add Succesfully',
            body: {
                comment: response.rows[0],
                user: response2.rows[0],
                post: response3.rows[0]
            }
        });
        console.log('The server just add the comment');

    }else{
        res.json({
            message: 'comment already exist'
        });
        console.log('comment already exist');
    }
}

const updateComment = async (req, res) => {
    const id = req.params.id;
    console.log('The server just received a request to update the comment: ' + id);
    const { commmentcontent, userid, postid } = req.body;
    const verify = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
    if (verify.rows != false){
        const response = await pool.query('UPDATE comments SET commmentcontent = $1, userid = $2, postid = $3 WHERE id = $4', [commmentcontent, userid, postid, id]);
        res.send('User Updated Sucessfully');
        console.log('The server just to update the comment '+response.rows)
    }else{
        res.json({
            message: 'The comment does not exist'
        });
        console.log('The comment does not exist');
    }
}

const deleteComment = async (req, res)=>{

}

module.exports = {
    getComments,
    getCommentById,
    getCommentsByUserId,
    getCommentsByPostId,
    createComment,
    updateComment,
    deleteComment
}