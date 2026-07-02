
// this is for setting js

 function settingsUpdate() {
    const profile = document.getElementById('profile');
    const security = document.getElementById('security');
    const notify = document.getElementById('notify');
    const appear = document.getElementById('appear');

    const profileBtn = document.getElementById('profileBtn');
    const securityBtn = document.getElementById('securityBtn');
    const notifyBtn = document.getElementById('notifyBtn');
    const appearBtn = document.getElementById('appearBtn');

    securityBtn.addEventListener('click', () => {
            profile.classList.add('hidden');
            notify.classList.add('hidden');
            appear.classList.add('hidden');
            security.classList.remove('hidden');
            securityBtn.classList.add('active'); 
            profileBtn.classList.remove('active');         
            notifyBtn.classList.remove('active');         
            appearBtn.classList.remove('active');         
    });

    profileBtn.addEventListener('click', () => {
        security.classList.add('hidden');
        notify.classList.add('hidden');
        appear.classList.add('hidden');
        profile.classList.remove('hidden');
        profileBtn.classList.add('active');
        securityBtn.classList.remove('active');
        notifyBtn.classList.remove('active');
        appearBtn.classList.remove('active');
        
    });

    notifyBtn.addEventListener('click', () => {
        security.classList.add('hidden');
        profile.classList.add('hidden');
        appear.classList.add('hidden');
        notify.classList.remove('hidden');
        notifyBtn.classList.add('active');
        securityBtn.classList.remove('active');
        profileBtn.classList.remove('active');
        appearBtn.classList.remove('active');
        
    });

    appearBtn.addEventListener('click', () => {
        security.classList.add('hidden');
        notify.classList.add('hidden');
        profile.classList.add('hidden');
        appear.classList.remove('hidden');
        appearBtn.classList.add('active');
        securityBtn.classList.remove('active');
        notifyBtn.classList.remove('active');
        profileBtn.classList.remove('active');
        
    });
 settingsUpdate()
    }
        settingsUpdate()



