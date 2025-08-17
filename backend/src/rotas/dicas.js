const express = require("express")
const connection = require("../db_config")
const upload = require("../multer.js");
const router = express.Router()

// cadastrar dica
router.post('/', upload.single('foto'), (req, res) => {
    let params = Array(
        req.body.titulo,
        req.body.descricao,
        req.body.conteudo,
        req.body.tipo,
        req.file.filename
    );
    
    let query = "INSERT INTO dicas(titulo, descricao, conteudo, tipo, foto) VALUES(?,?,?,?,?);";
    connection.query(query, params, (err, results) => {
        if(results) {
            res
                .status(201)
                .json({
                    success: true,
                    message: "Dica adicionada com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao adicionar dica",
                    data: err
                })
        }
    })
});
// listar dicas
router.get('/', (req, res) => {
    const query = "SELECT * FROM dicas";

    connection.query(query, (err, results) => {
        if(results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Dicas carregadas com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao carregar dicas",
                    data: err
                })
        }
    })
});
// editar dica
router.put('/',upload.single('foto'), (req, res) => {
    let params = Array(
        req.body.titulo,
        req.body.descricao,
        req.body.conteudo,
        req.body.tipo,
        req.file ? req.file.filename : undefined,
        req.body.id
    )
    let query = "UPDATE dicas SET titulo=?, descricao=?, conteudo=?, tipo=?, foto=COALESCE(?, foto) WHERE id = ?";

    connection.query(query,params, (err, results) => {
        if(results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Dica editada com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao editar dica",
                    data: err
                })
        }
    })
});
// deletar dica
router.delete('/:id', (req, res) => {
    let params = Array(
        req.params.id
    )
    let query = "DELETE FROM dicas WHERE id = ?";

    connection.query(query,params, (err, results) => {
        if(results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Dica deletada com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao deletar dica",
                    data: err
                })
        }
    })
});

module.exports = router;