const products = [
  { name: 'Clavier gaming', price: 79, inStock: true, onSale: false },
  { name: 'Souris sans fil', price: 49, inStock: true, onSale: true },
  { name: 'Écran 27"', price: 249, inStock: false, onSale: true },
  { name: 'Casque audio', price: 129, inStock: true, onSale: false }
];

// Sélection des éléments DOM
const elements = {
  list: document.querySelector('#products-list'),
  emptyState: document.querySelector('#empty-state'),
  buttons: {
    showAll: document.querySelector('#show-all-btn'),
    inStock: document.querySelector('#in-stock-btn'),
    onSale: document.querySelector('#on-sale-btn')
  }
};

// Formatage du prix (Bonne pratique pour l'internationalisation)
const currencyFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR'
});

/**
 * Crée un élément DOM pour un produit
 * @param {Object} product
 * @returns {HTMLElement}
 */
function createProductCard(product) {
  const li = document.createElement('li');
  li.className = 'product-card';

  const h3 = document.createElement('h3');
  h3.textContent = product.name; // Plus sécurisé que innerHTML

  const p = document.createElement('p');
  p.textContent = `Prix : ${currencyFormatter.format(product.price)}`;

  li.append(h3, p);
  return li;
}

/**
 * Affiche la liste des produits ou un message d'état vide
 * @param {Array} items - La liste des produits filtrés
 * @param {String} emptyMsg - Le message à afficher si la liste est vide
 */
function renderProducts(items, emptyMsg) {
  // Reset de la liste
  elements.list.innerHTML = '';

  // Gestion de l'état vide
  if (items.length === 0) {
    elements.emptyState.textContent = emptyMsg;
    elements.emptyState.style.display = 'block';
    return;
  }

  elements.emptyState.style.display = 'none';

  // Optimisation : Utilisation d'un Fragment pour minimiser les reflows du navigateur
  const fragment = document.createDocumentFragment();

  items.forEach(product => {
    const card = createProductCard(product);
    fragment.appendChild(card);
  });

  // Une seule injection dans le DOM réel
  elements.list.appendChild(fragment);
}

// --- Gestionnaires d'événements ---

elements.buttons.showAll.addEventListener('click', () => {
  renderProducts(products, 'Aucun produit à afficher.');
});

elements.buttons.inStock.addEventListener('click', () => {
  const filtered = products.filter(p => p.inStock);
  renderProducts(filtered, 'Aucun produit en stock.');
});

elements.buttons.onSale.addEventListener('click', () => {
  const filtered = products.filter(p => p.onSale);
  renderProducts(filtered, 'Aucun produit en promotion.');
});
