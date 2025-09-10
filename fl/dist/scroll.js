function setupScrollButtons() {
    var container = document.querySelector('.page-container');
    var btnLeft = document.getElementById('scroll-left');
    var btnRight = document.getElementById('scroll-right');
    var scrollAmount = 250;
    btnLeft === null || btnLeft === void 0 ? void 0 : btnLeft.addEventListener('click', function () {
        container === null || container === void 0 ? void 0 : container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    btnRight === null || btnRight === void 0 ? void 0 : btnRight.addEventListener('click', function () {
        container === null || container === void 0 ? void 0 : container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
}
setupScrollButtons();
