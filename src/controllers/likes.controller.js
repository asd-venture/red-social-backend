const { Pool }  = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'redsocial',
    port: '5432'
})

const getLikes = async (req, res)=>{

}

const getLikeById = async (req, res)=>{

}

const createLike = async (req, res)=>{

}

const deleteLike = async (req, res)=>{

}

module.exports = {
    getLikes,
    getLikeById,
    createLike,
    deleteLike,
}