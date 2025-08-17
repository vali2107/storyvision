const express = require("express")
const connection = require("../db_config")
const router = express.Router()

// cadastrar ticket
router.post('/', (req, res) => {
    const params = req.body;

    const query = "INSERT INTO tickets(id_usuario, nome, email, conteudo) VALUES(?,?,?,?)";
    connection.query(query, params, (err, results) => {
        if(results) {
            res
                .status(201)
                .json({
                    success: true,
                    message: "Ticket adicionado com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao adicionar ticket",
                    data: err
                })
        }
    })
});
// listar tickets
router.get('/', (req, res) => {
    const query = "SELECT * FROM tickets";

    connection.query(query, (err, results) => {
        if(results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Tickets carregados com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao carregar tickets",
                    data: err
                })
        }
    })
});
// editar ticket
router.put('/:id', (req, res) => {
    let params = Array(
        req.params.id
    )
    let query = "UPDATE tickets SET status = 'Finalizado' WHERE id = ?";

    connection.query(query, params, (err, results) => {
        if(results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Ticket concluído com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao editar ticket",
                    data: err
                })
        }
    })
});

module.exports = router;