let budgets = JSON.parse(localStorage.getItem("budgets")) || {};
let currentBudget = null;
let selectedItem = null;
let isSelectingMultiple = false;
let selectedItems = [];

const budgetList = document.getElementById("budget-list");
const itemList = document.getElementById("item-list");
const contextMenu = document.getElementById("context-menu");
const transferMenu = document.getElementById("transfer-menu");
const createBudgetButton = document.getElementById("create-budget-btn");
const addItemButton = document.getElementById("add-item-btn");
const saveAndBackButton = document.getElementById("save-and-back-btn");
const itemNameInput = document.getElementById("item-name");
const itemQuantityInput = document.getElementById("item-quantity");

// Carregar orçamentos na lista
function loadBudgets() {
  budgetList.innerHTML = "";
  Object.keys(budgets).forEach((key) => {
    const li = document.createElement("li");
    li.className = "budget-item";

    const span = document.createElement("span");
    span.textContent = `Orçamento ${key}`;
    span.style.cursor = "pointer";
    span.addEventListener("click", () => openBudget(key));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Apagar";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteBudget(key);
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    budgetList.appendChild(li);
  });
}

// Validar e salvar alterações
function validateAndSaveChanges() {
  if (!saveBudget()) {
    alert("Erro ao salvar os dados. Verifique os campos e tente novamente.");
    return false;
  }
  return true;
}

// Abrir um orçamento
function openBudget(name) {
  if (currentBudget && !validateAndSaveChanges()) {
    return;
  }
  currentBudget = name;
  document.getElementById("current-budget-name").textContent = name;
  loadItems();
  document.getElementById("budget-list-screen").style.display = "none";
  document.getElementById("budget-edit-screen").style.display = "block";
}

// Salvar dados do orçamento atual
function saveBudget() {
  if (currentBudget) {
    try {
      localStorage.setItem("budgets", JSON.stringify(budgets));
      return true;
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      return false;
    }
  }
  return false;
}

// Verificar e configurar o evento Salvar e Voltar
if (saveAndBackButton) {
  saveAndBackButton.addEventListener("click", function () {
    if (!validateAndSaveChanges()) {
      return;
    }
    document.getElementById("budget-edit-screen").style.display = "none";
    document.getElementById("budget-list-screen").style.display = "block";
  });
} else {
  console.warn("Botão 'Salvar e Voltar' não encontrado no DOM.");
}

// Carregar itens do orçamento atual
function loadItems() {
  itemList.innerHTML = "";
  if (budgets[currentBudget]) {
    budgets[currentBudget].forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - ${item.quantity}`;
      itemList.appendChild(li);
    });
  }
}

// Adicionar novo orçamento
createBudgetButton.addEventListener("click", () => {
  const budgetName = prompt("Digite o nome do novo orçamento:");
  if (!budgetName || !budgetName.trim()) {
    alert("O nome do orçamento não pode estar vazio ou apenas com espaços.");
    return;
  }
  if (budgets[budgetName]) {
    alert("Já existe um orçamento com este nome.");
    return;
  }
  budgets[budgetName] = [];
  localStorage.setItem("budgets", JSON.stringify(budgets));
  openBudget(budgetName);
});

// Apagar um orçamento
function deleteBudget(name) {
  if (confirm(`Tem certeza de que deseja apagar o orçamento '${name}'?`)) {
    delete budgets[name];
    localStorage.setItem("budgets", JSON.stringify(budgets));
    loadBudgets();
    alert("Orçamento apagado com sucesso!");
  }
}

// Adicionar item ao orçamento
addItemButton.addEventListener("click", function () {
  const itemName = itemNameInput.value.trim();
  const itemQuantity = parseInt(itemQuantityInput.value, 10);

  if (!itemName || isNaN(itemQuantity) || itemQuantity <= 0) {
    alert("Por favor, insira um nome e quantidade válidos.");
    return;
  }

  if (!currentBudget) {
    alert("Nenhum orçamento está selecionado.");
    return;
  }

  if (!budgets[currentBudget]) budgets[currentBudget] = [];
  budgets[currentBudget].push({ name: itemName, quantity: itemQuantity });

  localStorage.setItem("budgets", JSON.stringify(budgets));
  loadItems();

  itemNameInput.value = "";
  itemQuantityInput.value = "";

  alert("Item adicionado com sucesso!");
});

// Inicializar a lista de orçamentos ao carregar a página
loadBudgets();
