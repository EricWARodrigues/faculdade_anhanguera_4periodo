// Conectar com o banco de dados e levar as informações dos carros no banco de dados, e consumir
let cars = [];

async function loadCars() {
  try {
    const response = await fetch("http://localhost:3000/cars");
    cars = await response.json();

    renderCars(cars);
  } catch (error) {
    console.error("Erro ao buscar carros:", error);
  }
}

const carsGrid = document.getElementById("carsGrid");
const categorySelect = document.getElementById("categorySelect");
const searchInput = document.getElementById("searchInput");

// Menu mobile
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

// Modal
const modal = document.getElementById("modal");
const modalOverlay = document.getElementById("modalOverlay");
const closeModalBtn = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const daysInput = document.getElementById("daysInput");
const insuranceSelect = document.getElementById("insuranceSelect");
const totalPrice = document.getElementById("totalPrice");
const confirmReserve = document.getElementById("confirmReserve");

let selectedCar = null;

function moneyBR(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function renderCars(list) {
  carsGrid.innerHTML = "";

  if (list.length === 0) {
    carsGrid.innerHTML = `<p class="muted">Nenhum carro encontrado com esses filtros.</p>`;
    return;
  }

  list.forEach((car) => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <div class="card__top">
        <div>
          <strong>${car.name}</strong>
          <div class="muted small">Diária a partir de</div>
        </div>
        <span class="tag">${car.category.toUpperCase()}</span>
      </div>

      <div class="card__body">
        <div class="price">
          <span class="muted">Preço</span>
          <strong>${moneyBR(car.pricePerDay)}</strong>
        </div>

        <div class="specs">
          ${car.specs.map(s => `<span class="spec">${s}</span>`).join("")}
        </div>

        <button class="btn btn--primary" data-id="${car.id}">
          Reservar
        </button>
      </div>
    `;

    carsGrid.appendChild(card);
  });

  // bind nos botões
  carsGrid.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => openModal(Number(btn.dataset.id)));
  });
}

// MODAL
function openModal(carId) {
  selectedCar = cars.find((c) => c.id === carId);
  if (!selectedCar) return;

  modalTitle.textContent = `Reservar: ${selectedCar.name}`;
  modalDesc.textContent = `Diária: ${moneyBR(selectedCar.pricePerDay)}. Ajuste dias e seguro para simular o total.`;

  daysInput.value = 1;
  insuranceSelect.value = "0";
  updateTotal();

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  selectedCar = null;
}

function updateTotal() {
  if (!selectedCar) return;

  const days = Math.max(1, Number(daysInput.value || 1));
  const insurance = Number(insuranceSelect.value || 0);

  const total = (selectedCar.pricePerDay + insurance) * days;
  totalPrice.textContent = moneyBR(total);
}

// MENU MOBILE
navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});

// FECHAR MENU ao clicar em um link (mobile)
nav.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// filtros
function applyFilters() {
  const cat = categorySelect.value;
  const term = searchInput.value.trim().toLowerCase();

  const filtered = cars.filter(car => {
    const matchCat = cat === "all" || car.category === cat;

    const matchTerm =
      car.name.toLowerCase().includes(term) ||
      car.specs.some(spec => spec.toLowerCase().includes(term));

    return matchCat && matchTerm;
  });

  renderCars(filtered);
}

categorySelect.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

// modal events
modalOverlay.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);
daysInput.addEventListener("input", updateTotal);
insuranceSelect.addEventListener("change", updateTotal);

confirmReserve.addEventListener("click", () => {
  if (!selectedCar) return;
  alert(`Reserva simulada: ${selectedCar.name} — Total ${totalPrice.textContent}`);
  closeModal();
});

let categories = [];

async function loadCategories() {
  try {
    const response = await fetch("http://localhost:3000/categories");
    categories = await response.json();

    populateCategories();
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
  }
}

function populateCategories() {
  categorySelect.innerHTML = `<option value="all">Todas</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.name;
    option.textContent = cat.name.toUpperCase();
    categorySelect.appendChild(option);
  });
}

// init
loadCars();
loadCategories();