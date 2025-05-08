const express = require("express")
const cors = require("cors")
const connection = require("./db_config")
const app = express()

app.use(cors())
app.use(express.json())

const port = 3006

// CADASTRO USUÁRIO
app.post('/usuario/cadastrar', (req, res) => {
    let params = Array(
        req.body.nome,
        req.body.email,
        req.body.senha,
    );
    const query = "INSERT INTO usuarios(nome, email, senha) VALUES(?,?,?);";
    connection.query(query,params, (err, results) => {
        if(results) {
            res
                .status(201)
                .json({
                    success: true,
                    message: "Usuário cadastrado com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao cadastrar usuário",
                    data: err
                })
        }
    })
});

// LOGIN USUÁRIO
app.post('/usuario/login', (req, res) => {
    let params = Array(
        req.body.email,
        req.body.senha
    );
    const query = "SELECT * FROM usuarios WHERE email = ? AND senha = ?;"
    connection.query(query, params, (err, results) => {
        if(results.length > 0) {
            res
            .status(200)
            .json({
                success: true, 
                message: "Login realizado com sucesso", 
                data: results[0]})
        } else {
            res
            .status(400)
            .json({
                success: false, 
                message: "Nome ou senha incorretos"})
        }
    })
})

app.listen(port, () => console.log(`Rodando na porta ${port}`))