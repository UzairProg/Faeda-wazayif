$('.card').click(function () {
    $(".detail").addClass("active");

});

$(".close-deatil").on("click", function () {
    $(".detail").removeClass("active");

});

$(".menu-bar").on("click", function () {
    $(".sidebar").addClass("active");
})

$(".logo").on("click", function () {
    $(".sidebar").removeClass("active");
}
)