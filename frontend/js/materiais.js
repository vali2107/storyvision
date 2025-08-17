// adiciona header e footer na página
fetch('/frontend/reutilizaveis/header.html')
    .then(res => res.text())
    .then(data => document.getElementById('header').innerHTML = data);

fetch('/frontend/reutilizaveis/footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer').innerHTML = data);

    document.addEventListener("DOMContentLoaded", loadMateriais)

async function loadMateriais() {
    const responseRecursos = await fetch('http://localhost:3006/recursos', {
        method: 'GET',
        headers: {
            "Content-Type":"application/json"
        }
    })

    const resultsRecursos = await responseRecursos.json();

    const responseFerramentas = await fetch('http://localhost:3006/ferramentas', {
        method: 'GET',
        headers: {
            "Content-Type":"application/json"
        }
    })

    const resultsFerramentas = await responseFerramentas.json();

    const responseDicas = await fetch('http://localhost:3006/dicas', {
        method: 'GET',
        headers: {
            "Content-Type":"application/json"
        }
    })

    const resultsDicas = await responseDicas.json();

    if(resultsRecursos.success && resultsFerramentas.success && resultsDicas.success) {
        const images = 'http://localhost:3006/uploads/'

        let producDataRecursos = resultsRecursos.data;
        const selectRecursos = producDataRecursos.slice(-3);
        let htmlRecursos = document.getElementById('cards_recursos');
        htmlRecursos.innerHTML = '';
        for (const recurso of selectRecursos) {
            htmlRecursos.innerHTML += `
                <div class="item recurso">
                    <img src="${images + recurso.foto}" alt="${recurso.titulo}">
                    <a href="${recurso.link}" class="titulo">${recurso.titulo}</a>
                    <p>${recurso.descricao}</p>
                </div>
            `
        }

        let productDataFerramentas = resultsFerramentas.data;
        const selectFerramentas = productDataFerramentas.slice(-5);
        let htmlFerramentas = document.getElementById('cards_ferramentas');
        htmlFerramentas.innerHTML = '';
        for (const ferramenta of selectFerramentas) {
            htmlFerramentas.innerHTML += `
                <div class="item ferramenta">
                    <a href="${ferramenta.link}" target="_blank">
                        <img src="${images + ferramenta.logo}" alt="${ferramenta.nome}">
                    </a>
                    <p class="nome">${ferramenta.nome}</p>
                </div>
            `
        }

        let producDataDicas = resultsDicas.data;
        const selectDicas = producDataDicas.slice(-3);
        let htmlDicas = document.getElementById('cards_dicas');
        htmlDicas.innerHTML = '';
        for (const dica of selectDicas) {
            htmlDicas.innerHTML += `
                <div class="item dica">
                    <img src="${images + dica.foto}" alt="${dica.titulo}">
                    <a href="${dica.conteudo}" class="titulo">${dica.titulo}</a>
                    <p>${dica.descricao}</p>
                </div>
            `
        }

    } else {
        alert(resultsRecursos.message)
        alert(resultsFerramentas.message)
    }
}


async function abrirRecursos() {
    window.location.href = "recursos.html"
}

async function abrirFerramentas() {
    window.location.href = "ferramentas.html"
}

async function abrirDicas() {
    window.location.href = "dicas.html"
}