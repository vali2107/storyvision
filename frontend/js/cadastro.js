document.getElementById("cadastro_form").addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value
    const email = document.getElementById("email").value
    const senha = document.getElementById("senha").value

    const data = {nome, email, senha}

    const response = await fetch('http://localhost:3006/usuario/cadastrar', {
        method: 'POST',
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    })

    let results = await response.json();

    if(results.success) {        
        alert(results.message)

    } else {
        alert(results.message)
    }
})