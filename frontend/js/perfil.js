// adiciona header e footer na página
fetch('/frontend/reutilizaveis/header.html')
    .then(res => res.text())
    .then(data => document.getElementById('header').innerHTML = data);

fetch('/frontend/reutilizaveis/footer.html')
    .then(res => res.text())
    .then(data => document.getElementById('footer').innerHTML = data);

    // carrega a página do perfil, com as informações do usuário
if(document.getElementById("main_perfil")) {
    document.addEventListener("DOMContentLoaded", function() {
        const informacoesUsuario = localStorage.getItem('informacoes');
        const usuario = JSON.parse(informacoesUsuario); 

        const nascimento = usuario.nascimento;
        if (nascimento !== null) {
            const [ano, mes, dia] = nascimento.split('-');
            const nascimento = `${dia}/${mes}/${ano}`
        }

        let html = document.getElementById('main_perfil')
        html.innerHTML = '';
        html.innerHTML = `
                <h1>Seu perfil</h1>
                <button onclick="abrirEdicao()" id="abrir_edicao">Editar</button>
                <div class="info_perfil">
                    <div id="card_um">
                        <p>Nome</p>
                        <p id="nome" class="tag_perfil">${usuario.nome}</p>
                    </div>
                    <div id="card_dois">
                        <p>Email</p>
                        <p id="email" class="tag_perfil">${usuario.email}</p>
                    </div>
                    <div id="card_tres" class="card">
                        <p>Data de nascimento</p>
                        <p id="nascimento" class="tag_perfil">${nascimento}</p>
                    </div>
                    <div id="card_quatro" class="card">
                        <p>Categoria</p>
                        <p id="categoria" class="tag_perfil">${usuario.categoria}</p>
                    </div>
                </div>
                <div id="botoes">
                    <button onclick="logout()">Logout</button>
                    <button onclick="deletarUsuario()">Deletar conta</button>
                </div>
        `
    })
}

// abre o forms de edição, quando clicar em "Editar" na página de perfil
async function abrirEdicao() {
    const informacoesUsuario = localStorage.getItem('informacoes');
    const usuario = JSON.parse(informacoesUsuario); 

    let html = document.getElementById('main_perfil')
    html.innerHTML = '';
    html.innerHTML = `
        <h1>Seu perfil</h1>
        <button id="botao_editar" onclick="editarUsuario()">Salvar</button>
        <form action="" id="form_editar" class="info_perfil">
            <div id="card_um">
                <label for="nome">Nome</label>
                <input type="text" id="nome_editar" name="nome" class="tag_perfil" value="${usuario.nome}">
            </div>
            <div id="card_dois">
                <label for="email">Email</label>
                <input type="email" id="email_editar" name="email"  class="tag_perfil" value="${usuario.email}">
            </div>
            <div id="card_tres">
                <label for="nascimento">Nascimento</label>
                <input type="date" id="nascimento_editar" name="nascimento" class="tag_perfil" value=${usuario.nascimento}>
            </div>
            <div id="card_quatro">
                <label for="categoria">Categoria</label>
                <select name="categoria" id="categoria_editar" class="tag_perfil">
                    <option value="Estudante">Estudante</option>
                    <option value="Profissional">Profissional</option>
                    <option value="Ambos">Ambos</option>
                    <option value="Nenhum">Nenhum</option>
                </select>
            </div>
        </form>
    `
    document.getElementById("categoria_editar").value = usuario.categoria
}

// edita o usuário
async function editarUsuario() {
    const informacoesUsuario = localStorage.getItem('informacoes');
    const usuario = JSON.parse(informacoesUsuario);
    const idUsuario = usuario.id

    const nome = document.getElementById("nome_editar").value
    const email = document.getElementById("email_editar").value
    const nascimento = document.getElementById("nascimento_editar").value
    const categoria = document.getElementById("categoria_editar").value

    const data = {
        nome,
        email,
        nascimento, 
        categoria,
        idUsuario
    };

    const response = await fetch('http://localhost:3006/usuarios/', {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const results = await response.json();

    if(results.success) {        
        alert(results.message)

        const novosDados = {
            ...usuario,
            nome,
            email,
            nascimento,
            categoria
        };
        localStorage.setItem('informacoes', JSON.stringify(novosDados))
        
        window.location.reload()
    } else {
        alert(results.message)
    }
}

// logout usuário
function logout() {
    localStorage.removeItem('informacoes')
    localStorage.removeItem('n8n-chat/sessionId')
    window.location.href = "index.html"
}

// deleta usuário
async function deletarUsuario() {
    const confirmacao = confirm('Tem certeza que deseja deletar a conta?')

    if (confirmacao) {
        const informacoesUsuario = localStorage.getItem('informacoes');
        const usuario = JSON.parse(informacoesUsuario);

        const response = await fetch(`http://localhost:3006/usuarios/${usuario.id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
        })

        const results = await response.json();

        if (results.success) {
            alert(results.message)
            localStorage.removeItem('informacoes')
            window.location.href = "index.html"
        } else {
            alert(results.message)
        }
    }
}