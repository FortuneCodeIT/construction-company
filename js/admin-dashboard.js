// check Auth

const user = getCurrentUser();
if (!user || user.role !== 'admin') {
    window.location.href = '../login.html';
}

// update header
document.getElementById('userName').textContent = user.name;
document.getElementById('userRole').textContent = 'Administration';
document.getElementById('roleDisplay').textContent = 'Admin';

function loadDashboard() {
            const user = getCurrentUser();
            if (!user) return;

            console.log("📊 Loading dashboard for:", user.name);

            // Update greeting
            const greeting = document.getElementById('greeting');
            const hour = new Date().getHours();
            let timeGreeting = 'Good Morning';
            if (hour >= 12 && hour < 17) timeGreeting = 'Good Afternoon';
            else if (hour >= 17) timeGreeting = 'Good Evening';
            greeting.textContent = `${timeGreeting}, ${user.name}!`;

            // Get data from localStorage
            const projects = getAllProjects();
            const tasks = getAllTasks();
            const users = getAllUsers();

            // ---- UPDATE STATS ----
            const totalProjects = projects.length;
            const activeProjects = projects.filter(p => p.status === 'active').length;
            const delayedProjects = projects.filter(p => p.status === 'delayed' || p.status === 'on-hold').length;
            const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

            document.getElementById('totalProjects').textContent = totalProjects;
            document.getElementById('activeProjects').textContent = activeProjects;
            document.getElementById('delayedProjects').textContent = delayedProjects;
            document.getElementById('totalBudget').textContent = formatCurrency(totalBudget);

            // ---- UPDATE PROJECT STATUS CHART ----
            const completed = projects.filter(p => p.status === 'completed').length;
            const inProgress = projects.filter(p => p.status === 'active').length;
            const notStarted = projects.filter(p => p.status === 'on-hold' || p.status === 'delayed').length;

            // const chartContainer = document.getElementById('projectStatusChart');

            // if (projects.length === 0) {
            //     chartContainer.innerHTML = `
            //         <div style="text-align: center; padding: 20px;">
            //             <i class="bx bx-folder-open" style="font-size: 48px; color: #2a2a2a;"></i>
            //             <p style="color: #6b6b6b; margin-top: 12px;">No projects yet</p>
            //             <a href="projects.html" style="color: #FF5200; text-decoration: none;">Create your first project</a>
            //         </div>
            //     `;
            // } else {
            //     // Simple visual chart
            //     chartContainer.innerHTML = `
            //         <div style="padding: 10px 0;">
            //             <div style="margin-bottom: 12px;">
            //                 <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            //                     <span style="font-size: 13px; color: #22C55E;">● Completed</span>
            //                     <span style="font-size: 13px;">${completed}</span>
            //                 </div>
            //                 <div style="background: #1a1a1a; height: 8px; border-radius: 4px; overflow: hidden;">
            //                     <div style="width: ${totalProjects > 0 ? (completed/totalProjects)*100 : 0}%; height: 100%; background: #22C55E; border-radius: 4px;"></div>
            //                 </div>
            //             </div>
            //             <div style="margin-bottom: 12px;">
            //                 <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            //                     <span style="font-size: 13px; color: #FF5200;">● In Progress</span>
            //                     <span style="font-size: 13px;">${inProgress}</span>
            //                 </div>
            //                 <div style="background: #1a1a1a; height: 8px; border-radius: 4px; overflow: hidden;">
            //                     <div style="width: ${totalProjects > 0 ? (inProgress/totalProjects)*100 : 0}%; height: 100%; background: #FF5200; border-radius: 4px;"></div>
            //                 </div>
            //             </div>
            //             <div>
            //                 <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            //                     <span style="font-size: 13px; color: #6b6b6b;">● Not Started / Delayed</span>
            //                     <span style="font-size: 13px;">${notStarted}</span>
            //                 </div>
            //                 <div style="background: #1a1a1a; height: 8px; border-radius: 4px; overflow: hidden;">
            //                     <div style="width: ${totalProjects > 0 ? (notStarted/totalProjects)*100 : 0}%; height: 100%; background: #6b6b6b; border-radius: 4px;"></div>
            //                 </div>
            //             </div>
            //         </div>
            //     `;
            // }

            // // ---- UPDATE RECENT ACTIVITY ----
            // const activityContainer = document.getElementById('recentActivity');
           
            // Create activity from projects and tasks
            let activities = [];

            // Add project creation activities
            projects.forEach(p => {
                if (p.createdAt) {
                    activities.push({
                        type: 'project',
                        typeLabel: 'Project',
                        typeClass: 'project',
                        description: `New project <strong>${p.name}</strong> was created`,
                        user: p.createdBy ? getUserName(p.creaatedBy) : 'Admin',
                        time: formatTimeAgo(p.createdAt)
                        
                    });
                }
            });

            // Add task activities
            tasks.forEach(t => {
                if (t.createdAt) {
                    activities.push({
                        type: 'task',
                        typeLabel: 'Task',
                        typeClass: 'task',
                        description: `New Task "<strong>${t.title}</strong>" was created for <strong>${getProjectName(t.projectId)}</strong>`,
                        user: t.assignedTo ? getUserName(t.assignedTo) : 'Unassigned',
                        time: formatTimeAgo(t.createdAt)                      
                    });
                }
            });

            // Add user activities
            users.forEach(u => {
                if (u.createdAt && u.id > 6) {
                    activities.push({
                        type: 'user',
                        typeLabel: 'User',
                        typeClass: 'user',
                        description: `New user <strong>${u.name}</strong>" signed up as <span class="highlight">${getRoleDisplayName(u.role)}</span>`,
                        user: u.name,
                        time: formatTimeAgo(t.createdAt)                      
                    });
                }
            });


            // Material activities
            const materials = getAllMaterials();
            materials.forEach(m => {
                if (m.createdAt) {
                    activities.push({
                        type: 'material',
                        typeLabel: 'Material',
                        typeClass: 'material',
                        description: `New material <strong>${m.name}</strong>" added (${m.quantity} ${m.unit})`,
                        user: 'Admin',
                        time: formatTimeAgo(t.createdAt)                      
                    });
                }
            });

            // Sort by time (most recent first)
            activities.sort((a, b) => {
                const aTime = a.time === 'Just now' ? 0 : parseInt(a.time) || 999;
                const bTime = b.time === 'Just now' ? 0 : parseInt(b.time) || 999;
                return aTime - bTime;
            });



            // Limit to 5
            activities = activities.slice(0, 5);

        const activityContainer = document.getElementById('recentActivity');

            if (activities.length === 0) {
                activityContainer.innerHTML = `
                    <div style="text-align: center; padding: 20px; color: #6b6b6b;">
                        <i class="bx bx-hourglass"></i>
                        No recent activity
                    </div>
                `;
            } else {
                const topActivities = activities.slice(0, 10);

                let tableHtml = `
                    <table style="width: 100%;">
                        <thead>
                            <tr class="table-bg">
                                <th>Activitiy</th>
                                <th>Type</th>
                                <th>User</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                    `;

                    topActivities.forEach(a => {
                        tableHtml = `
                            <tr>
                                <td>${a.description}</td>
                                <td>
                                    <span class="type-badge ${a.typeClass}">${a.typeLabel}</span>
                                </td>
                                <td>${a.user}</td>
                                <td style="color: #6b6b6b; font-size: 13px;">${a.time}</td>
                            </tr>
                        `;
                    });

                    tableHtml += `
                        </tbody>                  
                    </table>
                    `;
                
                activityContainer.innerHTML = tableHtml;
                //  activityContainer.innerHTML = activities.splice(0, 10).map(a => `
                //     <div class="activities-table">
                //         <div class="act-dot" style="background: ${a.type === 'project' ? '#22C55E' : '#3b82f6'};"></div>
                //         <div class="act-text">${a.text}</div>
                //         <div class="act-time">${a.time}</div>
                //     </div>
                // `).join('');
            }


            // ---- UPDATE RECENT PROJECTS TABLE ----
            // const tableContainer = document.getElementById('recentProjectsTable');
           
            // if (projects.length === 0) {
            //     tableContainer.innerHTML = `
            //         <div style="text-align: center; padding: 40px; color: #6b6b6b;">
            //             No projects created yet
            //         </div>
            //     `;
            // } else {
            //     // Get 5 most recent projects
            //     const recentProjects = projects.slice(0, 5);
               
            //     let tableHtml = `
            //         <table style="width: 100%;">
            //             <thead>
            //                 <tr class="table-bg">
            //                     <th>Project</th>
            //                     <th>Location</th>
            //                     <th>Status</th>
            //                     <th>Progress</th>
            //                     <th>Budget</th>
            //                 </tr>
            //             </thead>
            //             <tbody>
            //     `;

            //     recentProjects.forEach(p => {
            //         const statusColors = {
            //             'active': '#22C55E',
            //             'completed': '#3b82f6',
            //             'delayed': '#EF4444',
            //             'on-hold': '#F59E0B'
            //         };
            //         const statusColor = statusColors[p.status] || '#9a9a9a';
                   
            //         tableHtml += `
            //             <tr>
            //                 <td><strong>${p.name}</strong></td>
            //                 <td>${p.location || 'N/A'}</td>
            //                 <td style="color: ${statusColor};">${p.status || 'N/A'}</td>
            //                 <td>
            //                     <div style="display: flex; align-items: center; gap: 10px;">
            //                         <div style="width: 80px; background: #1a1a1a; height: 6px; border-radius: 3px; overflow: hidden;">
            //                             <div style="width: ${p.progress || 0}%; height: 100%; background: ${statusColor}; border-radius: 3px;"></div>
            //                         </div>
            //                         <span style="font-size: 12px;">${p.progress || 0}%</span>
            //                     </div>
            //                 </td>
            //                 <td>${formatCurrency(p.budget || 0)}</td>
            //             </tr>
            //         `;
            //     });

            //     tableHtml += `
            //             </tbody>
            //         </table>
            //     `;

            //     tableContainer.innerHTML = tableHtml;
            // }

            const unreadCount = getUnreadNotificationCount();
            const dot = document.getElementById('notifyDot');

        if (unreadCount > 0) {
            dot.style.display = "block";
            dot.textContent = unreadCount
        } else {
            dot.style.display = "none";
        }
        }

        // ============================================
        // HELPER FUNCTIONS
        // ============================================

        function getProjectName(projectId) {
            const projects = getAllProjects();
            const project = projects.find(p => p.id === projectId);
            return project ? project.name : 'Unknown Project';
        }

        function getUserName(userId) {
            const users = getAllProjects();
            const user = users.find(u => u.id === userId);
            return user ? user.name : 'Unknown';
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
            }
            return names[role] || role;
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
        // LOAD ON PAGE READY
        // ============================================

        document.addEventListener('DOMContentLoaded', function() {
            // Update header with user info
            const user = getCurrentUser();
            if (user) {
                document.getElementById('userName').textContent = user.name;
                document.getElementById('userRole').textContent = getRoleDisplayName(user.role);
            }
           
            loadDashboard();
        });

        console.log("✅ Admin dashboard loaded!");