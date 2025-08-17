const express = require("express")
const cors = require("cors")
const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(__dirname + '/public'))

app.use('/usuarios', require('./rotas/usuarios'));
app.use('/modulos', require('./rotas/modulos'));
app.use('/aulas', require('./rotas/aulas'));
// app.use('/exercicios', require('./rotas/exercicios'));
app.use('/ferramentas', require('./rotas/ferramentas'));
app.use('/recursos', require('./rotas/recursos'));
app.use('/dicas', require('./rotas/dicas'));
app.use('/tickets', require('./rotas/tickets'));

const port = 3006;
app.listen(port, () => console.log(`Rodando na porta ${port}`))