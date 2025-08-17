const informacoesModulo = localStorage.getItem('moduloAberto');
const modulo = JSON.parse(informacoesModulo);

// coloca a opção de adicionar aulas somente para administradores
const informacoesUsuario = localStorage.getItem('informacoes');
const usuario = JSON.parse(informacoesUsuario);
if (usuario.tipo_conta === "Adm") {
    let html = document.getElementById("aulas")
    html.innerHTML = ''
    html.innerHTML = `
        <div id="topo">
            <h1>Aulas</h1>
            <div>
                <button id="abrir_add" onclick="abrirAdd()">Adicionar aula</button>
                <button id="abrir_reordenar" onclick="reordenarAulas()">Reordenar aulas</button>
            </div>
        </div>
        <div id="aulas_tudo"></div>
        <form id="inserir_aula_form">
            <input type="text" id="titulo" placeholder="Título">
            <input type="text" id="conteudo" placeholder="Conteúdo">
            <input type="file" id="foto">
            <button id="inserir_aula_botao" onclick="inserirAula(event)">Inserir</button>
            <button id="fechar_add" onclick="fecharAdd()">x</button>
        </form>
        <section id="reordenar_aulas_section"></section>
        <section id="editar"></section>
    `
}

// abre o form de adicionar
async function abrirAdd() {
    document.getElementById("inserir_aula_form").style.display = "flex";
    document.getElementById("abrir_add").style.display = "none"
    document.getElementById("abrir_reordenar").style.display = "none"
}

// fecha o form de adicionar
async function fecharAdd() {
    document.getElementById("inserir_aula_form").style.display = "none";
    document.getElementById("abrir_add").style.display = "block"
    document.getElementById("abrir_reordenar").style.display = "block"
}

// insere a aula no banco
async function inserirAula(event) {
    event.preventDefault()

    const titulo = document.getElementById("titulo").value
    const conteudo = document.getElementById("conteudo").value
    const foto = document.getElementById("foto").files[0]

    let formData = new FormData();

    formData.append("titulo", titulo)
    formData.append("conteudo", conteudo)
    formData.append("id_modulo", modulo.id)
    formData.append("foto", foto)
    console.log(document.getElementById("titulo"))

    console.log(formData)

    const response = await fetch('http://localhost:3006/aulas', {
        method: 'POST',
        body: formData
    })

    const results = await response.json();

    if (results.success) {
        alert(results.message)
        fecharAdd()
        listarAulas()
    } else {
        alert(results.message)
    }
}

// lista as aulas e adiciona cards no front
async function listarAulas() {
    const response = await fetch(`http://localhost:3006/aulas/${modulo.id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const results = await response.json();

    if (results.success) {
        let productData = results.data
        const images = 'http://localhost:3006/uploads/'
        let html = document.getElementById('aulas_tudo')
        html.innerHTML = '';
        for (const aula of productData) {
            let card = document.createElement('div')
            card.classList.add('item')
            card.innerHTML += `
                <img src="${images + aula.foto}" alt="${aula.titulo}">
                <div class="base">
                    <p class="titulo">${aula.titulo}</p>
                    <button class="abrir_aula_botao" onclick="abrirAula(${aula.id}, '${aula.titulo}', '${aula.conteudo}')">Ver</button>
                </div>
            `;

            // ações = editar, deletar, adicionar aulas
            if (usuario.tipo_conta === "Adm") {
                card.innerHTML += `
                    <div class="acoes">
                        <i class="fa-solid fa-pen-to-square" onclick="editarAula(${aula.id}, '${aula.titulo}', '${aula.conteudo}')"></i>
                        <i class="fa-solid fa-trash" onclick="deletarAula(${aula.id})"></i>
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
async function editarAula(id, titulo, conteudo) {
    let html = document.getElementById("editar")
    html.style.display = "block"
    html.innerHTML = ''
    html.innerHTML = `
        <form id="editar_aula_form">
            <input type="text" id="titulo_editar" placeholder="Título" value="${titulo}">
            <input type="text" id="conteudo_editar" placeholder="Conteúdo" value="${conteudo}">
            <input type="file" id="foto_editar">
            <button id="editar_aula_botao" type="button" onclick="enviarEdicao(event, ${id})">Editar</button>
            <button id="fechar_editar" onclick="fecharEditar()">x</button>
        </form>
    `
}

// envia a edição do form e edita no banco
async function enviarEdicao(event, id) {
    event.preventDefault()

    const titulo = document.getElementById("titulo_editar").value
    const conteudo = document.getElementById("conteudo_editar").value
    const foto = document.getElementById("foto_editar").files[0]

    let formData = new FormData();

    formData.append("id", id)
    formData.append("titulo", titulo)
    formData.append("conteudo", conteudo)
    if (foto) {
        formData.append("foto", foto);
    }

    console.log(formData)

    const response = await fetch(`http://localhost:3006/aulas`, {
        method: 'PUT',
        body: formData
    })

    const results = await response.json();

    if (results.success) {
        alert(results.message)
        listarAulas()
        fecharEditar()
    } else {
        alert(results.message)
    }
}

// deleta a aula
async function deletarAula(id) {
    const confirmacao = confirm('Tem certeza?')

    if (confirmacao) {
        const response = await fetch(`http://localhost:3006/aulas/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
        })

        const results = await response.json();

        if (results.success) {
            alert(results.message)
            listarAulas();
        } else {
            alert(results.message)
        }
    }
}

listarAulas()