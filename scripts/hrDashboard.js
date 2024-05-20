function showTab(tabId, event) {
    // Prevent the default anchor click behavior
    event.preventDefault();

    // Hide all tab contents
    var tabs = document.querySelectorAll('.tabContent');
    tabs.forEach(function (tab) {
        tab.style.display = 'none';
        tab.classList.remove('active');
    });

    // Remove active class from all tab links
    var tabLinks = document.querySelectorAll('.trafficNav-item');
    tabLinks.forEach(function (link) {
        link.classList.remove('active');
    });

    // Show the correct tab content and highlight the tab
    document.getElementById(tabId).style.display = 'block';
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.parentElement.classList.add('active');
}


// Google chart
// New Chart
async function fetchDataAndCreateCharts(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        // Initialize charts based on fetched data
        createChart('trafficChart1', 'line', data.monthly);
        createChart('trafficChart2', 'line', data.threeMonth);
        createChart('trafficChart3', 'line', data.sixMonth);
        createChart('trafficChart4', 'line', data.yearly);
        createChart('trafficChart5', 'line', data.allTime);
    } catch (error) {
        console.error('Failed to fetch or parse data:', error);
    }
}

function createChart(chartId, chartType, chartData) {
    console.log(chartId, chartData);
    var ctx = document.getElementById(chartId).getContext('2d');

    // Extracting data points from chartData
    const dataPoints = chartData.map(data => data.Order);

    // Calculate minimum and maximum values
    const minValue = Math.min(...dataPoints);
    const maxValue = Math.max(...dataPoints);
    console.log(chartId, 'minValue', minValue);
    console.log(chartId, 'maxValue', maxValue);

    // Calculate step size (using a simple heuristic of range divided by number of ticks)
    const range = maxValue - minValue;
    const stepSize = Math.ceil(range / 10); // Adjust number of ticks as needed
    console.log(chartId, 'range', range);
    console.log(chartId, 'stepSize', stepSize);

    return new Chart(ctx, {
        type: chartType,
        data: {
            labels: chartData.map(data => data.Month || data.Date || data.Period),
            datasets: [{
                data: dataPoints,
                backgroundColor: 'rgba(0, 123, 255, 0.3)',
                borderColor: '#3A5372',
                borderWidth: 5,
                pointBackgroundColor: 'rgba(0, 123, 255, 1)',
                pointRadius: 0,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        min: minValue,
                        max: maxValue,
                        stepSize: stepSize,
                        fontColor: '#86898B',
                        fontWeight: '500',
                        fontSize: 15
                    },
                    gridLines: {
                        drawBorder: true,
                        color: 'rgba(0, 0, 0, 0)',
                        zeroLineColor: "#000",
                        zeroLineWidth: 2
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: '#666',
                        fontSize: 11
                    },
                    gridLines: {
                        drawBorder: true,
                        color: 'rgba(0, 0, 0, 0)',
                        zeroLineColor: "#000",
                        zeroLineWidth: 2
                    }
                }]
            },
            legend: {
                display: false
            },
            elements: {
                line: {
                    tension: 0 // Disables bezier curves if preferred
                }
            }
        }
    });
}

// Fetch and create charts when the document is fully loaded
document.addEventListener('DOMContentLoaded', () => fetchDataAndCreateCharts('https://adityafunex.github.io/HrDashboard/json/userTraffic.json'));



// View perks 

document.getElementById('toggleButton').addEventListener('click', function (event) {
    event.preventDefault();
    const additionalRows = document.querySelectorAll('.additional');
    const isShowingMore = this.textContent.includes('Less');

    additionalRows.forEach(row => {
        row.style.display = isShowingMore ? 'none' : 'table-row';
    });

    this.textContent = isShowingMore ? 'View All' : 'View Less';
});

document.addEventListener('DOMContentLoaded', function () {
    fetch('https://adityafunex.github.io/HrDashboard/json/perks.json')
        .then(response => response.json())
        .then(data => createTableRows(data))
        .catch(error => console.error('Error loading the data:', error));
});

function createTableRows(data) {
    const tbody = document.getElementById('perksTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear existing rows if any
    console.log('Perks Data', data);
    data.forEach(perk => {
        const row = document.createElement('tr');
        row.className = perk.isAdditional ? 'additional' : '';
        row.style.display = perk.isAdditional ? 'none' : 'table-row'; // Hide additional rows initially

        const cellName = document.createElement('td');
        cellName.textContent = perk.perkName;
        const cellImpressions = document.createElement('td');
        cellImpressions.textContent = perk.impressions;

        row.appendChild(cellName);
        row.appendChild(cellImpressions);
        tbody.appendChild(row);
    });
}


// engagement js
async function fetchCityData() {
    try {
        const response = await fetch('https://adityafunex.github.io/HrDashboard/json/engagement.json'); // Adjust the URL as needed
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const cityData = await response.json();
        const total = Object.values(cityData).reduce((acc, { percentage }) => acc + percentage, 0);
        console.log('TotalCityValue', total);
        console.log('cityData', cityData);
        updateDropdown(cityData);
        drawChart(cityData, total);
        attachDropdownListener(cityData, total);
    } catch (error) {
        console.error('Error fetching city data:', error);
    }
}

function updateDropdown(cityData) {
    const dropdown = document.getElementById('chartDropdown');
    if (!dropdown) {
        console.error('Dropdown element not found!');
        return;
    }
    dropdown.innerHTML = '<option value="All">All</option>'; // Start with 'All' option
    Object.keys(cityData).forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        dropdown.appendChild(option);
    });
}

function drawChart(cityData, total, selectedCity = 'All') {
    const canvas = document.getElementById('chartCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Failed to get canvas context!');
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fill the entire canvas with the default background color
    ctx.fillStyle = '#ccc';
    ctx.beginPath();
    ctx.arc(110, 110, 100, 0, 2 * Math.PI);
    ctx.fill();

    if (selectedCity !== 'All') {
        const city = cityData[selectedCity];
        const percentage = city.percentage / total;
        ctx.fillStyle = city.color;
        ctx.beginPath();
        ctx.moveTo(110, 110); // Center of the canvas
        ctx.arc(110, 110, 100, -0.5 * Math.PI, (percentage * 2 * Math.PI) - 0.5 * Math.PI);
        ctx.lineTo(110, 110);
        ctx.fill();
    } else {
        let startAngle = -0.5 * Math.PI;
        Object.keys(cityData).forEach(city => {
            const percentage = cityData[city].percentage / total;
            ctx.fillStyle = cityData[city].color;
            const endAngle = startAngle + percentage * 2 * Math.PI;
            ctx.beginPath();
            ctx.moveTo(110, 110); // Center of the canvas
            ctx.arc(110, 110, 100, startAngle, endAngle);
            ctx.lineTo(110, 110);
            ctx.fill();
            startAngle = endAngle;
        });

        // Drawing a white circle for doughnut chart effect
        ctx.beginPath();
        ctx.arc(110, 110, 80, 0, 2 * Math.PI); // Adjusted the center point
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    updateLegend(selectedCity !== 'All' ? { [selectedCity]: cityData[selectedCity] } : cityData);
}

function updateLegend(cityData) {
    const legend = document.getElementById('legend');
    if (!legend) {
        console.error('Legend element not found!');
        return;
    }
    legend.innerHTML = '';
    Object.keys(cityData).forEach(city => {
        const colorBox = `<span class="cityBox" style="display:inline-block; width: 10px; height: 10px; background-color:${cityData[city].color}; margin-right: 5px;"></span>`;
        legend.innerHTML += `<li>${colorBox} ${city}</li>`;
    });
}

function attachDropdownListener(cityData, total) {
    const dropdown = document.getElementById('chartDropdown');
    dropdown.addEventListener('change', function () {
        const selectedCity = this.value === 'All' ? 'All' : this.value;
        drawChart(cityData, total, selectedCity);
    });
}

// Listen for document readiness to ensure HTML elements are loaded
document.addEventListener('DOMContentLoaded', function () {
    fetchCityData();
});
