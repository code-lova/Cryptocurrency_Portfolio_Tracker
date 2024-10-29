// charts.mjs
import Chart from 'chart.js/auto';


let chartInstance = null; // Variable to store the chart instance

export function drawPriceChart(prices) {

  if (!prices || prices.length === 0) {
    console.error('No price data available to draw the chart.');
    return; // Exit the function if no data is available
  }

  const ctx = document.getElementById('price-chart').getContext('2d');
  const labels = prices.map(price => new Date(price[0]).toLocaleDateString());
  const data = prices.map(price => price[1]);

  // If a chart already exists, destroy it before creating a new one
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Create a new chart instance and assign it to chartInstance
  // Create a new chart instance and assign it to chartInstance
  chartInstance = new Chart(ctx, {
    type: 'line', // Consider adding options for dynamic types
    data: {
      labels,
      datasets: [{
        label: 'Price History',
        data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Adds fill color under the line
        borderWidth: 2, // Thicker line for better visibility
        pointRadius: 2, // Smaller points on the line
        tension: 0.4, // Smooth curves
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Allows the chart to be responsive
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxHeight: 10,
            padding: 20,
          },
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return `Price: $${tooltipItem.raw.toFixed(2)}`; // Custom tooltip formatting
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date', // X-axis title
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10, // Limits number of ticks on x-axis
          },
        },
        y: {
          title: {
            display: true,
            text: 'Price ($)', // Y-axis title
          },
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return `$${value}`; // Formats y-axis ticks
            },
          },
        },
      },
    },
  });
}
