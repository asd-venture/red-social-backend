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
    const response = await pool.query('SELECT * FROM likes, users, posts WHERE likes.useridlike = users.userid and likes.postidlike = posts.postid ORDER BY likes.likeid DESC');
    res.status(200).json(response.rows);
    console.log('The server just get all the like');
}

const getLikeById = async (req, res)=>{
    console.log('The server just received a request to get one like');
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM likes, users, posts WHERE likes.likeid = $1 and likes.useridlike=users.userid and likes.postidlike=posts.postid ORDER BY likes.likeid DESC', [id]);
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
    const useridlike = req.params.userid;
    const response = await pool.query('SELECT * FROM likes, users, posts WHERE likes.useridlike=$1 and likes.postidlike=posts.postid and likes.useridlike=users.userid ORDER BY likes.likeid DESC', [useridlike]);
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
    const postidlike = req.params.postid;
    const response = await pool.query('SELECT * FROM likes, users, posts WHERE likes.postidlike=$1 and likes.postidlike=posts.postid and likes.useridlike=users.userid ORDER BY likes.likeid DESC', [postidlike]);
    if (response.rows != false){
        res.json({
            posts: response.rows
        });
        console.log("The server just get the post's likes");
    }else{
        res.json({
            message: 'The post does not exist or that post does not have any like',
            posts: response.rows
        });
        console.log('The post does not exist or that post does not have any like');
    }
}

const createLike = async (req, res)=>{
    console.log('The server just received data to add a new like');
    console.log(req.body);
    const { useridlike, postidlike } = req.body;

    const verify = await pool.query('SELECT * FROM likes WHERE (useridlike = $1 and postidlike = $2)', [useridlike, postidlike]);

    if (verify.rows == false){

        const send = await pool.query('INSERT INTO likes (useridlike, postidlike) VALUES ($1, $2)', [useridlike, postidlike]);
        const response = await pool.query('SELECT * FROM likes WHERE (useridlike = $1 and postidlike = $2)', [useridlike, postidlike])

        res.json({
            message: 'Like Add Succesfully',
            like: response.rows[0]
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
}

const deleteLike = async (req, res)=>{
    const likeid = req.params.id;
    console.log('The server just received a request to delete the like: ' + likeid);
    const verify = await pool.query('SELECT * FROM likes WHERE likeid = $1', [likeid]);
    if (verify.rows != false){
        const response = await pool.query('DELETE FROM likes WHERE likeid = $1', [likeid]);
        console.log(response);
        res.json(`Like ${likeid} deleted succesfully`);
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