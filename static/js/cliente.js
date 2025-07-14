console.log("Cliente.js carregado");

window.onload = () => {
    const linhas = document.querySelectorAll("tbody tr");
    linhas.forEach(linha => {
        const statusCell = linha.querySelector("td:last-child");
        const select = document.createElement("select");
        ["Green", "Yellow", "Red", "Default"].forEach(opcao => {
            const opt = document.createElement("option");
            opt.value = opcao;
            opt.textContent = opcao;
            select.appendChild(opt);
        });
        select.value = statusCell.textContent;
        select.onchange = () => {
            linha.style.color = status === "Default" ? "#000" : "#333";
            statusCell.textContent = select.value;
            linha.style.backgroundColor = corStatus(select.value);
            const id = linha.children[0].textContent;
            const cliente = JSON.parse(localStorage.getItem(id));
            cliente.status = select.value;
            salvarClienteLocal(cliente);
        };
        statusCell.innerHTML = "";
        statusCell.appendChild(select);
    });
};

function corStatus(status) {
    switch (status) {
        case "Green": return "#d4edda";
        case "Yellow": return "#fff3cd";
        case "Red": return "#f8d7da";
        default: return "#ffffff";
    }
}

function salvarClienteLocal(cliente) {
    localStorage.setItem(cliente.id, JSON.stringify(cliente));
}

function editarEvento(botao) {
    const span = botao.nextElementSibling;
    const atual = span.textContent;
    const novo = prompt("Editar evento:", atual);
    if (novo !== null) {
        span.textContent = novo;
        const id = botao.closest("tr").children[0].textContent;
        const cliente = JSON.parse(localStorage.getItem(id));
        cliente.evento = novo;
        salvarClienteLocal(cliente);
    }
}

function corStatus(status) {
    switch (status) {
        case "Green": return "#d4edda";
        case "Yellow": return "#fff3cd";
        case "Red": return "#f8d7da";
        default: return "#ffffff";
    }
}

function atualizarIndiceClientes(id) {
    let lista = JSON.parse(localStorage.getItem("onbet_clientes") || "[]");
    if (!lista.includes(id)) {
        lista.push(id);
        localStorage.setItem("onbet_clientes", JSON.stringify(lista));
    }
}

function listarTodosClientes() {
    const lista = JSON.parse(localStorage.getItem("onbet_clientes") || "[]");
    return lista.map(id => JSON.parse(localStorage.getItem(id)));
}
