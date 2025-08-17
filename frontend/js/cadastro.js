// faz o cadastro e manda informações do usuário para o localStorage
document.getElementById("cadastro_form").addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value
    const email = document.getElementById("email").value
    const senha = document.getElementById("senha").value
    const nascimento = document.getElementById("nascimento").value
    const categoria = document.getElementById("categoria").value

    const data = {nome, email, senha, nascimento, categoria}

    const response = await fetch('http://localhost:3006/usuarios/cadastrar', {
        method: 'POST',
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    })

    let results = await response.json();

    if(results.success) {        
        let userData = results.data;

        if (userData.nascimento) {
            userData.nascimento = userData.nascimento.split('T')[0]
        }
        console.log(userData)
        localStorage.setItem('informacoes', JSON.stringify(userData))

        alert(results.message)
        window.location.href = "modulos.html"
    } else {
        alert(results.message)
    }
})

// mostra a senha, colocando type = text
async function mostrarSenha() {
    document.getElementById('senha').setAttribute('type', 'text')
    document.getElementById('mostrar_senha').innerHTML = `
        <i class="fa-solid fa-eye" onclick="esconderSenha())"></i>
        <p onclick="esconderSenha()">Esconder senha</p>
    `
}

// esconde a senha, colocando type = password
async function esconderSenha() {
    document.getElementById('senha').setAttribute('type', 'password')
    document.getElementById('mostrar_senha').innerHTML = `
        <i class="fa-solid fa-eye-slash" onclick="mostrarSenha()"></i>
        <p onclick="mostrarSenha()">Mostrar senha</p>
    `
}