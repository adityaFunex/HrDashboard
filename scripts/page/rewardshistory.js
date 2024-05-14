let _Records = [];

const getRewardsHistory = function () {
    const data = [
        {
            id: 0, date: "11/09/2023", from: "johnny@funex.com", to: "jane@funex.com", amount: "$2,340.00", balance: "$530,030.00"
        }
    ]

    for (let i = 0; i < 180; i++) {
        data.push(
            {
                id: i + 1,  date: "11/09/2023", from: "johnny@funex.com", to: "jane@funex.com", amount: "$2,340.00", balance: "$530,030.00"
            }
        );
    }

    return data;
}

const displayRewardsHistory = function (data) {
    let html = "";

    for (let i = 0; i < data.length; i++) {
        html += `<tr>
        <td id="${data[i].id}">${data[i].date}</td>
        <td>${data[i].from}</td>
        <td>${data[i].to}</td>
        <td>${data[i].amount}</td>
        <td>${data[i].balance}</td>
    </tr>`;
    }

    $("#rewards-history-table").children().remove();
    $("#rewards-history-table").append(html);
    modalEvents();
}

const changePagination = function(data, pageNum) {
    const recordCount = parseInt($("#record-count").val());
    let number = pageNum;
    number = number ? number : 1;
    const endRecord = (number * recordCount);
    const startRecord = endRecord - recordCount;

    const slicedRecords = data.slice(startRecord, endRecord);
    displayRewardsHistory(slicedRecords);
}

$(document).ready(async function () {
    const data = await getRewardsHistory();
    _Records = data;
    await changePagination(data);
    createPagination(data.length);
    pageEvents(data);

    $("#record-count").on("change", async function () {
        await changePagination(_Records, null);
        createPagination(_Records.length);
    });
});