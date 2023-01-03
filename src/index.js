const cors = require('cors')
const fileUpload = require('express-fileupload')
const express = require('express');
const app = express();

require('dotenv').config();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}));
app.use(cors());

// routes
app.use(require('./routes/users'))
app.use(require('./routes/posts'))
app.use(require('./routes/likes'))
app.use(require('./routes/comments'))

app.listen(3000);
