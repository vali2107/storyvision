const express = require("express")
const connection = require("../db_config.js")
const upload = require("../multer.js");
const router = express.Router()

// cadastrar módulo
router.post('/', upload.single('foto'), (req, res) => {
    let select = "SELECT MAX(ordem) AS maxOrdem FROM modulos";

    connection.query(select, (err, results) => {
        if (err) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao carregar módulos",
                    data: err
                })
        }

        let ordem = (results[0].maxOrdem || 0) + 1;

        let params = Array(
            req.body.titulo,
            req.body.descricao,
            req.body.duracao,
            req.body.resumo,
            ordem,
            req.file.filename
        );

        let query = "INSERT INTO modulos(titulo, descricao, duracao, resumo, ordem, foto) VALUES(?,?,?,?,?,?);";
        connection.query(query, params, (err, results) => {
            if (results) {
                res
                    .status(201)
                    .json({
                        success: true,
                        message: "Módulo adicionado com sucesso",
                        data: results
                    })
            } else {
                res
                    .status(400)
                    .json({
                        success: false,
                        message: "Erro ao adicionar módulo",
                        data: err
                    })
            }
        })
    });
});

// listar módulos
router.get('/', (req, res) => {
    const query = "SELECT * FROM modulos ORDER BY ordem ASC";

    connection.query(query, (err, results) => {
        if (results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Módulos carregados com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao carregar módulos",
                    data: err
                })
        }
    })
});

// editar módulo
router.put('/', upload.single('foto'), (req, res) => {
    let params = Array(
        req.body.titulo,
        req.body.descricao,
        req.body.duracao,
        req.body.resumo,
        req.file ? req.file.filename : undefined,
        req.body.id
    )
    let query = "UPDATE modulos SET titulo=?, descricao=?, duracao=?, resumo=?, foto=COALESCE(?, foto) WHERE id = ?";

    connection.query(query, params, (err, results) => {
        if (results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Módulo editado com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao editar módulo",
                    data: err
                })
        }
    })
});

// reordenar módulos


// deletar módulo
router.delete('/:id', (req, res) => {
    let params = Array(
        req.params.id
    )
    let query = "DELETE FROM modulos WHERE id = ?";

    connection.query(query, params, (err, results) => {
        if (results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Módulo deletado com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao deletar módulo",
                    data: err
                })
        }
    })
});

module.exports = router;