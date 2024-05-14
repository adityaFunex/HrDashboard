let _Records = [];

const getEmployees = function (searchKey) {
    const data = [
        {
            id: 0, firstname: "Jane", lastname: "Weeks", email: "jweeks@funex.com",
            role: "exec. admin", department: "department", supervisor: "Jane Doe",
            startdate: "10/9/2023", city: "Irvine", zipcode: "1234", tags: ["Male", "Admin", "Design"],
            balance: "$2,300.00", img: "/assets/images/id.jpeg"
        }
    ]

    for (let i = 0; i < 180; i++) {
        data.push({
            id: i + 1, firstname: "Johnny", lastname: "Weeks", email: "jweeks@funex.com",
            role: "exec. admin", department: "department", supervisor: "Jane Doe",
            startdate: "10/9/2023", city: "Irvine", zipcode: "1234", tags: ["Male", "Admin", "Design"],
            balance: "$2,300.00", img: "/assets/images/id.jpeg"
        })
    }

    return data;
}

const displayEmployees = function (data) {
    let html = "";

    for (let i = 0; i < data.length; i++) {
        const tags = data[i].tags;
        let tagsHTML = "";
        let tagsAttr = "";

        for (let x = 0; x < tags.length; x++) {
            if (x > 1) {
                tagsHTML += "+" + (tags.length - x);
            } else {
                tagsHTML += `<div class="pill">${tags[x]}</div>`;
            }

            if (x < tags.length - 1) {
                tagsAttr += `${tags[x]}+`;
            } else {
                tagsAttr += `${tags[x]}`;
            }
        }

        html += `<tr data-id="${data[i].id}">
        <td><input type="checkbox" /></td>
        <td id="${data[i].id}" data-column="firstname">${data[i].firstname}</td>
        <td data-column="lastname">${data[i].lastname}</td>
        <td data-column="email">${data[i].email}</td>
        <td data-column="role">${data[i].role}</td>
        <td data-column="department">${data[i].department}</td>
        <td data-column="supervisor">${data[i].supervisor}</td>
        <td data-column="startdate">${data[i].startdate}</td>
        <td data-column="city">${data[i].city}</td>
        <td data-column="zipcode">${data[i].zipcode}</td>
        <td class="pill-group" data-column="tags" data-tags="${tagsAttr}">
            <div class="x-center">${tagsHTML}</div>
        </td>
        <td>${data[i].balance}</td>
        <td><button class="btn inactive" data-action="reward-employee" data-open-modal data-modal="reward-employee">Reward</button></td>
    </tr>`;
    }

    $("#rewards-table").children().remove();
    $("#rewards-table").append(html);

    modalEvents();
    tableEvents();
    rewardsEvents();
}

const removeTile = function (element) {
    const parent = $(element).closest(".modal");
    $(element).closest(".tile").remove();
    $("[data-modal='dialog-alert']").hide();
    $(parent).show();
    $(".overlay").show();
}

const editGroupEvents = function (parent) {
    const elements = $(parent).find(".employee-tile");

    $(elements).on("click", function () {
        const empID = "2";
        const team = "test";
        const fullName = "Mark Zuckerberg";
        const email = "markzuck@funex.com"
        const parentElem = $(this).attr("data-parent");
        const imgSrc = "/assets/images/id3.jpeg";

        const html = `
        <div data-id="${empID}" class="tile employee-add x-center col90">
            <div class="img-container xy-center">
                <img src="${imgSrc}" />
            </div>
            <div class="flex x-center col90">
                <div>
                    <div class="main-text x-center">
                        <span>${fullName}</span>
                        <span class="badge">${team}</span>
                    </div>
                    <div class="sub-text">${email}</div>
                </div>
                <div class="left-auto">
                    <button class="btn btn-icon remove-tile">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>`;

        $("#" + parentElem).append(html);

        $(`#${parentElem} .tile:last-of-type .remove-tile`).on("click", function () {
            showDialog(`Are you sure you want to remove employee <b>${fullName}</b>?`, "bi-exclamation-circle-fill", "Confirm", "Cancel", "", true, true, removeTile, $(this));
        });
    });
}

const rewardEmployees = function (modal) {
    const selected = $(".table-container > table tbody input:checked");
    const value = $(modal).find("#reward-amount").val();
    const remainingBal = $(modal).find(".remaining-balance").text();

    $(selected).click();

    const html = `<div class="xy-center column">
        <b>You just rewarded</b><br>
        <b>${value}</b><br>
        <b>Remaining balance: <span class='red'>${remainingBal}</span></b>
    </div?`
    showDialog(html, "bi-check-circle-fill", "Okay", "",'',  true, false, null);
}

const rewardGroup = function (modal) {
    const value = $(modal).find("[data-name='price-input']").val();
    const remainingBal = $(modal).find(".remaining-balance").text();

    const html = `<div class="xy-center column">
        <b>You just rewarded</b><br>
        <b>${value}</b><br>
        <b>Remaining balance: <span class='red'>${remainingBal}</span></b>
    </div?`
    showDialog(html, "bi-check-circle-fill", "Okay", "", '', true, false, null);
}

const getKey = function (element, e) {
    const oldValue = $(element).attr("data-value") ? $(element).attr("data-value") : "";
    let keynum;
    let newValue = "";

    if (window.event) { // IE
        keynum = e.keyCode;
    } else if (e.which) { // Netscape/Firefox/Opera
        keynum = e.which;
    }

    let num = String.fromCharCode(keynum);

    if (keynum === 190) {
        num = ".";
        newValue = oldValue + num;
    } else if (keynum === 8) {
        newValue = oldValue.slice(0, -1);
    } else if (isNaN(parseInt(num))) {
        num = "";
        newValue = oldValue;
    } else {
        newValue = oldValue + num;
    }

    $(element).attr("data-value", newValue);
}

const onPriceInput = function (e) {
    getKey($(this), e);
    const options = {
        style: 'decimal',  // Other options: 'currency', 'percent', etc.
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };
    const originalValue = $(this).attr("data-value");
    const value = parseFloat(originalValue);
    const modal = $(this).closest(".modal");
    const empCount = $(modal).attr("data-modal") === "reward-group" ? $("[data-id='reward-group-employees'] .tile").length : $("#reward-employee-table .tile").length;
    let currentBalance = $(modal).find(".current-balance").text();
    currentBalance = parseFloat(currentBalance.replace(/[$,]/g, ""));
    let remainingBalance = currentBalance - (value * empCount);
    remainingBalance = remainingBalance.toLocaleString('en-US', options);

    if (originalValue) {
        const decimal = value.toLocaleString('en-US', options);
        $(this).val(`$${decimal}`);
    } else {
        $(this).val("");
    }

    if (!isNaN(parseFloat(remainingBalance.replace(/[$,]/g, "")))) {
        $(modal).find(".remaining-balance").text(`$${remainingBalance}`);
    } else {
        $(modal).find(".remaining-balance").text("");
    }
    // e.preventDefault();
}

const rewardsEvents = function () {
    $(".btn[data-action='reward-employee']").on("click", function () {
        const selected = $(".table-container > table tbody input:checked");
        let html = "";

        for (let i = 0; i < selected.length; i++) {
            const tr = $(selected).eq(i).closest("tr");
            const id = $(tr).attr("data-id");
            const firstName = $(tr).find("td[data-column='firstname']").eq(0).text();
            const lastName = $(tr).find("td[data-column='lastname']").eq(0).text();
            const email = $(tr).find("td[data-column='email']").eq(0).text();

            html += ` <div data-id="${id}" class="tile x-center col95">
                    <div class="img-container xy-center">
                        <img src="/assets/images/id.jpeg" />
                    </div>
                    <div class="flex x-center selected-employee space-between col90">
                        <div class="main-text x-center">
                            <span>${firstName} ${lastName}</span>
                        </div>
                        <div class="left20 sub-text">${email}</div>
                        <div class="left-auto">
                            <button class="btn btn-icon remove-tile">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
        }

        $("#reward-employee-table").html(html);

        $("#reward-employee-table .remove-tile").on("click", function () {
            const row = $(this).closest(".tile");
            const id = $(row).attr("data-id");
            const mainRow = $(`.main-table tr[data-id='${id}']`);
            const checkbox = $(mainRow).find("input[type='checkbox']")[0];
            row.remove();
            $(checkbox).click();
        });
    });

    $(".btn[data-id='reward-employee-submit'], .btn[data-id='reward-group-submit']").on("click", async function () {
        const modal = $(this).closest(".modal");
        const validated = await validateForm(modal);
        const value = $(modal).find("[data-name='price-input']").val();
        const currentBal = $(modal).find(".current-balance").text();
        const remainingBal = $(modal).find(".remaining-balance").text();
        let html = "";

        if (!validated) {
            return "";
        }

        if ($(modal).attr("data-modal") === "reward-employee") {
            const selected = $(".table-container > table tbody input:checked");
            const length = $(selected).length > 3 ? $(selected).length - 3 : "";
            const excess = $(selected).length > 3 ? ` and <b>${length} others</b>` : "";
            const namesArr = $(selected).length > 3 ? $(selected).toArray().slice(1, 4) :
                $(selected).toArray();


            const names = namesArr.map((a) => {
                const tr = $(a).closest("tr");
                const firstName = $(tr).find("td[data-column='firstname']").eq(0).text();
                const lastName = $(tr).find("td[data-column='lastname']").eq(0).text();

                return ` ${firstName} ${lastName}`;
            }).join(",");

            html = `<div style='text-align: left'>
            <p>You are rewarding <b>${names}</b> ${excess}<br>
            <br>
            <b>${value}</b><br><br>
            <p><b>Current Balance:  <span class="turquiose">${currentBal}</span></b></p>
            <p><b>Remaining Balance: <span class="red">${remainingBal}</span></b></p><br><br>
            
            <p><b>Please note this action cannot be undone</b></p>
            <p>Are you sure you want to proceed?</p></div>
        `;

            if (selected.length > 0) {
                showDialog(html, "", "Proceed", "Cancel", "", true, true, rewardEmployees, modal);
            } else {
                showDialog(`No selected employees`, "bi-x-circle-fill", "", "Cancel", "", false, true, null);
            }
        } else {
            const group = $("#reward-group-input").val();

            html = `<div style='text-align: left'>
            <p>You are rewarding <b>${group}</b> group<br>
            <br>
            <b>${value}</b><br><br>
            <p><b>Current Balance:  <span class="turquiose">${currentBal}</span></b></p>
            <p><b>Remaining Balance: <span class="red">${remainingBal}</span></b></p><br><br>
            
            <p><b>Please note this action cannot be undone</b></p>
            <p>Are you sure you want to proceed?</p></div>`;

            showDialog(html, "", "Proceed", "Cancel", "", true, true, rewardGroup, modal);
        }
    });

    // $(".btn[data-id='reward-group-submit']").on("click", function () {
    //     showDialog(`Successfully rewarded group`, "bi-check-circle-fill", "", "Okay", false, true, null);
    // });

    $(".btn[data-id='add-group-submit']").on("click", async function () {
        const validated = await validateForm("[data-modal='create-new-group']");

        if(!validated) {
            return "";
        }

        showDialog(`Changes have been made successfully`, "bi-check-circle-fill", "Okay", "", "", true, false, null);
    });

    $(".btn[data-id='edit-group-submit']").on("click", async function () {
        const validated = await validateForm("[data-modal='edit-group']");

        if(!validated) {
            return "";
        }

        showDialog(`Changes have been made successfully`, "bi-check-circle-fill", "Okay", "", "", true, false, null);
    });

    $(".employee-search").on("keydown", async function () {
        const value = $(this).val();
        const container = $(this).closest(".modal").find("[data-id='employee-search-results']");
        const modal = $(this).closest(".modal").attr("data-modal");
        const parentCont = modal === "edit-group" ? "employee-added-edit" : "employee-added-create";
        const data = await getEmployees(value);
        let html = "";

        for (let i = 0; i < 3; i++) {
            html += `  <div data-parent="${parentCont}" class="tile employee-tile x-center col90">
            <div class="img-container xy-center">
                <img src="/assets/images/id.jpeg" />
            </div>
            <div class="flex x-center space-between col90">
                <div class="main-text x-center">
                    <span>${data[i].firstname} ${data[i].lastname}</span>
                </div>
                <div class="sub-text">${data[i].email}</div>
            </div>
        </div>`;
        }

        $(container).children().remove();
        $(container).append(html);
        editGroupEvents(container);
    });

    $("#record-count").on("change", async function () {
        await changePagination(_Records, null);
        createPagination(_Records.length);
        pageEvents(_Records);
    });

    $("input[data-name='price-input']").on("keyup", onPriceInput);
}

const getGroups = function (group) {
    const testEmployees = [{
        id: 1, firstname: "Cathryn", lastname: "Ngawse", email: "cath@funex.com",
        role: "exec. admin", department: "department", supervisor: "Jane Doe",
        startdate: "10/9/2023", city: "Irvine", zipcode: "1234", tags: ["Male", "Admin", "Design"],
        balance: "$2,300.00", img: "/assets/images/id.jpeg"
    },
    {
        id: 2, firstname: "Marie Jean", lastname: "Zhang", email: "jean@funex.com",
        role: "exec. admin", department: "department", supervisor: "Jane Doe",
        startdate: "10/9/2023", city: "Irvine", zipcode: "1234", tags: ["Male", "Admin", "Design"],
        balance: "$2,300.00", img: "/assets/images/id3.jpeg"
    },
    {
        id: 3, firstname: "Kris", lastname: "Chaw", email: "kris@funex.com",
        role: "exec. admin", department: "department", supervisor: "Jane Doe",
        startdate: "10/9/2023", city: "Irvine", zipcode: "1234", tags: ["Male", "Admin", "Design"],
        balance: "$2,300.00", img: "/assets/images/id3.jpeg"
    },
    {
        id: 4, firstname: "Jasmine", lastname: "Aldane", email: "jas@funex.com",
        role: "exec. admin", department: "department", supervisor: "Jane Doe",
        startdate: "10/9/2023", city: "Irvine", zipcode: "1234", tags: ["Male", "Admin", "Design"],
        balance: "$2,300.00", img: "/assets/images/id.jpeg"
    }];

    let data = [
        { group: "Technical Team", employeeCount: 20, employees: testEmployees },
        { group: "UI/UX Team", employeeCount: 20, employees: testEmployees },
        { group: "Customer Support Team", employeeCount: 30, employees: testEmployees }
    ]

    if (group) {
        data = data.filter(a => a.group === group);
    }

    return data;
}

const displayEditEmployeeGroup = async function () {
    const group = $(this).closest("tr").find("td").eq(0).text();
    const groupData = await getGroups(group);
    $("#groupname-edit-input").val(group);
    $(".edit-group-name").html(`<i class="bi bi-pencil"></i> Edit ${group}`);

    if (groupData.length > 0) {
        const employees = groupData[0].employees;
        let html = "";

        for (let i = 0; i < employees.length; i++) {
            const fullName = `${employees[i].firstname} ${employees[i].lastname}`;

            html += `<div data-id="${employees[i].id}" class="tile x-center col90">
            <div class="img-container xy-center">
                <img src="${employees[i].img}" />
            </div>
            <div class="flex x-center col90">
                <div>
                    <div class="main-text x-center">
                        <span class="fullname">${fullName}</span>
                        <span class="badge">${group}</span>
                    </div>
                    <div class="sub-text">${employees[i].email}</div>
                </div>
                <div class="left-auto">
                    <button class="btn btn-icon remove-tile">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>`;
        }

        $("#employee-added-edit").append(html);

        $(`#employee-added-edit .remove-tile`).on("click", function () {
            const name = $(this).closest(".tile").find(".fullname").text();
            showDialog(`Are you sure you want to remove employee <b>${name}</b>?`, "bi-exclamation-circle-fill", "Confirm", "Cancel", "", true, true, removeTile, $(this));
        });
    }

}

const displayRewardGroup = async function () {
    const group = $(this).closest("tr").find("td").eq(0).text();
    const groupData = await getGroups(group);
    $(".reward-group-name").html(`<i class="bi bi-plus-lg"></i> Reward ${group} Group`);
    $("#reward-group-input").val(group);

    if (groupData.length > 0) {
        let html = "";
        const employees = groupData[0].employees;

        for (let i = 0; i < employees.length; i++) {
            html += `<div data-id="${employees[i].id}" class="tile x-center col95">
                <div class="img-container xy-center">
                    <img src="${employees[i].img}" />
                </div>
                <div class="flex x-center space-between col90">
                    <div class="main-text x-center">
                        <span>${employees[i].firstname} ${employees[i].lastname}</span>
                    </div>
                    <div class="sub-text">${employees[i].email}</div>
                </div>
            </div>`;
        }

        $("[data-id='reward-group-employees']").html(html);
    }
}

const displayGroupsModal = async function (parent) {
    parent = $(`[data-modal='${parent}']`);
    const tableBody = $(parent).find("table tbody");
    const data = await getGroups();
    let html = "";
    $(tableBody).find("tr").remove();

    for (let i = 0; i < data.length; i++) {
        html += `<tr>
        <td>${data[i].group}</td>
        <td>${data[i].employeeCount}</td>
        <td>
            <div class="flex btn-group">
            <button class="btn purple" data-open-modal data-modal="reward-group">
                <i class="bi bi-gift"></i>
                Reward
            </button>
            <button class="btn purple" data-open-modal data-modal="edit-group">
                <i class="bi bi-pencil margin0"></i>
            </button>
            <button data-id="delete-group" class="btn purple">
                <i class="bi bi-trash margin0"></i>
            </button>
            </div>
        </td>
    </tr>`
    }

    $(tableBody).append(html);

    $(".btn[data-id='delete-group']").on("click", function () {
        const groupName = $(this).closest("tr").find("td").eq(0).text();
        showDialog(`Are you sure you want to delete <b>${groupName}</b> group?`, "bi-exclamation-circle-fill", "Confirm", "Cancel", "", true, true, deleteGroup, $(this));
    });

    $(".btn[data-modal='edit-group']").on("click", displayEditEmployeeGroup);
    $(".btn[data-modal='reward-group']").on("click", displayRewardGroup);

    modalEvents(parent);
}

const deleteGroup = function (element) {
    const parent = $(element).closest("tr");

    $(parent).remove();
    $(".modal").hide();
    $("[data-modal='list-of-groups']").show();
    $(".overlay").show();
    // delete group function
}

const displayEditGroupsModal = function (parent) {
    parent = $(`[data-modal='${parent}']`);
    const searchResults = $(parent).find(".tile-container");
    $(parent).find("input").val("");
    $(searchResults).find(".tile").remove();
}

const changePagination = function (data, pageNum) {
    const recordCount = parseInt($("#record-count").val());
    let number = pageNum;
    number = number ? number : 1;
    const endRecord = (number * recordCount);
    const startRecord = endRecord - recordCount;

    const slicedRecords = data.slice(startRecord, endRecord);
    displayEmployees(slicedRecords);
}


$(document).ready(async function () {
    const data = await getEmployees();
    _Records = data;
    await changePagination(data, null);
    createPagination(data.length);
    pageEvents(data);
});