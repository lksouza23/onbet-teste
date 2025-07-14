function gerarAleatorios() {
    alert("Gerar clientes aleatórios (simulado)");
}
function gerarDuplicados() {
    alert("Gerar clientes duplicados (simulado)");
}
function abrirAdicionarCliente() {
    alert("Abrir overlay de adicionar cliente");
}
function abrirNovoLancamento() {
    alert("Abrir overlay de novo lançamento");
}
function buscarCliente() {
    alert("Buscar cliente filtrado");
}
function limparFiltro() {
    alert("Limpar filtro e mostrar tabela principal");
}

function gerarID() {
    return "CLI-" + Math.floor(Math.random() * 1000000);
}

function dataAtual() {
    const agora = new Date();
    return agora.toLocaleDateString("pt-BR") + "_" + agora.toLocaleTimeString("pt-BR");
}

function salvarClienteLocal(cliente) {
    localStorage.setItem(cliente.id, JSON.stringify(cliente));
}

function carregarClientes() {
    const clientes = [];
    for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);
        if (chave.startsWith("CLI-")) {
            clientes.push(JSON.parse(localStorage.getItem(chave)));
        }
    }
    return clientes;
}

function renderizarTabelaPrincipal() {
    const clientes = carregarClientes();
    const tabela = document.getElementById("tabela-principal");
    tabela.innerHTML = `
        <table>
            <thead>
                <tr><th>ID</th><th>Nome</th><th>Data/Hora</th><th>Total</th><th>Desconto</th><th>Ações</th></tr>
            </thead>
            <tbody>
                ${clientes.map(cliente => `
                    <tr>
                        <td>${cliente.id}</td>
                        <td>${cliente.nome}</td>
                        <td>${cliente.data}</td>
                        <td>${cliente.valor}</td>
                        <td>${cliente.desconto || "0"}</td>
                        <td>
                            <button onclick="aplicarDesconto('${cliente.id}')">Desconto</button>
                            <button onclick="salvarCSV('${cliente.id}')">Salvar CSV</button>
                            <button onclick="visualizarCliente('${cliente.id}')">Visualizar</button>
                            <button onclick="excluirCliente('${cliente.id}')">Excluir</button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

// Ações
function aplicarDesconto(id) {
    const cliente = JSON.parse(localStorage.getItem(id));
    const valorDesconto = prompt("Valor do desconto:");
    cliente.desconto = parseFloat(valorDesconto);
    cliente.liquido = cliente.valor - cliente.desconto;
    salvarClienteLocal(cliente);
    renderizarTabelaPrincipal();
}

function salvarCSV(id) {
    const cliente = JSON.parse(localStorage.getItem(id));
    const csv = `ID,NOME,VALOR,ODDS,EVENTO,STATUS\n${cliente.id},${cliente.nome},${cliente.valor},${cliente.odds || ""},"${cliente.evento || ""}",${cliente.status || "Default"}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${id}.csv`;
    a.click();
}

function excluirCliente(id) {
    localStorage.removeItem(id);
    renderizarTabelaPrincipal();
}

function visualizarCliente(id) {
    window.location.href = `/cliente/${id}`;
}

window.onload = () => {
    renderizarTabelaPrincipal();
};

function abrirAdicionarCliente() {
    document.getElementById("overlay-adicionar").style.display = "flex";
    document.getElementById("id-cliente").value = gerarID();
    document.getElementById("data-cliente").value = dataAtual();
}

function abrirNovoLancamento() {
    document.getElementById("overlay-lancamento").style.display = "flex";
    const select = document.getElementById("cliente-select");
    select.innerHTML = "";
    carregarClientes().forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.nome;
        select.appendChild(opt);
    });
}

function fecharOverlay(id) {
    document.getElementById(id).style.display = "none";
}

function salvarNovoCliente() {
    const cliente = {
        id: document.getElementById("id-cliente").value,
        nome: document.getElementById("nome-cliente").value,
        data: document.getElementById("data-cliente").value,
        valor: parseFloat(document.getElementById("valor-cliente").value),
        status: "Default"
    };
    salvarClienteLocal(cliente);
    fecharOverlay("overlay-adicionar");
    renderizarTabelaPrincipal();
}

function salvarLancamento() {
    const id = document.getElementById("cliente-select").value;
    const valor = parseFloat(document.getElementById("valor-lancamento").value);
    const cliente = JSON.parse(localStorage.getItem(id));
    cliente.valor += valor;
    salvarClienteLocal(cliente);
    fecharOverlay("overlay-lancamento");
    renderizarTabelaPrincipal();
}

function filtrarSemana() {
    const inicio = document.getElementById("data-inicio").value;
    const fim = document.getElementById("data-fim").value;
    const clientes = carregarClientes().filter(c => {
        const data = c.data.split("_")[0];
        return compararDatas(data, inicio, fim);
    });
    renderizarTabelaFiltrada(clientes);
}

function compararDatas(data, inicio, fim) {
    const [d, m, a] = data.split("/");
    const dataNum = new Date(`${a}-${m}-${d}`);
    const [di, mi, ai] = inicio.split("/");
    const [df, mf, af] = fim.split("/");
    const inicioNum = new Date(`${ai}-${mi}-${di}`);
    const fimNum = new Date(`${af}-${mf}-${df}`);
    return dataNum >= inicioNum && dataNum <= fimNum;
}

function renderizarTabelaFiltrada(clientes) {
    const tabela = document.getElementById("tabela-principal");
    tabela.innerHTML = `
        <table>
            <thead><tr><th>ID</th><th>Nome</th><th>Data</th><th>Valor</th></tr></thead>
            <tbody>
                ${clientes.map(c => `
                    <tr><td>${c.id}</td><td>${c.nome}</td><td>${c.data}</td><td>${c.valor}</td></tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

function gerarDuplicados() {
    const duplicados = [];
    for (let i = 0; i < 3; i++) {
        const id = gerarID();
        const nome = "Duplicado" + i;
        const data = dataAtual();
        const valor = 50 + i * 10;
        duplicados.push({ id, nome, data, valor });
    }
    const corpo = document.getElementById("duplicados-body");
    corpo.innerHTML = "";
    duplicados.forEach(c => {
        const tr = document.createElement("tr");
        tr.style.backgroundColor = "#fff3cd"; // amarelo
        tr.innerHTML = `
            <td>${c.id}</td>
            <td>${c.nome}</td>
            <td>${c.data}</td>
            <td>${c.valor}</td>
            <td>
                <button onclick="manterDuplicado('${c.id}', '${c.nome}', '${c.data}', ${c.valor})">Manter</button>
                <button onclick="excluirDuplicado(this)">Excluir</button>
            </td>
        `;
        corpo.appendChild(tr);
    });
    document.getElementById("tabela-duplicados").style.display = "block";
}

function manterDuplicado(id, nome, data, valor) {
    const cliente = { id, nome, data, valor, status: "Default", alerta: true };
    salvarClienteLocal(cliente);
    renderizarTabelaPrincipal();
}

function excluirDuplicado(botao) {
    botao.closest("tr").remove();
}

function exportarTodosCSV() {
    const clientes = carregarClientes();
    clientes.forEach(c => salvarCSV(c.id));
}

function validarCliente(cliente) {
    return cliente && cliente.id && cliente.nome && typeof cliente.valor === "number";
}
if (!localStorage.getItem(cliente.id)) {
    localStorage.setItem(cliente.id, JSON.stringify(cliente));
}

function exportarCSVCompleto() {
    const clientes = listarTodosClientes();
    let csv = "ID,NOME,VALOR,ODDS,EVENTO,STATUS\n";
    clientes.forEach(c => {
        csv += `${c.id},${c.nome},${c.valor},${c.odds || ""},"${c.evento || ""}",${c.status || "Default"}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "planilha_onbet.csv";
    a.click();
}

function listarTodosClientes() {
    const clientes = [];
    for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);
        if (chave.startsWith("CLI-")) {
            clientes.push(JSON.parse(localStorage.getItem(chave)));
        }
    }
    return clientes;
}

function buscarPorNomeOuID(valor) {
    const clientes = listarTodosClientes();
    return clientes.filter(c => c.nome.includes(valor) || c.id.includes(valor));
}

function buscarPorSemana(inicio, fim) {
    const clientes = listarTodosClientes();
    return clientes.filter(c => {
        const data = new Date(c.data.split("_")[0].split("/").reverse().join("-"));
        const ini = new Date(inicio.split("/").reverse().join("-"));
        const fimD = new Date(fim.split("/").reverse().join("-"));
        return data >= ini && data <= fimD;
    });
}
