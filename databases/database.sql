CREATE DATABASE redsocial

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username varchar(40) NOT NULL, 
    email TEXT NOT NULL, 
    picture TEXT NOT NULL
);

CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    userid int NOT NULL,
    postTime TIMESTAMP NOT NULL,
    FOREIGN KEY (userid) REFERENCES users(id)
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    userid int NOT NULL,
    postid int NOT NULL,
    FOREIGN KEY (userid) REFERENCES users(id),
    FOREIGN KEY (postid) REFERENCES posts(id)
);

CREATE TABLE likes(
    id SERIAL PRIMARY KEY,
    userid int NOT NULL,
    postid int NOT NULL,
    FOREIGN KEY (userid) REFERENCES users(id),
    FOREIGN KEY (postid) REFERENCES posts(id)
);