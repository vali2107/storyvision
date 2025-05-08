document.getElementById("login_form").addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const data = {email, senha}

    const response = await fetch('http://localhost:3006/usuario/login', {
        method: 'POST',
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    })

    let results = await response.json();

    if(results.success) {
        let userData = results.data;
        console.log(userData)
        localStorage.setItem('informacoes', JSON.stringify(userData))
        
        alert(results.message)
        // window.location.href = './index.html';
    } else {
        alert(results.message)
    }
})