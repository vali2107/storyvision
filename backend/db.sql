CREATE DATABASE storyvision;
USE storyvision;

CREATE TABLE usuarios (
	id int primary key auto_increment not null,
    nome varchar(255) not null,
    email varchar(255) not null,
    senha varchar(255) not null,
    nascimento date,
    categoria enum('Estudante', 'Profissional', 'Ambos', 'Nenhum'),
    dataCriacao timestamp default current_timestamp,
    tipoConta enum('Adm', 'Usuario') default 'Usuario'
);

CREATE TABLE ferramentas (
	id int primary key auto_increment not null,
    nome varchar(255) not null,
    descricao varchar(255) not null,
    link varchar(255) not null,
    categoria varchar(255) not null,
    logo varchar(255)
);