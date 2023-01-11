const cors = require('cors')
const express = require('express');
require('dotenv').config();
const { PORT } = require('./config.js')

const app = express();


// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

// routes
app.use(require('./routes/users'))
app.use(require('./routes/posts'))
app.use(require('./routes/likes'))
app.use(require('./routes/comments'))

app.listen(PORT);
