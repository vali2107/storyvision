// adiciona header e footer na página
fetch('/frontend/reutilizaveis/header.html')
    .then(res => res.text())
    .then(data => document.getElementById('header').innerHTML = data);

fetch('/frontend/reutilizaveis/footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer').innerHTML = data);

// coloca a opção de adicionar aulas somente para administradores
const informacoesUsuario = localStorage.getItem('informacoes');
const usuario = JSON.parse(informacoesUsuario);
if (usuario.tipo_conta === "Adm") {
    let html = document.getElementById("main")
    html.innerHTML = ''
    html.innerHTML = `
        <div id="topo">
            <h1>Módulos</h1>
            <div>
                <button id="abrir_add" onclick="abrirAdd()">Adicionar módulo</button>
                <button id="abrir_reordenar" onclick="reordenarModulos()">Reordenar módulos</button>
            </div>
        </div>
        <div id="modulos_tudo"></div>
        <form id="inserir_modulo_form">
            <input type="text" id="titulo" placeholder="Título">
            <input type="text" id="descricao" placeholder="Descrição">
            <input type="text" id="duracao" placeholder="Duração">
            <input type="text" id="resumo" placeholder="Resumo">
            <input type="file" id="foto">
            <button id="inserir_modulo_botao" onclick="inserirModulo(event)">Inserir</button>
            <button id="fechar_add" onclick="fecharAdd()">x</button>
        </form>
        <section id="reordenar_modulos_section"></section>
        <section id="editar"></section>
    `
}

// abre o form de adicionar
async function abrirAdd() {
    document.getElementById("inserir_modulo_form").style.display = "flex";
    document.getElementById("abrir_add").style.display = "none"
    document.getElementById("abrir_reordenar").style.display = "none"
}

// fecha o form de adicionar
async function fecharAdd() {
    document.getElementById("inserir_modulo_form").style.display = "none";
    document.getElementById("abrir_add").style.display = "block"
    document.getElementById("abrir_reordenar").style.display = "block"
}

// insere o modulo no banco
async function inserirModulo(event) {
    event.preventDefault()

    const titulo = document.getElementById("titulo").value
    const descricao = document.getElementById("descricao").value
    const duracao = document.getElementById("duracao").value
    const resumo = document.getElementById("resumo").value
    const foto = document.getElementById("foto").files[0]

    let formData = new FormData();

    formData.append("titulo", titulo)
    formData.append("descricao", descricao)
    formData.append("duracao", duracao)
    formData.append("resumo", resumo)
    formData.append("foto", foto)

    console.log(formData)

    const response = await fetch('http://localhost:3006/modulos', {
        method: 'POST',
        body: formData
    })

    const results = await response.json();

    if (results.success) {
        alert(results.message)
        fecharAdd()
        listarModulos()
    } else {
        alert(results.message)
    }
}

// lista os módulos e adiciona cards no front
async function listarModulos() {
    const response = await fetch('http://localhost:3006/modulos', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const results = await response.json();

    if (results.success) {
        let productData = results.data
        const images = 'http://localhost:3006/uploads/'
        let html = document.getElementById('modulos_tudo')
        html.innerHTML = '';
        for (const modulo of productData) {
            let card = document.createElement('div')
            card.classList.add('item')
            card.innerHTML += `
                <img src="${images + modulo.foto}" alt="${modulo.titulo}">
                <div class="base">
                    <p class="titulo">${modulo.titulo}</p>
                    <button class="abrir_modulo_botao" onclick="abrirModulo(${modulo.id}, '${modulo.titulo}', '${modulo.descricao}', '${modulo.duracao}', '${modulo.resumo}', '${modulo.foto}')">Ver</button>
                </div>
            `;

            // ações = editar, deletar, adicionar aulas
            if (usuario.tipo_conta === "Adm") {
                card.innerHTML += `
                    <div class="acoes">
                        <i class="fa-solid fa-pen-to-square" onclick="editarModulo(${modulo.id}, '${modulo.titulo}', '${modulo.descricao}', '${modulo.duracao}', '${modulo.resumo}')"></i>
                        <i class="fa-solid fa-trash" onclick="deletarModulo(${modulo.id})"></i>
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
async function editarModulo(id, titulo, descricao, duracao, resumo) {
    let html = document.getElementById("editar")
    html.style.display = "block"
    html.innerHTML = ''
    html.innerHTML = `
        <form id="editar_modulo_form">
            <input type="text" id="titulo_editar" placeholder="Título" value="${titulo}">
            <input type="text" id="descricao_editar" placeholder="Descrição" value="${descricao}">
            <input type="text" id="duracao_editar" placeholder="Duração" value="${duracao}">
            <input type="text" id="resumo_editar" placeholder="Resumo" value="${resumo}">
            <input type="file" id="foto_editar">
            <button id="editar_modulo_botao" type="button" onclick="enviarEdicao(event, ${id})">Editar</button>
            <button id="fechar_editar" onclick="fecharEditar()">x</button>
        </form>
    `
}

// envia a edição do form e edita no banco
async function enviarEdicao(event, id) {
    event.preventDefault()

    const titulo = document.getElementById("titulo_editar").value
    const descricao = document.getElementById("descricao_editar").value
    const duracao = document.getElementById("duracao_editar").value
    const resumo = document.getElementById("resumo_editar").value
    const foto = document.getElementById("foto_editar").files[0]

    let formData = new FormData();

    formData.append("id", id)
    formData.append("titulo", titulo)
    formData.append("descricao", descricao)
    formData.append("duracao", duracao)
    formData.append("resumo", resumo)
    if (foto) {
        formData.append("foto", foto);
    }

    console.log(formData)

    const response = await fetch(`http://localhost:3006/modulos`, {
        method: 'PUT',
        body: formData
    })

    const results = await response.json();

    if (results.success) {
        alert(results.message)
        listarModulos()
        fecharEditar()
    } else {
        alert(results.message)
    }
}

// fecha a section de reordenar
async function fecharReordenar() {
    let html = document.getElementById("reordenar_modulos_section")
    html.style.display = "none"
    html.innerHTML = ''
    document.getElementById("abrir_add").style.display = "block"
    document.getElementById("abrir_reordenar").style.display = "block"
}

// adiciona seção de reordenar os módulos
async function reordenarModulos() {

    document.getElementById("abrir_add").style.display = "none"
    document.getElementById("abrir_reordenar").style.display = "none"
    let html = document.getElementById("reordenar_modulos_section")
    html.style.display = "flex"
    html.innerHTML = ''
    html.innerHTML = `
        <div id="modulos_reordenar"></div>
        <div id="acoes_reordenar">
            <button id="salvar_reordenar">Salvar</button>
            <button id="fechar_reordenar" onclick="fecharReordenar()">Cancelar</button>
        </div>
    `
    const response = await fetch('http://localhost:3006/modulos', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const results = await response.json();

    if (results.success) {
        let productData = results.data

        // cria array com id e ordem iniciais
        arrayOrdem = productData.map(m => ({ id: m.id, ordem: m.ordem }));
        arrayOrdem.sort((a, b) => a.ordem - b.ordem)
        arrayOrdem.forEach((item) => {
            item.ordem = arrayOrdem.indexOf(item) + 1
        });

        console.log(productData)
        console.log(arrayOrdem)

        // adiciona linhas
        let div = document.getElementById('modulos_reordenar')
        div.innerHTML = '';
        for (const modulo of productData) {
            let linha = document.createElement('div')
            linha.id = modulo.id;
            linha.setAttribute('class', 'linha')
            linha.setAttribute('order', modulo.ordem);
            linha.innerHTML += `
                <p>${modulo.titulo}</p>
                <div>
                    <button class="subir" onclick="subirModulo(${modulo.id}, ${modulo.ordem})"><i class="fa-solid fa-arrow-up"></i></button>
                    <button class="descer" onclick="descerModulo(${modulo.id}, ${modulo.ordem})"><i class="fa-solid fa-arrow-down"></i></button>
                </div>
            `;

            div.appendChild(linha);
        }
    } else {
        alert(results.message)
    }
}

async function subirModulo(id, ordemInicial) {
    const itemAtual = arrayOrdem.find(m => m.id === id)
    const itemTroca = arrayOrdem.find(m => m.ordem === ordemInicial - 1);

    document.getElementById(`${itemAtual.id}`).setAttribute('order', ordemInicial - 1)
    document.getElementById(`${itemTroca.id}`).setAttribute('order', ordemInicial)

    itemAtual.ordem = ordemInicial - 1
    itemTroca.ordem = ordemInicial

    console.log("ID atual:", itemAtual.id, typeof itemAtual.id);
    console.log("Item troca ID:", itemTroca.id, typeof itemTroca.id);
    console.log("Elemento encontrado para ID atual:", document.getElementById(id));
    console.log("Elemento encontrado para item troca:", document.getElementById(itemTroca.id));

    
}

async function descerModulo(id, ordemInicial) {

}

// quando a pessoa clica no botão de reordenar:

// OK dá um fetch no select modulos
// OK cria array com id, ordem
// OK for modulo of productData, cria div com nome, seta pra cima e seta pra baixo, id=id, order=ordem-1
// se clicar na seta pra cima:
// OK pega a ordem do id
// OK pega o id de ordem -1
// id = ordem -1
// outro id = ordem +1
// pega a div com id=id, e muda a ordem=novaOrdem
// se clicar na seta pra baixo: contrário
// quando a pessoa clica em salvar
// manda pro banco o array com as novas ordens

// deleta o modulo
async function deletarModulo(id) {
    const confirmacao = confirm('Tem certeza?')

    if (confirmacao) {
        const response = await fetch(`http://localhost:3006/modulos/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
        })

        const results = await response.json();

        if (results.success) {
            alert(results.message)
            listarModulos();
        } else {
            alert(results.message)
        }
    }
}

listarModulos()