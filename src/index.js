const cors = require('cors')
const express = require('express');
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

// routes
app.use(require('./routes/index'))

app.listen(3000);
