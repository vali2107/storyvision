const express = require("express")
const cors = require("cors")
const connection = require("./db_config")
const app = express()

app.use(cors())
app.use(express.json())

const port = 3006

// LOGIN
app.post('/usuarios/login', (req, res) => {
    let params = Array(
        req.body.email,
        req.body.senha
    );
    const query = "SELECT * FROM usuarios WHERE email = ? AND senha = ?;"
    connection.query(query, params, (err, results) => {
        if(results.length > 0) {
            res.status(200).json({success: true,message: "Sucesso",data: results[0]})
        } else {
                res
                .status(400)
                .json({
                    success: false,
                    message: "Nome ou senha incorretos",
                })
        }
    })
})

app.listen(port, () => console.log(`Rodando na porta ${port}`))