CREATE DATABASE firstapi

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(40),
    email TEXT
);

INSERT INTO users (name, email) VALUES 
    ('joe', 'joe@ibm.com'),
    ('ryan', 'ryan@faztweb.com');


CREATE TABLE Users(
    id SERIAL PRIMARY KEY,
    username varchar(40) NOT NULL, 
    email TEXT NOT NULL,
    password varchar(10) NOT NULL
);

CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    userID int NOT NULL,
    postTime TIMESTAMP NOT NULL,
    FOREIGN KEY (userID) REFERENCES users(id)
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    userID int NOT NULL,
    postID int NOT NULL,
    FOREIGN KEY (userID) REFERENCES users(id),
    FOREIGN KEY (postID) REFERENCES posts(id)
);

CREATE TABLE likes(
    id SERIAL PRIMARY KEY,
    userID int NOT NULL,
    postID int NOT NULL,
    FOREIGN KEY (userID) REFERENCES users(id),
    FOREIGN KEY (postID) REFERENCES posts(id)
);