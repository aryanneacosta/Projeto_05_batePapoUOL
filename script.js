let seuNome;
let input = document.querySelector("input");
cadastroUsuario();

function cadastroUsuario() {
    seuNome = prompt("Qual seu nome?");
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', 
    {
        name: seuNome
    });
    promise.then(buscarMensagens);
    promise.catch(usuarioDiferente);
}

function usuarioDiferente(error) {
    console.log(error.response)
    while (error.response.status === 400) {
        seuNome = prompt("Este usuário já está em uso. Crie outro.");
    }
    buscarMensagens();
}

function buscarMensagens() {
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    
    promessa.then(carregarMensagens);
    promessa.catch(deuRuim);
   
}

function deuRuim(error) {
    console.log(alert("Nossos servidores estão sobrecarregados, desculpe o inconveniente!"));
    //mudar aqui depois
}

function carregarMensagens(resposta) {

    console.log(resposta.data);
    const mensagens = resposta.data;

    const conteudo = document.querySelector(".content");

    
    for (let i = 0; i < mensagens.length; i++) {
        if (mensagens[i].type === "status") {
            conteudo.innerHTML += 
                `<div class="${mensagens[i].type}">
                    <div class="messagecontent">
                        <b class="hora">(${mensagens[i].time})</b>
                        <b class="nome">${mensagens[i].from}</b>
                        <b class="statusatual">${mensagens[i].text}</b>
                    </div>
                </div>` ;
        } else if (mensagens[i].type === "message") {
            conteudo.innerHTML += 
                `<div class="${mensagens[i].type}">
                    <div class="messagecontent">
                        <b class="hora">(${mensagens[i].time})</b>
                        <b class="nome">${mensagens[i].from}</b>
                        <b class="mensagematual"> para</b>
                        <b class="nome">${mensagens[i].to}:</b>
                        <b class="mensagematual">${mensagens[i].text}</b>
                    </div>
                </div>` ;
        } else if (mensagens[i].type === "private_message") {
            conteudo.innerHTML += 
                `<div class="${mensagens[i].type}">
                    <div class="messagecontent">
                        <b class="hora">(${mensagens[i].time})</b>
                        <b class="nome">${mensagens[i].from}</b>
                        <b class="mensagematual"> reservadamente para</b>
                        <b class="nome">${mensagens[i].to}:</b>
                        <b class="mensagematual">${mensagens[i].text}</b>
                    </div>
                </div>` ;
        }
    }
    let last = conteudo.lastElementChild;
    last.scrollIntoView();
}

function verificaConexao() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status',
    {
        name: seuNome
    });
    promise.then(buscarMensagens);
    promise.catch(console.log("Você foi desconectado")); 
}

setInterval(verificaConexao, 5000);

function enviarMensagem() {
    let mensagemEnviada = document.querySelector("input").value;
    console.log(mensagemEnviada);
    const parametroMensagem = {
        from: seuNome,
        to: "Todos",
        text: mensagemEnviada,
        type: "message" 
    };
    console.log(parametroMensagem);

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages',
    parametroMensagem);
        
        promise.then(buscarMensagens());
        promise.catch(console.log("deu ruim"));
}