const menuBtn = document.querySelector(".bar-wrapper");
const sidebar = document.querySelector(".aside-container");
const header = document.querySelector(".header-profile-wrapper");
menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle('open')

    if (menuBtn.classList.contains('open')) {
        sidebar.style.transform ='translateX(0)'; 
        header.style.display = 'none';   
    }
    else {
        sidebar.style.transform ='translateX(-100%)';
        header.style.display = 'flex';
    }
    
});

