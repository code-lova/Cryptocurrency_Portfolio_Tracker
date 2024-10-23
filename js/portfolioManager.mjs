import { getPortfolio, savePortfolio } from './utils.mjs';
import { fetchCryptoPrice } from "./apiService.mjs";


// Function to add a cryptocurrency to the portfolio
export function addCrypto(name, quantity, image) {
  const portfolio = getPortfolio();
  const existingCrypto = portfolio.find(crypto => crypto.name === name);

  if (existingCrypto) {
    // If the cryptocurrency already exists, update the quantity
    existingCrypto.quantity += quantity;
  } else {
    // Otherwise, add a new cryptocurrency at the top of the list
    portfolio.unshift({ name, quantity, image });
  }

  // Save the updated portfolio back to localStorage
  savePortfolio(portfolio);

   // Update the displayed total value
   updateTotalValue();
}

// Function to get the total number cryptocurrencies in the portfolio
export function getTotalAssets() {
  const portfolio = getPortfolio();
  return portfolio.length;
}

let cachedTotalValue = null;
// Function to get the total value of the portfolio
export async function getTotalValue() {
  const portfolio = getPortfolio();
  let totalValue = 0;

  // Loop through the portfolio and fetch the current price for each cryptocurrency
  for (const crypto of portfolio) {
    const currentPrice = await fetchCryptoPrice(crypto.name.toLowerCase());
    if (currentPrice) {
      totalValue += crypto.quantity * currentPrice;
    } else {
      console.error(`Price not found for ${crypto.name}`);
    }
  }

  return totalValue;
}

// Function to update the displayed total value in the UI
export async function updateTotalValue() {
  const totalValue = await getTotalValue();
  const totalAssets = getTotalAssets();
  const formattedValue = totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('portfolio-value').innerText = `${formattedValue}`;

  document.getElementById('total-asset').innerText = totalAssets;
}
