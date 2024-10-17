const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export async function fetchCryptoPrice(cryptoName) {
    const url = `${API_BASE_URL}/simple/price?ids=${cryptoName}&vs_currencies=usd`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching price for ${cryptoName}: ${response.statusText}`);
        }
        const data = await response.json();
        return data[cryptoName]?.usd || null; // Return the price in USD or null if not found
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function fetchHistoricalData(cryptoName, days = 30) {
    const url = `${API_BASE_URL}/coins/${cryptoName}/market_chart?vs_currency=usd&days=${days}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching historical data for ${cryptoName}: ${response.statusText}`);
        }
        const data = await response.json();
        return data.prices; // Return price data for the specified days
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Fetch a list of cryptocurrencies based on user input (search)
export async function fetchCryptoList(query) {
    const url = `${API_BASE_URL}/search?query=${query}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching crypto list: ${response.statusText}`);
        }
        const data = await response.json();
        return data.coins.map(coin => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}
