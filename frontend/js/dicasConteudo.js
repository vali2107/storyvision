// adiciona header e footer na página
fetch('/frontend/reutilizaveis/header.html')
    .then(res => res.text())
    .then(data => document.getElementById('header').innerHTML = data);

fetch('/frontend/reutilizaveis/footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer').innerHTML = data);

async function abrirDica(id, titulo, conteudo) {
    let dados = {id, titulo, conteudo}
    console.log(dados)
    localStorage.setItem('dicaAberta', JSON.stringify(dados))
    window.location.href = "dica_conteudo.html"
}

let html_aula = document.getElementById('main_conteudo')
if (html_aula) {
    const dados = JSON.parse(localStorage.getItem('dicaAberta'))

    const {id, titulo, conteudo} = dados
    html_aula.innerHTML = ''
    html_aula.innerHTML = `
        <h1>${titulo}</h1>
        ${conteudo}
`
}