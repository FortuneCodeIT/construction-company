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

<<<<<<< HEAD
=======


// const menuBtn = document.querySelector(".bar-wrapper");
// const sidebar = document.querySelector(".aside-container");
// const searchBar = document.querySelector('.search-bar-wrapper');
// const header = document.querySelector(".header-profile-wrapper");

// menuBtn.addEventListener("click", () => {
//     menuBtn.classList.toggle("open")

//     if (menuBtn.classList.contains('open')) {
//         sidebar.classList.toggle("active-menu");
//         // menuBtn.style.transform = sidebar ? 'translateX(500px)' : 'translateX(0)';
//         header.style.display = 'none';
//         searchBar.style.display = 'none'      
//     }
// });
>>>>>>> c5491b9d34073c1e38491f7641db556e7dbc1c85
