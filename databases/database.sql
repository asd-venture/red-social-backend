CREATE DATABASE redsocial

CREATE TABLE Users(
    id SERIAL PRIMARY KEY,
    username varchar(40) NOT NULL, 
    email TEXT NOT NULL
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