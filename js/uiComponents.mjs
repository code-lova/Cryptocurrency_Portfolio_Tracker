import { getPortfolio, savePortfolio } from "./utils.mjs";
import { updateTotalValue } from "./portfolioManager.mjs";


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

// Function to render the portfolio in the UI
export function renderPortfolio() {
  const portfolio = getPortfolio();
  const portfolioContainer = document.getElementById("portfolio-container");

  portfolioContainer.innerHTML = ""; // Clear the container before rendering

  // If the portfolio is empty
  if (portfolio.length === 0) {
    portfolioContainer.innerHTML = "<p>Your portfolio is empty</p>";
    return;
  }

  // Render each cryptocurrency in the portfolio
  portfolio.forEach((crypto) => {
    const cryptoItem = document.createElement("div");
    cryptoItem.className = "portfolio-item";
    cryptoItem.innerHTML = `
        <img src="${crypto.image}" alt="${crypto.name}" class="crypto-image" />
        <p class="crypto-info"">${crypto.name}: ${crypto.quantity}</p>
        <button class="remove-btn" data-name="${crypto.name}">Remove</button>
      `;
    portfolioContainer.appendChild(cryptoItem);
  });

  // Attach event listeners for remove buttons
  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const name = event.target.getAttribute("data-name");
      removeCrypto(name); // Call the function from portfolioManager to remove
      renderPortfolio(); // Re-render the portfolio after removal
      updateTotalValue(); // Update the total value after removal
    });
  });
}
