// ============================================
// js/dashboard.js - Shared Dashboard Logic
// ============================================

console.log("📊 Dashboard.js loaded!");

// ============================================
// AUTH CHECK
// ============================================

function checkDashboardAuth() {
    const user = getCurrentUser();
   
    if (!user) {
        window.location.href = '../login.html';
        return null;
    }
   
    // Update header with user info
    updateHeader(user);
   
    // Check if user is on correct dashboard
    const path = window.location.pathname;
    const isAdmin = path.includes('/admin/');
    const isWorker = path.includes('/workers/');
    const isClient = path.includes('/client/');
   
    // Redirect if on wrong dashboard
    if (isAdmin && user.role !== 'admin') {
        if (user.role === 'client') {
            window.location.href = '../client/my-project.html';
        } else {
            window.location.href = '../workers/wo-dashboard.html';
        }
        return null;
    }
   
    if (isWorker && (user.role === 'admin' || user.role === 'client')) {
        if (user.role === 'admin') {
            window.location.href = '../admin/dashboard.html';
        } else {
            window.location.href = '../client/my-project.html';
        }
        return null;
    }
   
    if (isClient && user.role !== 'client') {
        if (user.role === 'admin') {
            window.location.href = '../admin/dashboard.html';
        } else {
            window.location.href = '../workers/wo-dashboard.html';
        }
        return null;
    }
   
    return user;
}

// ============================================
// HEADER UPDATE
// ============================================

function updateHeader(user) {
    if (!user) return;
   
    const nameElement = document.querySelector('#userName, .header-profile-text h3');
    const roleElement = document.querySelector('#userRole, .header-profile-text p');
    const roleDisplay = document.querySelector('#roleDisplay');

       
   
    if (nameElement) nameElement.textContent = user.name;
   
    if (roleElement) {
        const roleNames = {
            'admin': 'Admin',
            'project_manager': 'Project Manager',
            'site_engineer': 'Site Engineer',
            'supervisor': 'Supervisor',
            'contractor': 'Contractor',
            'architect': 'Architect',
            'safety_officer': 'Safety Officer',
            'worker': 'Worker',
            'client': 'Client',
            'other': 'Other'
        };
        roleElement.textContent = roleNames[user.role] || user.role;
    }
   
    if (roleDisplay) {
        const roleNames = {
            'admin': 'Admin',
            'project_manager': 'Project Manager',
            'site_engineer': 'Site Engineer',
            'supervisor': 'Supervisor',
            'contractor': 'Contractor',
            'architect': 'Architect',
            'safety_officer': 'Safety Officer',
            'worker': 'Worker',
            'client': 'Client',
            'other': 'Other'
        };
        roleDisplay.textContent = roleNames[user.role] || user.role;
    }
            const hour = new Date().getHours();
            let timeRoleDisplay = 'Good Morning';
            if (hour >= 12 && hour < 17) timeRoleDisplay = 'Good Afternoon';
            else if (hour >= 17) timeRoleDisplay = 'Good Evening';
        if (roleDisplay) {
            roleDisplay.textContent = `${timeRoleDisplay}, ${user.name}!`;
        }
  
   
    // Update notification dot
    updateNotificationDot();
}

// ============================================
// NOTIFICATION DOT
// ============================================

function updateNotificationDot() {
    const unreadCount = getUnreadNotificationCount();
    const dot = document.querySelector('.notify-dot');
    if (dot) {
        if (unreadCount > 0) {
            dot.style.display = 'block';
            // dot.textContent = unreadCount;
        } else {
            dot.style.display = 'none';
        }
    }
}

// ============================================
// STATS FUNCTIONS
// ============================================

function updateStats(stats) {
    // Total Projects
    const totalEl = document.getElementById('totalProjects');
    if (totalEl) totalEl.textContent = stats.totalProjects || 0;
   
    // Active Projects
    const activeEl = document.getElementById('activeProjects');
    if (activeEl) activeEl.textContent = stats.activeProjects || 0;
   
    // Delayed Projects
    const delayedEl = document.getElementById('delayedProjects');
    if (delayedEl) delayedEl.textContent = stats.delayedProjects || 0;
   
    // Total Budget
    const budgetEl = document.getElementById('totalBudget');
    if (budgetEl) budgetEl.textContent = '₦' + (stats.totalBudget || 0).toLocaleString();
   
    // Worker Stats
    const myProjectsEl = document.getElementById('myProjects');
    if (myProjectsEl) myProjectsEl.textContent = stats.myProjects || 0;
   
    const pendingTasksEl = document.getElementById('pendingTasks');
    if (pendingTasksEl) pendingTasksEl.textContent = stats.pendingTasks || 0;
   
    const completedTasksEl = document.getElementById('completedTasks');
    if (completedTasksEl) completedTasksEl.textContent = stats.completedTasks || 0;
   
    const dueTasksEl = document.getElementById('dueTasks');
    if (dueTasksEl) dueTasksEl.textContent = stats.dueTasks || 0;
}

// ============================================
// ACTIVITY FUNCTIONS
// ============================================

function renderActivities(activities, containerId) {
    
    console.log("Activities Array:", activities)
    
    const containerActivities = document.getElementById(containerId);

    if (!containerActivities) return;


    // Sort by time (newest first)
    // activities.sort((a, b) => {
    //     const aTime = a.time === 'Just now' ? 0 : parseInt(a.time) || 999;
    //     const bTime = b.time === 'Just now' ? 0 : parseInt(b.time) || 999;
    //     return aTime - bTime;
    // });
    activities.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
    });



    if (activities.length === 0) {
        containerActivities.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #6b6b6b;">
                <i class="bx bx-hourglass"></i>
                <h4>No Recent Activity</h4>
                <p>Your activities will appear here</p>
            </div>
        `;
        return;
    }
   
   
    const topActivities = activities.slice(0,10);
   
    let tableHtml = `
        <table style="width: 100%;">
            <thead>
                <tr class="table-bg">
                    <th>Activity</th>
                    <th>Projects</th>
                    <th>User</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
    `;
   
    topActivities.forEach(a => {
        const typeClass = a.type || 'task';
        const typeLabel = a.typeLabel || a.type || 'Activity'; 
        tableHtml += `
            <tr>
                <td>${a.description}</td>
                <td><span class="type-badge ${typeClass}">${typeLabel}</span></td>
                 <td>${a.user}</td>
                <td style="color: #6b6b6b; font-size: 13px;">${new Date(a.createdAt).toLocaleString()}</td>
            </tr>
        `;
    });
   localStorage.getItem('activities')
    tableHtml += `
            </tbody>
        </table>
    `;

    containerActivities.innerHTML = tableHtml;
}


function loadProjectManager() {
     const users = getAllUsers();

     const projectManagers = users.filter(user => user.role === 'project_manager');

     const select = document.getElementById('manager');

     select.innerHTML = `
        <option value="">Select Project Manager</option>
     `;

     projectManagers.forEach(pm => {
        select.innerHTML += `
            <option value="${pm.id}">${pm.name}</option>
        `;
     });
}


let currentPage = 1;
const projectsPerPage = 8;
const maxVisiblePages = 4

function renderProjects(projects = getAllProjects()) {
    

    console.log("renderProject is running");

    // this make the newest created project comes first
    projects.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // this is to add pagination to the project page
    const totalPages = Math.ceil(projects.length / projectsPerPage);

    const start = (currentPage - 1) * projectsPerPage;
    const end = start + projectsPerPage;

    const paginatedProjects = projects.slice(start, end);
    

    const container = document.getElementById('projectsContainer');     

    if (projects.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; ">
                <i class="bx bx-folder-open"></i>
                <h3 style="color: white;">No project Yet</h3>
                <p>Create your first projects.</p>
            </div>
   `;
   return;
    }

    

    container.innerHTML = paginatedProjects.map(project => {

        const managerName = getUserName(project.projectManagerId);
        const clientName = getUserName(project.clientId);
        const teamName = getUserName(project.assigneeId);

        console.log(`project: ${project.name}`);
        console.log(`PM ID: ${project.projectManagerId} -> Name: ${managerName}`);
        console.log(`client ID: ${project.clientId} -> Name: ${clientName}`);

        
      return  `
    
        <div class="project-card " >
            <div class="project-card-head">
                <div class="project-card-text">
                    <h4>${project.name}</h4>
                    <p>${project.location}</p>
                </div>
                <span class="status-badge ${project.status.toLowerCase()}">${project.status}</span>
            </div>
            <div class="project-progress-container">
                <div class="project-progress-wrapper">
                    <div class="project-progress" style=" width:${project.progress || 0};"></div>
                </div>
                <span>${project.progress || 0}%</span>
            </div>
            <div class="start-date">
                <p>Start Date</p>
                <span>${project.startDate} </span>
            </div>
            <div class="start-date">
                <p>End Date</p>
                <span>${project.endDate}</span>
            </div>
            <div class="start-date" >
                <p>Project Manger</p>
                <span>${managerName}</span>
            </div>
            <div class="start-date" >
                <p>Client</p>
                <span>${clientName}</span>
            </div>
            <div class="start-date" >
                <p>Other Team</p>
                <span>${teamName}</span>
            </div>

            <div class="view-details">
            <a href="projects-details.html?id=${project.id}" onclick="viewProject(${project.id})">View Details</a>
            <a href="" onclick="deleteProject(${project.id})">Delete</a>
            </div>
        </div>
`}).join("");
  
        renderPagination(totalPages );
}

function renderPagination(totalPages) {
    // const totalPages = Math.ceil(totalProjects / projectsPerPage);

    const pagination = document.getElementById('pagination');

    if (!pagination) return;

    let html = '';

    // Previous Button
    html += `
        <button ${currentPage === 1 ? 'disabled' : ''}
        onclick="changePage(${currentPage - 1})">
        Prev
        </button>
    `;

    let startPage = Math.max(1,currentPage - Math.floor(maxVisiblePages / 2));

    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1,endPage - maxVisiblePages + 1);
    }

    for(let i = 1; i <= totalPages; i++) {

        html += `
            <button onclick="changePage(${i})" class=" ${i === currentPage ? 'active-page' : ''}">${i}</button>
        `;
    }

    // Next Button
    html += `
        <button  ${currentPage === totalPages ? 'disabled' : ''}
        onclick="changePage(${currentPage + 1})">
        Next
        </button>
    `;
    pagination.innerHTML = html;
}

function changePage(page) {
    console.log("page clicked:", page)

    currentPage = page;
    renderProjects();
}


// this is to change active state depending if the project is active, completed or delayed
function filterProjects(status) {
    const eachProjects = getAllProjects();

    let filteredProjects;

    switch(status) {
        case 'all':
            filteredProjects = eachProjects;
            break

        case 'active':
            filteredProjects = eachProjects.filter(p => p.status.toLowerCase() === 'active');
            
            break

        case 'completed':
            filteredProjects = eachProjects.filter(p => p.status.toLowerCase() === 'completed');
            break

        case 'delayed':
            filteredProjects = eachProjects.filter(p => p.status.toLowerCase() === 'delayed' || p.status.toLowerCase() === 'delayed');
            break

        default:
            filterProjects = eachProjects;
        
    }

    renderProjects(filteredProjects);
  
}


// this is to change active color in the projects button
function projectUpdate() {
    console.log('projectUpdate started');
 const allBtn = document.getElementById('allProjectBtn');
 const activeBtn = document.getElementById('activeProjectBtn');
 const completedBtn = document.getElementById('completedProjectBtn');
 const delayedBtn = document.getElementById('delayedProjectBtn');


//  FOR ALL PROJECTS
   allBtn.addEventListener('click', () => {
     allBtn.classList.add('active-btn');
     activeBtn.classList.remove('active-btn');
     completedBtn.classList.remove('active-btn');
     delayedBtn.classList.remove('active-btn');

    // document.querySelectorAll('.project-card').forEach(card => {
    //     card.classList.remove('hidden');
    // });

   });

// FOR ONLY ACTIVE PROJECTS
   activeBtn.addEventListener('click', () => {
    activeBtn.classList.add('active-btn')
    allBtn.classList.remove('active-btn')
    completedBtn.classList.remove('active-btn')
    delayedBtn.classList.remove('active-btn')

    // document.querySelectorAll('.project-card').forEach(card => {
    //     card.classList.add('hidden');
    // });
    // document.querySelectorAll('.activeProject').forEach(card => {
    //     card.classList.remove('hidden');
    // });
   
   });

// FOR ONLY COMPLETED PROJECTS
   completedBtn.addEventListener('click', () => {
    completedBtn.classList.add('active-btn');
    allBtn.classList.remove('active-btn');
    activeBtn.classList.remove('active-btn');
    delayedBtn.classList.remove('active-btn');

    // document.querySelectorAll('.project-card').forEach(card => {
    //     card.classList.add('hidden');
    // });
    // document.querySelectorAll('.completedProject').forEach(card => {
    //     card.classList.remove('hidden');
    // });

   });

// FOR ONLY DELAYED PROJECTS
   delayedBtn.addEventListener('click', () => {
    delayedBtn.classList.add('active-btn');
    allBtn.classList.remove('active-btn');
    activeBtn.classList.remove('active-btn');
    completedBtn.classList.remove('active-btn');

    //  document.querySelectorAll('.project-card').forEach(card => {
    //     card.classList.add('hidden');
    // });
    // document.querySelectorAll('.delayedProject').forEach(card => {
    //     card.classList.remove('hidden');
    // });

   });

}


function viewProject(projectId) {
        localStorage.setItem('selectedProjectId', projectId);
        // window.location.href = `projects-details.html?id=${projectId}`;
        
    console.log("project details running", projectId);

}


// ============================================
        // GET PROJECT ID FROM URL
        // ============================================
        function getProjectIdFromURL() {
            const params = new URLSearchParams(window.location.search);
            return parseInt(params.get('id'));
        }

        const projectId = getProjectIdFromURL();

        // ============================================
        // LOAD PROJECT DETAILS
        // ============================================
        function loadProjectDetails() {
            if (!projectId || isNaN(projectId)) {
                document.getElementById('app').innerHTML = `
                    <div class="empty-state">
                        <i class="bx bx-error-circle"></i>
                        <h4>No Project Selected</h4>
                        <p>Please select a project from the projects page.</p>
                        <a href="projects.html" style="color: #FF5200; text-decoration: none;">Go to Projects</a>
                    </div>
                `;
                return;
            }

            const projects = getAllProjects();
            const project = projects.find(p => p.id === projectId);

            if (!project) {
                document.getElementById('app').innerHTML = `
                    <div class="empty-state">
                        <i class="bx bx-folder-x"></i>
                        <h4>Project Not Found</h4>
                        <p>The project you're looking for doesn't exist.</p>
                        <a href="projects.html" style="color: #FF5200; text-decoration: none;">Go to Projects</a>
                    </div>
                `;
                return;
            }

            // Get related data
            const tasks = getAllTasks().filter(t => t.projectId === projectId);
            const users = getAllUsers();
            const expenses = getAllExpenses().filter(e => e.projectId === projectId);

            // ✅ Get team members with roles
            const pmName = getUserName(project.projectManagerId);
            const engineerName = getUserName(project.leadEngineerId);
            const clientName = getUserName(project.clientId);
           
            // ✅ Get all team members (assignedTeam)
            const teamMembers = [];
            if (project.assignedTeam && project.assignedTeam.length > 0) {
                project.assignedTeam.forEach(id => {
                    const member = users.find(u => u.id === id);
                    if (member) {
                        teamMembers.push(member);
                    }
                });
            }

            // ✅ Role display names
            const roleDisplayNames = {
                'project_manager': 'Project Manager',
                'engineer': 'Engineer',
                'supervisor': 'Supervisor',
                'worker': 'Worker'
            };

            // ✅ Role badge classes
            const roleBadgeClasses = {
                'project_manager': 'role-pm',
                'engineer': 'role-engineer',
                'supervisor': 'role-supervisor',
                'worker': 'role-worker',
                'client': 'role-client'
            };

            // Calculate stats
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(t => t.status === 'completed' || t.status === 'done').length;
            const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
            const pendingTasks = tasks.filter(t => t.status === 'pending').length;

            // Calculate budget spent
            const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
            const budgetRemaining = (project.budget || 0) - totalSpent;
            const budgetUsedPercent = project.budget ? Math.round((totalSpent / project.budget) * 100) : 0;

            // Status class
            const statusClass = project.status === 'active' ? 'status-active' :
                               project.status === 'completed' ? 'status-completed' :
                               project.status === 'delayed' ? 'status-delayed' : 'status-on-hold';
            const statusDisplay = project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'Active';

            // Progress color
            const progressColor = project.progress >= 80 ? '#22C55E' :
                                 project.progress >= 50 ? '#FF5200' : '#EF4444';

            // ✅ Build team HTML
            let teamHtml = '';
           
            // Add Project Manager
            if (project.projectManagerId) {
                const pm = users.find(u => u.id === project.projectManagerId);
                if (pm) {
                    const initials = pm.avatar || pm.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                    teamHtml += `
                        <div class="team-member-card">
                            <div class="avatar" style="background: linear-gradient(135deg, #FF5200, #ff8c5a);">${initials}</div>
                            <div class="name">${pm.name}</div>
                            <div class="role">Project Manager</div>
                            <span class="role-badge role-pm">PM</span>
                        </div>
                    `;
                }
            }

            // Add Lead Engineer
            if (project.leadEngineerId) {
                const engineer = users.find(u => u.id === project.leadEngineerId);
                if (engineer) {
                    const initials = engineer.avatar || engineer.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                    teamHtml += `
                        <div class="team-member-card">
                            <div class="avatar" style="background: linear-gradient(135deg, #3b82f6, #60a5fa);">${initials}</div>
                            <div class="name">${engineer.name}</div>
                            <div class="role">Lead Engineer</div>
                            <span class="role-badge role-engineer">Engineer</span>
                        </div>
                    `;
                }
            }

            // Add Client
            if (project.clientId) {
                const client = users.find(u => u.id === project.clientId);
                if (client) {
                    const initials = client.avatar || client.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                    teamHtml += `
                        <div class="team-member-card">
                            <div class="avatar" style="background: linear-gradient(135deg, #22C55E, #4ade80);">${initials}</div>
                            <div class="name">${client.name}</div>
                            <div class="role">Client</div>
                            <span class="role-badge role-client">Client</span>
                        </div>
                    `;
                }
            }

            // Add Team Members
            teamMembers.forEach(member => {
                const initials = member.avatar || member.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                const roleDisplay = roleDisplayNames[member.role] || member.role;
                const roleBadge = roleBadgeClasses[member.role] || 'role-worker';
               
                const roleColors = {
                    'project_manager': 'linear-gradient(135deg, #FF5200, #ff8c5a)',
                    'engineer': 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                    'supervisor': 'linear-gradient(135deg, #F59E0B, #fbbf24)',
                    'worker': 'linear-gradient(135deg, #a855f7, #c084fc)'
                };
                const avatarColor = roleColors[member.role] || 'linear-gradient(135deg, #6b7280, #9ca3af)';
               
                teamHtml += `
                    <div class="team-member-card">
                        <div class="avatar" style="background: ${avatarColor};">${initials}</div>
                        <div class="name">${member.name}</div>
                        <div class="role">${roleDisplay}</div>
                        <span class="role-badge ${roleBadge}">${roleDisplay}</span>
                    </div>
                `;
            });

            // Render HTML
            document.getElementById('app').innerHTML = `

             <div class="project-details-head">
            <h4><a href="projects.html">Projects</a></h4>
            <i class="bx bx-chevron-right"></i>
            <p>${project.name}</span>
        </div>

            <div class="project-details-name-wrapper">
            <h1>${project.name}</h1>
            <p style="text-transform: Capitalize;">${project.status}</p>
            <div class="project-details-progress-wrapper">
                <div class="project-details-progress-text">
                    <h4>Progress</h4>
                    <span style="color: ${progressColor};">${projects.progress || 0}%</span>
                </div>
                    <div class="project-progress-wrapper">
                        <div class="project-progress" style=" width: ${projects.progress || 0}; background-color:#FF5200;"></div>
                    </div>
           </div>
            <button>Edit Project</button>
        </div>

                  <div class="details-btn-container">
            <div class="details-btn-wrapper">
                <button class="active-btn">Overview</button>
                <button>Timeline</button>
                <button>Tasks</button>
                <button>Documents</button>
                <button>Team</button>
                <button>Reports</button>
            </div>

                <div class="details-overview-progress-wrapper">
                    <div class="overview-progress-card-1">
                        <table>
                            <tr>
                                <th>Location</th>
                                <td>📍 ${project.location || 'No location set'}</td>
                            </tr>
                            <tr>
                                <th>Start Date</th>
                                <td>${formatDate(project.startDate)}</td>
                            </tr>
                            <tr>
                                <th>End Date</th>
                                <td>${formatDate(project.endDate)}</td>
                            </tr>
                            <tr>
                                <th>Budget</th>
                                <td style="color: #22C55E;">₦${(project.budget || 0).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <th>Projects Manager</th>
                                <td>${pmName}</td>
                            </tr>
                             <tr>
                              <th>Lead Engineer</th>
                                    <td>${project.leadEngineerId}</td>
                                </tr>
                                <tr>
                                    <th>Client</th>
                                    <td>${project.clientId}</td>
                                </tr>
                        </table>

                         <div class="decription-text">
                                <p>Description</p>
                                <span>${project.description}</span>
                            </div>
                            
                        </div>

                        <div class="overview-progress-card-2">
                            <h4>Progress Overview</h4>
                            <canvas></canvas>
                        </div>
                </div>
                </div>



            `;

                 if (project.status === 'active' || project.status === 'completed') {
     document.querySelector('.project-details-name-wrapper p').style.background = "#22C55E";
     }    
     if (project.status === 'completed') {
     document.querySelector('.project-details-name-wrapper p').style.background = "#3B82F6";
     }    
    if (project.status === 'delayed') {
       document.querySelector('.project-details-name-wrapper p').style.background = "#F59E0B";
     }
    if (project.status === 'on-hold') {
       document.querySelector('.project-details-name-wrapper p').style.background = "#EF4444";
     }
        }






function renderTasks(tasks = getAllTasks(), maxItems = 5) {
    console.log('Rendering task...');

      // this make the newest created project comes first
    tasks.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });


    const taskContainer = document.getElementById('taskContainerId');
    if (!taskContainer) return;

       if (tasks.length === 0) {
        taskContainer.innerHTML = `
            <div class="empty-state">
                <i class="bx bx-check-circle"></i>
                <h4>No Tasks Yet</h4>
                <p>No tasks to display</p>
            </div>
        `;
        return;

        }

    
    // const displayTasks = tasks.slice(0, maxItems);
    // const allProjects = getAllProjects();

   let tableHtml =  `
        <table style="width: 100%;">
            <thead>
                <tr class="table-bg">
                    <th>Task</th>
                    <th>Project</th>
                    <th>Assigned To</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

       tasks.forEach(t => {
        const statusClass = t.status === 'pending' ? 'task-status-pending' :
                           t.status === 'in_progress' ? 'task-status-progress' :
                           t.status === 'completed' || t.status === 'done' ? 'task-status-completed' : 'task-status-delayed';
       
        const statusDisplay = t.status === 'in_progress' ? 'In Progress' :
                             t.status === 'done' ? 'Completed' :
                             t.status || 'Pending';

        const projectName = getProjectName(t.projectId);
        const assigneeName = getUserName(t.assignedTo);

          // ✅ FIXED: priorityColor properly defined
        const priorityColor = t.priority === 'high' ? '#EF4444' :
                             t.priority === 'medium' ? '#F59E0B' : '#22C55E';

        tableHtml += `
            <tr>
                <td><strong>${escapeHtml(t.title)}</strong></td>
                <td>${escapeHtml(projectName)}</td>
                <td>${escapeHtml(assigneeName)}</td>
                <td><span style="color: ${priorityColor}; text-transform: capitalize;">${t.priority || 'medium'}</span></td>
                <td><span class="task-status-badge ${statusClass}">${statusDisplay}</span></td>
                <td>${t.dueDate ? formatDate(t.dueDate) : 'No date'}</td>
                <td class="action-icons">
                    <i class="bx bx-edit" onclick="editTask()" title="Edit" ></i>
                    <i class="bx bx-lock"  title="Disable"></i>
                    <i class="bx bx-trash" onclick="deleteTaskHandler(${t.id})" title="Delete"></i>
                   </td>
            </tr>
        `;
    });

    tableHtml += `
            </tbody>
        </table>
    `;

    taskContainer.innerHTML = tableHtml;
    console.log("✅ Tasks rendered!");


}

// this is used to delete task
function deleteTaskHandler(taskId) {
    deleteTask(taskId);
    renderTasks();
}


 




// ============================================
// LOAD USERS
// ============================================
function renderUsers(allUsers = getAllUsers()) {

    // const allUsers = getAllUsers();
    const container = document.getElementById('usersContainer');

      // this make the newest created project comes first
    allUsers.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Update stats
    const active = allUsers.filter(u => u.status === 'active').length;
    const inactive = allUsers.filter(u => u.status === 'inactive').length;



    document.getElementById('totalUsers').textContent = allUsers.length;
    document.getElementById('activeUsers').textContent = active;
    document.getElementById('inActiveUsers').textContent = inactive;


    if (allUsers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bx bx-user-x"></i>
                <h4>No Users</h4>
                <p>Click the "Create User" button to add your first user.</p>
            </div>
        `;
        return;
    }

    let tableHtml = `
        <table class="user-table">
            <thead>
                <tr class="table-bg">
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    allUsers.forEach(u => {
        const roleClass = u.role === 'admin' ? 'role-admin' :
                            u.role === 'project_manager' ? 'role-pm' :
                            u.role === 'engineer' ? 'role-engineer' :
                            u.role === 'supervisor' ? 'role-supervisor' :
                            u.role === 'worker' ? 'role-worker' : 'role-client';
        const roleDisplay = u.role === 'project_manager' ? 'Project Manager' :
                            u.role === 'admin' ? 'Admin' :
                            u.role || 'Unknown';

        const statusClass = u.status === 'active' ? 'status-active' : 'status-inactive';

        tableHtml += `
            <tr data-role="${u.role}" data-status="${u.status}" data-name="${u.name.toLowerCase()}" data-email="${u.email.toLowerCase()}">
                <td><strong>${escapeHtml(u.name)}</strong></td>
                <td>${escapeHtml(u.email)}</td>
                <td><span class="role-badge ${roleClass}">${roleDisplay}</span></td>
                <td>${escapeHtml(u.department || 'N/A')}</td>
                <td class="${statusClass}">${u.status || 'active'}</td>
                <td>${u.createdAt ? formatDate(u.createdAt) : 'No date'}</td>
                <td class="action-icons">
                    <i class="bx bx-edit" onclick="editUser()" title="Edit" ></i>
                    <i class="bx bx-lock" onclick="toggleUserStatus(${u.id})" title="Disable"></i>
                    <i class="bx bx-trash" onclick="deleteUserHandler(${u.id})" title="Delete"></i>
                </td>
            </tr>
        `;
    });

    tableHtml += `
            </tbody>
        </table>
    `;

    container.innerHTML = tableHtml;

    
}

function deleteUserHandler(userId) {
    deleteUser(userId);
    renderUsers();
}

function toggleUserStatus(userId) {

    const users = getAllUsers();

    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        alert('User not found');
        return;
    }

    const user = users[userIndex];
    // prevents deactivating yourself (admin)
    const currentUser = getCurrentUser();
    if (user.id === currentUser?.id) {
        alert('You cannot deactivat your own account');
        return;
    }

    // prevents deactivating admin users (optional)
    if (user.role === 'admin') {
        alert('Cannot deactivate admin users');
        return;
    } 
    const currentStatus = user.status;
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    const action = newStatus === 'active' ? 'activate' : 'deactivate';
    const confirmMsg = `Are you sure you want to ${action} "${user.name}"?`;

    if (!confirm(confirmMsg)) {
        return;
    }

    // update status
    users[userIndex].status = newStatus;
    users[userIndex].updatedAt = new Date().toISOString();

    localStorage.setItem('users', JSON.stringify(users));

    alert(`${user.name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}`);

    renderUsers();

    addActivity(`User ${user.name} was ${newStatus === 'active' ? 'activated' : 'deactivated'}`, 'user');
}

  // Filter Users
function filterUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    const rows = document.querySelectorAll('#usersContainer tbody tr');
    
    rows.forEach(row => {
        const name = row.dataset.name.toLowerCase() || '';
        const email = row.dataset.email.toLowerCase() || '';
        const role = row.dataset.role || '';
        const status = row.dataset.status || '';
        
        const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm);
        const matchesRole = roleFilter === 'all' || role === roleFilter;
        const matchesStatus = statusFilter === 'all' || status === statusFilter;
        
        if (matchesSearch && matchesRole && matchesStatus) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}
 

function renderMaterial() {
    const materials = getAllMaterials();

      materials.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const container = document.getElementById('materialContainer');
    if (!container) return;

    const total = materials.length;
    const lowStock = materials.filter(m => m.status === 'low_stock' || (m.minStock && m.quantity <= m.minStock)).length;
    const outOfStock = materials.filter(m => m.status === 'out_of_stock' || m.quantity <= 0).length;
    const categories = new Set(materials.map(m => m.category)).size;
    const equipment = materials.filter(m => m.category === 'equipment').length;

    document.getElementById('totalMaterials').textContent = total;
    document.getElementById('lowStock').textContent = lowStock;
    document.getElementById('outOfStock').textContent = outOfStock;
    document.getElementById('totalCategory').textContent = categories;

       if (materials.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bx bx-check-circle"></i>
                <h4>No Materials Yet</h4>
                <p>No Material to display</p>
            </div>
        `;
        return;

        }
        
    let tableHtml =  `
        <table style="width: 100%;">
            <thead>
                <tr class="table-bg">
                    <th>Material Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;


     materials.forEach(m => {
        const statusClass = m.status === 'available' || (m.quantity > 0 && !m.minStock) ? 'status-available' :
                           m.status === 'low_stock' || (m.minStock && m.quantity <= m.minStock) ? 'status-low' :
                           'status-out-of-stock' ; 
       
        const statusDisplay = m.status === 'available' ? 'Available' :
                             m.status === 'low_stock' ? 'Low Stock' : 
                             'Out Of Stock' ;

        let statusColor = '';
        
        if (statusDisplay === 'Available') {
            statusColor = '#22C55E'
        }       
        else if (statusDisplay === 'Low Stock') {
            statusColor = '#F59E0B'
        }
        else {
            statusColor = '#EF4444'
        }
      
         tableHtml += `
          <tr>
            <td><srong>${escapeHtml(m.materialName)}</strong></td>
            <td>${escapeHtml(m.category || 'N/A')}</td>
            <td>${m.quantity || 0}</td>
            <td>${escapeHtml(m.unit || 'N/A')}</td>
            <td><span class=" ${statusClass}" style="color: ${statusColor};">${statusDisplay}</span></td>
        <td class="action-icons">
            <i class="bx bx-edit" onclick="editUser('mike.chen@pinnacle.com')" title="Edit"></i>
            <i class="bx bx-lock" onclick="toggleUserStatus(this)" title="Disable"></i>
            <i class="bx bx-trash" onclick="deleteMaterialHandler(${m.id})" title="Delete"></i>
        </td>
        </tr>

         `;

     });

     
    tableHtml += `
            </tbody>
        </table>
    `;

    
    materialContainer.innerHTML = tableHtml;
    console.log("✅ Material rendered!");
   
}


function deleteMaterialHandler(materialId) {
    deleteMaterial(materialId)
    renderMaterial();
}



function populateProjectFilter() {
    const projects = getAllProjects();
    const filterSelect = document.getElementById('projectFilter');

    filterSelect.innerHTML = `<option value="all">All Projects</option>`;

    if (projects.length === 0) {
        console.warn("No project found!");
        return;
    }

    projects.forEach(p => {
        filterSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
    });
    
    console.log('Filter populated with:', projects.length);
}

let currentFilter = 'all';

function filterBudget() {
    const filterValue = document.getElementById('projectFilter').value;
    currentFilter = filterValue;
    console.log('Filter changes to:', filterValue);

    renderBudgetData(filterValue);
}


function renderBudgetData(projectId = 'all') {
    console.log('Loading budget data for:', projectId)
    
    const projects = getAllProjects();
    const allExpenses = getAllExpenses();

    let filteredProjects = projects;
    let filteredExpenses = allExpenses;

    if (projectId !==  'all') {
        const id = parseInt(projectId);
        filteredProjects = projects.filter(p => p.id === id);
        filteredExpenses = allExpenses.filter(e => e.projectId === id);
    }

    const totalBudget = filteredProjects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalSpent = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const remaining = totalBudget - totalSpent;

    // pending cost
    const pendingCost = filteredExpenses
        .filter(e => e.status === 'pending' || !e.status)
        .reduce((sum, e) => sum + (e.amount || 0), 0);

    // update stat
    document.getElementById('totalBudget').textContent = formatCurrency(totalBudget);
    document.getElementById('totalSpent').textContent = formatCurrency(totalSpent);
    document.getElementById('remainingBudget').textContent = formatCurrency(remaining);
    document.getElementById('pendingCost').textContent = formatCurrency(pendingCost);

    // update project name header
    const header = document.getElementById('projectNameHeader');
    if (projectId === 'all') {
        header.textContent = 'All Projects Overview'
    } else {
        const project = projects.find(p => p.id === parseInt(projectId));
        header.textContent = `${project ? project.name : 'Unknown Project'} - Budget Overview`;
    }

    // update Expense count
    document.getElementById('expenseCount').textContent = `Showing ${filteredExpenses.length} expenses`;

    renderCategoryChart(filteredExpenses);
    renderUtilizationChart(filteredProjects, filteredExpenses);
    renderExpenses(filteredExpenses);

}

function renderCategoryChart(expenses = getAllExpenses()) {
    console.log('rendering category chart:');

    const container = document.getElementById('categoryChart');


    const categories = {};
    const categoryColors = {
        'labor': '#3b82fe',
        'material': '#22C55E',
        'equipment': '#F59E0B',
        'transport': '#a855f7',
        'other': '#9a9a9a'
    };
    const categoryLabels = {
        'labor': 'Labor',
        'material': 'Material',
        'equipment': 'Equipment',
        'transport': 'Transport',
        'other': 'Other'
    }

    expenses.forEach(e => {
        const cat = e.category || 'other';
        if (!categories[cat]) {
            categories[cat] = 0;
        }
        categories[cat] += e.amount || 0;
    });

    const total = Object.values(categories).reduce((sum, val) => sum + val, 0);

    if (Object.keys(categories).length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bx bx-wallet"></i>
                <h4>No Expenses Yet</h4>
                <p>Add expenses to see category breakdown</p>
            </div>
        `;
        return;
    }

    let html = '';
    Object.keys(categories).forEach(key => {
        const amount = categories[key];
        const percent = total > 0 ? Math.round((amount / total) * 100) : 0;
        const color = categoryColors[key] || '#9a9a9a';
        const label = categoryLabels[key] || key;

        html += `
              <div class="progress-content-wrapper ">

                        <div class="progress-content">                          
                        <div class="progress-text">
                            <div class="dot labour" style="background: ${color};"></div>
                            <p>${label}</p>
                        </div>
                            <span style="color: ${color};">${formatCurrency(amount)} (${percent}%)</span>
                        </div> 
                <div class="bar-track">
                    <div class="bar-fill" style="width: ${percent}%; background: ${color};"></div>
                </div>         
              </div>

        `;
    });

    container.innerHTML = html;
}


// ============================================
        // RENDER UTILIZATION CHART
// ============================================
function renderUtilizationChart(projects = getAllProjects().slice(0,5), expenses = getAllExpenses()) {
    const container = document.getElementById('utilizationChart');



    if (projects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bx bx-folder"></i>
                <h4>No Projects</h4>
                <p>Create projects to see budget utilization</p>
            </div>
        `;
        return;
    }

    let html = '';
    projects.forEach(p => {
        const projectExpenses = expenses.filter(e => e.projectId === p.id);
        const totalSpent = projectExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
        const percent = p.budget > 0 ? Math.min(Math.round((totalSpent / p.budget) * 100), 100) : 0;
        
        let color = '#22C55E';
        if (percent > 80) color = '#EF4444';
        else if (percent > 50) color = '#F59E0B';

        html += `
            <div class="budget-bar">
                <div class="bar-label">
                    <span class="name">${p.name}</span>
                    <span class="percent" style="color: ${color};">${percent}% (${formatCurrency(totalSpent)} / ${formatCurrency(p.budget || 0)})</span>
                </div>
                <div class="bar-track">
                    <div class="bar-fill" style="width: ${percent}%; background: ${color};"></div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

        // ============================================
        // RENDER EXPENSES TABLE
        // ============================================
function renderExpenses(expenses = getAllExpenses()) {
    const container = document.getElementById('expensesContainer');

    expenses.sort((a, b) => {
        return new Date(b.recordedAt) - new Date(a.recordedAt);
    });


    if (expenses.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding: 20px;">
                <i class="bx bx-receipt"></i>
                <h4>No Expenses</h4>
                <p>Click "Add Expense" to record your first expense</p>
            </div>
        `;
        return;
    }

    const topExpenses = expenses.slice(0, 20);

    let tableHtml = `
        <table class="expenses-table">
            <thead>
                <tr class="table-bg">
                    <th>Description</th>
                    <th>Project</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    topExpenses.forEach(e => {
        const projectName = getProjectName(e.projectId);
        const categoryClass = 'category-' + (e.category || 'other');
        const categoryLabel = e.category ? e.category.charAt(0).toUpperCase() + e.category.slice(1) : 'Other';
        const date = e.expenseDate ? formatDate(e.expenseDate) : 'No date';

        tableHtml += `
            <tr>
                <td><strong>${escapeHtml(e.description || 'No description')}</strong></td>
                <td>${escapeHtml(projectName)}</td>
                <td><span class="category-badge ${categoryClass}">${categoryLabel}</span></td>
                <td style="color: #EF4444; font-weight: 600;">-${formatCurrency(e.amount || 0)}</td>
                <td>${date}</td>
            <td class="action-icons">
                <i class="bx bx-edit" onclick="editUser('mike.chen@pinnacle.com')" title="Edit"></i>
                <i class="bx bx-lock" onclick="toggleUserStatus(this)" title="Disable"></i>
                <i class="bx bx-trash" onclick="deleteExpenseHandler(${e.id})" title="Delete"></i>
            </td>
            </tr>
        `;
    });

    tableHtml += `
            </tbody>
        </table>
    `;

    container.innerHTML = tableHtml;
}

function deleteExpenseHandler(expenseId) {
    deleteExpense(expenseId)
    renderExpenses();
}


// RENDER TEAM MEMBERS
// ============================================
function renderMembers() {
    console.log("📋 Rendering team members...");
    
    const users = getAllUsers();
    // Filter out admin and clients
    const teamMembers = users.filter(u => u.role !== 'admin' && u.role !== 'client');
    
    const container = document.getElementById('teamContainer');

    // Update stats
    const total = teamMembers.length;
    const totalSupervisor = teamMembers.filter(u => u.role === 'supervisor').length; // to get the toatl supervisors
    const totalEngineer = teamMembers.filter(u => u.role === 'engineer').length; // to get the engineers
    const totalWorker = teamMembers.filter(u => u.role === 'worker').length;// to get the toatl workers
    const totalPm = teamMembers.filter(u => u.role === 'project_manager').length; // to get the toatl project manager
    const active = teamMembers.filter(u => u.status === 'active').length; // to get all active memebers
    const inactive = teamMembers.filter(u => u.status === 'inactive').length; // to get all in-active memebers
    const roles = new Set(teamMembers.map(u => u.role)).size; // to get the number of role available

    document.getElementById('totalMembers').textContent = total;
    document.getElementById('totalProjectManager').textContent = totalPm;
    document.getElementById('totalEngineer').textContent = totalEngineer;
    document.getElementById('totalWorker').textContent = totalWorker;

    if (teamMembers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bx bx-group"></i>
                <h4>No Team Members</h4>
                <p>Click "Add Member" to add your first team member.</p>
            </div>
        `;
        return;
    }

    const roleColors = {
        'project_manager': 'linear-gradient(135deg, #3b82f6, #60a5fa)',
        'engineer': 'linear-gradient(135deg, #22C55E, #4ade80)',
        'supervisor': 'linear-gradient(135deg, #F59E0B, #fbbf24)',
        'worker': 'linear-gradient(135deg, #a855f7, #c084fc)'
    };

    const roleDisplayNames = {
        'project_manager': 'Project Manager',
        'engineer': 'Engineer',
        'supervisor': 'Supervisor',
        'worker': 'Worker'
    };

    container.innerHTML = teamMembers.map(m => {
        const initials = m.avatar || m.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const avatarColor = roleColors[m.role] || 'linear-gradient(135deg, #6b7280, #9ca3af)';
        const roleDisplay = roleDisplayNames[m.role] || m.role;
        const statusClass = m.status === 'active' ? 'status-active' : 'status-offline';
        const statustext = m.status === 'active' ? 'Online' : 'Offline';
        const dotClass = m.status === 'active' ? 'online-dot' : 'offline-dot';
        const statusIcon = m.status === 'active' ? '<div class="online-dot"></div>' : '<div class="offline-dot"></div>';
        
        
        // if (statusClass === 'active') {
        //     document.style.color = '#22C55E';
        // }
        // if (statusClass === 'inactive') {
        //     document.style.color = 'red';
        // }

        return `

        <div class="member-card " data-role="${m.role}" data-status="${m.status}" data-name="${m.name.toLowerCase()}" data-email="${m.email.toLowerCase()}">
        <div class="mc-top">
          <div class="mc-left">
            <div class="mc-avatar" style="background:linear-gradient(135deg,#f05a1a,#ff8c5a) background: ${avatarColor};">
    ${initials}
            </div>
            <div>
              <div class="mc-name">${escapeHtml(m.name)}</div>
              <div class="mc-role">${roleDisplay}</div>
            </div>
          </div>
          <div class="online-badge ${statusClass}">${statusIcon} ${statustext}</div>
        </div>
        <div class="mc-divider"></div>
        <div class="mc-info">
          <div class="mc-info-row">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            ${escapeHtml(m.email)}
          </div>
          <div class="mc-info-row">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.83a16 16 0 0 0 6.29 6.29l1.17-.78a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            ${escapeHtml(m.phone)}
          </div>
          <span style="font-size: 12px; color: #6b6b6b;">${escapeHtml(m.department || 'No department')}</span>
        </div>
        <div class="mc-actions">
         <a href="#" class="mc-btn mc-btn-primary" onclick="viewProfile(${m.id})">👤 View Profile</a>
          <button class="mc-btn mc-btn-ghost"  onclick="messageMember(${m.id})">💬 Message</button>
          <i class="bx bx-trash btn-delete" onclick="deleteMemberHandler(${m.id})"></i>
        </div>
      </div>


        `;
    }).join('');

    console.log("✅ Team rendered!");
}

function deleteMemberHandler(expenseId) {
    deleteUser(expenseId)
    renderMembers();
}

          // ============================================
        // FILTER TEAM MEMBERS
        // ============================================
function filterMembers() {
    const searchTerm = document.getElementById('searchMember').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    const cards = document.querySelectorAll('.member-card');
    
    cards.forEach(card => {
        const name = card.dataset.name || '';
        const email = card.dataset.email || '';
        const role = card.dataset.role || '';
        const status = card.dataset.status || '';

        const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm);
        const matchesRole = roleFilter === 'all' || role === roleFilter;
        const matchesStatus = statusFilter === 'all' || status === statusFilter;

        card.style.display = (matchesSearch && matchesRole && matchesStatus) ? '' : 'none';
    });
}


// ============================================
// VIEW PROFILE
// ============================================
function viewProfile(userId) {
    window.location.href = `profile-detail.html?id=${userId}`;
}

// ============================================
// MESSAGE MEMBER
// ============================================
function messageMember(userId) {
    window.location.href = `ad-inbox.html?user=${userId}`;
}










function formatDate(dateString) {
    if (!dateString) return 'No date';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatTimeAgo(dateString) {
    if (!dateString) return 'Recently';
   
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
   
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return diffMins + 'm ago';
    if (diffHours < 24) return diffHours + 'h ago';
    if (diffDays < 7) return diffDays + 'd ago';
    return past.toLocaleDateString();
}

function getRoleDisplayName(role) {
    const names = {
        'admin': 'Admin',
        'project_manager': 'Project Manager',
        'site_engineer': 'Site Engineer',
        'supervisor': 'Supervisor',
        'contractor': 'Contractor',
        'architect': 'Architect',
        'safety_officer': 'Safety Officer',
        'worker': 'Worker',
        'client': 'Client',
        'other': 'Other'
    };
    return names[role] || role;
}




// ============================================
// ADMIN DASHBOARD LOADER
// ============================================

function loadAdminDashboard() {
    const projects = getAllProjects();
    const tasks = getAllTasks();
    const users = getAllUsers();
    const materials = getAllMaterials();
   

    
        const totalProjects = projects.length;
        const activeProjects = projects.filter(p => p.status === 'active').length;
        const delayedProjects = projects.filter(p => p.status === 'delayed' || p.status === 'on-hold').length;
        const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);


        document.getElementById('totalProjects').textContent = totalProjects;
        document.getElementById('activeProjects').textContent = activeProjects;
        document.getElementById('delayedProjects').textContent = delayedProjects;
        document.getElementById('totalBudget').textContent = formatCurrency(totalBudget);
        

        // ---- UPDATE PROJECT STATUS CHART ----
        
        if (totalProjects === 0) 
            
            return {
                completed: 0,
                inProgress: 0,
                notStarted: 0
            };
              
      
        const completed = projects.filter(p => p.status === 'completed').length;
        const inProgress = projects.filter(p => p.status === 'active').length;
        const notStarted = projects.filter(p => p.status === 'on-hold' || p.status === 'delayed').length;

     
        const chartContainer = document.getElementById('projectStatusChart');

               if (projects.length === 0) {
                chartContainer.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <i class="bx bx-folder-open" style="font-size: 48px; color: #2a2a2a;"></i>
                        <p style="color: #6b6b6b; margin-top: 12px;">No projects yet</p>
                        <a href="projects.html" style="color: #FF5200; text-decoration: none;">Create your first project</a>
                    </div>
                `;
            } else {
                // Simple visual chart
chartContainer.innerHTML = `

    <div class="progress-wrapper">
        <div class="progress-container">
            <div class="progress-bar">
            
                <div class="progress-fill" style="width:;  height: 100%;  border-radius: 4px;">${totalProjects > 0 ? Math.round((completed/totalProjects) + (inProgress/totalProjects) + (notStarted/totalProjects) *100) : 0}%</div>                      
                
            </div>
            <div class="progress-stats">
                <span class="completed">${totalProjects > 0 ? Math.round((completed/totalProjects) *100) : 0}%</span> Completed
                <span class="in-progress">${totalProjects > 0 ? Math.round((inProgress/totalProjects) *100) : 0}%</span> In Progress
                <span class="not-started">${totalProjects > 0 ? Math.round((notStarted/totalProjects) *100) : 0}%</span> Not Started
            </div>
            </div>


            
            <div style="padding: 10px 0;">
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="font-size: 13px; color: #22C55E;">● Completed</span>
                        <span style="font-size: 13px;">${completed}</span>
                    </div>
                    <div style="background: #1a1a1a; height: 8px; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${totalProjects > 0 ? (completed/totalProjects)*100 : 0}%; height: 100%; background: #22C55E; border-radius: 4px;"></div>
                    </div>
                </div>
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="font-size: 13px; color: #FF5200;">● In Progress</span>
                        <span style="font-size: 13px;">${inProgress}</span>
                    </div>
                    <div style="background: #1a1a1a; height: 8px; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${totalProjects > 0 ? (inProgress/totalProjects)*100 : 0}%; height: 100%; background: #FF5200; border-radius: 4px;"></div>
                    </div>
                </div>
                <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="font-size: 13px; color: #6b6b6b;">● Not Started / Delayed</span>
                        <span style="font-size: 13px;">${notStarted}</span>
                    </div>
                    <div style="background: #1a1a1a; height: 8px; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${totalProjects > 0 ? (notStarted/totalProjects)*100 : 0}%; height: 100%; background: #6b6b6b; border-radius: 4px;"></div>
                    </div>
                </div>
            </div>
            </div>

        `;
}


// THIS FOR THE ADMIN TO SEE ALL ACTIVITES GOING ON BOTH THE WORKERS AND CLIENT SIDE   
    // Build activities
    const activities = [];
   
    projects.forEach(p => {
        if (p.createdAt) {
            activities.unshift({
                type: 'project',
                typeLabel:`<span style=" color: #FF5200;"> ${p.name}</span>`,
                description: `New project was created`,
                createdBy: getCurrentUser().id,
                user:  p.createdBy ? getUserName(p.createdBy) : 'Admin', 
                time: formatTimeAgo(p.createdAt),
                createdAt: p.createdAt
            });
        }
    });
   
    tasks.forEach(t => {
        if (t.createdAt) {
            const projectName = getProjectName(t.projectId);
            activities.unshift({
                type: 'task',
                typeLabel: 'Task',
                description: `New task <strong>${t.title}</strong> added to <span style="color: #FF5200;">${projectName}</span>`,
                user: t.assignedTo ? getUserName(t.assignedTo) : 'Unassigned', 
                time: formatTimeAgo(t.createdAt),
                createdAt: t.createdAt
            });
        }
    });

    users.forEach(u => {
        if (u.createdAt && u.id > 6) {
            activities.unshift({
                type: 'user',
                typeLabel: 'User',
                description: `New user <strong>${u.name}</strong> signed up as <span style="color: #FF5200;">${getRoleDisplayName(u.role)}</span>`,
                 user: u.name, 
                time: formatTimeAgo(u.createdAt),
                createdAt: u.createdAt
            });
        }
    });

        // Material activities
    materials.forEach(m => {
        if (m.createdAt) {
            activities.push({
                type: 'material',
                typeLabel: 'Material',
                description: `New material "<strong style="color: #FF5200;">${m.materialName}</strong>" added (${m.quantity} ${m.unit})`,
                user: 'Admin',
                time: formatTimeAgo(m.createdAt),  
                createdAt: m.createdAt                   
            });
        }
    });

    renderActivities(activities, 'containerId');
}



// ============================================
// WORKER DASHBOARD LOADER
// ============================================

function loadWorkerDashboard() {
    const user = getCurrentUser();
    if (!user) return;

    console.log('User:', user.name, 'ID:', user.id);
   
    const allProjects = getAllProjects();
    const allTasks = getAllTasks();

      console.log("📋 Total projects:", allProjects.length);
    console.log("📋 Total tasks:", allTasks.length);
   
   
  // ✅ Check how projects are assigned
    // A worker can be assigned as PM, Engineer, or in assignedTeam
    const myProjects = allProjects.filter(project => {
        const isPM = project.projectManagerId === user.id;
        const isEngineer = project.leadEngineerId === user.id;
        const isInTeam = project.assignedTeam && project.assignedTeam.includes(user.id);
        
        // ✅ Log each project to see why it's being filtered
        if (isPM || isEngineer || isInTeam) {
            console.log(`✅ ${user.name} is assigned to:`, project.name);
            console.log(`   isPM: ${isPM}, isEngineer: ${isEngineer}, isInTeam: ${isInTeam}`);
            return true;
        }
        return false;
    });
   
    console.log("📋 My projects:", myProjects.length);
    
     // ✅ If no projects found, log all projects to see what's wrong
    if (myProjects.length === 0) {
        console.log("📋 All projects with their assignments:");
        allProjects.forEach(p => {
            console.log(`  ${p.name}: PM:${p.projectManagerId}, Engineer:${p.leadEngineerId}, Team:${p.assignedTeam}`);
        });
    }
   
    // Find tasks assigned to this user
    const myTasks = allTasks.filter(t => t.assignedTo === user.id);
   
    // Stats
    const pending = myTasks.filter(t => t.status !== 'completed' && t.status !== 'done');
    const completed = myTasks.filter(t => t.status === 'completed' || t.status === 'done');
   
    const today = new Date();
    const overdue = myTasks.filter(t => {
        if (t.dueDate && t.status !== 'completed' && t.status !== 'done') {
            const dueDate = new Date(t.dueDate);
            return dueDate < today;
        }
        return false;
    });
    
    
    // Update stats
       
    // ✅ SAFE: Check each element before updating
    const myProjectsEl = document.getElementById('myOwnProjects');
    if (myProjectsEl) {
        myProjectsEl.textContent = myProjects.length;
        console.log(`✅ Updated myProjects to: ${myProjects.length}`);
    } else {
        console.warn("⚠️ Element #myProjects not found in HTML");
    }
    
    const pendingTasksEl = document.getElementById('pendingTasks');
    if (pendingTasksEl) {
        pendingTasksEl.textContent = pending.length;
        console.log(`✅ Updated pendingTasks to: ${pending.length}`);
    } else {
        console.warn("⚠️ Element #pendingTasks not found in HTML");
    }
    
    const completedTasksEl = document.getElementById('completedTasks');
    if (completedTasksEl) {
        completedTasksEl.textContent = completed.length;
        console.log(`✅ Updated completedTasks to: ${completed.length}`);
    } else {
        console.warn("⚠️ Element #completedTasks not found in HTML");
    }
    
    const dueTasksEl = document.getElementById('dueTasks');
    if (dueTasksEl) {
        dueTasksEl.textContent = overdue.length;
        console.log(`✅ Updated dueTasks to: ${overdue.length}`);
    } else {
        console.warn("⚠️ Element #dueTasks not found in HTML");
    }
   
        // document.getElementById('myOwnProjects').textContent = myProjects.length,
        // document.getElementById('pendingTasks').textContent = pending,
        // document.getElementById('completedTasks').textContent = completed,
        // document.getElementById('dueTasks').textContent = overdue.length, 
   
    // Render projects and tasks
    renderWorkerProjects(myProjects);
    renderWorkerTasks(myTasks);
   
    // Build activities
    const activities = [];
   
    myTasks.forEach(t => {
        if (t.createdAt) {
            const projectName = allProjects.find(p => p.id === t.projectId)?.name || 'Unknown';
            activities.unshift({
                type: 'task',
                typeLabel: 'Task',
                description: `Task <strong>${t.title}</strong> ${t.status === 'completed' || t.status === 'done' ? 'completed' : 'updated'}`,
                user: user.name,
                time: formatTimeAgo(t.updatedAt || t.createdAt)
            });
        }
    });
   
    myProjects.forEach(p => {
        if (p.createdAt) {
            activities.unshift({
                type: 'project',
                typeLabel: 'Project',
                description: `Assigned to project <strong>${p.name}</strong>`,
                user: user.name,
                time: formatTimeAgo(p.createdAt)
            });
        }
    });
   
    renderActivities(activities, 'activityContainer');
}



// ============================================
// RENDER WORKER PROJECTS - COMPLETE FIX
// ============================================

function renderWorkerProjects(projects) {
    console.log("📋 Rendering worker projects:", projects);
    console.log("📋 Projects count:", projects ? projects.length : 0);
   
    const container = document.getElementById('projectsContainer');

    
    if (!container) {
        console.warn("⚠️ projectsContainer not found");
        return;
    }

    // ✅ Check if projects is valid
    if (!projects || !Array.isArray(projects) || projects.length === 0) {
        console.log("📋 No projects to display");
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 40px; color: #6b6b6b;">
                <i class="bx bx-folder" style="font-size: 48px;"></i>
                <h4 style="margin-top: 12px;">No Projects</h4>
                <p>You are not assigned as Project Manager on any projects yet.</p>
            </div>
        `;
        return;
    }

    // ✅ Log each project to see what data we have
    projects.forEach((p, index) => {
        console.log(`📋 Project ${index + 1}:`, p);
        console.log(`   Name: ${p.name || 'undefined'}`);
        console.log(`   Location: ${p.location || 'undefined'}`);
        console.log(`   Progress: ${p.progress || 'undefined'}`);
        console.log(`   Status: ${p.status || 'undefined'}`);
    });

    let html = '';
   
    projects.forEach((p, index) => {
        // ✅ Provide fallbacks for ALL fields
        const projectName = p?.name || `Project ${index + 1}`;
        const projectLocation = p?.location || 'No location set';
        const progress = typeof p?.progress === 'number' ? p.progress : 0;
        const status = p?.status || 'Active';

        // determine woekers role on the project
        let roleOnProject = '';
        let roleColor = '';
        let roleIcon = '';

        if (p.projectManagerId === currentUser.id) {
            roleOnProject = 'Project Manager';
            roleColor = '#FF5200';
        } else if (p.leadEngineerId === currentUser.id) {
            roleOnProject = 'Lead Engineer';
            roleColor = '#3b82f6';
        }else if (p.assignedTeam && p.assignedTeam.includes(currentUser.id)) {
            roleOnProject = 'Team Member';
            roleColor = '#22C556';
        } else {
            roleOnProject = 'Assigned';
            roleColor = '#9a9a9a'
        }
       
        // ✅ Status color
        let statusColor = '#F59E0B';
        if (status.toLowerCase() === 'active') statusColor = '#22C55E';
        else if (status.toLowerCase() === 'completed') statusColor = '#3b82f6';
        else if (status.toLowerCase() === 'delayed') statusColor = '#EF4444';
       
        // ✅ Progress color
        const progressColor = progress > 70 ? '#22C55E' : progress > 40 ? '#FF5200' : '#EF4444';

        html += `

                 <div class="project-card">
                        <div class="project-card-head">
                            <div class="project-card-text">
                                <h4> ${projectName}</h4>
                                <p> ${projectLocation}</p>
                            </div>
                            <span style="color:  ${statusColor}; ">${status}</span>
                        </div>
                        <div class="project-progress-container">
                            <div class="project-progress-wrapper">
                                <div style="width: ${progress}%; height: 100%; background: ${progressColor}; border-radius: 3px;"></div>
                            </div>
                            <span>${progress}%</span>
                        </div>
                        <div class="start-date">
                            <p>My Role</p>
                            <span style="color: ${roleColor};">${roleOnProject}</span>
                        </div>
                        <div class="start-date">
                            <p>Due Date</p>
                            <span>${p.endDate ? formatDate(p.endDate) : ''}</span>
                        </div>
                        <div class="start-date">
                            <p>Budget</p>
                            <span>&#8358; ${(p.budget||0).toLocaleString()}</span>
                        </div>

                    <div class="view-details">
                    <a href="projects-details.html">View Details</a>
                    </div>
                    </div> 




        `;
    });

    container.innerHTML = html;
    console.log("✅ Worker projects rendered successfully!");
}



        



        function renderWorkerTasks(tasks) {
            console.log("🔵 renderWorkerTasks() called");
            
            // const user = getCurrentUser();
            // if (!user) return;
            
            // const allTasks = getAllTasks();
            // const myTasks = allTasks.filter(t => t.assignedTo === user.id);
          tasks.sort((a, b) => {
                 return new Date(b.createdAt) - new Date(a.createdAt);
             });

            
            const container = document.getElementById('tasksContainer');
            if (!container) return;
   
          container.innerHTML = `hgnghnghc`

            if (!tasks || tasks.length === 0) {
                container.innerHTML = `
                     <div class="empty-state">
                        <i class="bx bx-check-circle"></i>
                        <h4>No Tasks</h4>
                        <p>You have no tasks assigned.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = tasks.slice(0, 10).map(t => {
                const statusClass = t.status === 'pending' ? 'status-pending' : 
                                   t.status === 'in_progress' ? 'status-progress' : 'status-completed';
                const statusDisplay = t.status === 'in_progress' ? 'In Progress' : 
                                     t.status === 'done' ? 'Completed' : 
                                     t.status || 'Pending';

                const priorityClass = t.priority === 'high' ? 'priority-high' :
                                     t.priority === 'medium' ? 'priority-medium' : 'priority-low';
                const priorityDisplay = t.priority ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1) : 'medium';
                                     
                const projectName = getProjectName(t.projectId);

                // Due Date
                const dueDate = t.dueDate ? formatDate(t.dueDate) : 'No date';


              
                // OverDue Date
                const isOverDue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed';
              
                return `

                <div class="task-card" data-status="in-progress">
                    <div class="task-header">
                        <span class="task-title">${t.title}</span>

                        <select class="status-select" onchange="updateTaskStatus(${t.id}, this.value)">
                            <option value="pending" ${t.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="in_progress" ${t.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                            <option value="completed" ${t.status === 'completed' ? 'selected' : ''}>Completed</option>
                            <option value="delayed" ${t.status === 'delayed' ? 'selected' : ''}>Delayed</option>
                        </select>
                    </div>
                    <div class="task-project">📁 ${projectName}</div>
                    <div style="display: flex; justify-content: space-between; margin-top: 12px;">
                    <div>
                        <span class="task-due">Due: ${dueDate}</span>
                    </div>
                        <span class="priority-high ${priorityClass}">● ${priorityDisplay}</span>
                    </div>
                </div>
                    <div class="task-item">
            
                        <span class="task-status ${statusClass}"></span>
                    </div>
                `;
            }).join('');

              if (!dueDate) {
                document.querySelector('.task-due').textContent = `OverDue: ${dueDate}`
            }
            else {
                document.querySelector('.task-due').textContent = `isOverDue: ${isOverDue}`
            }
        

        }

// ============================================
// UPDATE TASK STATUS
// ============================================
function updateTaskStatus(taskId, newStatus) {
    console.log(`🔄 Updating task ${taskId} to ${newStatus}`);
    
    const tasks = getAllTasks();
    const idx = tasks.findIndex(t => t.id === taskId);
    
    if (idx !== -1) {
        tasks[idx].status = newStatus;
        tasks[idx].updatedAt = new Date().toISOString();
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        addActivity(`Task "${tasks[idx].title}" status updated to ${newStatus}`, 'task');
        loadTasks();
        
        console.log(`✅ Task ${taskId} updated to ${newStatus}`);
    }
}


updateNotificationDot();

let allNotification = [];

function loadNotification() {
    console.log('📋 Loading notifications...');

    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.warn('⚠️ No user logged in');
        const container = document.getElementById('notificationsContainer');
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="bx bx-lock"></i>
                    <h4>Please Login</h4>
                    <p>You need to be logged in to view notifications.</p>
                </div>
            `;
        }
        return;
    }

    const allNotifications = getAllNotifications();
    
    // ✅ Filter by current user
    const userNotifications = allNotifications.filter(n => n.userId === currentUser.id);

    console.log(`📋 Found ${userNotifications.length} notifications for ${currentUser.name}`);

    // Sort by newest first
    userNotifications.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    allNotification = userNotifications;

    // Update stats
    updateStats(userNotifications);

    // Render notifications
    renderNotifications(userNotifications);

    // Update notification dot
    updateNotificationDot();

    console.log('✅ Notifications loaded successfully!');
}


// ============================================
// UPDATE STATS
// ============================================
function updateStats(notifications) {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.isRead).length;
    const read = notifications.filter(n => n.isRead).length;
    const types = new Set(notifications.map(n => n.type)).size;

    document.getElementById('totalNotifications').textContent = unread;
    document.getElementById('unreadNotifications').textContent = unread;
    document.getElementById('readNotifications').textContent = read;
    document.getElementById('typeCount').textContent = types || 0;
}


  // ============================================
        // RENDER NOTIFICATIONS
        // ============================================
function renderNotifications(notifications = getAllNotifications()) {
    console.log('notification called')

    const container = document.getElementById('notificationsContainer');

    if (!container) return;

    // ✅ Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.warn('⚠️ No user logged in');
        container.innerHTML = `
            <div class="empty-state">
                <i class="bx bx-lock"></i>
                <h4>Please Login</h4>
                <p>You need to be logged in to view notifications.</p>
            </div>
        `;
        return;
    }

    // ✅ FILTER: Only show notifications for the current user
    const userNotifications = notifications.filter(n => n.userId === currentUser.id);

    console.log(`📋 Found ${userNotifications.length} notifications for user ${currentUser.name}`);

    if (userNotifications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bx bx-bell-off"></i>
                <h4>No Notifications</h4>
                <p>You're all caught up! No notifications to display.</p>
            </div>
        `;
        return;
    }

    // Sort by newest first
    userNotifications.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    let html = '';

    userNotifications.forEach(n => {
        const isRead = n.isRead || false;
        const iconMap = {
            'task': '📋',
            'project': '📁',
            'message': '💬',
            'material': '📦',
            'report': '📊',
            'system': '⚙️'
        };
        const icon = iconMap[n.type] || '🔔';
        const time = n.createdAt ? formatTimeAgo(n.createdAt) : 'Just now';
        html += `


            <div class="notify-card ${isRead ? '' : 'unread'}" 
            data-id="${n.id}"  
            data-type="${n.type}"               
            data-status="${isRead ? 'read' : 'unread'}"
                    onclick="markAsRead(${n.id})">
            <div class="notify-content">
                <div class="notify-icon  ${iconClass}" >
                    ${icon}
                </div>
                <div class="notify-text">
                    <h4>${escapeHtml(n.title)}</h4>
                    <p>${escapeHtml(n.message)}</p>
                    <div class="notify-time">${time}</div>

                    <span class="badge ${isRead ? 'badge-read' : 'badge-unread'}">
                            ${isRead ? '✅ Read' : '🔴 Unread'}
                        </span>
                        <span style="font-size: 11px; color: #6b6b6b; text-transform: capitalize;">
                            ${n.type || 'System'}
                        </span>
                </div>
            </div>
                <div class="action-icons">
                    ${!isRead ? `<button class="mark-read" onclick="event.stopPropagation(); markAsRead(${n.id})">Mark read</button>` : ''}
                       <i class="bx bx-trash" onclick="deleteNotify(${n.id})" title="Delete"></i>
                    
            </div>
        </div>



        `;
    });

    
    container.innerHTML = html;
}

function markAsRead(notificationId) {
    markNotificationAsRead(notificationId)
    renderNotifications();
}

function markAllAsRead() {
if (!confirm('Mark all notifications as read?')) return;
    
    const notifications = getAllNotifications();
    notifications.forEach(n => {
        n.isRead = true;
        n.readAt = new Date().toISOString();
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // Update notification dot
    updateNotificationDot();
    
    // Reload notifications
    loadNotification();
    
    alert('✅ All notifications marked as read!');
}

        
    function updateNotificationDot() {
        const currentUser = getCurrentuser();
        if (!currentUser) {
            const dot = document.querySelector('.notify-dot');
            if (dot) dot.style.display = 'none';
            return;
        }
        const notifications = getAllNotificatiions();
        
        const unreadCount = getUnreadNotificationCount();
        const dot = document.querySelector('.notify-dot');
        if (dot) {
            if (unreadCount > 0) {
                dot.style.display = 'block';
                dot.textContent = unreadCount;
            } else {
                dot.style.display = 'none';
            }
        }
    }


// ============================================
// DELETE NOTIFICATION
// ============================================
function deleteNotify(notificationId) {
    deleteNotification(notificationId);
    renderNotifications();
}



function deleteAllNotifications() {
    if (!confirm('Delete all notifications? This cannot be undone.')) return;

     let notifications = getAllNotifications();
         notifications.forEach(n => {
        if (n.id === currentUser.id ) {
            n.id = true;
        }
    });
    localStorage.setItem('notifications', JSON.stringify([]));
    
        // Update notification dot
    updateNotificationDot();
    
    // Reload notifications
    loadNotification();
  
    alert('✅ All notifications cleared!');
}



 function updateMyTask() {
    const tasks = getAllTasks();

    
    const taskList = document.getElementById('taskList');
    const visibleTasks = tasks.slice(0, 3);

     

    taskList.innerHTML = visibleTasks.map(task => {
        const statusClass = task.status === 'pending' ? 'status-pending' : 
                            task.status === 'in_progress' ? 'status-progress' : 'status-completed';
        const statusDisplay = task.status === 'in_progress' ? 'In Progress' : 
                        task.status === 'done' ? 'Completed' : 
                        task.status || 'Pending';

        const projectName = getProjectById(task.projectId);

     return   `
        <div>
            <h4 style="font-size: 14px;">${task.title}</h4>
            <p style="font-size: 12px; color: #9a9a9a;">${projectName}</p>
        </div>
        <span class="${task.status}" style="color: #F59E0B; font-size: 12px; ${statusClass}">${statusDisplay}</span>
    `}).join('');

    document.getElementById('taskCount').textContent = `${tasksData.length} tasks`;
 }




// ============================================
// CLIENT DASHBOARD LOADER
// ============================================

function loadClientDashboard() {
    const user = getCurrentUser();
    if (!user) return;
   
    const projects = getAllProjects();
    const users = getAllUsers();
    const clientData = users.find(u => u.id === user.id);
    const clientProjectId = clientData?.clientProjectId;
   
    let myProject = null;
    if (clientProjectId) {
        myProject = projects.find(p => p.id === clientProjectId);
    }
   
    const container = document.getElementById('projectContainer');
    if (!container) return;
   
    if (!myProject) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bx bx-building-house" style="font-size: 48px;"></i>
                <h4>No Project Yet</h4>
                <p>You don't have any active projects at the moment.</p>
                <p style="font-size: 13px;">Contact your project manager for updates.</p>
            </div>
        `;
        return;
    }
   
    // Find project manager name
    const pm = users.find(u => u.id === myProject.projectManagerId);
    const pmName = pm ? pm.name : 'Not assigned';
   
    // Calculate budget used (from expenses)
    const expenses = getAllExpenses();
    const projectExpenses = expenses.filter(e => e.projectId === myProject.id);
    const totalSpent = projectExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const budgetUsed = myProject.budget ? Math.round((totalSpent / myProject.budget) * 100) : 0;
   
    container.innerHTML = `
        <div class="project-detail">
            <h2 style="color: #FF5200; font-size: 24px;">${myProject.name}</h2>
            <p style="color: #9a9a9a; margin: 8px 0;">📍 ${myProject.location || 'Location not set'}</p>
            <p style="color: #9a9a9a; margin: 4px 0;">📋 ${myProject.description || 'No description'}</p>
           
            <div style="margin: 20px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Project Progress</span>
                    <span style="color: #FF5200; font-weight: 600;">${myProject.progress || 0}%</span>
                </div>
                <div style="background: #1a1a1a; height: 10px; border-radius: 5px; overflow: hidden;">
                    <div style="width: ${myProject.progress || 0}%; height: 100%; background: #FF5200; border-radius: 5px;"></div>
                </div>
            </div>
           
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0;">
                <div style="background: #0a0a0a; padding: 16px; border-radius: 8px; border: 1px solid #1a1a1a;">
                    <p style="color: #9a9a9a; font-size: 12px;">Project Manager</p>
                    <p style="font-weight: 600;">${pmName}</p>
                </div>
                <div style="background: #0a0a0a; padding: 16px; border-radius: 8px; border: 1px solid #1a1a1a;">
                    <p style="color: #9a9a9a; font-size: 12px;">Status</p>
                    <p style="font-weight: 600; color: ${myProject.status === 'active' ? '#22C55E' : '#F59E0B'};">${myProject.status || 'Active'}</p>
                </div>
            </div>
           
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 16px 0;">
                <div style="text-align: center; padding: 12px; background: #0a0a0a; border-radius: 8px;">
                    <p style="font-size: 20px; font-weight: 700; color: #3b82f6;">${formatDate(myProject.startDate)}</p>
                    <p style="color: #9a9a9a; font-size: 11px;">Start Date</p>
                </div>
                <div style="text-align: center; padding: 12px; background: #0a0a0a; border-radius: 8px;">
                    <p style="font-size: 20px; font-weight: 700; color: #FF5200;">${formatDate(myProject.endDate)}</p>
                    <p style="color: #9a9a9a; font-size: 11px;">End Date</p>
                </div>
                <div style="text-align: center; padding: 12px; background: #0a0a0a; border-radius: 8px;">
                    <p style="font-size: 20px; font-weight: 700; color: #22C55E;">${formatCurrency(myProject.budget || 0)}</p>
                    <p style="color: #9a9a9a; font-size: 11px;">Budget</p>
                </div>
            </div>
           
            <div style="text-align: center; margin-top: 16px;">
                <a href="messages.html" style="background: #FF5200; color: #fff; text-decoration: none; padding: 10px 24px; border-radius: 8px; display: inline-block;">
                    💬 Message Project Manager
                </a>
            </div>
        </div>
    `;
}

// ============================================
// GET PROJECT NAME (Helper)
// ============================================

function getProjectName(projectId) {
    const projects = getAllProjects();
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// ============================================
// GET USER NAME (Helper)
// ============================================

function getUserName(userId) {
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
}

// ============================================
// AUTO-DETECT AND LOAD CORRECT DASHBOARD
// ============================================

function loadDashboard() {

    const path = window.location.pathname;

    if (path.includes('projects-details.html')) {
        loadProjectDetails();
        return;
    }
    // if (path.includes('tasks.html')) {
    //     renderTasks();
    //     return;
    // }

    const user = checkDashboardAuth();
    if (!user) return;
    
    if (path.includes('/admin/')) {
        console.log("📊 Loading Admin Dashboard");
        loadAdminDashboard();
    } else if (path.includes('/workers/')) {
        console.log("📊 Loading Worker Dashboard");
        loadWorkerDashboard();
    } else if (path.includes('/client/')) {
        console.log("📊 Loading Client Dashboard");
        loadClientDashboard();
    }
}

// ============================================
// RUN ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', loadDashboard);

console.log("✅ Dashboard.js ready!");


