const express = require("express")
const connection = require("../db_config")
const upload = require("../multer.js");
const router = express.Router()

// cadastrar recurso
router.post('/', upload.single('foto'), (req, res) => {
    let params = Array(
        req.body.titulo,
        req.body.descricao,
        req.body.link,
        req.body.tipo,
        req.file.filename
    );
    
    let query = "INSERT INTO recursos(titulo, descricao, link, tipo, foto) VALUES(?,?,?,?,?);";
    connection.query(query, params, (err, results) => {
        if(results) {
            res
                .status(201)
                .json({
                    success: true,
                    message: "Recurso adicionado com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao adicionar recurso",
                    data: err
                })
        }
    })
});
// listar recursos
router.get('/', (req, res) => {
    const query = "SELECT * FROM recursos";

    connection.query(query, (err, results) => {
        if(results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Recursos carregados com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao carregar recursos",
                    data: err
                })
        }
    })
});
// editar recurso
router.put('/',upload.single('foto'), (req, res) => {
    let params = Array(
        req.body.titulo,
        req.body.descricao,
        req.body.link,
        req.body.tipo,
        req.file ? req.file.filename : undefined,
        req.body.id
    )
    let query = "UPDATE recursos SET titulo=?, descricao=?, link=?, tipo=?, foto=COALESCE(?, foto) WHERE id = ?";

    connection.query(query,params, (err, results) => {
        if(results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Recurso editado com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao editar recurso",
                    data: err
                })
        }
    })
});
// deletar recurso
router.delete('/:id', (req, res) => {
    let params = Array(
        req.params.id
    )
    let query = "DELETE FROM recursos WHERE id = ?";

    connection.query(query,params, (err, results) => {
        if(results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Recurso deletado com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao deletar recurso",
                    data: err
                })
        }
    })
});

module.exports = router;