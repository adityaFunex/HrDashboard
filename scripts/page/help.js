const helpPageEvents = function () {
    console.log($("[data-id='send-message']"))
    $("[data-id='send-message']").on("click", function () {
        console.log("chc")
        showDialog(`We have received your message and will contact you shortly.`, "bi-check-circle-fill", "", "Confirm", false, true, null);
    });
}

$(document).ready(function () {
    helpPageEvents();
});