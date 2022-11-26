const { Pool }  = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'redsocial',
    port: '5432'
})

const getComments = async (req, res)=>{

}

const getCommentById = async (req, res)=>{

}

const createComment = async (req, res)=>{

}

const deleteComment = async (req, res)=>{

}

const updateComment = async (req, res) => {

}

module.exports = {
    getComments,
    getCommentById,
    createComment,
    deleteComment,
    updateComment
}