// ============================================
        // CHECK AUTH
        // ============================================
        const user = getCurrentUser();
        if (!user || user.role === 'admin' || user.role === 'client') {
            // If admin or client, redirect to their dashboards
            if (user && user.role === 'admin') {
                window.location.href = '../admin/dashboard.html';
            } else if (user && user.role === 'client') {
                window.location.href = '../client/my-project.html';
            } else {
                window.location.href = '../login.html';
            }
        }

        // Update header
        document.getElementById('userName').textContent = user.name;
        const roleDisplay = getRoleDisplayName(user.role);
        document.getElementById('userRole').textContent = roleDisplay;
        document.getElementById('roleDisplay').textContent = roleDisplay;

        // ============================================
        // LOAD DASHBOARD DATA
        // ============================================
        function loadDashboard() {
            const allProjects = getAllProjects();
            const allTasks = getAllTasks();
            const allUsers = getAllUsers();

            // Find projects assigned to this user
            const myProjects = allProjects.filter(p =>
                p.projectManagerId === user.id ||
                p.leadEngineerId === user.id ||
                (p.assignedTeam && p.assignedTeam.includes(user.id))
            );

            // Find tasks assigned to this user
            const myTasks = allTasks.filter(t => t.assignedTo === user.id);

            // Stats
            const pending = myTasks.filter(t => t.status !== 'completed' && t.status !== 'done');
            const completed = myTasks.filter(t => t.status === 'completed' || t.status === 'done');

            // Overdue tasks (due date passed and not completed)
            const today = new Date();
            const overdue = myTasks.filter(t => {
                if (t.dueDate && t.status !== 'completed' && t.status !== 'done') {
                    const dueDate = new Date(t.dueDate);
                    return dueDate < today;
                }
                return false;
            });

            document.getElementById('myProjects').textContent = myProjects.length;
            document.getElementById('pendingTasks').textContent = pending.length;
            document.getElementById('completedTasks').textContent = completed.length;
            document.getElementById('dueTasks').textContent = overdue.length;

            // ============================================
            // RENDER MY PROJECTS
            // ============================================
            const projectsContainer = document.getElementById('projectsContainer');

            if (myProjects.length === 0) {
                projectsContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="bx bx-folder"></i>
                        <h4>No Projects Assigned</h4>
                        <p>You haven't been assigned to any projects yet</p>
                    </div>
                `;
            } else {
                projectsContainer.innerHTML = myProjects.slice(0, 5).map(p => {
                    const progressColor = p.status === 'completed' ? '#22C55E' :
                                         p.status === 'delayed' ? '#EF4444' : '#FF5200';
                    return `
                        <div class="project-item">
                            <div class="project-info">
                                <div class="name">${p.name}</div>
                                <div class="location">📍 ${p.location || 'No location'}</div>
                            </div>
                            <div class="project-progress">
                                <div class="bar">
                                    <div class="fill" style="width: ${p.progress || 0}%; background: ${progressColor};"></div>
                                </div>
                                <span class="percent">${p.progress || 0}%</span>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            // ============================================
            // RENDER MY TASKS
            // ============================================
            const tasksContainer = document.getElementById('tasksContainer');

            if (myTasks.length === 0) {
                tasksContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="bx bx-check-circle"></i>
                        <h4>No Tasks Assigned</h4>
                        <p>You don't have any tasks yet</p>
                    </div>
                `;
            } else {
                tasksContainer.innerHTML = myTasks.slice(0, 5).map(t => {
                    const statusClass = t.status === 'pending' ? 'status-pending' :
                                       t.status === 'in_progress' ? 'status-progress' :
                                       t.status === 'completed' || t.status === 'done' ? 'status-completed' : 'status-delayed';
                   
                    const statusDisplay = t.status === 'in_progress' ? 'In Progress' :
                                         t.status === 'done' ? 'Completed' :
                                         t.status || 'Pending';
                   
                    const projectName = allProjects.find(p => p.id === t.projectId)?.name || 'Unknown';
                   
                    return `
                        <div class="task-item">
                            <div class="task-info">
                                <div class="title">${t.title}</div>
                                <div class="project">📁 ${projectName} • Due: ${t.dueDate ? formatDate(t.dueDate) : 'No date'}</div>
                            </div>
                            <span class="task-status ${statusClass}">${statusDisplay}</span>
                        </div>
                    `;
                }).join('');
            }

            // ============================================
            // RENDER ACTIVITY TABLE
            // ============================================
            const activities = [];
           
            // Task activities
            myTasks.forEach(t => {
                if (t.createdAt) {
                    const projectName = allProjects.find(p => p.id === t.projectId)?.name || 'Unknown';
                    activities.push({
                        type: 'task',
                        typeLabel: 'Task',
                        description: `Task <strong>${t.title}</strong> ${t.status === 'completed' || t.status === 'done' ? 'completed' : 'updated'}`,
                        project: projectName,
                        time: formatTimeAgo(t.updatedAt || t.createdAt)
                    });
                }
            });

            // Project activities (when user was assigned)
            myProjects.forEach(p => {
                if (p.createdAt) {
                    activities.push({
                        type: 'project',
                        typeLabel: 'Project',
                        description: `Assigned to project <strong>${p.name}</strong>`,
                        project: p.name,
                        time: formatTimeAgo(p.createdAt)
                    });
                }
            });

            // Sort by time
            activities.sort((a, b) => {
                const aTime = a.time === 'Just now' ? 0 : parseInt(a.time) || 999;
                const bTime = b.time === 'Just now' ? 0 : parseInt(b.time) || 999;
                return aTime - bTime;
            });

            const activityContainer = document.getElementById('activityContainer');

            if (activities.length === 0) {
                activityContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="bx bx-hourglass"></i>
                        <h4>No Recent Activity</h4>
                        <p>Your activities will appear here</p>
                    </div>
                `;
            } else {
                const topActivities = activities.slice(0, 10);
                let tableHtml = `
                    <table>
                        <thead>
                            <tr>
                                <th>Activity</th>
                                <th>Project</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                topActivities.forEach(a => {
                    tableHtml += `
                        <tr>
                            <td>${a.description}</td>
                            <td><span class="type-badge ${a.type}">${a.project}</span></td>
                            <td style="color: #6b6b6b; font-size: 13px;">${a.time}</td>
                        </tr>
                    `;
                });

                tableHtml += `
                        </tbody>
                    </table>
                `;

                activityContainer.innerHTML = tableHtml;
            }

            // Update notification dot
            const unreadCount = getUnreadNotificationCount();
            const dot = document.getElementById('notifyDot');
            if (unreadCount > 0) {
                dot.style.display = 'block';
                dot.textContent = unreadCount;
            } else {
                dot.style.display = 'none';
            }
        }

        // ============================================
        // HELPER FUNCTIONS
        // ============================================

        function getRoleDisplayName(role) {
            const names = {
                'admin': 'Admin',
                'project_manager': 'Project Manager',
                'engineer': 'Engineer',
                'supervisor': 'Supervisor',
                'worker': 'Worker',
                'client': 'Client'
            };
            return names[role] || role;
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

        // ============================================
        // LOAD ON PAGE READY
        // ============================================

        document.addEventListener('DOMContentLoaded', loadDashboard);

        console.log("✅ Worker dashboard loaded for:", user.name);