const getPopularPages = function (filter) {
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

    const data = [
        ["Perks", "Views"],
        ["Legoland", 25300],
        ["Mickey's Very Merry Christmas", 20302],
        ["EPCOT", 19344],
        ["Animal Kingdom", 19244],
        ["Magic Kingdom", 18344],
        ["Legoland", 18204],
        ["Christmas", 17001],
        ["EPCOT", 14344],
        ["Animal Kingdom", 10344],
        ["Magic Kingdom", 640]
    ]

    return data;
}

const displayPopularPages = async function (filter) {
    const data = await getPopularPages(filter);
    let html = "";

    for (let i = 0; i < data.length; i++) {
        if (i === 0) {
            html += `<div class='column col50'>`;
        } else if (i === 5) {
            html += `</div><div class='column col50'>`;
        }

        html += `<div class="list-item x-center">
        <span class="list-item-num">${i + 1}</span>
        <span class="list-value">${data[i].page}</span>
        <div class="list-item-col column">
            <span class="value">${data[i].views}</span>
            <span>visits</span>
        </div>
    </div>`;

        if (i === 10) {
            html += `</div>`;
        }
    }

    $("#top10").append(html);
}

const displayPopularPagesGraph = async function (filter) {
    const arr = await getPopularPages(filter);
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        const data = google.visualization.arrayToDataTable(arr);

        const options = {
            title: ''
        };

        options.chartArea = { left: '35%', width: '100%', height: '65%' };
        options.colors = ['#4931ff'];
        const chart = new google.visualization.BarChart(document.getElementById('top10Bar'));
        chart.draw(data, options);
    }
}

const filtersEvent = function () {
    $("[data-filter-select]").on("change", async (e) => {
        const element = $(e.target);
        const filter = $(element).attr("data-filter");
        const value = $(element).val();
        ;
        if (filter === "Active Monthly Users") {
            $("[data-id='this-month-data']").text("1234");
            $("[data-id='last-3months-data']").text("1234");
            $("[data-id='this-year-data']").text("1234");

            await displayPopularPages(value);
        }
    });
}


$(document).ready(async function () {
    // await displayPopularPages();
    await displayPopularPagesGraph();
    filtersEvent();
});




