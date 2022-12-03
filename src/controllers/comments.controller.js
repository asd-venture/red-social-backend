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
    const response = await pool.query('SELECT * FROM comments, users, posts WHERE comments.useridcomment = users.userid and comments.postidcomment = posts.postid ORDER BY comments.commentid DESC');
    res.status(200).json(response.rows);
    console.log('The server just get all the comments');
}

const getCommentById = async (req, res)=>{
    console.log('The server just received a request to get one comment');
    const commentid = req.params.id;
    const response = await pool.query('SELECT * FROM comments, users, posts WHERE comments.commentid = $1 and comments.useridcomment=users.userid and comments.postidcomment=posts.postid', [commentid]);
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
    const useridcomment = req.params.userid;
    const response = await pool.query('SELECT * FROM comments, users, posts WHERE comments.useridcomment=$1 and comments.postidcomment=posts.postid and comments.useridcomment=users.userid ORDER BY comments.commentid DESC', [useridcomment]);
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
    const postidcomment = req.params.postid;
    const response = await pool.query('SELECT * FROM comments, users, posts WHERE comments.postidcomment=$1 and comments.postidcomment=posts.postid and comments.useridcomment=users.userid ORDER BY comments.commentid DESC', [postidcomment]);
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
    const { nota, useridcomment, postidcomment } = req.body;

    const verify = await pool.query('SELECT * FROM comments WHERE (useridcomment = $1 and postidcomment = $2)', [useridcomment, postidcomment]);

    if (verify.rows == false){

        const send = await pool.query('INSERT INTO comments (nota, useridcomment, postidcomment) VALUES ($1, $2, $3)', [nota, useridcomment, postidcomment]);
        const response = await pool.query('SELECT * FROM comments WHERE (useridcomment = $1 and postidcomment = $2)', [useridcomment, postidcomment])
        const response2 = await pool.query('SELECT * FROM users WHERE userid = $1', [useridcomment])
        const response3 = await pool.query('SELECT * FROM posts WHERE postid = $1', [postidcomment])

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
    const commentid = req.params.id;
    console.log('The server just received a request to update the comment: ' + commentid);
    const { nota, useridcomment, postidcomment } = req.body;
    const verify = await pool.query('SELECT * FROM comments WHERE commentid = $1', [commentid]);
    if (verify.rows != false){
        const response = await pool.query('UPDATE comments SET nota = $1, useridcomment = $2, postidcomment = $3 WHERE commentid = $4', [nota, useridcomment, postidcomment, commentid]);
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
    const commentid = req.params.id;
    console.log('The server just received a request to delete the comment: ' + commentid);
    const verify = await pool.query('SELECT * FROM comments WHERE commentid = $1', [commentid]);
    if (verify.rows != false){
        const response = await pool.query('DELETE FROM comments WHERE commentid = $1', [commentid]);
        console.log(response);
        res.json(`Comment ${commentid} deleted succesfully`);
        console.log('The server just delete the comment');
    }else{
        res.json({
            message: 'The comment does not exist'
        });
        console.log('The comment does not exist');
    }
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