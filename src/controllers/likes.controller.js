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

const getLikes = async (req, res)=>{
    try {
        const response = await pool.query('SELECT * FROM likes, users, posts WHERE likes.useridlike = users.userid and likes.postidlike = posts.postid ORDER BY likes.likeid DESC');
        res.status(200).json(response.rows);
        console.log('The server just get all the like');
    } catch (error) {
        res.json("the server catch this error getting likes: "+ error)
        console.log("the server catch this error getting likes: "+ error)
    }
}

const getLikesByUserId = async (req, res) => {
    try {
        const useridlike = req.params.userid;
        const response = await pool.query('SELECT * FROM likes, users, posts WHERE likes.useridlike=$1 and likes.postidlike=posts.postid and likes.useridlike=users.userid ORDER BY likes.likeid DESC', [useridlike]);
        if (response.rows != false){
            res.json(response.rows);
            console.log("The server just get the user's like");
        }else{
            res.json(response.rows)
            console.log('The user does not exist or that user does not have any like');
        }
    } catch (error) {
        res.json("the server catch this error getting the user's likes: "+ error)
        console.log("the server catch this error getting the user's likes: "+ error)
    }
}

const getLikesByPostId = async (req, res)=>{
    try {
        const postidlike = req.params.postid;
        const response = await pool.query('SELECT * FROM likes, users, posts WHERE likes.postidlike=$1 and likes.postidlike=posts.postid and likes.useridlike=users.userid ORDER BY likes.likeid DESC', [postidlike]);
        if (response.rows != false){
            res.json(response.rows);
            console.log("The server just get the post's likes");
        }else{
            res.json(response.rows);
            console.log('The post does not exist or that post does not have any like');
        }
    } catch (error) {
        res.json("the server catch this error getting the post's likes: "+ error)
        console.log("the server catch this error getting the post's likes: "+ error)
    }
}

const createLike = async (req, res)=>{
    try {
        const { useridlike, postidlike } = req.body;
        const verify = await pool.query('SELECT * FROM likes WHERE (useridlike = $1 and postidlike = $2)', [useridlike, postidlike]);
        if (verify.rows == false){
            const send = await pool.query('INSERT INTO likes (useridlike, postidlike) VALUES ($1, $2)', [useridlike, postidlike]);
            res.json({
                message: 'Like Add Succesfully'
            });
            console.log('The server just add the like');
        }else{
            const response = await pool.query('SELECT * FROM likes WHERE (useridlike = $1 and postidlike = $2)', [useridlike, postidlike])
            res.json({
                message: 'Like already exist',
                like: response.rows[0]
            });
            console.log('Like already exist');
        }
    } catch (error) {
        res.json("the server catch this error creating a like: "+ error)
        console.log("the server catch this error creating a like: "+ error)
    }
}

const deleteLike = async (req, res)=>{
    try {
        const likeid = req.params.id;
        const verify = await pool.query('SELECT * FROM likes WHERE likeid = $1', [likeid]);
        if (verify.rows != false){
            const response = await pool.query('DELETE FROM likes WHERE likeid = $1', [likeid]);
            res.json({
                message: 'Like delete succesfully'
            })
            console.log('The server just delete the like');
        }else{
            res.json({
                message: 'The like does not exist'
            })
            console.log('The like does not exist');
        }
    } catch (error) {
        res.json("the server catch this error removing a like: "+ error)
        console.log("the server catch this error removing a like: "+ error)
    }
}

module.exports = {
    getLikes,
    getLikesByUserId,
    getLikesByPostId,
    createLike,
    deleteLike,
}