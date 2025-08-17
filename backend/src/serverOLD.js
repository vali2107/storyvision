// const express = require("express")
// const cors = require("cors")
// const connection = require("./db_config")
// const upload = require("./multer.js");
// const app = express()

// app.use(cors())
// app.use(express.json())

// const port = 3006;

// // USUÁRIO

// // cadastrar usuário
// app.post('/usuario/cadastrar', (req, res) => {
//     const params = [
//         req.body.nome,
//         req.body.email,
//         req.body.senha,
//         req.body.nascimento,
//         req.body.categoria,
//     ];

//     const query = "INSERT INTO usuarios(nome, email, senha, nascimento, categoria) VALUES(?,?,?,?,?)";
//     connection.query(query, params, (err, results) => {
//         if (err) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Erro ao cadastrar usuário",
//                 data: err
//             });
//         }
        
//         const query_select = "SELECT * FROM usuarios WHERE id = ?";
//         connection.query(query_select, [results.insertId], (errSelect, resultsSelect) => {
//             if (errSelect || resultsSelect.length === 0) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Erro ao buscar usuário cadastrado",
//                     data: errSelect
//                 });
//             }

//             res.status(201).json({
//                 success: true,
//                 message: "Usuário cadastrado com sucesso",
//                 data: resultsSelect[0]
//             });
//         });
//     });
// });
// // login usuário
// app.post('/usuario/login', (req, res) => {
//     let params = Array(
//         req.body.email,
//         req.body.senha
//     );
//     const query = "SELECT * FROM usuarios WHERE email = ? AND senha = ?;"
//     connection.query(query, params, (err, results) => {
//         if(results.length > 0) {
//             res
//             .status(200)
//             .json({
//                 success: true, 
//                 message: "Login realizado com sucesso", 
//                 data: results[0]})
//         } else {
//             res
//             .status(400)
//             .json({
//                 success: false, 
//                 message: "Nome ou senha incorretos"})
//         }
//     })
// })
// // load usuário
// app.get('/usuario/:id', (req, res) => {
//     let params = Array(
//         req.params.id
//     )

//     const query = "SELECT * FROM usuarios WHERE id=?";

//     connection.query(query,params, (err, results) => {
//         if(results) {
//             res
//                 .status(201)
//                 .json({
//                     success: true,
//                     message: "Sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Sem Sucesso",
//                     data: err
//                 })
//         }
//     })
// });
// // editar usuário
// app.put('/usuario/editar', (req, res) => {
//     let params = Array(
//         req.body.nome,
//         req.body.email,
//         req.body.nascimento,
//         req.body.categoria,
//         req.body.id
//     )
//     let query = "UPDATE usuarios SET nome = ?, email = ?, nascimento = ?, categoria = ? WHERE id = ?";

//     connection.query(query, params, (err, results) => {
//         if(results) {
//             res
//                 .status(200)
//                 .json({
//                     success: true,
//                     message: "Usuário editado com sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Erro ao editar usuário",
//                     data: err
//                 })
//         }
//     })
// });
// // editar thread usuário (usada pelo chatbot)
// app.put('/usuario/editar/thread', (req, res) => {
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
// // deletar usuário
// app.delete('/usuario/deletar/:id', (req, res) => {
//     let params = Array(
//         req.params.id
//     )
//     let query = "DELETE FROM usuarios WHERE id = ?";

//     connection.query(query,params, (err, results) => {
//         if(results) {
//             res
//                 .status(200)
//                 .json({
//                     success: true,
//                     message: "Usuário deletado com sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Erro ao deletar usuário",
//                     data: err
//                 })
//         }
//     })
// });


// // FERRAMENTAS

// // cadastrar ferramenta
// app.post('/ferramenta', upload.single('logo'), (req, res) => {
//     let params = Array(
//         req.body.nome,
//         req.body.descricao,
//         req.body.link,
//         req.body.categoria,
//         req.file.filename
//     );
    
//     let query = "INSERT INTO ferramentas(nome, descricao, link, categoria, logo) VALUES(?,?,?,?,?);";
//     connection.query(query, params, (err, results) => {
//         if(results) {
//             res
//                 .status(201)
//                 .json({
//                     success: true,
//                     message: "Ferramenta adicionada com sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Erro ao adicionar ferramenta",
//                     data: err
//                 })
//         }
//     })
// });
// // listar ferramentas
// app.use('/uploads', express.static(__dirname + '/public'))
// app.get('/ferramentas', (req, res) => {
//     const query = "SELECT * FROM ferramentas";

//     connection.query(query, (err, results) => {
//         if(results) {
//             res
//                 .status(200)
//                 .json({
//                     success: true,
//                     message: "Ferramentas carregadas com sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Erro ao carregar ferramentas",
//                     data: err
//                 })
//         }
//     })
// });
// // editar ferramenta
// app.put('/ferramenta',upload.single('logo'), (req, res) => {
//     let params = Array(
//         req.body.nome,
//         req.body.descricao,
//         req.body.link,
//         req.body.categoria,
//         req.file ? req.file.filename : undefined,
//         req.body.id
//     )
//     let query = "UPDATE ferramentas SET nome=?, descricao=?, link=?, categoria=?, logo=COALESCE(?, logo) WHERE id = ?";

//     connection.query(query,params, (err, results) => {
//         if(results) {
//             res
//                 .status(200)
//                 .json({
//                     success: true,
//                     message: "Ferramenta editada com sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Erro ao editar ferramenta",
//                     data: err
//                 })
//         }
//     })
// });
// // deletar ferramenta
// app.delete('/ferramenta/:id', (req, res) => {
//     let params = Array(
//         req.params.id
//     )
//     let query = "DELETE FROM ferramentas WHERE id = ?";

//     connection.query(query,params, (err, results) => {
//         if(results) {
//             res
//                 .status(200)
//                 .json({
//                     success: true,
//                     message: "Ferramenta deletada com sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Erro ao deletar ferramenta",
//                     data: err
//                 })
//         }
//     })
// });


// // RECURSOS

// // cadastrar recurso
// app.post('/recurso', upload.single('foto'), (req, res) => {
//     let params = Array(
//         req.body.titulo,
//         req.body.descricao,
//         req.body.link,
//         req.body.tipo,
//         req.file.filename
//     );
    
//     let query = "INSERT INTO recursos(titulo, descricao, link, tipo, foto) VALUES(?,?,?,?,?);";
//     connection.query(query, params, (err, results) => {
//         if(results) {
//             res
//                 .status(201)
//                 .json({
//                     success: true,
//                     message: "Recurso adicionado com sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Erro ao adicionar recurso",
//                     data: err
//                 })
//         }
//     })
// });
// // listar recursos
// app.use('/uploads', express.static(__dirname + '/public'))
// app.get('/recursos', (req, res) => {
//     const query = "SELECT * FROM recursos";

//     connection.query(query, (err, results) => {
//         if(results) {
//             res
//                 .status(200)
//                 .json({
//                     success: true,
//                     message: "Recursos carregados com sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Erro ao carregar recursos",
//                     data: err
//                 })
//         }
//     })
// });
// // editar recurso
// app.put('/recurso',upload.single('foto'), (req, res) => {
//     let params = Array(
//         req.body.titulo,
//         req.body.descricao,
//         req.body.link,
//         req.body.tipo,
//         req.file ? req.file.filename : undefined,
//         req.body.id
//     )
//     let query = "UPDATE recursos SET titulo=?, descricao=?, link=?, tipo=?, foto=COALESCE(?, foto) WHERE id = ?";

//     connection.query(query,params, (err, results) => {
//         if(results) {
//             res
//                 .status(200)
//                 .json({
//                     success: true,
//                     message: "Recurso editado com sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Erro ao editar recurso",
//                     data: err
//                 })
//         }
//     })
// });
// // deletar recurso
// app.delete('/recurso/:id', (req, res) => {
//     let params = Array(
//         req.params.id
//     )
//     let query = "DELETE FROM recursos WHERE id = ?";

//     connection.query(query,params, (err, results) => {
//         if(results) {
//             res
//                 .status(200)
//                 .json({
//                     success: true,
//                     message: "Recurso deletado com sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Erro ao deletar recurso",
//                     data: err
//                 })
//         }
//     })
// });


// // DICAS

// // cadastrar dica
// app.post('/dica', upload.single('foto'), (req, res) => {
//     let params = Array(
//         req.body.titulo,
//         req.body.descricao,
//         req.body.conteudo,
//         req.body.tipo,
//         req.file.filename
//     );
    
//     let query = "INSERT INTO dicas(titulo, descricao, conteudo, tipo, foto) VALUES(?,?,?,?,?);";
//     connection.query(query, params, (err, results) => {
//         if(results) {
//             res
//                 .status(201)
//                 .json({
//                     success: true,
//                     message: "Dica adicionada com sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Erro ao adicionar dica",
//                     data: err
//                 })
//         }
//     })
// });
// // listar dicas
// app.use('/uploads', express.static(__dirname + '/public'))
// app.get('/dicas', (req, res) => {
//     const query = "SELECT * FROM dicas";

//     connection.query(query, (err, results) => {
//         if(results) {
//             res
//                 .status(200)
//                 .json({
//                     success: true,
//                     message: "Dicas carregadas com sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Erro ao carregar dicas",
//                     data: err
//                 })
//         }
//     })
// });
// // editar dica
// app.put('/dica',upload.single('foto'), (req, res) => {
//     let params = Array(
//         req.body.titulo,
//         req.body.descricao,
//         req.body.conteudo,
//         req.body.tipo,
//         req.file ? req.file.filename : undefined,
//         req.body.id
//     )
//     let query = "UPDATE dicas SET titulo=?, descricao=?, conteudo=?, tipo=?, foto=COALESCE(?, foto) WHERE id = ?";

//     connection.query(query,params, (err, results) => {
//         if(results) {
//             res
//                 .status(200)
//                 .json({
//                     success: true,
//                     message: "Dica editada com sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Erro ao editar dica",
//                     data: err
//                 })
//         }
//     })
// });
// // deletar dica
// app.delete('/dica/:id', (req, res) => {
//     let params = Array(
//         req.params.id
//     )
//     let query = "DELETE FROM dicas WHERE id = ?";

//     connection.query(query,params, (err, results) => {
//         if(results) {
//             res
//                 .status(200)
//                 .json({
//                     success: true,
//                     message: "Dica deletada com sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Erro ao deletar dica",
//                     data: err
//                 })
//         }
//     })
// });


// // TICKETS - não finalizado

// // cadastrar ticket
// app.post('/ticket', (req, res) => {
//     const params = [
//         req.body.nome,
//         req.body.email,
//         req.body.mensagem
//     ];

//     const query = "INSERT INTO tickets(nome, email, mensagem) VALUES(?,?,?)";
//     connection.query(query, params, (err, results) => {
//         if(results) {
//             res
//                 .status(201)
//                 .json({
//                     success: true,
//                     message: "Ticket adicionado com sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Erro ao adicionar ticket",
//                     data: err
//                 })
//         }
//     })
// });
// // listar tickets
// app.get('/tickets', (req, res) => {
//     const query = "SELECT * FROM tickets";

//     connection.query(query, (err, results) => {
//         if(results) {
//             res
//                 .status(200)
//                 .json({
//                     success: true,
//                     message: "Tickets carregados com sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Erro ao carregar tickets",
//                     data: err
//                 })
//         }
//     })
// });
// // editar ticket
// app.put('/ticket', (req, res) => {
//     let params = Array(
//         req.body.nome,
//         req.body.email,
//         req.body.nascimento,
//         req.body.categoria,
//         req.body.id
//     )
//     let query = "UPDATE usuarios SET nome = ?, email = ?, nascimento = ?, categoria = ? WHERE id = ?";

//     connection.query(query, params, (err, results) => {
//         if(results) {
//             res
//                 .status(200)
//                 .json({
//                     success: true,
//                     message: "Usuário editado com sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Erro ao editar usuário",
//                     data: err
//                 })
//         }
//     })
// });
// // deletar ticket
// app.delete('/ticket/:id', (req, res) => {
//     let params = Array(
//         req.params.id
//     )
//     let query = "DELETE FROM dicas WHERE id = ?";

//     connection.query(query,params, (err, results) => {
//         if(results) {
//             res
//                 .status(200)
//                 .json({
//                     success: true,
//                     message: "Dica deletada com sucesso",
//                     data: results
//                 })
//         } else {
//             res
//                 .status(400)
//                 .json({
//                     success: false,
//                     message: "Erro ao deletar dica",
//                     data: err
//                 })
//         }
//     })
// });




// app.listen(port, () => console.log(`Rodando na porta ${port}`))