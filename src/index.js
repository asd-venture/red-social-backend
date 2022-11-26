const cors = require('cors')
const express = require('express');
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

// routes
app.use(require('./routes/users'))
app.use(require('./routes/posts'))
app.use(require('./routes/likes'))

app.listen(3000);
