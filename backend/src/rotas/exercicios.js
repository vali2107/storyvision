const express = require("express")
const connection = require("../db_config")
const router = express.Router()

// cadastrar exercício
router.post('/', (req, res) => {
    let select = "SELECT MAX(ordem) AS maxOrdem FROM exercicios";

    connection.query(select, (err, results) => {
        if (err) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao carregar exercícios",
                    data: err
                })
        }

        let ordem = (results[0].maxOrdem || 0) + 1;

        let params = Array(
            req.body.id_modulo,
            req.body.pergunta,
            req.body.tipo,
            req.body.alternativas,
            req.body.resposta_correta,
            ordem
        );

        let query = "INSERT INTO exercicios(id_modulo, pergunta, tipo, alternativas, resposta_correta) VALUES(?,?,?,?,?);";
        connection.query(query, params, (err, results) => {
            if (results) {
                res
                    .status(201)
                    .json({
                        success: true,
                        message: "Exercício adicionada com sucesso",
                        data: results
                    })
            } else {
                res
                    .status(400)
                    .json({
                        success: false,
                        message: "Erro ao adicionar exercício",
                        data: err
                    })
            }
        })
    });
});

// listar exercícios
router.get('/:id', (req, res) => {
    let params = Array(
        req.params.id
    )
    let query = "SELECT * FROM exercicios WHERE id_modulo = ?";

    connection.query(query,params, (err, results) => {
        if (results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Exercícios carregados com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao carregar exercícios",
                    data: err
                })
        }
    })
});

// editar exercício
router.put('/:id', (req, res) => {
    let params = Array(
        req.body.pergunta,
        req.body.tipo,
        req.body.alternativas,
        req.body.resposta_correta,
        req.params.id
    )
    let query = "UPDATE exercicios SET pergunta=?, tipo=?, alternativas=?, resposta_correta=? WHERE id = ?";

    connection.query(query,params, (err, results) => {
        if(results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Exercício editado com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao editar exercício",
                    data: err
                })
        }
    })
});

// deletar exercício
router.delete('/:id', (req, res) => {
    let params = Array(
        req.params.id
    )
    let query = "DELETE FROM exercicios WHERE id = ?";

    connection.query(query,params, (err, results) => {
        if(results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Exercício deletado com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao deletar exercício",
                    data: err
                })
        }
    })
});

module.exports = router;