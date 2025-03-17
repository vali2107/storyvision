CREATE DATABASE storyvision;
USE storyvision;

CREATE TABLE usuarios (
	id int primary key auto_increment not null,
    nome varchar(255) not null,
    email varchar(255) not null,
    senha varchar(255) not null,
    idade int
);