CREATE DATABASE storyvision;
USE storyvision;

CREATE TABLE usuarios (
	id int primary key auto_increment not null,
    nome varchar(255) not null,
    email varchar(255) not null unique,
    senha varchar(255) not null,
    nascimento date,
    categoria enum('Estudante', 'Profissional', 'Ambos', 'Nenhum'),
    thread varchar(255),
    data_criacao timestamp default current_timestamp,
    tipo_conta enum('Adm', 'Usuario') default 'Usuario'
);

CREATE TABLE modulos (
	id int primary key auto_increment not null,
    titulo varchar(255) not null,
    descricao text not null,
    duracao varchar(25),
    resumo text not null,
    ordem int,
    foto varchar(255),
    data_criacao timestamp default current_timestamp
);

CREATE TABLE aulas (
	id int primary key auto_increment not null,
    titulo varchar(255) not null,
    conteudo text not null,
    id_modulo int not null,
    ordem int,
    foto varchar(255),
    data_criacao timestamp default current_timestamp,
    
    FOREIGN KEY (id_modulo) REFERENCES modulos(id) ON DELETE CASCADE
);

CREATE TABLE exercicios (
	id int primary key auto_increment not null,
    id_modulo int not null,
    pergunta text not null,
    tipo varchar(255) not null,
    alternativas text,
    resposta_correta varchar(255) not null,
    ordem int,
    data_criacao timestamp default current_timestamp,
    
    FOREIGN KEY (id_modulo) REFERENCES modulos(id) ON DELETE CASCADE
);

CREATE TABLE progresso (
	id int primary key auto_increment not null,
    id_usuario int not null,
    id_modulo int not null,
    concluida boolean default false,
    data_inicio timestamp default current_timestamp,
    data_conclusao timestamp,
    
    UNIQUE (id_usuario, id_modulo),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_modulo) REFERENCES modulos(id) ON DELETE CASCADE
);

CREATE TABLE respostas (
	id int primary key auto_increment not null,
    id_usuario int not null,
    id_exercicio int not null,
    resposta varchar(255) not null,
    correta boolean not null,
    data_resposta timestamp default current_timestamp,
    
    UNIQUE (id_usuario, id_exercicio),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_exercicio) REFERENCES exercicios(id) ON DELETE CASCADE
);

CREATE TABLE ferramentas (
	id int primary key auto_increment not null,
    nome varchar(255) not null,
    descricao text not null,
    link varchar(255) not null,
    categoria varchar(255) not null,
    logo varchar(255)
);

CREATE TABLE recursos (
	id int primary key auto_increment not null,
    titulo varchar(255) not null,
    descricao text not null,
    link varchar(255) not null,
	tipo varchar(255) not null,
    foto varchar(255)
);

CREATE TABLE dicas (
	id int primary key auto_increment not null,
    titulo varchar(255) not null,
    descricao text not null,
    conteudo text not null,
	tipo varchar(255) not null,
    foto varchar(255)
);

CREATE TABLE tickets (
	id int primary key auto_increment not null,
    id_usuario int,
    nome varchar(255) not null,
    email varchar(255) not null,
    conteudo text not null,
    status enum('Em Aberto', 'Finalizado') default 'Em Aberto',
	data_criacao timestamp default current_timestamp,
    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

INSERT INTO usuarios(nome, email, senha, tipo_conta) VALUES ("Valentina", "adm@gmail.com", "1234", "adm");