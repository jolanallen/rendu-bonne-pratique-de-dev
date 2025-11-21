const amountInput = document.querySelector('#order-amount');
const shippingSelect = document.querySelector('#shipping-type');
const calcButton = document.querySelector('#calc-btn');
const resultEl = document.querySelector('#result');

function formatPrice(value) {
  return value.toFixed(2).replace('.', ',') + ' €';
}

const shippingStrategies = {
  standard: (orderAmount) => {
    if (orderAmount >= 50) {
      return 0;
    } else {
      return 4.99;
    }
  },
  express: (orderAmount) => {
    if (orderAmount >= 100) {
      return 0;
    } else {
      return 9.99;
    }
  },
  pickup: (orderAmount) => {
    if (orderAmount >= 30) {
      return 0;
    } else {
      return 2.99;
    }
  },
};

function calculateShippingCost(type, orderAmount) {
  const strategy = shippingStrategies[type];

  if (!strategy) {
    return 0;
  }

  return strategy(orderAmount);
}

calcButton.addEventListener('click', () => {
  const type = shippingSelect.value;
  const amount = Number(amountInput.value) || 0;

  const shippingCost = calculateShippingCost(type, amount);
  resultEl.textContent =
    'Frais de livraison : ' + formatPrice(shippingCost);
});











