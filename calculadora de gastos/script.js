const form = document.getElementById('expense-form');
const amountInput = document.getElementById('amount');
const descriptionInput = document.getElementById('description');
const categoryInput = document.getElementById('category');
const list = document.getElementById('expense-list');
const totalDisplay = document.getElementById('total');
const summaryDisplay = document.getElementById('summary');
const filterSelect = document.getElementById('filter-category');
const toggleTheme = document.getElementById('toggle-theme');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function renderExpenses() {
  list.innerHTML = '';
  const selectedCategory = filterSelect.value;
  let total = 0;
  let summary = {};

  expenses.forEach((expense, index) => {
    if (selectedCategory !== "Todas" && expense.category !== selectedCategory) return;

    total += parseFloat(expense.amount);
    summary[expense.category] = (summary[expense.category] || 0) + parseFloat(expense.amount);

    const li = document.createElement('li');
    li.innerHTML = `
      <span>${expense.category}: ${expense.description} - R$ ${parseFloat(expense.amount).toFixed(2)}</span>
      <button onclick="removeExpense(${index})">❌</button>
    `;
    list.appendChild(li);
  });

  totalDisplay.textContent = `Total: R$ ${total.toFixed(2)}`;

  let summaryText = Object.entries(summary).map(
    ([cat, val]) => `${cat}: R$ ${val.toFixed(2)}`
  ).join(' | ');
  summaryDisplay.textContent = summaryText || 'Sem gastos nesta categoria.';

  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function removeExpense(index) {
  if (confirm('Deseja remover este gasto?')) {
    expenses.splice(index, 1);
    renderExpenses();
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const expense = {
    amount: amountInput.value,
    description: descriptionInput.value,
    category: categoryInput.value
  };

  expenses.push(expense);
  amountInput.value = '';
  descriptionInput.value = '';
  categoryInput.selectedIndex = 0;

  renderExpenses();
});

filterSelect.addEventListener('change', renderExpenses);

toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  toggleTheme.textContent = document.body.classList.contains('dark') ? '☀️ Modo Claro' : '🌙 Modo Escuro';
});

renderExpenses();
