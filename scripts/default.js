const createPillFilters = function () {
    const filters = $(".filter-input");
    let html = "";

    for (let i = 0; i < filters.length; i++) {
        const value = $(filters).eq(i).val();
        const filter = $(filters).eq(i).closest(".filter-set").find("label").eq(0).text();

        if (value) {
            html += `<div class="pill filled filter purple sm">
            <b>${filter}:</b> ${value} <i class="bi bi-x-lg remove-tag"></i>
            </div>`;
        }
    }

    $(".pill-filters .pill").remove();
    $(".pill-filters").append(html);

    $(".pill-filters .pill .remove-tag").on("click", function () {
        const pill = $(this).parent();
        pill.remove();
    });
}

const createPagination = function (length) {
    const container = $(".pagination");
    const recordCount = parseInt($("#record-count").val());
    let pagesLength = length / recordCount;
    const remainder = length % recordCount;
    pagesLength = remainder > 0 ? pagesLength++ : pagesLength;
    let html = "";

    html += `<span class="page prev"><i class="bi bi-caret-left-fill"></i></span>`;

    for (let i = 0; i < pagesLength; i++) {
        const active = i === 0 ? "active" : "";
        const limit = i > 4 ? "hidden" : "";
        html += `<span class="page ${active} ${limit}">${i + 1}</span>`;
    }

    html += `<span class="page next"><i class="bi bi-caret-right-fill"></i></span>`;

    $(container).children().remove();
    $(container).append(html);
}

const validateForm = function (modal) {
    const inputs = $(modal).find("input:not(.not-req), select");
    const validated = true;

    for (let i = 0; i < inputs.length; i++) {
        const val = $(inputs).eq(i).val();

        if (!val) {
            alert("Please fill in all the required fields");
            return false;
        }
    }

    return validated;
}

const filterRecords = function () {
    const filters = $(".filter-input");

    for (let i = 0; i < filters.length; i++) {
        const value = $(filters).eq(i).val();
        const filter = $(filters).eq(i).closest(".filter-set").find("label").eq(0).text();
        // filtering records
    }
}

const initiateFunctions = function (modal) {
    switch (modal) {
        case "list-of-groups":
            displayGroupsModal("list-of-groups");
            break;
        case "create-new-group":
            displayEditGroupsModal("create-new-group");
            break;
        case "edit-group":
            displayEditGroupsModal("edit-group");
            break;
        default:
        // code block
    }
}

const modalEvents = function (parent) {
    const elements = parent ? $(parent).find("[data-open-modal]") : $("[data-open-modal]");
    $(elements).on("click", function () {
        const modal = $(this).attr("data-modal");
        const action = $(this).attr("data-modal-action");

        $(".modal input, .modal select").val("");
        $(".form-tags").children().remove();
        $("#upload-employee-csv").val("");
        $("[data-id='bulk-upload-employees']").addClass("disabled");
        $(".upload-inbox-text").text("no file chosen");
        $(".overlay").css({ "display": "flex" });
        $(".overlay").removeClass("hidden");
        $(".modal").hide();
        $(`.modal[data-modal="${modal}"]`).show();
        $(`.modal[data-modal="${modal}"]`).removeClass("hidden");
        $("body").css("overflow", "hidden");

        if (action) {
            $(".modal").find(".modal-header").html("<h3>" + action + "</h3>");
        }

        initiateFunctions(modal);
    });
}

const pageEvents = function (data) {
    $(".page").on("click", function () {
        const element = $(this);
        const pageNum = element.text();
        const pageActionsBool = element.hasClass("next") || element.hasClass("prev");
        const active = $(".page.active");
        const nextPage = $(active).nextAll('.page:not(.next, .prev):first');
        const prevPage = $(active).prevAll('.page:not(.next, .prev):first');

        if (pageActionsBool) {
            const pages = $(".page:not(.hidden, .next, .prev)");
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
}

const tableEvents = function () {
    $(".table-container > table tbody tr input").on("change", function () {
        const checkbox = $(this);
        const row = $(this).closest("tr");
        const button = $(row).find("button");

        if ($(checkbox)[0].checked) {
            $(button).removeClass("inactive");
            $(button).addClass("blue");
        } else {
            $(button).addClass("inactive");
            $(button).removeClass("blue");
        }
    });
}

const eventHandlers = function () {
    $("[data-modal-close]").on("click", function () {
        $(".overlay").css("display", "none");
        $(".overlay").hide();
        $("body").removeAttr("style");
    });

    $(".sidenav").on("mouseover", function () {
        $(".sidenav").addClass("expand");
        $(".sidenav").removeClass("minimize");
    })

    $(".sidenav").on("mouseout", function () {
        $(".sidenav").removeClass("expand");
        $(".sidenav").addClass("minimize");
    });

    // $("input[data-name='price-input']").on("keyup", onPriceInput);

    $(".remove-row").on("click", function () {
        const row = $(this).closest("tr");
        row.remove();
    });

    $(".tags-input").on('keypress', function (e) {
        const value = $(this).val();
        const modal = $(this).closest(".modal");

        if (e.which == 13) {
            $(modal).find(".form-tags").append(`<div class="tag sm x-center">${value} <i class="bi bi-x remove-tag"></i></div>`);

            $(".tag:last-of-type .remove-tag").on("click", function () {
                const tag = $(this).closest(".tag").text();

                const removeTag = () => {
                    const pill = $(this).parent();
                    pill.remove();
                    $(".overlay").show();
                    $(".modal").hide();
                    $(modal).show();
                    $("body").css("overflow", "hidden");
                }

                showDialog(`Are you sure you want to remove <b>${tag}</b> tag?`, "bi-exclamation-circle-fill", "Confirm", "Cancel", "", true, true, removeTag);
            });

            e.preventDefault();
        }
    });

    $("[open-file-upload]").on("click", function () {
        $("#upload-employee-csv").click();
    });

    $(".columns-selection-btn").on("click", function () {
        $(".dropdown").show();
    });

    $(document).on("click", function (e) {
        if (!$(e.target).hasClass("dropdown-item") && $(e.target).closest(".dropdown").length === 0
            && $(e.target).closest(".columns-selection").length === 0 && !$(e.target).hasClass("columns-selection")) {
            $(".dropdown").hide();
        }
    });

    $(".columns-selection .dropdown-item").on("click", function () {
        const element = $(this);
        const checkbox = $(element).find(".bi");
        const column = $(checkbox).attr("data-column");
        const tableColumn = $(`th[data-column="${column}"]`);
        const index = tableColumn.index();
        const columns = $("table td, table th");

        if ($(element).hasClass("active")) {
            $(element).removeClass("active")
        } else {
            $(element).addClass("active")
        }

        for (let i = 0; i < columns.length; i++) {
            const colIndex = columns.eq(i).index();
            if (colIndex === index) {
                if ($(element).hasClass("active")) {
                    columns.eq(i).show();
                } else {
                    columns.eq(i).hide();
                }
            }
        }
    });

    $(".export-csv").on("click", function () {
        const columns = $("table tr th:not(:last-of-type)");
        const rows = $("table tr");
        let string = "";
        const name = $("table").attr("data-name");

        const header = $.makeArray(columns).map(a => $(a).text()).join(",");

        for (let i = 0; i < rows.length; i++) {
            const data = $(rows).eq(i).find("td:not(:last-of-type)");
            string += $.makeArray(data).map(a => {
                if ($(a).hasClass("pill-group")) {
                    return $(a).attr("data-tags");
                } else {
                    return $(a).text().trim()
                }
            }).join(",");
            string += '\n';
        }

        string = header + string;

        downloadCSVFile(string, name);
    });

    $(".remove-tag").on("click", function () {
        const pill = $(this).parent();
        pill.remove();
    })

    $(".filter-records").on("click", function () {
        createPillFilters();
        filterRecords();
    });

    $(".clear-filters").on("click", function () {
        $(".filter-input").val("");
    });

    $("#upload-employee-csv").on("change", function () {
        const files = $("#upload-employee-csv").prop('files')[0];
        $(".upload-inbox-text").text(files.name);
        if(files) {
            $("[data-id='bulk-upload-employees']").removeClass("disabled");
        } else {
            $("[data-id='bulk-upload-employees']").addClass("disabled");
        }
    });

    modalEvents();
}


const downloadCSVFile = function (csv_data, name) {
    CSVFile = new Blob([csv_data], { type: "text/csv" });
    var temp_link = document.createElement('a');

    temp_link.download = name + ".csv";
    var url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;

    temp_link.style.display = "none";
    document.body.appendChild(temp_link);

    temp_link.click();
    document.body.removeChild(temp_link);
}

const showDialog = function (message, icon, confirmBtnText, cancelBtnText, confirmButtonColor, confirmButton, cancelButton, func, element) {
    const dialog = $("[data-modal='dialog-alert']");
    const confirmBtn = $(dialog).find(".confirm-btn");
    const cancelBtn = $(dialog).find(".cancel-btn");
    const iconContainer = $(dialog).find(".dialog-icon");

    $(".modal").hide();
    $(".overlay").show();
    $("body").css("overflow", "hidden");
    $(".dialog-message").html(message);

    $(iconContainer).html(`<i class="bi ${icon} bottom10 top20"></i>`);
    $(dialog).show();
    $(cancelBtn).text(cancelBtnText);
    $(confirmBtn).text(confirmBtnText);

    if (confirmButtonColor) {
        $(confirmBtn).removeClass("green");
        $(confirmBtn).addClass(confirmButtonColor);
    } else {
        $(confirmBtn).removeClass("red");
        $(confirmBtn).addClass("green");
    }

    if (confirmButton) {
        $(confirmBtn).show();
    } else {
        $(confirmBtn).hide();
    }

    if (cancelButton) {
        $(cancelBtn).show();
    } else {
        $(cancelBtn).hide();
    }

    if (func) {
        const execute = func;

        const trigger = () => {
            if (element) {
                execute(element);
            } else {
                execute();
            }

            $(confirmBtn).unbind("click", trigger);
        };

        $(confirmBtn).on("click", trigger);
    }
}

const defaultState = function () {
    $(".dropdown").hide();
    $("[data-modal-hide-nav]").hide();
    $("[data-modal-show-nav]").show();
    $(".sidenav").addClass("minimize");
    $(".sidenav").removeClass("expand");
}

$(document).ready(function () {
    defaultState();
    eventHandlers();
});