"use strict";

var createPillFilters = function createPillFilters() {
  var filters = $(".filter-input");
  var html = "";

  for (var i = 0; i < filters.length; i++) {
    var value = $(filters).eq(i).val();
    var filter = $(filters).eq(i).closest(".filter-set").find("label").eq(0).text();

    if (value) {
      html += "<div class=\"pill filled filter purple sm\">\n            <b>".concat(filter, ":</b> ").concat(value, " <i class=\"bi bi-x-lg remove-tag\"></i>\n            </div>");
    }
  }

  $(".pill-filters .pill").remove();
  $(".pill-filters").append(html);
  $(".pill-filters .pill .remove-tag").on("click", function () {
    var pill = $(this).parent();
    pill.remove();
  });
};

var createPagination = function createPagination(length) {
  var container = $(".pagination");
  var pagesLength = length / 25;
  var remainder = length % 25;
  pagesLength = remainder > 0 ? pagesLength++ : pagesLength;
  var html = "";
  html += "<span class=\"page prev\"><i class=\"bi bi-caret-left\"></i></span>";

  for (var i = 0; i < pagesLength; i++) {
    var active = i === 0 ? "active" : "";
    var limit = i > 4 ? "hidden" : "";
    html += "<span class=\"page ".concat(active, " ").concat(limit, "\">").concat(i + 1, "</span>");
  }

  html += "<span class=\"page next\"><i class=\"bi bi-caret-right\"></i></span>";
  $(container).children().remove();
  $(container).append(html);
};

var filterRecords = function filterRecords() {
  var filters = $(".filter-input");

  for (var i = 0; i < filters.length; i++) {
    var value = $(filters).eq(i).val();
    var filter = $(filters).eq(i).closest(".filter-set").find("label").eq(0).text(); // filtering records 
  }
};

var modalEvents = function modalEvents() {
  $("[data-open-modal]").on("click", function () {
    var modal = $(this).attr("data-modal");
    $(".overlay").css({
      "display": "flex"
    });
    $(".overlay").removeClass("hidden");
    $(".modal").hide();
    $(".modal[data-modal=\"".concat(modal, "\"]")).show();
    $(".modal[data-modal=\"".concat(modal, "\"]")).removeClass("hidden");
    console.log($(".modal[data-modal=\"".concat(modal, "\"]")));
  });
};

var pageEvents = function pageEvents(data) {
  $(".page").on("click", function () {
    var element = $(this);
    var pageNum = element.text();
    var pageActionsBool = element.hasClass("next") || element.hasClass("prev");
    var active = $(".page.active");
    var nextPage = $(active).nextAll('.page:not(.next, .prev):first');
    var prevPage = $(active).prevAll('.page:not(.next, .prev):first');

    if (pageActionsBool) {
      var pages = $(".page:not(.hidden, .next, .prev)");

      if (element.hasClass("next") && nextPage) {
        if ($(nextPage).hasClass("hidden")) {
          $(pages).eq(0).addClass("hidden");
        }

        $(nextPage).removeClass("hidden");
        $(nextPage).click();
      } else if (element.hasClass("prev") && prevPage) {
        if ($(prevPage).hasClass("hidden")) {
          $(pages).eq(pages.length - 1).addClass("hidden");
        }

        $(prevPage).removeClass("hidden");
        $(prevPage).click();
      }
    } else {
      element.addClass("active");
      changePagination(data, pageNum);
      active.removeClass("active");
    }
  });
};

var eventHandlers = function eventHandlers() {
  $("[data-modal-close]").on("click", function () {
    $(".overlay").hide();
  });
  $("[data-modal-show-nav]").on("click", function () {
    $(".sidenav").addClass("expand");
    $(".sidenav").removeClass("minimize");
    $("[data-modal-hide-nav]").show();
    $("[data-modal-show-nav]").hide();
  });
  $("[data-modal-hide-nav]").on("click", function () {
    $(".sidenav").removeClass("expand");
    $(".sidenav").addClass("minimize");
    $("[data-modal-hide-nav]").hide();
    $("[data-modal-show-nav]").show();
  });
  $(".remove-employee").on("click", function () {
    var row = $(this).closest("tr");
    row.remove();
    console.log(row);
  });
  $("#tags").on('keypress', function (e) {
    var value = $("#tags").val();

    if (e.which == 13) {
      $(".form-tags").append("<div class=\"pill red sm\">".concat(value, " <i class=\"bi bi-x-lg remove-tag\"></i></div>"));
      $(".pill:last-of-type .remove-tag").on("click", function () {
        var pill = $(this).parent();
        pill.remove();
      });
      e.preventDefault();
    }
  });
  $("[open-file-upload]").on("click", function () {
    $("#upload-employee-csv").click();
  });
  $(".columns-selection-btn").on("mouseenter", function () {
    $(".dropdown").show();
  });
  $(".columns-selection").on("mouseleave", function () {
    $(".dropdown").hide();
  });
  $(".columns-selection .dropdown-item").on("click", function () {
    var element = $(this);
    var input = $(element).find("input");
    var column = $(input).attr("data-column");
    var tableColumn = $("th[data-column=\"".concat(column, "\"]"));
    var index = tableColumn.index();
    var columns = $("table td, table th");

    if ($(input).attr("checked") === "checked") {
      $(input).removeAttr("checked");
    } else {
      $(input).attr("checked", true);
    }

    for (var i = 0; i < columns.length; i++) {
      var colIndex = columns.eq(i).index();

      if (colIndex === index) {
        if ($(input).attr("checked") === "checked") {
          columns.eq(i).show();
        } else {
          columns.eq(i).hide();
        }
      }
    }
  });
  $(".export-csv").on("click", function () {
    var columns = $("table tr th:not(:last-of-type)");
    var rows = $("table tr");
    var string = "";
    var name = $("table").attr("data-name");
    var header = $.makeArray(columns).map(function (a) {
      return $(a).text();
    }).join(",");

    for (var i = 0; i < rows.length; i++) {
      var data = $(rows).eq(i).find("td:not(:last-of-type)");
      string += $.makeArray(data).map(function (a) {
        if ($(a).hasClass("pill-group")) {
          return $(a).attr("data-tags");
        } else {
          return $(a).text().trim();
        }
      }).join(",");
      string += '\n';
    }

    string = header + string;
    downloadCSVFile(string, name);
  });
  $(".remove-tag").on("click", function () {
    var pill = $(this).parent();
    pill.remove();
  });
  $(".filter-records").on("click", function () {
    createPillFilters();
    filterRecords();
  });
  $(".clear-filters").on("click", function () {
    $(".pill-filters .pill").remove();
  });
  $("#upload-employee-csv").on("change", function () {
    var files = $("#upload-employee-csv").prop('files')[0];
    console.log(files);
    $(".upload-inbox-text").text(files.name);
  });
  modalEvents();
};

var downloadCSVFile = function downloadCSVFile(csv_data, name) {
  CSVFile = new Blob([csv_data], {
    type: "text/csv"
  });
  var temp_link = document.createElement('a');
  temp_link.download = name + ".csv";
  var url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);
  temp_link.click();
  document.body.removeChild(temp_link);
};

var defaultState = function defaultState() {
  $(".dropdown").hide();
  $("[data-modal-hide-nav]").hide();
  $("[data-modal-show-nav]").show();
  $(".sidenav").addClass("minimize");
  $(".sidenav").removeClass("expand");
};

$(document).ready(function () {
  defaultState();
  eventHandlers();
});