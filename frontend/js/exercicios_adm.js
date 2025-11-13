// adiciona header e footer na página
fetch('/frontend/reutilizaveis/header.html')
    .then(res => res.text())
    .then(data => document.getElementById('header').innerHTML = data);

fetch('/frontend/reutilizaveis/footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer').innerHTML = data);

// coloca a opção de adicionar recurso somente para administradores
const informacoesUsuario = localStorage.getItem('informacoes');
const usuario = JSON.parse(informacoesUsuario);
const informacoesModulo = localStorage.getItem('moduloAberto')
const modulo = JSON.parse(informacoesModulo)

// abre o form de adicionar
async function abrirAdd() {
    document.getElementById("inserir_exercicio_form").style.display = "flex";
    document.getElementById("abrir_add").style.display = "none"
}

// fecha o form de adicionar
async function fecharAdd() {
    document.getElementById("inserir_exercicio_form").style.display = "none";
    document.getElementById("abrir_add").style.display = "block"
}

// insere o recurso no banco
async function inserirExercicio(event) {
    event.preventDefault()

    const pergunta = document.getElementById("pergunta").value
    const tipo = document.getElementById("tipo").value
    const alternativas = document.getElementById("alternativas").value
    const resposta_correta = document.getElementById("resposta_correta").value
    const id_modulo = modulo.id

    let data = { id_modulo, pergunta, tipo, alternativas, resposta_correta }
    console.log(data)

    const response = await fetch('http://localhost:3006/exercicios', {
        method: 'POST',
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    })

    const results = await response.json();

    if (results.success) {
        alert(results.message)
        fecharAdd()
        listarExercicios()
    } else {
        alert(results.message)
    }
}

// lista os exercícios e adiciona cards no front
async function listarExercicios() {
    const response = await fetch(`http://localhost:3006/exercicios/${modulo.id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const results = await response.json();

    if (results.success) {
        let productData = results.data
        let html = document.getElementById('exercicios_tudo')
        html.innerHTML = '';
        for (const exercicio of productData) {
                let card = document.createElement('div')
                card.classList.add('item')
                if (exercicio.tipo === "Objetiva") {
                    card.innerHTML += `
                        <p><b>Pergunta:</b> ${exercicio.pergunta}</p>
                        <p><b>Tipo:</b> ${exercicio.tipo}</p>
                        <p><b>Alternativas:</b> ${exercicio.alternativas}</p>
                        <p><b>Resposta:</b> ${exercicio.resposta_correta}</p>
                        <div class="acoes">
                            <i class="fa-solid fa-pen-to-square" onclick="editarExercicio(${exercicio.id}, '${exercicio.pergunta}', '${exercicio.tipo}', '${exercicio.alternativas}', '${exercicio.resposta_correta}')"></i>
                            <i class="fa-solid fa-trash" onclick="deletarExercicio(${exercicio.id})"></i>
                        </div>
                    `;
                } else {
                    card.innerHTML += `
                        <p><b>Pergunta:</b> ${exercicio.pergunta}</p>
                        <p><b>Tipo:</b> ${exercicio.tipo}</p>
                        <p><b>Resposta:</b> ${exercicio.resposta_correta}</p>
                        <div class="acoes">
                            <i class="fa-solid fa-pen-to-square" onclick="editarExercicio(${exercicio.id}, '${exercicio.pergunta}', '${exercicio.tipo}', '${exercicio.alternativas}', '${exercicio.resposta_correta}')"></i>
                            <i class="fa-solid fa-trash" onclick="deletarExercicio(${exercicio.id})"></i>
                        </div>
                    `;
                }
                
                html.appendChild(card);
            }
    } else {
        alert(results.message)
    }
}

// fecha o form de editar
async function fecharEditar() {
    let html = document.getElementById("editar")
    html.style.display = "none"
    html.innerHTML = ''
}

// adiciona o form de editar
async function editarExercicio(id, pergunta, tipo, alternativas, resposta_correta) {
    let html = document.getElementById("editar")
    html.style.display = "block"
    html.innerHTML = ''
    html.innerHTML = `
        <form id="editar_exercicio_form">
            <input type="text" id="pergunta_editar" placeholder="Pergunta" value="${pergunta}">
            <input type="text" id="tipo_editar" placeholder="Objetiva, subjetiva" value="${tipo}">
            <input type="text" id="alternativas_editar" placeholder="As alternativas, caso seja objetiva" value="${alternativas}">
            <input type="text" id="resposta_correta_editar" placeholder="Resposta correta" value="${resposta_correta}">
            <button id="editar_exercicio_botao" type="button" onclick="enviarEdicao(event, ${id})">Editar</button>
            <button id="fechar_editar" onclick="fecharAdd()">x</button>
        </form>
    `
}

// envia a edição do form e edita no banco
async function enviarEdicao(event, id) {
    event.preventDefault()

    const pergunta = document.getElementById("pergunta_editar").value
    const tipo = document.getElementById("tipo_editar").value
    const alternativas = document.getElementById("alternativas_editar").value
    const resposta_correta = document.getElementById("resposta_correta_editar").value

    const data = {pergunta, tipo, alternativas, resposta_correta}

    const response = await fetch(`http://localhost:3006/exercicios/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    })

    const results = await response.json();

    if (results.success) {
        alert(results.message)
        listarExercicios()
        fecharEditar()
    } else {
        alert(results.message)
    }
}

// deleta o exercício
async function deletarExercicio(id) {
    const confirmacao = confirm('Tem certeza?')

    if (confirmacao) {
        const response = await fetch(`http://localhost:3006/exercicios/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
        })

        const results = await response.json();

        if (results.success) {
            alert(results.message)
            listarExercicios();
        } else {
            alert(results.message)
        }
    }
}

listarExercicios()