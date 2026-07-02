//  function getAllUsers() {
//     try {
//         const storedUsers = localStorage.getItem('users')
//         if (storedUsers) {
//             return JSON.parse(storedUsers);
//         }
//     } catch (e) {
//         console.log("Error parsing users:", e)
//     }
//     return [];
//  }

    //  this is for preloader
<<<<<<< HEAD
       document.addEventListener('DOMContentLoaded', () => {
=======
       document.getElementById('DOMContentLoaded', () => {
>>>>>>> c5491b9d34073c1e38491f7641db556e7dbc1c85

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
         },1000);
 
 function getInitials(fullName) {

        if (!fullName || fullName.value.trim() === "") {
        return 'US';
    }

    const nameParts = fullName.value.trim().split(' ');
    const firstLetter = nameParts[0] ? nameParts[0][0] : '';
    const secondLetter = nameParts[1] ? nameParts[1][0] : '';

    if (nameParts.length === 1) {
        return fullName.substring(0, 2).toUpperCase();
        }
        return (firstLetter + secondLetter).toUpperCase();
    }

function emailExits(email) {
    try {
        const storedUsers = localStorage.getItem('users');
        if (!storedUsers) return false;

        const existingUsers = JSON.parse(storedUsers);

        const emailLower = email.toLowerCase();
        return existingUsers.some(user => user.email.toLowerCase() === emailLower);
    } catch (e) {
        return false;
    }
}

document.getElementById('email').addEventListener('input', () => {
    const email = this.value.trim();
    const hint = document.getElementById('emailHint');

    if (email && email.includes('@') && email.includes('.')) {
        if (emailExits(email)) {
            hint.style.color = '#Ef4444';
            hint.textContent = ' This email is already registered. Please login instead.';
        } else {
            hint.style.color = '#22C55E';
            hint.textContent = 'Email is available';
        }
    } else if (email) {
        hint.style.color = '#F59E0B';
        hint.textContent = 'Please enter a valid email address';
    } else {
        hint.textContent = '';
    }
});

function handleSignup() {

    console.log("Signup function running...");

    const fullName = document.getElementById('fullname');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const company = document.getElementById('company');
    const role = document.getElementById('role').value;
    const password = document.getElementById('password');
    const confirm = document.getElementById('confirm');

      const messageDiv = document.getElementById('message')

    // Validation
            if (fullName.value.trim() === "" || email.value.trim() === "" || phone.value.trim() === "" || company.value.trim() === "" || password.value === "") {
                messageDiv.innerHTML = '<div class="error">❌ Please fill all required fields</div>';
                return;
            }
            if (!role || role === "") {
                messageDiv.textContent = "❌please select a role";
                messageDiv.classList.add('error');
                return;
            }
           
            if (password.value !== confirm.value) {
                messageDiv.innerHTML = '<div class="error">❌ Passwords do not match</div>';
                return;
            }
           
            if (password.value.length < 6) {
                messageDiv.innerHTML = '<div class="error">❌ Password must be at least 6 characters</div>';
                return;
            }
           
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                messageDiv.innerHTML = '<div class="error">❌ Please enter a valid email address</div>';
                return;
            }
        
            // Get existing users from data.js
            const users = getAllUsers();
            let existingUsers = [];

            try {
            const storedUsers = localStorage.getItem('users');
            if (storedUsers) {
                existingUsers = JSON.parse(storedUsers);
            }
            } catch (e) {
                existingUsers = [];
            }
            

            console.log("Existing users:", existingUsers.length);

            // Check if email already exists
            const UserExists = existingUsers.find(u => u.email.value === email.value);
            if (UserExists) {
                messageDiv.innerHTML = '<div class="error">❌ Email already exists. Please login instead.</div>';
                return;
            }
           
            // Get avatar initials 
            // const initials = fullname.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
          
            const Initials = getInitials(fullName);

             const nextId = existingUsers.length > 0 ? Math.max(...existingUsers.map(u => u.id)) + 1 : 1;
           
            // Determine status (workers need approval, clients are active)
            // let status = 'active';
            // let roleFinal = role;
           
            // if (role === 'worker') {
            //     status = 'pending';  // Needs admin approval
            // }
           
            // Create new user object
            const newUser = {
                id: nextId, // Simple unique ID
                name: fullName.value,
                email: email.value.trim(),
                phone: phone.value.trim() || '',
                password: password.value.trim() ,
                role: role,
                department: company.value.trim()  || '',
                avatar: Initials,
                status: 'active' ,
                clientProjectId: null,
                createdAt: new Date().toISOString()
            };
           
            console.log("New user:", newUser )
            // Add user using data.js function
            existingUsers.push(newUser);

            localStorage.setItem('users', JSON.stringify(existingUsers));

            const savedUsers = localStorage.getItem('users');
            console.log("Saved users:", savedUsers);
           
            // Show success message
            // if (role === 'worker') {
                 messageDiv.innerHTML = '<div class="success">✅ Account created successfully! Redirecting to login...</div>';
                // Clear form
                document.getElementById('myForm').reset();
            // } else {
               
               
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = '../login.html';
                }, 2000);
            // }  
            return false;         
  }
 

  const SignupBtn = document.getElementById('SignupBtn');
  if (SignupBtn) {
    SignupBtn.addEventListener('click', handleSignup);
    console.log("Form found! Event attached")
  } else {
    console.error("Form not found!")
  }







//   this is for login
function handleLogin() {
        console.log("🔵 Login button clicked!");

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const messageDiv = document.getElementById('message');

        // Hide previous error
        messageDiv.style.display = 'none';

        // Validate
        if (!email) {
            messageDiv.textContent = 'Please enter your email address';
            messageDiv.style.color = '#EF4444'
            messageDiv.style.display = 'block';
            return;
        }

        if (!password) {
            messageDiv.textContent = 'Please enter your password';
            messageDiv.style.color = '#EF4444'
            messageDiv.style.display = 'block';
            return;
        }

        // Get all users from localStorage
        let existingUsers = [];
        try {
            const storedUsers = localStorage.getItem('users');
            if (storedUsers) {
                existingUsers = JSON.parse(storedUsers);
            }
        } catch (e) {
            console.error("Error reading users:", e);
        }

        console.log("📋 All users:", existingUsers);
        console.log("📋 All users:", email);

        // Find user (case-insensitive email)
        const user = existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

         console.log("📋 All users:", user);

        if (!user) {
            messageDiv.textContent = '❌ Invalid email or password';
            messageDiv.style.color = '#EF4444'
            messageDiv.style.display = 'block';
            console.log("❌ Login failed - user not found");
            return;
        }


        // Check if account is active
        if (user.status !== 'active') {
            messageDiv.textContent = '❌ Your account is inactive. Please contact admin.';
            messageDiv.style.color = '#EF4444'
            messageDiv.style.display = 'block';
            console.log("❌ Login failed - account inactive");
            return;
        }

        console.log("✅ Login successful for:", user.name);

        // ============================================
        // ROLE-BASED REDIRECT
        // ============================================

        // Save user session
        const sessionUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        
        sessionStorage.setItem('currentUser', JSON.stringify(sessionUser));

        // Update last login
        user.lastLogin = new Date().toISOString();
        localStorage.setItem('users', JSON.stringify(existingUsers));

        // Redirect based on role
        const role = user.role;
        console.log("🔄 Redirecting based on role:", role);

        let redirectUrl = '';

        switch(role) {
            case 'admin':
                redirectUrl = 'admin/dashboard.html';
                break;
            case 'project_manager':
            case 'site_engineer':
            case 'contractor':
            case 'architect':
            case 'engineer':
            case 'supervisor':
            case 'worker':
            case 'other':
                redirectUrl = 'workers/wo-dashboard.html';
                break;
            case 'client':
                redirectUrl = 'client/my-project.html';
                break;
            default:
                redirectUrl = 'index.html';
        }

        console.log("🚀 Redirecting to:", redirectUrl);
        window.location.href = redirectUrl;
    }

    // ============================================
    // ATTACH EVENT LISTENERS
    // ============================================

    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
        console.log("✅ Login button attached!");
    } else {
        console.error("❌ Login button not found!");
    }

    // Enter key support
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });

    // Also Enter key on email field
    document.getElementById('email').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });

    console.log("✅ Login page ready!");