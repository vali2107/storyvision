const express = require("express")
const connection = require("../db_config")
const upload = require("../multer.js");
const router = express.Router()

// cadastrar ferramenta
router.post('/', upload.single('logo'), (req, res) => {
    let params = Array(
        req.body.nome,
        req.body.descricao,
        req.body.link,
        req.body.categoria,
        req.file.filename
    );
    
    let query = "INSERT INTO ferramentas(nome, descricao, link, categoria, logo) VALUES(?,?,?,?,?);";
    connection.query(query, params, (err, results) => {
        if(results) {
            res
                .status(201)
                .json({
                    success: true,
                    message: "Ferramenta adicionada com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao adicionar ferramenta",
                    data: err
                })
        }
    })
});
// listar ferramentas
router.get('/', (req, res) => {
    const query = "SELECT * FROM ferramentas";

    connection.query(query, (err, results) => {
        if(results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Ferramentas carregadas com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao carregar ferramentas",
                    data: err
                })
        }
    })
});
// editar ferramenta
router.put('/',upload.single('logo'), (req, res) => {
    let params = Array(
        req.body.nome,
        req.body.descricao,
        req.body.link,
        req.body.categoria,
        req.file ? req.file.filename : undefined,
        req.body.id
    )
    let query = "UPDATE ferramentas SET nome=?, descricao=?, link=?, categoria=?, logo=COALESCE(?, logo) WHERE id = ?";

    connection.query(query,params, (err, results) => {
        if(results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Ferramenta editada com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao editar ferramenta",
                    data: err
                })
        }
    })
});
// deletar ferramenta
router.delete('/:id', (req, res) => {
    let params = Array(
        req.params.id
    )
    let query = "DELETE FROM ferramentas WHERE id = ?";

    connection.query(query,params, (err, results) => {
        if(results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Ferramenta deletada com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao deletar ferramenta",
                    data: err
                })
        }
    })
});

module.exports = router;