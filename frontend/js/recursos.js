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
if (usuario.tipo_conta === "Adm") {
    let html = document.getElementById("main")
    html.innerHTML = ''
    html.innerHTML = `
        <div id="topo">
            <h1>Biblioteca de Recursos</h1>
            <button id="abrir_add" onclick="abrirAdd()">Adicionar recurso</button>
        </div>
        <div id="recursos_tudo"></div>
        <form id="inserir_recurso_form">
            <input type="text" id="titulo" placeholder="Título">
            <input type="text" id="descricao" placeholder="Descrição">
            <input type="text" id="link" placeholder="Link">
            <input type="text" id="tipo" placeholder="Tipo">
            <input type="file" id="foto">
            <button id="inserir_recurso_botao" onclick="inserirRecurso(event)">Inserir</button>
            <button id="fechar_add" onclick="fecharAdd()">x</button>
        </form>
        <section id="editar"></section>
    `
} 

// abre o form de adicionar
async function abrirAdd() {
    document.getElementById("inserir_recurso_form").style.display = "flex";
    document.getElementById("abrir_add").style.display = "none"
}

// fecha o form de adicionar
async function fecharAdd() {
    document.getElementById("inserir_recurso_form").style.display = "none";
    document.getElementById("abrir_add").style.display = "block"
}

// insere o recurso no banco
async function inserirRecurso(event) {
    event.preventDefault()

    const titulo = document.getElementById("titulo").value
    const descricao = document.getElementById("descricao").value
    const link = document.getElementById("link").value
    const tipo = document.getElementById("tipo").value
    const foto = document.getElementById("foto").files[0]

    let formData = new FormData();

    formData.append("titulo", titulo)
    formData.append("descricao", descricao)
    formData.append("link", link)
    formData.append("tipo", tipo)
    formData.append("foto", foto)

    console.log(formData)

    const response = await fetch('http://localhost:3006/recursos', {
        method: 'POST',
        body: formData
    })

    const results = await response.json();

    if(results.success) {        
        alert(results.message)
        fecharAdd()
        listarRecursos()
    } else {
        alert(results.message)
    }
}

// lista os recursos e adiciona cards no front
async function listarRecursos() {
    const response = await fetch('http://localhost:3006/recursos', {
        method: 'GET',
        headers: {
            "Content-Type":"application/json"
        }
    })

    const results = await response.json();

    if(results.success) {
        let productData = results.data
        const images = 'http://localhost:3006/uploads/'  
        let html = document.getElementById('recursos_tudo')
        html.innerHTML = '';
        for (const recurso of productData) {
            let card = document.createElement('div')
            card.classList.add('item')
            card.innerHTML += `
                <img src="${images + recurso.foto}" alt="${recurso.titulo}">
                <a href="${recurso.link}" class="titulo">${recurso.titulo}</a>
                <p>${recurso.descricao}</p>
            `;

            if (usuario.tipo_conta === "Adm") {
                card.innerHTML += `
                    <div class="acoes">
                        <i class="fa-solid fa-pen-to-square" onclick="editarRecurso(${recurso.id}, '${recurso.titulo}', '${recurso.descricao}', '${recurso.link}', '${recurso.tipo}')"></i>
                        <i class="fa-solid fa-trash" onclick="deletarRecurso(${recurso.id})"></i>
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
async function editarRecurso(id, titulo, descricao, link, tipo) {
    let html = document.getElementById("editar")
    html.style.display = "block"
    html.innerHTML = ''
    html.innerHTML = `
        <form id="editar_recurso_form">
            <input type="text" id="titulo_editar" placeholder="Título" value="${titulo}">
            <input type="text" id="descricao_editar" placeholder="Descrição" value="${descricao}">
            <input type="text" id="link_editar" placeholder="Link" value="${link}">
            <input type="text" id="tipo_editar" placeholder="Tipo" value="${tipo}">
            <input type="file" id="foto_editar">
            <button id="editar_recurso_botao" type="button" onclick="enviarEdicao(event, ${id})">Editar</button>
            <button id="fechar_editar" onclick="fecharEditar()">x</button>
        </form>
    `
}

// envia a edição do form e edita no banco
async function enviarEdicao(event, id) {
    event.preventDefault()

    const titulo = document.getElementById("titulo_editar").value
    const descricao = document.getElementById("descricao_editar").value
    const link = document.getElementById("link_editar").value
    const tipo = document.getElementById("tipo_editar").value
    const foto = document.getElementById("foto_editar").files[0]

    let formData = new FormData();

    formData.append("id", id)
    formData.append("titulo", titulo)
    formData.append("descricao", descricao)
    formData.append("link", link)
    formData.append("tipo", tipo)
    if (foto) {
        formData.append("foto", foto);
    }

    console.log(formData)

    const response = await fetch(`http://localhost:3006/recursos`, {
        method: 'PUT',
        body: formData
    })

    const results = await response.json();

    if(results.success) {        
        alert(results.message)
        listarRecursos()
        fecharEditar()
    } else {
        alert(results.message)
    }
}

// deleta o recurso
async function deletarRecurso(id) {
    const confirmacao = confirm('Tem certeza?')

    if (confirmacao) {
        const response = await fetch(`http://localhost:3006/recursos/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
        })

        const results = await response.json();

        if (results.success) {
            alert(results.message)
            listarRecursos();
        } else {
            alert(results.message)
        }
    }
}

listarRecursos()