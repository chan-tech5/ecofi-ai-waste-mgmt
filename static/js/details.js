const apiKeyWeatherAPI = 'b1fab2921c2a4edaa6f80559232412'; // Replace with your actual WeatherAPI key

// Get query parameters from URL
const urlParams = new URLSearchParams(window.location.search);
const lat = parseFloat(urlParams.get('lat'));
const lng = parseFloat(urlParams.get('lng'));

//  Check if latitude and longitude are correctly retrieved
console.log('Latitude:', lat);
console.log('Longitude:', lng);

// Initialize the map
const map = L.map('map').setView([lat, lng], 10);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add marker for selected location
L.marker([lat, lng]).addTo(map)
    .bindPopup(`Selected location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`)
    .openPopup();

fetchPlaceName(lat, lng);

// Fetch data for the location
fetchData(lat, lng);

async function fetchPlaceName(lat, lng) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        if (!response.ok) {
            throw new Error('Failed to fetch place name');
        }
        const data = await response.json();
        const placeName = data.display_name;
        
        document.getElementById('placeName').innerText = `Place: ${placeName}`;
    } catch (error) {
        console.error('Error fetching place name:', error);
        document.getElementById('placeName').innerText = 'Place: Unknown';
    }
}

async function fetchData(lat, lng) {
    try {
        await fetchWeatherData(lat, lng);
        await fetchEarthquakeData(lat, lng);
        await fetchElevationData(lat, lng);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchWeatherData(lat, lng) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKeyWeatherAPI}&q=${lat},${lng}&days=3`);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        console.log('Weather Data:', data);
        displayWeatherData(data);
        displayRiskData(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weatherData').innerHTML = `<p>Error fetching weather data. Please try again.</p>`;
        document.getElementById('riskData').innerHTML = `<p>Error fetching risk data. Please try again.</p>`;
    }
}

function displayWeatherData(data) {
    const forecasts = data.forecast.forecastday;
    const weatherHTML = forecasts.map(day => {
        const date = new Date(day.date).toLocaleDateString();

        return `
            <div class="weather-day">
                <h4>${date}</h4>
                <p>Temperature: ${day.day.avgtemp_c}°C</p>
                <p>Weather: ${day.day.condition.text}</p>
                <p>Humidity: ${day.day.avghumidity}%</p>
                <p>Wind Speed: ${day.day.maxwind_kph} kph</p>
                <p>Rain Rate: ${day.day.totalprecip_mm} mm</p>
            </div>
        `;
    }).join('');

    document.getElementById('weatherData').innerHTML = weatherHTML;
}

function displayRiskData(data) {
    const forecasts = data.forecast.forecastday;
    const riskData = forecasts.map(day => {
        const date = new Date(day.date).toLocaleDateString();
        const rainAmount = day.day.totalprecip_mm;

        const floodRisk = rainAmount > 50 ? 3 : rainAmount > 20 ? 2 : 1;
        const heavyRainRisk = rainAmount > 20 ? 3 : 1;
        const tsunamiRisk = isNearWaterBody(lat, lng) ? 2 : 1;

        const elevation = document.getElementById('elevationData').getAttribute('data-elevation');
        const landslideRisk = calculateLandslideRisk(elevation, rainAmount);

        return { date, floodRisk, heavyRainRisk, tsunamiRisk, landslideRisk, rainAmount };
    });

    displayGraph(riskData);

    const riskHTML = riskData.map(risk => {
        return `
            <div class="risk-day">
                <h4>${risk.date}</h4>
                <p>Rain Amount: ${risk.rainAmount} mm</p>
                <p>Flood Risk: ${risk.floodRisk === 3 ? "High" : risk.floodRisk === 2 ? "Moderate" : "Low"}</p>
                <p>Heavy Rain Risk: ${risk.heavyRainRisk === 3 ? "High" : "Low"}</p>
                <p>Tsunami Risk: ${risk.tsunamiRisk === 2 ? "Possible" : "None"}</p>
                <p>Landslide Risk: ${risk.landslideRisk === 3 ? "High" : risk.landslideRisk === 2 ? "Moderate" : "Low"}</p>
            </div>
        `;
    }).join('');

    document.getElementById('riskData').innerHTML = riskHTML;
}

function calculateLandslideRisk(elevation, rainAmount) {
    if (!elevation) return 1;

    if (elevation > 1000 && rainAmount > 50) {
        return 3;
    } else if (elevation > 500 && rainAmount > 20) {
        return 2;
    } else {
        return 1;
    }
}

function isNearWaterBody(lat, lng) {
    const waterBodyRanges = [
        { latMin: 84, latMax: 60, lngMin: -80, lngMax: 20 },
        { latMin: 65, latMax: 65, lngMin: 120, lngMax: -80 },
        { latMin: 30, latMax: 60, lngMin: 20, lngMax: 120 },
        { latMin: 65, latMax: 90, lngMin: -180, lngMax: 180 },
        { latMin: 5, latMax: 20, lngMin: 92, lngMax: 100 }
    ];

    return waterBodyRanges.some(range => lat >= range.latMin && lat <= range.latMax && lng >= range.lngMin && lng <= range.lngMax);
}

async function fetchEarthquakeData(lat, lng) {
    const maxRadiusKm = 100;
    try {
        const response = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lng}&maxradiuskm=${maxRadiusKm}`);
        if (!response.ok) {
            throw new Error('Failed to fetch earthquake data');
        }
        const data = await response.json();
        console.log('Earthquake Data:', data);
        displayEarthquakeData(data);
    } catch (error) {
        console.error('Error fetching earthquake data:', error);
        document.getElementById('earthquakeData').innerHTML = `<p>Error fetching earthquake data. Please try again.</p>`;
    }
}

function displayEarthquakeData(data) {
    if (data.features.length === 0) {
        document.getElementById('earthquakeData').innerHTML = `<p>No recent earthquakes found within 100 km.</p>`;
        return;
    }

    const earthquakes = data.features.map(eq => {
        const { place, mag, time } = eq.properties;
        const date = new Date(time).toLocaleString();
        return `<p>Location: ${place} | Magnitude: ${mag} | Time: ${date}</p>`;
    }).join('');

    document.getElementById('earthquakeData').innerHTML = `<h3>Recent Earthquakes (within 100 km)</h3>${earthquakes}`;
}

async function fetchElevationData(lat, lng) {
    try {
        const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`);
        if (!response.ok) {
            throw new Error('Failed to fetch elevation data');
        }
        const data = await response.json();
        console.log('Elevation Data:', data);
        displayElevationData(data);
    } catch (error) {
        console.error('Error fetching elevation data:', error);
        document.getElementById('elevationData').innerHTML = `<p>Error fetching elevation data. Please try again.</p>`;
    }
}

function displayElevationData(data) {
    const elevation = data.results[0].elevation;
    document.getElementById('elevationData').innerHTML = `<p>Elevation: ${elevation} meters</p>`;
    document.getElementById('elevationData').setAttribute('data-elevation', elevation);
}

function displayGraph(riskData) {
    const labels = riskData.map(risk => risk.date);
    const floodRisks = riskData.map(risk => risk.floodRisk);
    const heavyRainRisks = riskData.map(risk => risk.heavyRainRisk);
    const tsunamiRisks = riskData.map(risk => risk.tsunamiRisk);
    const landslideRisks = riskData.map(risk => risk.landslideRisk);

    const ctx = document.getElementById('riskChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Flood Risk',
                    data: floodRisks,
                    backgroundColor: 'rgba(60, 102, 192, 1)', // Light cyan for dark background
                    borderColor: 'rgba(75, 192, 192, 1)',       // Cyan border
                    borderWidth: 1
                },
                {
                    label: 'Heavy Rain Risk',
                    data: heavyRainRisks,
                    backgroundColor: 'rgba(255, 159, 64, 1)',  // Light orange for dark background
                    borderColor: 'rgba(255, 159, 64, 1)',         // Orange border
                    borderWidth: 1
                },
                {
                    label: 'Tsunami Risk',
                    data: tsunamiRisks,
                    backgroundColor: 'rgba(54, 162, 235, 1)',  // Light blue for dark background
                    borderColor: 'rgba(54, 162, 235, 1)',         // Blue border
                    borderWidth: 1
                },
                {
                    label: 'Landslide Risk',
                    data: landslideRisks,
                    backgroundColor: 'rgba(153, 102, 255, 1)', // Light purple for dark background
                    borderColor: 'rgba(153, 102, 255, 1)',        // Purple border
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#ffffff',  // White tick labels
                    }
                },
                x: {
                    ticks: {
                        color: '#ffffff',  // White tick labels
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'  // White legend labels
                    }
                }
            }
        }
    });
}