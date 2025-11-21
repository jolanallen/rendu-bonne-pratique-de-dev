const amountInput = document.querySelector('#order-amount');
const shippingSelect = document.querySelector('#shipping-type');
const calcButton = document.querySelector('#calc-btn');
const resultEl = document.querySelector('#result');

function formatPrice(value) {
  return value.toFixed(2).replace('.', ',') + ' €';
}

// Version non OCP : if / else partout
function calculateShippingCost(type, orderAmount) {
  if (type === 'standard') {
    if (orderAmount >= 50) {
      return 0;
    } else {
      return 4.99;
    }
  } else if (type === 'express') {
    if (orderAmount >= 100) {
      return 0;
    } else {
      return 9.99;
    }
  } else if (type === 'pickup') {
    if (orderAmount >= 30) {
      return 0;
    } else {
      return 2.99;
    }
  } else {
    return 0;
  }
}

calcButton.addEventListener('click', () => {
  const type = shippingSelect.value;
  const amount = Number(amountInput.value) || 0;

  const shippingCost = calculateShippingCost(type, amount);
  resultEl.textContent =
    'Frais de livraison : ' + formatPrice(shippingCost);
});
