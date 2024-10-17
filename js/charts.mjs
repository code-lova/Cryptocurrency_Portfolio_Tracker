// charts.mjs
import Chart from 'chart.js/auto';

export function drawPriceChart(prices) {
  const ctx = document.getElementById('price-chart').getContext('2d');
  const labels = prices.map(price => new Date(price[0]).toLocaleDateString());
  const data = prices.map(price => price[1]);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Price History',
        data,
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });
}