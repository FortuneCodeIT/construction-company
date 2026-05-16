const mobileNav = document.getElementById('mobile-nav');
const desktopNav = document.getElementById('desktop-nav');
const openNav = document.getElementById('openNav');

openNav.addEventListener('click', () => {
    openNav.classList.toggle('open');

    if (openNav.classList.contains('open')) {
        mobileNav.style.display = 'flex';
        desktopNav.style.display= 'none';
    }
    else {
        mobileNav.style.display= 'none';
    }
});