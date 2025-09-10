function setupScrollButtons() {
    const container = document.querySelector('.page-container');
    const btnLeft = document.getElementById('scroll-left');
    const btnRight = document.getElementById('scroll-right');
    const scrollAmount = 250;
    btnLeft?.addEventListener('click', () => {
        container?.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    btnRight?.addEventListener('click', () => {
        container?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
}

setupScrollButtons()