import { getPortfolio } from './portfolioManager.mjs';

// Function to render the portfolio UI
export function renderPortfolio() {
  const portfolioContainer = document.getElementById('portfolio-container');
  const portfolio = getPortfolio();

  portfolioContainer.innerHTML = ''; // Clear the container

  // Loop through each cryptocurrency in the portfolio
  portfolio.forEach(crypto => {
    const cryptoElement = document.createElement('div');
    cryptoElement.className = 'portfolio-item';
    cryptoElement.innerHTML = `
      <span>${crypto.name}</span>
      <span>${crypto.quantity.toFixed(2)}</span>
    `;

    // Add the item to the container
    portfolioContainer.appendChild(cryptoElement);
  });
}
