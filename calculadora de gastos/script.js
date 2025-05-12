const form = document.getElementById('expense-form');
const amountInput = document.getElementById('amount');
const descriptionInput = document.getElementById('description');
const categoryInput = document.getElementById('category');
const list = document.getElementById('expense-list');
const totalDisplay = document.getElementById('total');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function renderExpenses() {
  list.innerHTML = '';
  let total = 0;

  expenses.forEach((expense, index) => {
    total += parseFloat(expense.amount);

    const li = document.createElement('li');
    li.innerHTML = `
      <span>${expense.category}: ${expense.description} - R$ ${parseFloat(expense.amount).toFixed(2)}</span>
      <button onclick="removeExpense(${index})">❌</button>
    `;
    list.appendChild(li);
  });

  totalDisplay.textContent = `Total: R$ ${total.toFixed(2)}`;
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function removeExpense(index) {
  expenses.splice(index, 1);
  renderExpenses();
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

renderExpenses();
