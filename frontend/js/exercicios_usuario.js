// adiciona header e footer na página
fetch('/frontend/reutilizaveis/header.html')
    .then(res => res.text())
    .then(data => document.getElementById('header').innerHTML = data);

fetch('/frontend/reutilizaveis/footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer').innerHTML = data);

const informacoesUsuario = localStorage.getItem('informacoes');
const usuario = JSON.parse(informacoesUsuario);
const informacoesModulo = localStorage.getItem('moduloAberto')
const modulo = JSON.parse(informacoesModulo)

// abrir exercício selecionado na lista
async function abrirExercicio(id, pergunta, tipo, alternativas, resposta_correta) {
    let exercicio_aberto = document.getElementById("exercicio_aberto")
    exercicio_aberto.innerHTML = ''
    if (tipo === "Objetiva") {
        p = document.createElement('p')
        p.textContent = pergunta
        exercicio_aberto.appendChild(p)

        form = document.createElement('form')
        form.id = 'lista_alternativas'

        let alternativasArray = alternativas.split(";")
        console.log(alternativasArray)
        for (const alternativa of alternativasArray) {
            let label = document.createElement('label')
            let input = document.createElement('input')
            input.type = 'radio'
            input.name = 'resposta'
            input.id = 'resposta'
            input.value = alternativa

            label.appendChild(input)
            label.append(alternativa)

            form.appendChild(label)
        }

        botao = document.createElement('button')
        botao.innerHTML = 'Enviar resposta'
        form.appendChild(botao)

        botao.addEventListener('click', () => {
            enviarResposta();
        });

        exercicio_aberto.appendChild(form)
    } else if (tipo === "Subjetiva") {
        exercicio_aberto.innerHTML = `
            <p>${pergunta}</p>
            <textarea name="resposta" id="resposta"></textarea>
            <button onclick="enviarResposta()">Enviar resposta</button>
        `
    }
}

async function enviarResposta() {
    alert("Você acertou! Parabéns")
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
        html.innerHTML = ''
        html.innerHTML = `
                <section id="lista_exercicios"></section>
                <section id="exercicio_aberto"></section>
            `
        let numeracao = 1
        let lista = document.getElementById("lista_exercicios")
        for (const exercicio of productData) {
            let item = document.createElement('div')
            item.addEventListener('click', () => {
                abrirExercicio(
                    exercicio.id,
                    exercicio.pergunta,
                    exercicio.tipo,
                    exercicio.alternativas,
                    exercicio.resposta_correta
                );
            });
            item.innerHTML += `
                    <p id="item_${numeracao}">${numeracao}.</p>
                `
            lista.appendChild(item)
            numeracao += 1
        }
    } else {
        alert(results.message)
    }
}


listarExercicios()