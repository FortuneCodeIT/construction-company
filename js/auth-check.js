    //  this is for preloader
       document.getElementById('DOMContentLoaded', () => {

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
         },3000);


console.log("🔐 Auth check running...");

function checkAuth() {
    // Get current user from sessionStorage
    const userData = sessionStorage.getItem('currentUser');
   
    if (!userData) {
        console.log("❌ No user session found - redirecting to login");
    
        
        const currentPage = window.location.pathname;
        console.log(" current page:", currentPage)

    //     if (currentPage.includes('login.html')) {
    //         console.log("Already on login page - no redirect");
    //         return null;
    //     }

    //     console.log("Redirecting to login");
    //     window.location.href = '../login.html';
    //     return null;
    }

    try {
        const user = JSON.parse(userData);

        // check if user still exist in localstorage and is active
        const allUsers = getAllUsers();
        const dbUser = allUsers.find(u => u.id === user.id);

        //if user not found in localstorage or in inactive
        if (!dbUser || dbUser.status !== 'active') {
            console.log('user acount is inactive or deleted');

            //clear session
            sessionStorage.removeItem('currentUser');

            alert('Your account has been deactivated. Please contact the administrator.');

            window.location.href = '../login.html';
            return null;
        }

        //update session
        const updatedSessionUser = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
            status: dbUser.status
        };
        sessionStorage.setItem('currentUser', JSON.stringify(updatedSessionUser));

        console.log("✅ User authenticated:", user.name);
        return updatedSessionUser;
    } catch (e) {
        console.error("❌ Error parsing user data:", e);

        const currentPage = windown.location.pathname;
        if (currentPage.includes('login.html')) {
            return null;
        }
        window.location.href = '../login.html';
        return null;
    }
}

function updateHeaderWithUser(user) {
    if (!user) return;
    // Update header profile
    const nameElement = document.querySelector('.header-profile-text h3');
    const roleElement = document.querySelector('.header-profile-text p');
    const avatarElement = document.querySelector('.header-profile #avatar');
   
    if (nameElement) {
        nameElement.textContent = user.name;
    }
   
    if (roleElement) {
        const roleMap = {
            'admin': 'Administrator',
            'project_manager': 'Project Manager',
            'engineer': 'Engineer',
            'supervisor': 'Supervisor',
            'contractor': 'Contractor',
            'site_engineer': 'Site Engineer',
            'worker': 'Worker',
            'client': 'Client',
            'other': 'Others',
        };
        roleElement.textContent = roleMap[user.role] || user.role;
    }
   
    // Update avatar initials
    if (avatarElement && user.name) {
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        // If avatar is an image, we could set src, but for initials we'll add text
        if (!avatarElement.src || avatarElement.src.includes('avatar')) {
            // If using image, we can add a fallback
        }
    }

    updateNotificationDot();
}

// Run auth check when page loads
const currentUser = checkAuth();

// If user is authenticated, update header
if (currentUser) {
    document.addEventListener('DOMContentLoaded', function() {
        updateHeaderWithUser(currentUser);
        console.log("👤 User header updated for:", currentUser.name);
    });
}

// For logout
function logoutUser() {
    sessionStorage.removeItem('currentUser');
    window.location.href = '../login.html';
}