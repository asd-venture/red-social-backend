const { Pool }  = require('pg');
const { 
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT 
} = require('../config')

const pool = new Pool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT
})

const getComments = async (req, res)=>{
    try {
        const response = await pool.query('SELECT * FROM comments, users, posts WHERE comments.useridcomment = users.userid and comments.postidcomment = posts.postid ORDER BY comments.commentid DESC');
        res.status(200).json(response.rows);
    } catch (error) {
        res.json("the server catch this error getting comments: "+ error)
        console.log("the server catch this error getting comments: "+ error)
    }
}

const getCommentsByUserId = async (req, res)=>{
    try {
        const useridcomment = req.params.userid;
        const response = await pool.query('SELECT * FROM comments, users, posts WHERE comments.useridcomment=$1 and comments.postidcomment=posts.postid and comments.useridcomment=users.userid ORDER BY comments.commentid DESC', [useridcomment]);
        if (response.rows != false){
            res.json(response.rows);
        }else{
            res.json(response.rows);
        }
    } catch (error) {
        res.json("the server catch this error getting the user's comments: "+ error)
        console.log("the server catch this error getting the user's comments: "+ error)
    }
}

const getCommentsByPostId = async(req, res)=>{
    try {
        const postidcomment = req.params.postid;
        const response = await pool.query('SELECT * FROM comments, users, posts WHERE comments.postidcomment=$1 and comments.postidcomment=posts.postid and comments.useridcomment=users.userid ORDER BY comments.commentid DESC', [postidcomment]);
        if (response.rows != false){
            res.json(response.rows);
        }else{
            res.json(response.rows);
        }
    } catch (error) {
        res.json("the server catch this error getting the post's comments: "+ error)
        console.log("the server catch this error getting the post's comments: "+ error)
    }
}

const createComment = async (req, res)=>{
    try {
        const { nota, useridcomment, postidcomment } = req.body;
        const verify = await pool.query('SELECT * FROM comments WHERE (useridcomment = $1 and postidcomment = $2)', [useridcomment, postidcomment]);
        if (verify.rows == false){
            const response = await pool.query('INSERT INTO comments (nota, useridcomment, postidcomment) VALUES ($1, $2, $3)', [nota, useridcomment, postidcomment]);
            
            res.json({
                message: 'User Add Succesfully',
            });

        }else{
            res.json({
                message: 'comment already exist'
            });
        }
    } catch (error) {
        res.json("the server catch this error creating a comment: "+ error)
        console.log("the server catch this error creating a comment: "+ error)
    }
}

const updateComment = async (req, res) => {
    try {
        const commentid = req.params.id;
        const { nota, useridcomment, postidcomment } = req.body;
        const verify = await pool.query('SELECT * FROM comments WHERE commentid = $1', [commentid]);
        if (verify.rows != false){
            const response = await pool.query('UPDATE comments SET nota = $1, useridcomment = $2, postidcomment = $3 WHERE commentid = $4', [nota, useridcomment, postidcomment, commentid]);
            res.send('User Updated Sucessfully');
        }else{
            res.json({
                message: 'The comment does not exist'
            });
        }
    } catch (error) {
        res.json("the server catch this error updating a comment: "+ error)
        console.log("the server catch this error updating a comment: "+ error)
    }
}

const deleteComment = async (req, res)=>{
    try {
        const commentid = req.params.id;
        const verify = await pool.query('SELECT * FROM comments WHERE commentid = $1', [commentid]);
        if (verify.rows != false){
            const response = await pool.query('DELETE FROM comments WHERE commentid = $1', [commentid]);
            res.json(`Comment ${commentid} deleted succesfully`);
        }else{
            res.json({
                message: 'The comment does not exist'
            });
        }
    } catch (error) {
        res.json("the server catch this error removing a comment: "+ error)
        console.log("the server catch this error removing a comment: "+ error)
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