$("#Board").click(() => {
    $("#GameStatus").css("display", "none");
});

$(".play").click(() => {
    if ($("#ThinkTimeChoice").val() == "none") {
        $("#warning").css("visibility", "visible");
        return 0;
    }
    start.play();
    $("#Board").css("pointer-events", "auto");
    $(".layout-move-list").css("display", "block");
    $(".option-container").css("display", "flex");
    $(".pick-time").css("display", "none");
    $(".ThinkingDiv").css("display", "flex");
});