import {
  addCrypto,
  updateTotalValue
} from "./portfolioManager.mjs";
import { fetchCryptoList, fetchCryptoPrice } from "./apiService.mjs";
import { renderPortfolio } from "./uiComponents.mjs";

document.addEventListener("DOMContentLoaded", () => {
  // Render the portfolio on page load
  renderPortfolio();
  updateTotalValue();

  // Handle the form submission to add a cryptocurrency
  document
    .getElementById("crypto-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const cryptoName = document.getElementById("crypto-name").value;
      const cryptoQuantity = parseFloat(
        document.getElementById("crypto-quantity").value
      );

      const cryptoList = await fetchCryptoList(cryptoName.toLowerCase());
      const selectedCrypto = cryptoList.find(crypto => crypto.name.toLowerCase() === cryptoName.toLowerCase());
    
      if (selectedCrypto) {

        // Fetch the current price of the selected cryptocurrency
        const cryptoPrice = await fetchCryptoPrice(selectedCrypto.id);
        if(cryptoPrice){
          addCrypto(selectedCrypto.name, cryptoQuantity, selectedCrypto.image); 
          renderPortfolio(); 
          updateTotalValue();
          alert("Your portfolio has been updated");

          //clear the input field
          document.getElementById("crypto-name").value = "";
          document.getElementById("crypto-quantity").value = "";
        }else {
          // If price is not available, alert the user
          alert("Selected cryptocurrency price is unavailable.");
        }
      } else {
        alert("Cryptocurrency not found or image unavailable.");
      }
    });

  // Add event listener for searching cryptocurrencies
  const cryptoInput = document.getElementById("crypto-name");
  const dropdown = document.getElementById('crypto-dropdown');

  cryptoInput.addEventListener("input", async (event) => {
    const query = event.target.value;
    
    // If input is cleared, hide the dropdown
    if (query.length === 0) {
        dropdown.innerHTML = '';
        dropdown.style.display = 'none';
    } else if (query.length > 2) {
        const cryptoList = await fetchCryptoList(query);
        displayCryptoDropdown(cryptoList);
    }
  });

  // Hide the dropdown when clicking outside the input field
  document.addEventListener('click', (event) => {
    const isClickInsideInput = cryptoInput.contains(event.target);
    const isClickInsideDropdown = dropdown.contains(event.target);

    if (!isClickInsideInput && !isClickInsideDropdown) {
      dropdown.style.display = 'none'; // Hide the dropdown
    }
  });

  // Show dropdown when the user clicks back into the input
  cryptoInput.addEventListener('focus', () => {
    if (cryptoInput.value.length > 2) {
      dropdown.style.display = 'block';
    }
  });
});

// Function to display the dropdown for searching cryptocurrencies
function displayCryptoDropdown(cryptoList) {
    const dropdown = document.getElementById('crypto-dropdown');
    dropdown.innerHTML = ''; // Clear the dropdown
  
    if (cryptoList.length > 0) {
      cryptoList.forEach(crypto => {
        const option = document.createElement('div');
        option.classList.add('dropdown-item');
        option.textContent = `${crypto.name} (${crypto.symbol.toUpperCase()})`;
        option.dataset.id = crypto.id;
        option.addEventListener('click', () => {
          document.getElementById('crypto-name').value = crypto.name;
          dropdown.innerHTML = ''; // Clear dropdown after selection
          dropdown.style.display = 'none';
        });
        dropdown.appendChild(option);
      });
      dropdown.style.display = 'block'; // Show the dropdown
    } else {
      dropdown.style.display = 'none'; // Hide the dropdown if no results
    }
  }