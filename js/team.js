function teamMemberUpdate() {
    console.log('teamMemberUpdate started');
    const allTeam = document.getElementById('allTeamBtn');
    const engTeam = document.getElementById('engBtn');
    const superTeam = document.getElementById('superBtn');
    const workerTeam = document.getElementById('workerBtn');

    allTeam.addEventListener('click', () => {
        allTeam.classList.add('active-team');
        engTeam.classList.remove('active-team');
        superTeam.classList.remove('active-team');
        workerTeam.classList.remove('active-team');

        document.querySelectorAll('.member-card').forEach(card => {
            card.classList.remove('hidden');
        });
    });

    engTeam.addEventListener('click', () => {
        allTeam.classList.remove('active-team');
        engTeam.classList.add('active-team');
        superTeam.classList.remove('active-team');
        workerTeam.classList.remove('active-team');

        document.querySelectorAll('.member-card').forEach(card => {
            card.classList.add('hidden');
        });
        document.querySelectorAll('.engineer-team').forEach(card => {
            card.classList.remove('hidden');
        });
    });

    superTeam.addEventListener('click', () => {
        allTeam.classList.remove('active-team');
        engTeam.classList.remove('active-team');
        superTeam.classList.add('active-team');
        workerTeam.classList.remove('active-team');

        document.querySelectorAll('.member-card').forEach(card => {
            card.classList.add('hidden');
        });
        document.querySelectorAll('.supervisor-team').forEach(card => {
            card.classList.remove('hidden');
        });
    });

    workerTeam.addEventListener('click', () => {
        allTeam.classList.remove('active-team');
        engTeam.classList.remove('active-team');
        superTeam.classList.remove('active-team');
        workerTeam.classList.add('active-team');

        document.querySelectorAll('.member-card').forEach(card => {
            card.classList.add('hidden');
        });
        document.querySelectorAll('.worker-team').forEach(card => {
            card.classList.remove('hidden');
        });
    });

}
teamMemberUpdate();

