import { getPortfolio, savePortfolio } from './utils.mjs';

// Function to add a cryptocurrency to the portfolio
export function addCrypto(name, quantity) {
  const portfolio = getPortfolio();
  const existingCrypto = portfolio.find(crypto => crypto.name === name);

  if (existingCrypto) {
    // If the cryptocurrency already exists, update the quantity
    existingCrypto.quantity += quantity;
  } else {
    // Otherwise, add a new cryptocurrency
    portfolio.push({ name, quantity });
  }

  // Save the updated portfolio back to localStorage
  savePortfolio(portfolio);

   // Update the displayed total value
   updateTotalValue();
}

// Function to remove a cryptocurrency from the portfolio
export function removeCrypto(name) {
  let portfolio = getPortfolio();
  portfolio = portfolio.filter(crypto => crypto.name !== name);

  // Save the updated portfolio back to localStorage
  savePortfolio(portfolio);
  // Update the displayed portfolio and total value after removing
  renderPortfolio();
  updateTotalValue();
}

// Function to get the total value of the portfolio
export function getTotalValue() {
  const portfolio = getPortfolio();
  let totalValue = 0;

  // Simulate value as quantity * price of 1 (this will be replaced by actual API data)
  portfolio.forEach(crypto => {
    totalValue += crypto.quantity * 1; // Dummy price for now
  });

  return totalValue;
}

// Function to update the displayed total value in the UI
export function updateTotalValue() {
    const totalValue = getTotalValue();
    document.getElementById('portfolio-value').innerText = totalValue.toFixed(2);
}


// Function to render the portfolio in the UI
export function renderPortfolio() {
    const portfolio = getPortfolio();
    const portfolioContainer = document.getElementById('portfolio-container');
  
    portfolioContainer.innerHTML = ''; // Clear the container before rendering
  
    // If the portfolio is empty
    if (portfolio.length === 0) {
      portfolioContainer.innerHTML = '<p>Your portfolio is empty</p>';
      return;
    }
  
    // Render each cryptocurrency in the portfolio
    portfolio.forEach(crypto => {
      const cryptoItem = document.createElement('div');
      cryptoItem.className = 'portfolio-item';
      cryptoItem.innerHTML = `
        <p>${crypto.name}: ${crypto.quantity}</p>
        <button class="remove-btn" data-name="${crypto.name}">Remove</button>
      `;
      portfolioContainer.appendChild(cryptoItem);
    });
  
    // Attach event listeners for remove buttons
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const name = event.target.getAttribute('data-name');
        removeCrypto(name);
      });
    });
}
