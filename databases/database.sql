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
    FOREIGN KEY (useridpost) REFERENCES users(userid) ON DELETE CASCADE
);

CREATE TABLE images(
    imageid TEXT NOT NULL,
    urlimage TEXT NOT NULL,
    postidimage int NOT NULL,
    FOREIGN KEY (postidimage) REFERENCES posts(postid) ON DELETE CASCADE
);

CREATE TABLE comments(
    commentid SERIAL PRIMARY KEY,
    nota TEXT NOT NULL,
    useridcomment int NOT NULL,
    postidcomment int NOT NULL,
    FOREIGN KEY (useridcomment) REFERENCES users(userid) ON DELETE CASCADE,
    FOREIGN KEY (postidcomment) REFERENCES posts(postid) ON DELETE CASCADE
);

CREATE TABLE likes(
    likeid SERIAL PRIMARY KEY,
    useridlike int NOT NULL,
    postidlike int NOT NULL,
    FOREIGN KEY (useridlike) REFERENCES users(userid) ON DELETE CASCADE,
    FOREIGN KEY (postidlike) REFERENCES posts(postid) ON DELETE CASCADE
);