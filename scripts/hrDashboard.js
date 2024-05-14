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
                        fontFamily: 'Rage Italic',
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
document.addEventListener('DOMContentLoaded', () => fetchDataAndCreateCharts('../json/userTraffic.json'));



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
    fetch('../json/perks.json')
        .then(response => response.json())
        .then(data => createTableRows(data))
        .catch(error => console.error('Error loading the data:', error));
});

function createTableRows(data) {
    const tbody = document.getElementById('perksTable').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear existing rows if any

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
        const response = await fetch('../json/engagement.json'); // Adjust the URL as needed
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const cityData = await response.json();
        const total = Object.values(cityData).reduce((acc, { percentage }) => acc + percentage, 0);
        updateDropdown(cityData); // Update the dropdown with cities and include 'All' option
        drawChart(cityData, total); // Initial drawing of the chart
        attachDropdownListener(cityData, total); // Listen for changes in dropdown
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
    dropdown.innerHTML = '<option>All</option>'; // Start with 'All' option
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let startAngle = -0.5 * Math.PI;

    const dataToDraw = selectedCity !== 'All' ? { [selectedCity]: cityData[selectedCity] } : cityData;

    Object.keys(dataToDraw).forEach(city => {
        const percentage = cityData[city].percentage / total;
        ctx.fillStyle = cityData[city].color;
        const endAngle = startAngle + percentage * 2 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(120, 120);
        ctx.arc(120, 120, 100, startAngle, endAngle);
        ctx.lineTo(120, 120);
        ctx.fill();
        startAngle = endAngle;
    });

    // Drawing a white circle for doughnut chart effect
    ctx.beginPath();
    ctx.arc(120, 120, 80, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    updateLegend(dataToDraw);
}

function updateLegend(cityData) {
    const legend = document.getElementById('legend');
    if (!legend) {
        console.error('Legend element not found!');
        return;
    }
    legend.innerHTML = '';
    Object.keys(cityData).forEach(city => {
        const colorBox = `<span class="cityBox" style="display:inline-block; background-color:${cityData[city].color};"></span>`;
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
