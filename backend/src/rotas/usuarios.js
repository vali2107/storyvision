const express = require("express")
const connection = require("../db_config")
const router = express.Router()

// cadastrar usuário
router.post('/cadastrar', (req, res) => {
    const params = [
        req.body.nome,
        req.body.email,
        req.body.senha,
        req.body.nascimento,
        req.body.categoria,
    ];

    const query = "INSERT INTO usuarios(nome, email, senha, nascimento, categoria) VALUES(?,?,?,?,?)";
    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: "Erro ao cadastrar usuário",
                data: err
            });
        }
        
        const query_select = "SELECT * FROM usuarios WHERE id = ?";
        connection.query(query_select, [results.insertId], (errSelect, resultsSelect) => {
            if (errSelect || resultsSelect.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Erro ao buscar usuário cadastrado",
                    data: errSelect
                });
            }

            res.status(201).json({
                success: true,
                message: "Usuário cadastrado com sucesso",
                data: resultsSelect[0]
            });
        });
    });
});
// login usuário
router.post('/login', (req, res) => {
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
// load usuário
router.get('/:id', (req, res) => {
    let params = Array(
        req.params.id
    )

    const query = "SELECT * FROM usuarios WHERE id=?";

    connection.query(query,params, (err, results) => {
        if(results) {
            res
                .status(201)
                .json({
                    success: true,
                    message: "Sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Sem Sucesso",
                    data: err
                })
        }
    })
});
// editar usuário
router.put('/', (req, res) => {
    let params = Array(
        req.body.nome,
        req.body.email,
        req.body.nascimento,
        req.body.categoria,
        req.body.id
    )
    let query = "UPDATE usuarios SET nome = ?, email = ?, nascimento = ?, categoria = ? WHERE id = ?";

    connection.query(query, params, (err, results) => {
        if(results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Usuário editado com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao editar usuário",
                    data: err
                })
        }
    })
});
// editar thread usuário (usada pelo chatbot)
// router.put('/usuario/editar/thread', (req, res) => {
//     let params = Array(
//         req.body.thread,
//         req.body.id
//     )
//     let query = "UPDATE usuarios SET thread = ? WHERE id = ?";

//     connection.query(query, params, (err, results) => {
//         if(results) {
//             res
//                 .status(200)
//                 .json({
//                     success: true,
//                     message: "Thread adicionada com sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Erro ao adicionar thread",
//                     data: err
//                 })
//         }
//     })
// });

// deletar usuário
router.delete('/:id', (req, res) => {
    let params = Array(
        req.params.id
    )
    let query = "DELETE FROM usuarios WHERE id = ?";

    connection.query(query,params, (err, results) => {
        if(results) {
            res
                .status(200)
                .json({
                    success: true,
                    message: "Usuário deletado com sucesso",
                    data: results
                })
        } else {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao deletar usuário",
                    data: err
                })
        }
    })
});

module.exports = router;