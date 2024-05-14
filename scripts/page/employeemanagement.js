let _Records = [];
const getEmployees = function () {
    const data = [
        {
            id: 0, firstname: "Johnny", lastname: "Weeks", email: "jweeks@funex.com",
            role: "Executive Admin", department: "department", supervisor: "Jane Doe",
            startdate: "10/9/2023", city: "Irvine", zipcode: "1234", tags: ["Male", "Admin", "Design"],
            balance: "$2,300.00"
        }
    ]

    for (let i = 0; i < 180; i++) {
        data.push({
            id: i + 1, firstname: "Johnny", lastname: "Weeks", email: "jweeks@funex.com",
            role: "Executive Admin", department: "department", supervisor: "Jane Doe",
            startdate: "10/9/2023", city: "Irvine", zipcode: "1234", tags: ["Male", "Admin", "Design"],
            balance: "$2,300.00"
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
        <td>${data[i].firstname}</td>
        <td>${data[i].lastname}</td>
        <td>${data[i].email}</td>
        <td>${data[i].role}</td>
        <td>${data[i].department}</td>
        <td>${data[i].supervisor}</td>
        <td>${data[i].startdate}</td>
        <td>${data[i].city}</td>
        <td>${data[i].zipcode}</td>
        <td class="pill-group" data-tags="${tagsAttr}">
            <div class="x-center">${tagsHTML}</div>
        </td>
        <td>${data[i].balance}</td>
        <td><button class="btn purple" data-open-modal data-modal="update-employee">
            <i class="bi bi-pencil margin0"></i>
        </button></td>
    </tr>`;
    }

    $("#employee-table").children().remove();
    $("#employee-table").append(html);
    modalEvents();
}

const changePagination = function (data, pageNum) {
    let number = pageNum;
    number = number ? number : 1;
    const endRecord = number * 25;
    const startRecord = endRecord - 24;

    const slicedRecords = data.slice(startRecord, endRecord);
    displayEmployees(slicedRecords);
}

const bulkUploadEmployee = function () {
    // if success
    const success = true;
    if (success) {
        showDialog("Your files have been uploaded", "bi-check-circle-fill", "Okay", "Close", '', true, false);
    } else {
        showDialog("An error occurred. Please try again", "bi-x-circle-fill", "", "Close", '', false, true);
    }
}

const addEmployee = async function () {
    const validated = await validateForm($("[data-modal='add-employee']"));

    if(!validated) {
        return "";
    }

    const success = true;
    if (success) {
        showDialog("Changes have been made successfully", "bi-check-circle-fill", "Okay", "Close", '', true, false);
    } else {
        showDialog("An error occurred. Please try again", "bi-x-circle-fill", "", "Close", "", false, true);
    }
}

const updateEmployee = async function () {
    const validated = await validateForm($("[data-modal='update-employee']"));

    if(!validated) {
        return "";
    }

    const success = true;
    if (success) {
        showDialog("Changes have been made successfully", "bi-check-circle-fill", "Okay", "Close", '', true, false);
    } else {
        showDialog("An error occurred. Please try again", "bi-x-circle-fill", "", "Close", "", false, true);
    }
}

const deactivateEmployee = function () {
    const success = true;
    if (success) {
        showDialog("This employee has been deactivated", "bi-check-circle-fill", "Okay", "Close", '', true, false, () => {  $("[data-modal-close]").eq(0).click(); });
    } else {
        showDialog("An error occurred. Please try again", "bi-x-circle-fill", "", "Close", "", false, true);
    }
}

const employeeManagementEvents = function () {
    $("[data-id='bulk-upload-employees']").on("click", bulkUploadEmployee);
    $("[data-id='add-employee']").on("click", addEmployee);
    $("[data-id='update-employee']").on("click", updateEmployee);

    $("tr td .btn[data-modal='update-employee']").on("click", function () {
        const recordID = $(this).closest("tr").attr("data-id");
        const record = _Records.filter(a => parseInt(a.id) === parseInt(recordID));
        const tags = record[0].tags;
        let html = "";

        $("#firstname-update").val(record[0].firstname);
        $("#lastname-update").val(record[0].lastname);
        $("#email-update").val(record[0].email);
        $("#role-update option[selected]").removeAttr("selected");
        $(`#role-update`).val(record[0].role);
        $(`#role-update option:contains(${record[0].role})`).attr('selected', 'selected');
        $("#department-update").val(record[0].department);
        $("#supervisor-update").val(record[0].supervisor);
        $("#startDate-update").val(record[0].startdate.replaceAll("/", "-"));
        $("#city-update").val(record[0].city);
        $("#zipcode-update").val(record[0].zipcode);

        for (let i = 0; i < tags.length; i++) {
            html += `<div class="tag sm x-center">${tags[i]} <i class="bi bi-x remove-tag"></i></div>`;
        }
        console.log( $(".form-tags.update"));
        $(".form-tags.update").append(html);

        $(".tag .remove-tag").on("click", function () {
            const tag = $(this).closest(".tag").text();
            const modal = $(this).closest(".modal");

            const removeTag = () => {
                const pill = $(this).parent();
                pill.remove();
                $(".overlay").show();
                $(".modal").hide();
                $(modal).show();
            }

            showDialog(`Are you sure you want to remove <b>${tag}</b> tag?`, "bi-exclamation-circle-fill", "Confirm", "Cancel", "", true, true, removeTag);
        });
    });

    $('[data-id="deactivate-employee"]').on("click", function () {
        const html = `<p>Are you sure you want to deactivate this employee?</p>`;
        showDialog(html, "", "Deactivate", "Cancel", "red", true, true, deactivateEmployee);    
    })
}

$(document).ready(async function () {
    const data = await getEmployees();
    _Records = data;
    await changePagination(data);
    createPagination(data.length);
    employeeManagementEvents();
    pageEvents(data);
});