const { Pool }  = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'redsocial',
    port: '5432'
})

const getComments = async (req, res)=>{
    const response = await pool.query('SELECT * FROM comments, users, posts WHERE comments.useridcomment = users.userid and comments.postidcomment = posts.postid ORDER BY comments.commentid DESC');
    res.status(200).json(response.rows);
    console.log('The server just get all the comments');
}

const getCommentsByUserId = async (req, res)=>{
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


const getCommentsByPostId = async(req, res)=>{
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
    const { nota, useridcomment, postidcomment } = req.body;
    const verify = await pool.query('SELECT * FROM comments WHERE (useridcomment = $1 and postidcomment = $2)', [useridcomment, postidcomment]);
    if (verify.rows == false){
        const send = await pool.query('INSERT INTO comments (nota, useridcomment, postidcomment) VALUES ($1, $2, $3)', [nota, useridcomment, postidcomment]);
        
        res.json({
            message: 'User Add Succesfully',
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
    const verify = await pool.query('SELECT * FROM comments WHERE commentid = $1', [commentid]);
    if (verify.rows != false){
        const response = await pool.query('DELETE FROM comments WHERE commentid = $1', [commentid]);
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
    getCommentsByUserId,
    getCommentsByPostId,
    createComment,
    updateComment,
    deleteComment
}