// adiciona header e footer na página
fetch('/frontend/reutilizaveis/header.html')
    .then(res => res.text())
    .then(data => document.getElementById('header').innerHTML = data);

fetch('/frontend/reutilizaveis/footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer').innerHTML = data);


const informacoesUsuario = localStorage.getItem('informacoes');
const usuario = JSON.parse(informacoesUsuario);

// enviar ticket
async function enviarTicket(event) {
    event.preventDefault()

    const nome = document.getElementById("nome").value
    const email = document.getElementById("email").value
    const conteudo = document.getElementById("mensagem").value

    console.log(usuario.id)
    let dados = [
        usuario.id,
        nome,
        email,
        conteudo
    ]

    const response = await fetch('http://localhost:3006/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })

    const results = await response.json();

    if (results.success) {
        alert(results.message)
        listarTickets()
    } else {
        alert(results.message)
    }
}

async function listarTickets() {
    const response = await fetch('http://localhost:3006/tickets', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const results = await response.json();

    if (results.success) {
        let productData = results.data
        let tabela = document.getElementById('tabela')
        tabela.innerHTML = `
            <tr>
                <th class='topo_id'>Usuário</th>
                <th class='topo_nome'>Nome</th>
                <th class='topo_email'>E-mail</th>
                <th class='topo_conteudo'>Conteúdo</th>
                <th class='topo_status'>Status</th>
                <th class='topo_data'>Data de Criação</th>
            </tr>
        `;
        for (const ticket of productData) {
            const dataCriacao = ticket.data_criacao;
            const [ano, mes, resto] = dataCriacao.split('-');
            const [dia] = resto.split('T')
            const dataFormatada = `${dia}/${mes}/${ano}`

            let statusClass = 'aberto'
            if (ticket.status === "Finalizado") {
                statusClass = 'finalizado'
            }

            let linha = document.createElement('tr')
            linha.classList.add('linha')
            linha.innerHTML += `
                <td class='linha_id'>${ticket.id_usuario}</td>
                <td class='linha_nome'>${ticket.nome}</td>
                <td class='linha_email'>${ticket.email}</td>
                <td class='linha_conteudo'>${ticket.conteudo}</td>
                <td class='linha_status' onclick="concluirTicket(${ticket.id}, '${ticket.status}')"><mark class="${statusClass}">${ticket.status}</mark></td>
                <td class='linha_data'>${dataFormatada}</td>
            `;

            tabela.appendChild(linha);
        }
    } else {
        alert(results.message)
    }
}

// ver tickets (adm only)
if (usuario.tipo_conta === "Adm") {
    let html = document.getElementById('main')
    html.innerHTML = ''
    html.innerHTML = `
        <h1>Tickets</h1>
        <form id="enviar_ticket_form">
            <input type="text" id="nome" placeholder="Seu Nome">
            <input type="text" id="email" placeholder="Seu E-Mail">
            <textarea id="mensagem" placeholder="Mensagem"></textarea>
            <button id="enviar_ticket_botao" onclick="enviarTicket(event)">Enviar</button>
        </form>
        <table id="tabela"></table>
    `

    listarTickets()
}

// concluir ticket (adm only)
async function concluirTicket(id, status) {
    if (status === "Em Aberto") {
        const confirmacao = confirm('Quer concluir o ticket?')

        if (confirmacao) {
            const response = await fetch(`http://localhost:3006/tickets/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const results = await response.json();

            if (results.success) {
                alert(results.message)
                listarTickets()
            } else {
                alert(results.message)
            }
        }
    }
}