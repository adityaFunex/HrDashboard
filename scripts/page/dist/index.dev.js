"use strict";

var getPopularPages = function getPopularPages(filter) {
  // filter records
  // const data = [
  //     { page: "Legoland", views: '25,300' },
  //     { page: "Mickey's Very Merry Christmas", views: '20,302' },
  //     { page: "EPCOT", views: '19,344' },
  //     { page: "Animal Kingdom", views: '19,244' },
  //     { page: "Magic Kingdom", views: '18,344' },
  //     { page: "Legoland", views: '18,204' },
  //     { page: "Mickey's Very Merry Christmas", views: '17,001' },
  //     { page: "EPCOT", views: '14,344' },
  //     { page: "Animal Kingdom", views: '10,344' },
  //     { page: "Magic Kingdom", views: '6,400' }
  // ]
  var data = [["Perks", "Views"], ["Legoland", 25300], ["Mickey's Very Merry Christmas", 20302], ["EPCOT", 19344], ["Animal Kingdom", 19244], ["Magic Kingdom", 18344], ["Legoland", 18204], ["Christmas", 17001], ["EPCOT", 14344], ["Animal Kingdom", 10344], ["Magic Kingdom", 640]];
  return data;
};

var displayPopularPages = function displayPopularPages(filter) {
  var data, html, i;
  return regeneratorRuntime.async(function displayPopularPages$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(getPopularPages(filter));

        case 2:
          data = _context.sent;
          html = "";

          for (i = 0; i < data.length; i++) {
            if (i === 0) {
              html += "<div class='column col50'>";
            } else if (i === 5) {
              html += "</div><div class='column col50'>";
            }

            html += "<div class=\"list-item x-center\">\n        <span class=\"list-item-num\">".concat(i + 1, "</span>\n        <span class=\"list-value\">").concat(data[i].page, "</span>\n        <div class=\"list-item-col column\">\n            <span class=\"value\">").concat(data[i].views, "</span>\n            <span>visits</span>\n        </div>\n    </div>");

            if (i === 10) {
              html += "</div>";
            }
          }

          $("#top10").append(html);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
};

var displayPopularPagesGraph = function displayPopularPagesGraph(filter) {
  var arr, drawChart;
  return regeneratorRuntime.async(function displayPopularPagesGraph$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          drawChart = function _ref() {
            var data = google.visualization.arrayToDataTable(arr);
            var options = {
              title: ''
            };
            options.chartArea = {
              left: '35%',
              width: '100%',
              height: '65%'
            };
            options.colors = ['#4931ff'];
            var chart = new google.visualization.BarChart(document.getElementById('top10Bar'));
            chart.draw(data, options);
          };

          _context2.next = 3;
          return regeneratorRuntime.awrap(getPopularPages(filter));

        case 3:
          arr = _context2.sent;
          google.charts.load('current', {
            'packages': ['corechart']
          });
          google.charts.setOnLoadCallback(drawChart);

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var filtersEvent = function filtersEvent() {
  $("[data-filter-select]").on("change", function _callee(e) {
    var element, filter, value;
    return regeneratorRuntime.async(function _callee$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            element = $(e.target);
            filter = $(element).attr("data-filter");
            value = $(element).val();
            ;

            if (!(filter === "Active Monthly Users")) {
              _context3.next = 10;
              break;
            }

            $("[data-id='this-month-data']").text("1234");
            $("[data-id='last-3months-data']").text("1234");
            $("[data-id='this-year-data']").text("1234");
            _context3.next = 10;
            return regeneratorRuntime.awrap(displayPopularPages(value));

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
};

$(document).ready(function _callee2() {
  return regeneratorRuntime.async(function _callee2$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(displayPopularPagesGraph());

        case 2:
          filtersEvent();

        case 3:
        case "end":
          return _context4.stop();
      }
    }
  });
});