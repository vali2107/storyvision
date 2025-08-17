// adiciona header e footer na página
fetch('/frontend/reutilizaveis/header.html')
    .then(res => res.text())
    .then(data => document.getElementById('header').innerHTML = data);

fetch('/frontend/reutilizaveis/footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer').innerHTML = data);

// coloca a opção de adicionar ferramenta, caso seja administrador
const informacoesUsuario = localStorage.getItem('informacoes');
const usuario = JSON.parse(informacoesUsuario);
if (usuario.tipo_conta === "Adm") {
    let html = document.getElementById("main")
    html.innerHTML = ''
    html.innerHTML = `
        <div id="topo">
            <h1>Recomendações de Ferramentas</h1>
            <button id="abrir_add" onclick="abrirAdd()">Adicionar ferramenta</button>
        </div>
        <div id="ferramentas_tudo">
        </div>
        <form id="inserir_ferramenta_form">
            <input type="text" id="nome" placeholder="Nome">
            <input type="text" id="descricao" placeholder="Descrição">
            <input type="text" id="link" placeholder="Link">
            <input type="text" id="categoria" placeholder="Categoria">
            <input type="file" id="logo">
            <button id="inserir_ferramenta_botao" onclick="inserirFerramenta(event)">Inserir</button>
            <button id="fechar_add" onclick="fecharAdd()">x</button>
        </form>
        <section id="editar"></section>
    `
} 

// abre o forms de adicionar
async function abrirAdd() {
    document.getElementById("inserir_ferramenta_form").style.display = "flex";
    document.getElementById("abrir_add").style.display = "none"
}

// fecha o forms de adicionar
async function fecharAdd() {
    document.getElementById("inserir_ferramenta_form").style.display = "none";
    document.getElementById("abrir_add").style.display = "block"
}

// insere nova ferramenta
async function inserirFerramenta(event) {
    event.preventDefault()

    const nome = document.getElementById("nome").value
    const descricao = document.getElementById("descricao").value
    const link = document.getElementById("link").value
    const categoria = document.getElementById("categoria").value
    const logo = document.getElementById("logo").files[0]

    let formData = new FormData();

    formData.append("nome", nome)
    formData.append("descricao", descricao)
    formData.append("link", link)
    formData.append("categoria", categoria)
    formData.append("logo", logo)

    console.log(formData)

    const response = await fetch('http://localhost:3006/ferramentas', {
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

// lista ferramentas
async function listarFerramentas() {
    const response = await fetch('http://localhost:3006/ferramentas', {
        method: 'GET',
        headers: {
            "Content-Type":"application/json"
        }
    })

    const results = await response.json();

    if(results.success) {
        let productData = results.data
        const images = 'http://localhost:3006/uploads/'  
        let html = document.getElementById('ferramentas_tudo')
        html.innerHTML = '';

        let categorias = [];
        for (const ferramenta of productData) {
            if (!categorias.includes(ferramenta.categoria)) {
                categorias.push(ferramenta.categoria)
            }
        }

        for (const categoria of categorias) {
            let cardCategoria = document.createElement('div')
            cardCategoria.classList.add("categoria_tudo")
            cardCategoria.innerHTML = `
                <h2>${categoria}</h2>
            `

            let divItens = document.createElement('div')
            divItens.classList.add('itens')

            for (const ferramenta of productData) {
                if (ferramenta.categoria === categoria) {
                    let card = document.createElement('div');
                    card.classList.add('item');

                    card.innerHTML = `
                        <a href="${ferramenta.link}" target="_blank">
                            <img src="${images + ferramenta.logo}" alt="${ferramenta.nome}">
                        </a>
                        <p class="nome">${ferramenta.nome}</p>
                    `;

                    if (usuario.tipo_conta === "Adm") {
                        card.innerHTML += `
                            <div class="acoes">
                                <i class="fa-solid fa-pen-to-square" onclick="editarFerramenta(${ferramenta.id}, '${ferramenta.nome}', '${ferramenta.descricao}', '${ferramenta.link}', '${ferramenta.categoria}')"></i>
                                <i class="fa-solid fa-trash" onclick="deletarFerramenta(${ferramenta.id})"></i>
                            </div>
                        `;
                    }

                    divItens.appendChild(card);
                }
            }
            cardCategoria.appendChild(divItens)
            html.appendChild(cardCategoria)
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
async function editarFerramenta(id, nome, descricao, link, categoria) {
    let html = document.getElementById("editar")
    html.style.display = "block"
    html.innerHTML = ''
    html.innerHTML = `
        <form id="editar_ferramenta_form">
            <input type="text" id="nome_editar" placeholder="Nome" value="${nome}">
            <input type="text" id="descricao_editar" placeholder="Descrição" value="${descricao}">
            <input type="text" id="link_editar" placeholder="Link" value="${link}">
            <input type="text" id="categoria_editar" placeholder="Categoria" value="${categoria}">
            <input type="file" id="logo_editar">
            <button id="editar_ferramenta_botao" type="button" onclick="enviarEdicao(event, ${id})">Editar</button>
            <button id="fechar_editar" onclick="fecharEditar()">x</button>
        </form>
    `
}

// envia a edição do form e edita no banco
async function enviarEdicao(event, id) {
    event.preventDefault()

    const nome = document.getElementById("nome_editar").value
    const descricao = document.getElementById("descricao_editar").value
    const link = document.getElementById("link_editar").value
    const categoria = document.getElementById("categoria_editar").value
    const logo = document.getElementById("logo_editar").files[0]

    let formData = new FormData();

    formData.append("id", id)
    formData.append("nome", nome)
    formData.append("descricao", descricao)
    formData.append("link", link)
    formData.append("categoria", categoria)
    if (logo) {
        formData.append("logo", logo);
    }

    console.log(formData)

    const response = await fetch(`http://localhost:3006/ferramentas`, {
        method: 'PUT',
        body: formData
    })

    const results = await response.json();

    if(results.success) {        
        alert(results.message)
        listarFerramentas()
        fecharEditar()
    } else {
        alert(results.message)
    }
}

// deleta o recurso
async function deletarFerramenta(id) {
    const confirmacao = confirm('Tem certeza?')

    if (confirmacao) {
        const response = await fetch(`http://localhost:3006/ferramentas/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
        })

        const results = await response.json();

        if (results.success) {
            alert(results.message)
            listarFerramentas();
        } else {
            alert(results.message)
        }
    }
}

listarFerramentas()