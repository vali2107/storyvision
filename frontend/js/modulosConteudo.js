// adiciona header e footer na página
fetch('/frontend/reutilizaveis/header.html')
    .then(res => res.text())
    .then(data => document.getElementById('header').innerHTML = data);

fetch('/frontend/reutilizaveis/footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer').innerHTML = data);

async function abrirModulo(id, titulo, descricao, duracao, resumo, foto) {
    let dados = {id, titulo, descricao, duracao, resumo, foto}
    localStorage.setItem('moduloAberto', JSON.stringify(dados))
    window.location.href = "modulo_conteudo.html"
}

let html = document.getElementById('main_conteudo')
if (html) {
    const dados = JSON.parse(localStorage.getItem('moduloAberto'))

    const {id, titulo, descricao, duracao, resumo, foto} = dados
    const images = 'http://localhost:3006/uploads/'
    html.innerHTML = ''
    html.innerHTML = `
    <section id="informacoes_modulo">
        <div id="dados">
            <h1>${titulo}</h1>
            <p id="descricao">${descricao}</p>
            <p id="duracao">Duração: ${duracao}</p>
        </div>
        <div id="acoes">
            <button id="assistir">Assistir</button>
            <button id="resumo">Resumo</button>
            <button id="exercicios">Exercícios</button>
        </div>
        <img src="${images + foto}" alt="${titulo}">
    </section>
    <section id="aulas">
        <h1>Aulas</h1>
        <div id="aulas_tudo"></div>
        <section id="editar"></section>
    </section>
`
}