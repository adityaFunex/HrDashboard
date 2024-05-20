"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function showTab(tabId, event) {
  // Prevent the default anchor click behavior
  event.preventDefault(); // Hide all tab contents

  var tabs = document.querySelectorAll('.tabContent');
  tabs.forEach(function (tab) {
    tab.style.display = 'none';
    tab.classList.remove('active');
  }); // Remove active class from all tab links

  var tabLinks = document.querySelectorAll('.trafficNav-item');
  tabLinks.forEach(function (link) {
    link.classList.remove('active');
  }); // Show the correct tab content and highlight the tab

  document.getElementById(tabId).style.display = 'block';
  document.getElementById(tabId).classList.add('active');
  event.currentTarget.parentElement.classList.add('active');
} // Google chart
// New Chart


function fetchDataAndCreateCharts(url) {
  var response, data;
  return regeneratorRuntime.async(function fetchDataAndCreateCharts$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch(url));

        case 3:
          response = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(response.json());

        case 6:
          data = _context.sent;
          // Initialize charts based on fetched data
          createChart('trafficChart1', 'line', data.monthly);
          createChart('trafficChart2', 'line', data.threeMonth);
          createChart('trafficChart3', 'line', data.sixMonth);
          createChart('trafficChart4', 'line', data.yearly);
          createChart('trafficChart5', 'line', data.allTime);
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.error('Failed to fetch or parse data:', _context.t0);

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
}

function createChart(chartId, chartType, chartData) {
  var ctx = document.getElementById(chartId).getContext('2d'); // Extracting data points from chartData

  var dataPoints = chartData.map(function (data) {
    return data.Order;
  }); // Calculate minimum and maximum values

  var minValue = Math.min.apply(Math, _toConsumableArray(dataPoints));
  var maxValue = Math.max.apply(Math, _toConsumableArray(dataPoints));
  console.log(chartId, 'minValue', minValue);
  console.log(chartId, 'maxValue', maxValue); // Calculate step size (using a simple heuristic of range divided by number of ticks)

  var range = maxValue - minValue;
  var stepSize = Math.ceil(range / 10); // Adjust number of ticks as needed

  console.log(chartId, 'range', range);
  console.log(chartId, 'stepSize', stepSize);
  return new Chart(ctx, {
    type: chartType,
    data: {
      labels: chartData.map(function (data) {
        return data.Month || data.Date || data.Period;
      }),
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
} // Fetch and create charts when the document is fully loaded


document.addEventListener('DOMContentLoaded', function () {
  return fetchDataAndCreateCharts('https://adityafunex.github.io/HrDashboard/json/userTraffic.json');
}); // View perks 

document.getElementById('toggleButton').addEventListener('click', function (event) {
  event.preventDefault();
  var additionalRows = document.querySelectorAll('.additional');
  var isShowingMore = this.textContent.includes('Less');
  additionalRows.forEach(function (row) {
    row.style.display = isShowingMore ? 'none' : 'table-row';
  });
  this.textContent = isShowingMore ? 'View All' : 'View Less';
});
document.addEventListener('DOMContentLoaded', function () {
  fetch('https://adityafunex.github.io/HrDashboard/json/perks.json').then(function (response) {
    return response.json();
  }).then(function (data) {
    return createTableRows(data);
  })["catch"](function (error) {
    return console.error('Error loading the data:', error);
  });
});

function createTableRows(data) {
  var tbody = document.getElementById('perksTable').getElementsByTagName('tbody')[0];
  tbody.innerHTML = ''; // Clear existing rows if any

  data.forEach(function (perk) {
    var row = document.createElement('tr');
    row.className = perk.isAdditional ? 'additional' : '';
    row.style.display = perk.isAdditional ? 'none' : 'table-row'; // Hide additional rows initially

    var cellName = document.createElement('td');
    cellName.textContent = perk.perkName;
    var cellImpressions = document.createElement('td');
    cellImpressions.textContent = perk.impressions;
    row.appendChild(cellName);
    row.appendChild(cellImpressions);
    tbody.appendChild(row);
  });
} // engagement js


function fetchCityData() {
  var response, cityData, total;
  return regeneratorRuntime.async(function fetchCityData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(fetch('https://adityafunex.github.io/HrDashboard/json/engagement.json'));

        case 3:
          response = _context2.sent;

          if (response.ok) {
            _context2.next = 6;
            break;
          }

          throw new Error('Network response was not ok.');

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          cityData = _context2.sent;
          total = Object.values(cityData).reduce(function (acc, _ref) {
            var percentage = _ref.percentage;
            return acc + percentage;
          }, 0);
          updateDropdown(cityData); // Update the dropdown with cities and include 'All' option

          drawChart(cityData, total); // Initial drawing of the chart

          attachDropdownListener(cityData, total); // Listen for changes in dropdown

          _context2.next = 18;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          console.error('Error fetching city data:', _context2.t0);

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 15]]);
}

function updateDropdown(cityData) {
  var dropdown = document.getElementById('chartDropdown');

  if (!dropdown) {
    console.error('Dropdown element not found!');
    return;
  }

  dropdown.innerHTML = '<option>All</option>'; // Start with 'All' option

  Object.keys(cityData).forEach(function (city) {
    var option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    dropdown.appendChild(option);
  });
}

function drawChart(cityData, total) {
  var selectedCity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'All';
  var canvas = document.getElementById('chartCanvas');

  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }

  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var startAngle = -0.5 * Math.PI;
  var dataToDraw = selectedCity !== 'All' ? _defineProperty({}, selectedCity, cityData[selectedCity]) : cityData;
  Object.keys(dataToDraw).forEach(function (city) {
    var percentage = cityData[city].percentage / total;
    ctx.fillStyle = cityData[city].color;
    var endAngle = startAngle + percentage * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(120, 120);
    ctx.arc(120, 120, 100, startAngle, endAngle);
    ctx.lineTo(120, 120);
    ctx.fill();
    startAngle = endAngle;
  }); // Drawing a white circle for doughnut chart effect

  ctx.beginPath();
  ctx.arc(120, 120, 80, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  updateLegend(dataToDraw);
}

function updateLegend(cityData) {
  var legend = document.getElementById('legend');

  if (!legend) {
    console.error('Legend element not found!');
    return;
  }

  legend.innerHTML = '';
  Object.keys(cityData).forEach(function (city) {
    var colorBox = "<span class=\"cityBox\" style=\"display:inline-block; background-color:".concat(cityData[city].color, ";\"></span>");
    legend.innerHTML += "<li>".concat(colorBox, " ").concat(city, "</li>");
  });
}

function attachDropdownListener(cityData, total) {
  var dropdown = document.getElementById('chartDropdown');
  dropdown.addEventListener('change', function () {
    var selectedCity = this.value === 'All' ? 'All' : this.value;
    drawChart(cityData, total, selectedCity);
  });
} // Listen for document readiness to ensure HTML elements are loaded


document.addEventListener('DOMContentLoaded', function () {
  fetchCityData();
});