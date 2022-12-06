CREATE DATABASE redsocial

CREATE TABLE users(
    userid SERIAL PRIMARY KEY,
    username varchar(40) NOT NULL, 
    email TEXT NOT NULL, 
    picture TEXT NOT NULL
);

CREATE TABLE posts(
    postid SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    useridpost int NOT NULL,
    postTime TIMESTAMP NOT NULL,
    FOREIGN KEY (useridpost) REFERENCES users(userid)
);

CREATE TABLE comments(
    commentid SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    useridcomment int NOT NULL,
    postidcomment int NOT NULL,
    FOREIGN KEY (useridcomment) REFERENCES users(userid),
    FOREIGN KEY (postidcomment) REFERENCES posts(postid)
);

CREATE TABLE likes(
    likeid SERIAL PRIMARY KEY,
    useridcomment int NOT NULL,
    postidcomment int NOT NULL,
    FOREIGN KEY (useridcomment) REFERENCES users(userid),
    FOREIGN KEY (postidcomment) REFERENCES posts(postid)
);