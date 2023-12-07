function openNav() {
    document.getElementById("sideNav").style.width = "190px";
    document.getElementById("content").style.marginLeft = "190px";
}

function closeNav() {
    document.getElementById("sideNav").style.width = "0";
    document.getElementById("content").style.marginLeft= "0";
}

function checkWidth() {
    if ($(window).width() > 514) {
        $('#content').removeAttr("style");
    }
}
$(window).resize(checkWidth);

