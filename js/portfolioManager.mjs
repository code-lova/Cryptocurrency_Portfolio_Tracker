import { getPortfolio, savePortfolio } from './utils.mjs';
import { fetchCryptoPrice, fetchHistoricalData } from "./apiService.mjs";
import { drawPriceChart } from "./charts.mjs";
import { renderPortfolio } from "./uiComponents.mjs";


// Function to add a cryptocurrency to the portfolio
export async function addCrypto(name, quantity, image) {
  const portfolio = getPortfolio();
  const existingCrypto = portfolio.find(crypto => crypto.name === name);

  
  try {
    // Fetch historical data and only fetch the price if it's a new crypto or quantity changes
    const historicalData = await fetchHistoricalData(name.toLowerCase(), 30);

    if (!historicalData || historicalData.length === 0) {
      alert(`Cannot add ${name}. Historical data is unavailable.`);
      return;
    }

    if (existingCrypto) {
      // Check if quantity has changed for existing crypto
      if (existingCrypto.quantity !== quantity) {
        // Fetch current price since quantity has changed
        const currentPrice = await fetchCryptoPrice(name.toLowerCase());
        if (!currentPrice) {
          alert(`Price data unavailable for ${name}`);
          return;
        }
        existingCrypto.price = currentPrice; // Update price in portfolio
      }
      // Update quantity and historical data for existing crypto
      existingCrypto.quantity += quantity;
      existingCrypto.historicalData = historicalData;
    } else {
      // If the cryptocurrency is new, fetch both price and add it to portfolio
      const currentPrice = await fetchCryptoPrice(name.toLowerCase());
      if (!currentPrice) {
        alert(`Cannot add ${name}. Price data is unavailable.`);
        return;
      }
      portfolio.unshift({ name, quantity, image, price: currentPrice, historicalData });
    }

    // Save the updated portfolio back to localStorage
    savePortfolio(portfolio);

    // Immediately render the updated portfolio and update the displayed total value
    renderPortfolio();
    await updateTotalValue();

    // Draw the chart for the new or updated crypto if historical data exists
    drawPriceChart(historicalData);

  } catch (error) {
    console.error(`Failed to add ${name} due to data fetch error:`, error);
  }

  
}

// Function to get the total number cryptocurrencies in the portfolio
export function getTotalAssets() {
  const portfolio = getPortfolio();
  return portfolio.length;
}



// Function to get the total value of the portfolio
export async function getTotalValue() {
  const portfolio = getPortfolio();
  let totalValue = 0;

  // Loop through the portfolio and fetch the current price for each cryptocurrency
  for (const crypto of portfolio) {
    if (crypto.price) {
      totalValue += crypto.quantity * crypto.price;
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
