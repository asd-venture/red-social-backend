const { Pool }  = require('pg');
const fs = require('fs-extra');
let { uploadImage, deleteImage } = require('../utils/cloudinary.js');
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

const getPosts = async (req, res) => {
    try {
        const { page, size } = req.query;
        const results = await pool.query('SELECT * FROM posts INNER JOIN users ON users.userid=posts.useridpost LEFT JOIN images ON images.postidimage=posts.postid ORDER BY posts.postid DESC LIMIT $2 OFFSET (($1 - 1) * $2)', [page, size]);
        const total_results = await pool.query('SELECT count(*) FROM posts')
        res.status(200).json({
            page: parseInt(page),
            results: results.rows,
            total_pages: Math.ceil(total_results.rows[0].count/size),
            total_results: parseInt(total_results.rows[0].count)
        });
        console.log('The server just get all the posts');
    } catch (error) {
        res.json("the server catch this error getting posts: "+ error)
        console.log("the server catch this error getting posts: "+ error)
    }
}

const getPostById = async (req, res) => {
    try {
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
    } catch (error) {
        res.json("the server catch this error getting a post: "+ error)
        console.log("the server catch this error getting a post: "+ error)
    }
}

const getPostsByUserId = async (req, res) => {
    try {
        const useridpost = req.params.userid;
        const { page, size } = req.query;
        const results = await pool.query('SELECT * FROM posts INNER JOIN users ON users.userid=$1 LEFT JOIN images ON images.postidimage=posts.postid WHERE posts.useridpost=$1 ORDER BY posts.postid DESC LIMIT $3 OFFSET (($2 - 1) * $3)', [useridpost, page, size]);
        const total_results = await pool.query('SELECT count(*) FROM posts WHERE posts.useridpost=$1', [useridpost])
        res.status(200).json({
            page: parseInt(page),
            results: results.rows,
            total_pages: Math.ceil(total_results.rows[0].count/size),
            total_results: parseInt(total_results.rows[0].count)
        });
        console.log('The server just get posts');
    } catch (error) {
        res.json("the server catch this error getting the user's posts: "+ error)
        console.log("the server catch this error getting the user's posts: "+ error)
    }
}

const createPost = async (req, res) => {
    try {
        const { content, useridpost } = req.body;
        if(content || req.files?.image ){
            const response = await pool.query('INSERT INTO posts (content, useridpost, posttime) VALUES ($1, $2, current_timestamp) RETURNING *', [content, useridpost]);
            if (req.files?.image) {
                const image = await uploadImage(req.files.image.tempFilePath)
                await pool.query('INSERT INTO images (imageid, urlimage, postidimage) VALUES ($1, $2, $3)', [image.public_id, image.secure_url, response.rows[0]?.postid]);
                await fs.unlink(req.files.image.tempFilePath);
            }
            res.json({
                message: 'User Add Succesfully',
            });
            console.log('The server just add the post');
        }
    } catch (error) {
        res.json("the server catch this error creating a post: "+ error)
        console.log("the server catch this error creating a post: "+ error)
    }
}

const updatePost = async (req, res) => {
    try {
        const postid = req.params.id;
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
    } catch (error) {
        res.json("the server catch this error updating a post: "+ error)
        console.log("the server catch this error updating a post: "+ error)
    }
}

const deletePost = async (req, res) => {
    try {
        const postid = req.params.id;
        const verify = await pool.query('SELECT * FROM posts WHERE postid = $1', [postid]);
        if (verify.rows != false){
            const image = await pool.query('SELECT * FROM images WHERE postidimage = $1', [postid])
            if(image.rows != false){
                await deleteImage(image.rows[0].imageid)
            }
            const response = await pool.query('DELETE FROM posts WHERE postid = $1', [postid]);
            res.json(`Post ${postid} deleted succesfully`);
            console.log('The server just delete the post');
        }else{
            res.json({
                message: 'The post does not exist'
            });
            console.log('The post does not exist');
        }
    } catch (error) {
        res.json("the server catch this error removing a post: "+ error)
        console.log("the server catch this error removing a post: "+ error)
    }
}

module.exports = {
    getPosts,
    getPostById,
    getPostsByUserId,
    createPost,
    updatePost,
    deletePost
}