const express = require("express")
const connection = require("../db_config.js")
const upload = require("../multer.js");
const router = express.Router()

// cadastrar aula
router.post('/', upload.single('foto'), (req, res) => {
    let select = "SELECT MAX(ordem) AS maxOrdem FROM aulas";

    connection.query(select, (err, results) => {
        if (err) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao carregar aulas",
                    data: err
                })
        }

        let ordem = (results[0].maxOrdem || 0) + 1;

        let params = Array(
            req.body.titulo,
            req.body.conteudo,
            req.body.id_modulo,
            ordem,
            req.file.filename
        );

        let query = "INSERT INTO aulas(titulo, conteudo, id_modulo, ordem, foto) VALUES(?,?,?,?,?);";
        connection.query(query, params, (err, results) => {
            if (results) {
                res
                    .status(201)
                    .json({
                        success: true,
                        message: "Aula adicionada com sucesso",
                        data: results
                    })
            } else {
                res
                    .status(400)
                    .json({
                        success: false,
                        message: "Erro ao adicionar aula",
                        data: err
                    })
            }
        })
    });
});

// listar aulas
router.get('/:id', (req, res) => {
    let params = Array(
        req.params.id
    )
    let query = "SELECT * FROM aulas WHERE id_modulo = ?";

    connection.query(query,params, (err, results) => {
        if (results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Aulas carregadas com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao carregar aulas",
                    data: err
                })
        }
    })
});

// editar aula
router.put('/',upload.single('foto'), (req, res) => {
    let params = Array(
        req.body.titulo,
        req.body.conteudo,
        req.file ? req.file.filename : undefined,
        req.body.id
    )
    let query = "UPDATE aulas SET titulo=?, conteudo=?, foto=COALESCE(?, foto) WHERE id = ?";

    connection.query(query,params, (err, results) => {
        if(results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Aula editada com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao editar aula",
                    data: err
                })
        }
    })
});
// deletar aula
router.delete('/:id', (req, res) => {
    let params = Array(
        req.params.id
    )
    let query = "DELETE FROM aulas WHERE id = ?";

    connection.query(query,params, (err, results) => {
        if(results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Aula deletada com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao deletar aula",
                    data: err
                })
        }
    })
});

module.exports = router;