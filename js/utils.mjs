// Utility function to retrieve portfolio from localStorage
export function getPortfolio() {
    const portfolio = localStorage.getItem('portfolio');
    return portfolio ? JSON.parse(portfolio) : [];
}
  
// Utility function to save portfolio to localStorage
export function savePortfolio(portfolio) {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
}