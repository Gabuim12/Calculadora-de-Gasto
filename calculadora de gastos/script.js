const form = document.getElementById("expense-form");
const list = document.getElementById("expense-list");
const totalDisplay = document.getElementById("total");
const saldoDisplay = document.getElementById("saldo-display");
const rendaInput = document.getElementById("renda");
const toggleTheme = document.getElementById("toggle-theme");

let despesas = [];
let renda = 0;
let grafico;

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const nome = document.getElementById("expense-name").value;
  const valor = parseFloat(document.getElementById("expense-value").value);
  const categoria = document.getElementById("expense-category").value;

  if (nome && !isNaN(valor)) {
    despesas.push({ nome, valor, categoria });
    form.reset();
    atualizarLista();
    atualizarGrafico();
  }
});

function atualizarLista(filtro = "todos") {
  list.innerHTML = "";
  const despesasFiltradas = filtro === "todos" ? despesas : despesas.filter(d => d.categoria === filtro);

  despesasFiltradas.forEach((despesa, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${despesa.nome} - R$ ${despesa.valor.toFixed(2)} 
      <button class="edit-btn" onclick="editarDespesa(${index})">✏️ Editar</button>
      <button onclick="removerGasto(${index})">❌</button>
    `;
    list.appendChild(li);
  });

  const total = despesas.reduce((acc, d) => acc + d.valor, 0);
  totalDisplay.innerText = `Total de Gastos: R$ ${total.toFixed(2)}`;
  atualizarSaldo();
}

function editarDespesa(index) {
  const novaDescricao = prompt("Novo nome do gasto:", despesas[index].nome);
  const novoValor = parseFloat(prompt("Novo valor (R$):", despesas[index].valor));
  if (!isNaN(novoValor) && novaDescricao.trim() !== "") {
    despesas[index].nome = novaDescricao;
    despesas[index].valor = novoValor;
    atualizarLista();
    atualizarGrafico();
  }
}

function removerGasto(index) {
  despesas.splice(index, 1);
  atualizarLista(document.getElementById("filter-category").value);
  atualizarGrafico();
}

function filtrarGastos() {
  const filtro = document.getElementById("filter-category").value;
  atualizarLista(filtro);
}

function calcularSaldo() {
  renda = parseFloat(rendaInput.value) || 0;
  atualizarSaldo();
}

function atualizarSaldo() {
  const total = despesas.reduce((acc, d) => acc + d.valor, 0);
  const saldo = renda - total;
  saldoDisplay.innerText = `Saldo: R$ ${saldo.toFixed(2)}`;
  saldoDisplay.style.color = saldo >= 0 ? "#28a745" : "#dc3545";
}

function atualizarGrafico() {
  const categorias = {};
  despesas.forEach(d => {
    categorias[d.categoria] = (categorias[d.categoria] || 0) + d.valor;
  });

  const labels = Object.keys(categorias);
  const data = Object.values(categorias);

  if (grafico) grafico.destroy();

  const ctx = document.getElementById("graficoGastos").getContext("2d");
  grafico = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        label: "Gastos por Categoria",
        data,
        backgroundColor: ["#ff6384", "#36a2eb"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleTheme.textContent = document.body.classList.contains("dark")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
});
