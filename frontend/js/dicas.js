// adiciona header e footer na página
fetch('/frontend/reutilizaveis/header.html')
    .then(res => res.text())
    .then(data => document.getElementById('header').innerHTML = data);

fetch('/frontend/reutilizaveis/footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer').innerHTML = data);

    // coloca a opção de adicionar dica somente para administradores
const informacoesUsuario = localStorage.getItem('informacoes');
const usuario = JSON.parse(informacoesUsuario);
if (usuario.tipo_conta === "Adm") {
    let html = document.getElementById("main")
    html.innerHTML = ''
    html.innerHTML = `
        <div id="topo">
            <h1>Dicas Rápidas</h1>
            <button id="abrir_add" onclick="abrirAdd()">Adicionar dica</button>
        </div>
        <div id="dicas_tudo"></div>
        <form id="inserir_dica_form">
            <input type="text" id="titulo" placeholder="Título">
            <input type="text" id="descricao" placeholder="Descrição">
            <textarea id="conteudo" placeholder="Conteúdo"></textarea>
            <input type="text" id="tipo" placeholder="Tipo">
            <input type="file" id="foto">
            <button id="inserir_dica_botao" onclick="inserirDica(event)">Inserir</button>
            <button id="fechar_add" onclick="fecharAdd()">x</button>
        </form>
        <section id="editar"></section>
    `
} 

// abre o form de adicionar
async function abrirAdd() {
    document.getElementById("inserir_dica_form").style.display = "flex";
    document.getElementById("abrir_add").style.display = "none"
}

// fecha o form de adicionar
async function fecharAdd() {
    document.getElementById("inserir_dica_form").style.display = "none";
    document.getElementById("abrir_add").style.display = "block"
}

// insere o dica no banco
async function inserirDica(event) {
    event.preventDefault()

    const titulo = document.getElementById("titulo").value
    const descricao = document.getElementById("descricao").value
    const conteudo = document.getElementById("conteudo").value
    const tipo = document.getElementById("tipo").value
    const foto = document.getElementById("foto").files[0]

    let formData = new FormData();

    formData.append("titulo", titulo)
    formData.append("descricao", descricao)
    formData.append("conteudo", conteudo)
    formData.append("tipo", tipo)
    formData.append("foto", foto)

    console.log(formData)

    const response = await fetch('http://localhost:3006/dicas', {
        method: 'POST',
        body: formData
    })

    const results = await response.json();

    if(results.success) {        
        alert(results.message)
        fecharAdd()
        listarFerramentas()
    } else {
        alert(results.message)
    }
}

// lista os dicas e adiciona cards no front
async function listarDicas() {
    const response = await fetch('http://localhost:3006/dicas', {
        method: 'GET',
        headers: {
            "Content-Type":"application/json"
        }
    })

    const results = await response.json();

    if(results.success) {
        let productData = results.data
        const images = 'http://localhost:3006/uploads/'  
        let html = document.getElementById('dicas_tudo')
        html.innerHTML = '';
        for (const dica of productData) {
            let card = document.createElement('div')
            card.classList.add('item')
            card.innerHTML += `
                <img src="${images + dica.foto}" alt="${dica.titulo}">
                <div class="base">
                    <p class="titulo">${dica.titulo}</p>
                    <button class="abrir_dica_botao" onclick="abrirDica(${dica.id}, '${dica.titulo}', '${dica.conteudo}')">Ver</button>
                </div>
                <p>${dica.descricao}</p>
            `;

            if (usuario.tipo_conta === "Adm") {
                card.innerHTML += `
                    <div class="acoes">
                        <i class="fa-solid fa-pen-to-square" onclick="editarDica(${dica.id}, '${dica.titulo}', '${dica.descricao}', '${dica.conteudo}', '${dica.tipo}')"></i>
                        <i class="fa-solid fa-trash" onclick="deletarDica(${dica.id})"></i>
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
async function editarDica(id, titulo, descricao, conteudo, tipo) {
    let html = document.getElementById("editar")
    html.style.display = "block"
    html.innerHTML = ''
    html.innerHTML = `
        <form id="editar_dica_form">
            <input type="text" id="titulo_editar" placeholder="Título" value="${titulo}">
            <input type="text" id="descricao_editar" placeholder="Descrição" value="${descricao}">
            <textarea id="conteudo_editar" placeholder="Conteúdo">${conteudo}</textarea>
            <input type="text" id="tipo_editar" placeholder="Tipo" value="${tipo}">
            <input type="file" id="foto_editar">
            <button id="editar_dica_botao" type="button" onclick="enviarEdicao(event, ${id})">Editar</button>
            <button id="fechar_editar" onclick="fecharEditar()">x</button>
        </form>
    `
}

// envia a edição do form e edita no banco
async function enviarEdicao(event, id) {
    event.preventDefault()

    const titulo = document.getElementById("titulo_editar").value
    const descricao = document.getElementById("descricao_editar").value
    const conteudo = document.getElementById("conteudo_editar").value
    const tipo = document.getElementById("tipo_editar").value
    const foto = document.getElementById("foto_editar").files[0]

    let formData = new FormData();

    formData.append("id", id)
    formData.append("titulo", titulo)
    formData.append("descricao", descricao)
    formData.append("conteudo", conteudo)
    formData.append("tipo", tipo)
    if (foto) {
        formData.append("foto", foto);
    }

    console.log(formData)

    const response = await fetch(`http://localhost:3006/dicas`, {
        method: 'PUT',
        body: formData
    })

    const results = await response.json();

    if(results.success) {        
        alert(results.message)
        listarDicas()
        fecharEditar()
    } else {
        alert(results.message)
    }
}

// deleta o dica
async function deletarDica(id) {
    const confirmacao = confirm('Tem certeza?')

    if (confirmacao) {
        const response = await fetch(`http://localhost:3006/dicas/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }
        })

        const results = await response.json();

        if (results.success) {
            alert(results.message)
            listarDicas();
        } else {
            alert(results.message)
        }
    }
}

listarDicas()