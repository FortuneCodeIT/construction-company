    //  this is for preloader
       document.addEventListener('DOMContentLoaded', () => {

            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.style.display = 'none';
            }
        });

         setTimeout(function() {
            const preloader = document.getElementById('preloader');
                if (preloader) {
                    preloader.style.display = 'none';
                    
                }

         },10000);

                 
  



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


// const text = document.querySelector(".text");
const moreBtns = document.querySelectorAll('.moreBtn');

    moreBtns.forEach(moreBtn => {
        moreBtn.addEventListener('click', () => {

            const serviceCard = moreBtn.closest(".service-card")
            const text = serviceCard.querySelector(".text")

            text.classList.toggle("show");

        if(text.classList.contains("show")) {
            moreBtn.textContent = 'Show less';
        }
        else {
             moreBtn.textContent = 'Learn More...';
        }
        });
    });


function serviceUpdate() {
    const residentBtn = document.getElementById('residentialBtn');
    const manageBtn = document.getElementById('manageBtn');
    const commerceBtn = document.getElementById('commerceBtn');
    const devBtn = document.getElementById('devBtn');

    residentBtn.addEventListener('click', () => {
        document.getElementById('residential').classList.remove('hidden');
        residentBtn.classList.add('active-service');
        document.getElementById('management').classList.add('hidden');
        manageBtn.classList.remove('active-service');
        document.getElementById('commercial').classList.add('hidden');
        commerceBtn.classList.remove('active-service');
        document.getElementById('development').classList.add('hidden');
        devBtn.classList.remove('active-service');
    });

    manageBtn.addEventListener('click', () => {
        document.getElementById('management').classList.remove('hidden');
        manageBtn.classList.add('active-service');
        document.getElementById('residential').classList.add('hidden');
        residentBtn.classList.remove('active-service');
        document.getElementById('commercial').classList.add('hidden');
        commerceBtn.classList.remove('active-service');
        document.getElementById('development').classList.add('hidden');
        devBtn.classList.remove('active-service');
    });

    commerceBtn.addEventListener('click', () => {
        document.getElementById('commercial').classList.remove('hidden');
        commerceBtn.classList.add('active-service');
        document.getElementById('management').classList.add('hidden');
        manageBtn.classList.remove('active-service');
        document.getElementById('residential').classList.add('hidden');
        residentBtn.classList.remove('active-service');
        document.getElementById('development').classList.add('hidden');
        devBtn.classList.remove('active-service');
    });

    devBtn.addEventListener('click', () => {
        document.getElementById('development').classList.remove('hidden');
        devBtn.classList.add('active-service');
        document.getElementById('management').classList.add('hidden');
        manageBtn.classList.remove('active-service');
        document.getElementById('residential').classList.add('hidden');
        residentBtn.classList.remove('active-service');
        document.getElementById('commercial').classList.add('hidden');
        commerceBtn.classList.remove('active-service');
    });
}
serviceUpdate()


