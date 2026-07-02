// ============================================
// PINNACLE CONSTRUCTION MANAGEMENT SYSTEM
// Complete Data Management File
// ============================================

// ============================================
// 1. INITIALIZE STORAGE (Run once)
// ============================================

function initData() {
    // ---------- USERS (Default for login) ----------
    if (!localStorage.getItem('users') || !adminExists) {
        const users = [
            { id: 1, name: "Admin User", email: "admin@pinnacle.com", password: "admin123", role: "admin", department: "Executive", avatar: "AU", status: "active", clientProjectId: null },
            { id: 2, name: "John Doe", email: "john@pinnacle.com", password: "pm123", role: "project_manager", department: "Construction", avatar: "JD", status: "active", clientProjectId: null },
            { id: 3, name: "Sarah Johnson", email: "sarah@client.com", password: "client123", role: "client", department: "", avatar: "SJ", status: "active", clientProjectId: null },
            { id: 4, name: "Micheal Brown", email: "micheal@pinnacle.com", password: "eng123", role: "engineer", department: "Engineering", avatar: "MB", status: "active", clientProjectId: null },
            { id: 5, name: "Lisa Wong", email: "lisa@pinnacle.com", password: "sup123", role: "supervisor", department: "Safety", avatar: "LW", status: "active", clientProjectId: null },
            { id: 6, name: "James Obi", email: "james@pinnacle.com", password: "worker123", role: "worker", department: "Construction", avatar: "JO", status: "active", clientProjectId: null },
            { id: 7, name: "John Smith", email: "johnsm@pinnacle.com", password: "pm1234", role: "project_manager", department: "Construction", avatar: "JS", status: "active", clientProjectId: null },
        ];
        localStorage.setItem('users', JSON.stringify(users));
        console.log("Default users created");
    } else {
        console.log(" Users already exist - keeping existing data");

        if (!adminExists) {
            console.log('Admin not found! Adding admin...');
            const newAdmin = {
                id: existingUsers.length > 0 ? Math.max(...existingUsers.map(u => u.id)) + 1 : 1,
                name: "Admin User",
                email: "admin@pinnacle.com",
                role: "admin",
                department: "Executive",
                avatar: "AU",
                status: "active",
                clientProjectId: null
            };
           existingUsers.push(newAdmin); 
        const existingUsers = JSON.parse(localStorage.getItem('users'));
        console.log("Existing users: ", existingUsers.length);           
        }

    }

    
    // ---------- EMPTY DATA ARRAYS (Start with nothing) ----------
    if (!localStorage.getItem('projects')) {
        localStorage.setItem('projects', JSON.stringify([]));
    }
    if (!localStorage.getItem('tasks')) {
        localStorage.setItem('tasks', JSON.stringify([]));
    }
    if (!localStorage.getItem('materials')) {
        localStorage.setItem('materials', JSON.stringify([]));
    }
    if (!localStorage.getItem('messages')) {
        localStorage.setItem('messages', JSON.stringify([]));
    }
    if (!localStorage.getItem('siteReports')) {
        localStorage.setItem('siteReports', JSON.stringify([]));
    }
    if (!localStorage.getItem('expenses')) {
        localStorage.setItem('expenses', JSON.stringify([]));
    }
    if (!localStorage.getItem('materialRequests')) {
        localStorage.setItem('materialRequests', JSON.stringify([]));
    }
    if (!localStorage.getItem('notifications')) {
        localStorage.setItem('notifications', JSON.stringify([]));
    }
    if (!localStorage.getItem('invoices')) {
        localStorage.setItem('invoices', JSON.stringify([]));
    }
}

// ============================================
// 2. USER SESSION MANAGEMENT
// ============================================

function getCurrentUser() {
    const user = sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = '../login.html';
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function checkRole(allowedRoles) {
    const user = getCurrentUser();
    if (!user) return false;
    return allowedRoles.includes(user.role);
}

// ============================================
// 3. USER CRUD OPERATIONS
// ============================================

function getAllUsers() {
    try {
        const users = localStorage.getItem('users');
        if (!users) {
            console.log('No users found in localStorage');
            return[];
        }
        const parsed = JSON.parse(users)
        console.log('users loaded:', parsed.length);
        return parsed;
    } catch (e) {
        console.log('error getting users:', e);
          return [];
    }
  
}


// this is for add a new user to the system
function addUser(userData) {
    try {
        const users = getAllUsers();
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

        const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

<<<<<<< HEAD
        let cleanRole = userData.role || 'client';

        if (typeof cleanRole === 'string') {
            cleanRole = userData.role.replace(/-/g, '_');
        }


=======
>>>>>>> c5491b9d34073c1e38491f7641db556e7dbc1c85
        const newUser = {
            id: newId,
            name: userData.name,
            email: userData.email,
            phone: userData.phone || '',
            password: userData.password,
            confirmPassword: userData.confirmPassword,
<<<<<<< HEAD
            role: cleanRole,
=======
            role: userData.role,
>>>>>>> c5491b9d34073c1e38491f7641db556e7dbc1c85
            department: userData.department || '',
            status: userData.status,
            clientProjectId: null,
            createdAt: new Date().toISOString()
        };
<<<<<<< HEAD
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('New user added:', newUser.name, 'Role:', newUser.role);
=======

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('New user added:', newUser.name);
>>>>>>> c5491b9d34073c1e38491f7641db556e7dbc1c85


        addActivity('New user ${newUser.name} created as ${newUser.role}', "user");

        return newUser;
    } catch (e) {
        console.error("Error add user:", e)
        return null
    }
}


// ============================================
// HELPER FUNCTIONS - Get Names from IDs
// ============================================

function getUserName(userId) {
    if (!userId) {
         return 'Unassigned';
    }

    const users = getAllUsers();

    const user = users.find(u => u.id === userId);

    if (user) {
        return user.name;
    } else { console.warn(`User not found for ID: ${userId}`);
        console.log(`Available user ID:`, users.map(u => u.id));
    return  'Unknown ';
}
}

function getUserEmail(userId) {
    if (!userId) return 'No email';
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);
    return user ? user.email : 'Unknown';
}

function getUserRole(userId) {
    if (!userId) return 'Unknown';
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);
    return user ? getRoleDisplayName(user.role) : 'Unknown';
}

function getProjectName(projectId) {
    if (!projectId) return 'No Project';
    const projects = getAllProjects();
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
}

function getProjectManagerName(projectId) {
    if (!projectId) return 'Unassigned';
    const projects = getAllProjects();
    const project = projects.find(p => p.id === projectId);
    if (!project) return 'Unknown';
    return getUserName(project.projectManagerId);
}

function getClientName(projectId) {
    if (!projectId) return 'No Client';
    const projects = getAllProjects();
    const project = projects.find(p => p.id === projectId);
    if (!project) return 'Unknown';
    return getUserName(project.clientId);
}

function getTaskAssigneeName(taskId) {
    if (!taskId) return 'Unassigned';
    const tasks = getAllTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return 'Unknown';
    return getUserName(task.assignedTo);
}

function getTaskProjectName(taskId) {
    if (!taskId) return 'No Project';
    const tasks = getAllTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return 'Unknown';
    return getProjectName(task.projectId);
}

function deleteUser(userId) {
    let users = getAllUsers();
    users = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(users));
}

// function getUserById(userId) {
//     const users = getAllUsers();
//     return users.find(u => u.id === userId);
// }

// function getUserName(userId) {
//     if (!userId) return 'Unassined';
//     const users = getAllUsers();
//     const user = users.find(u => u.id === userId);
//     return user ? user.name : 'Unknown User'
// }

// function addUser(userData) {
//     const users = getAllUsers();
//     const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
   
//     const newUser = {
//         id: newId,
//         ...userData,
//         status: 'active',
//         createdAt: new Date().toISOString()
//     };
   
//     users.push(newUser);
//     localStorage.setItem('users', JSON.stringify(users));
//     return newUser;
// }

// function updateUser(userId, updates) {
//     const users = getAllUsers();
//     const index = users.findIndex(u => u.id === userId);
//     if (index !== -1) {
//         users[index] = { ...users[index], ...updates };
//         localStorage.setItem('users', JSON.stringify(users));
//         return users[index];
//     }
//     return null;
// }

// function deleteUser(userId) {
//     let users = getAllUsers();
//     users = users.filter(u => u.id !== userId);
//     localStorage.setItem('users', JSON.stringify(users));
// }

// function getUsersByRole(role) {
//     const users = getAllUsers();
//     return users.filter(u => u.role === role);
// }

// ============================================
// 4. PROJECT CRUD OPERATIONS
// ============================================

function getAllProjects() {
    try {
        const projects = localStorage.getItem('projects');
        if (!projects) {
            console.log('No project found');
            return [];
        }
        const parsed = JSON.parse(projects);
        console.log('project loaded:', parsed.length);
        return parsed;
    } catch (e) {
        console.error('Error getting projects:', e);
        return [];
    }
}

function getProjectById(projectId) {
    const projects = getAllProjects();
    return projects.find(p => p.id === projectId);
}

function getUserProjects() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
   
    const allProjects = getAllProjects();
   
    // Admin sees all projects
    if (currentUser.role === 'admin') {
        return allProjects;
    }
   
    // Client sees only their assigned project
    if (currentUser.role === 'client') {
        const users = getAllUsers();
        const clientData = users.find(u => u.id === currentUser.id);
        if (clientData && clientData.clientProjectId) {
            return allProjects.filter(p => p.id === clientData.clientProjectId);
        }
        return [];
    }
   
    // Worker/PM/Engineer sees projects they are assigned to
    return allProjects.filter(project =>
        project.projectManagerId === currentUser.id ||
        project.leadEngineerId === currentUser.id ||
        (project.assignedTeam && project.assignedTeam.includes(currentUser.id))
    );
}

function addProject(projectData) {
    const projects = getAllProjects();
    const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
   
    const newProject = {
        id: newId,
        ...projectData,
        progress: projectData.progress || 0,
        createdAt: new Date().toISOString(),
        createdBy: getCurrentUser()?.id
    };
   
    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));
   
    // Send notification to project manager
    if (projectData.projectManagerId) {
        addNotification({
            userId: projectData.projectManagerId,
            title: "New Project Assigned",
            message: `You have been assigned as Project Manager for "${projectData.name}"`,
            type: "project"
        });
    }
   
    return newProject;
}


function updateProject(projectId, updates) {
    const projects = getAllProjects();
    const index = projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
        projects[index] = { ...projects[index], ...updates };
        localStorage.setItem('projects', JSON.stringify(projects));
        return projects[index];
    }
    return null;
}
 
function deleteProject(projectId) {
    let projects = getAllProjects();
    projects = projects.filter(p => p.id !== projectId);
    localStorage.setItem('projects', JSON.stringify(projects));
   
    // Also delete related tasks
    let tasks = getAllTasks();
    tasks = tasks.filter(t => t.projectId !== projectId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ============================================
// 5. TASK CRUD OPERATIONS
// ============================================

function getAllTasks() {
    try {
        const tasks = localStorage.getItem('tasks');
        console.log('getAllTasks() called, raw data:', tasks);

        if (!tasks) {
        console.log('No tasks found in localStorage');
        return [];
        }

        const parsed = JSON.parse(tasks);
        console.log('parsed tasks:', parsed);
        console.log('Tasks count:', parsed.length);

        if (Array.isArray(parsed)) {
            return parsed;
        } else {
            console.warn('data is not an array, returning empty');
            return [];
        }
    } catch (e) {
        console.error('Error in getAllTasks():', e);
        return [];
    }
    // const newTasks = localStorage.getItem('newtasks');
    // return newTasks ? JSON.parse('newTasks') : [];
}
function saveTasks(tasks) {
    try {
        if (!Array.isArray(tasks)) {
             console.warn('saveTask() called with non-array:', tasks);
             tasks = [];
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
        console.log('Tasks saved:', tasks.length);
    } catch (e) {
        console.error('Error saving newtasks:', e);
        return [];
    } 

}


function getTaskById(taskId) {
    const tasks = getAllTasks();
    return tasks.find(t => t.id === taskId);
}

function getUserTasks() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
   
    const allTasks = getAllTasks();
   
    if (currentUser.role === 'admin') {
        return allTasks;
    }
   
    if (currentUser.role === 'client') {
        const userProjects = getUserProjects();
        const projectIds = userProjects.map(p => p.id);
        return allTasks.filter(t => projectIds.includes(t.projectId));
    }
   
    return allTasks.filter(t => t.assignedTo === currentUser.id);
}

function getTasksByProject(projectId) {
    const tasks = getAllTasks();
    return tasks.filter(t => t.projectId === projectId);
}

function addTask(taskData) {
try {
    const tasks = getAllTasks();
    console.log("current tasks before add:", tasks.length);
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
   
    const newTask = {
        id: newId,
        ...taskData,
        status: taskData.status || 'pending',
        createdAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
        createdBy: getCurrentUser()?.id
    };
   
    tasks.push(newTask);
    saveTasks(tasks);
    console.log("Task added:", newTask.title);
    console.log("Total task added:", taskData.length);
   

   
    return newTask;
} catch (e) {
    console.error("Error adding task:", e);
    return null;
}
}

function updateTask(taskId, updates) {
    const tasks = getAllTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updates };
        localStorage.setItem('tasks', JSON.stringify(tasks));
        return tasks[index];
    }
    return null;
}

function deleteTask(taskId) {
    let tasks = getAllTasks();
    tasks = tasks.filter(t => t.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ============================================
// 6. MATERIAL CRUD OPERATIONS
// ============================================

function getAllMaterials() {
    return JSON.parse(localStorage.getItem('materials')) || [];
}

function getMaterialById(materialId) {
    const materials = getAllMaterials();
    return materials.find(m => m.id === materialId);
}

function addMaterial(materialData) {
    const materials = getAllMaterials();
    const newId = materials.length > 0 ? Math.max(...materials.map(m => m.id)) + 1 : 1;
   
    const newMaterial = {
        id: newId,
        ...materialData,
        createdAt: new Date().toISOString()
    };
   
    materials.push(newMaterial);
    localStorage.setItem('materials', JSON.stringify(materials));
    return newMaterial;
}

function updateMaterial(materialId, updates) {
    const materials = getAllMaterials();
    const index = materials.findIndex(m => m.id === materialId);
    if (index !== -1) {
        materials[index] = { ...materials[index], ...updates };
        localStorage.setItem('materials', JSON.stringify(materials));
        return materials[index];
    }
    return null;
}

function deleteMaterial(materialId) {
    let materials = getAllMaterials();
    materials = materials.filter(m => m.id !== materialId);
    localStorage.setItem('materials', JSON.stringify(materials));
}

function getLowStockMaterials() {
    const materials = getAllMaterials();
    return materials.filter(m => m.status === 'low_stock' || (m.minStock && m.quantity <= m.minStock));
}

// ============================================
// 7. MATERIAL REQUEST CRUD
// ============================================

function getAllMaterialRequests() {
    return JSON.parse(localStorage.getItem('materialRequests')) || [];
}

function addMaterialRequest(requestData) {
    const requests = getAllMaterialRequests();
    const newId = requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1;
   
    const newRequest = {
        id: newId,
        ...requestData,
        status: 'pending',
        requestedBy: getCurrentUser()?.id,
        requestedAt: new Date().toISOString()
    };
   
    requests.push(newRequest);
    localStorage.setItem('materialRequests', JSON.stringify(requests));
   
    // Notify admin
    addNotification({
        userId: 1,
        title: "New Material Request",
        message: `Material request for ${requestData.materialName}`,
        type: "material"
    });
   
    return newRequest;
}

function updateMaterialRequest(requestId, updates) {
    const requests = getAllMaterialRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index !== -1) {
        requests[index] = { ...requests[index], ...updates };
        localStorage.setItem('materialRequests', JSON.stringify(requests));
        return requests[index];
    }
    return null;
}

// ============================================
// 8. MESSAGE CRUD
// ============================================

function getAllMessages() {
    return JSON.parse(localStorage.getItem('messages')) || [];
}

function getUserMessages() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
   
    const allMessages = getAllMessages();
    return allMessages.filter(m =>
        m.from === currentUser.id ||
        m.to === currentUser.id
    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function getConversation(otherUserId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
   
    const messages = getAllMessages();
    return messages.filter(m =>
        (m.from === currentUser.id && m.to === otherUserId) ||
        (m.from === otherUserId && m.to === currentUser.id)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

function sendMessage(messageData) {
    const messages = getAllMessages();
    const newId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
   
    const newMessage = {
        id: newId,
        ...messageData,
        from: getCurrentUser()?.id,
        timestamp: new Date().toISOString(),
        isRead: false
    };

    messages.push(newMessage);
    localStorage.setItem('messages', JSON.stringify(messages));
   
    // Notify receiver
    addNotification({
        userId: messageData.to,
        title: "New Message",
        message: `New message from ${getCurrentUser()?.name}`,
        type: "message"
    });
   
    return newMessage;
}

function markMessageAsRead(messageId) {
    const messages = getAllMessages();
    const index = messages.findIndex(m => m.id === messageId);
    if (index !== -1) {
        messages[index].isRead = true;
        messages[index].readAt = new Date().toISOString();
        localStorage.setItem('messages', JSON.stringify(messages));
    }
}

function getUnreadMessageCount() {
    const currentUser = getCurrentUser();
    if (!currentUser) return 0;
   
    const messages = getAllMessages();
    return messages.filter(m => m.to === currentUser.id && !m.isRead).length;
}

// ============================================
// 9. NOTIFICATION CRUD
// ============================================

function getAllNotifications() {
    return JSON.parse(localStorage.getItem('notifications')) || [];
}

function getUserNotifications() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
   
    const notifications = getAllNotifications();
    return notifications.filter(n => n.userId === currentUser.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function addNotification(notificationData) {
    const notifications = getAllNotifications();
    const newId = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1;
   
    const newNotification = {
        id: newId,
        ...notificationData,
        createdAt: new Date().toISOString(),
        isRead: false
    };
   
    notifications.push(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    return newNotification;
}

function markNotificationAsRead(notificationId) {
    const notifications = getAllNotifications();
    const index = notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
        notifications[index].isRead = true;
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }
}

function markAllNotificationsAsRead() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
   
    const notifications = getAllNotifications();
    notifications.forEach(n => {
        if (n.userId === currentUser.id && !n.isRead) {
            n.isRead = true;
        }
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

function getUnreadNotificationCount() {
    const currentUser = getCurrentUser();
    if (!currentUser) return 0;
   
    const notifications = getAllNotifications();
    return notifications.filter(n => n.userId === currentUser.id && !n.isRead).length;
}

function deleteNotification(notificationId) {
    if (!confirm('Delete this notification?')) return;
    
    let notifications = getAllNotifications();
    notifications = notifications.filter(n => n.id !== notificationId);
    localStorage.setItem('notifications', JSON.stringify(notifications));

}





// ============================================
// 10. SITE REPORT CRUD
// ============================================

function getAllSiteReports() {
    return JSON.parse(localStorage.getItem('siteReports')) || [];
}

function getSiteReportsByProject(projectId) {
    const reports = getAllSiteReports();
    return reports.filter(r => r.projectId === projectId)
        .sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate));
}

function addSiteReport(reportData) {
    const reports = getAllSiteReports();
    const newId = reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 1;
   
    const newReport = {
        id: newId,
        ...reportData,
        submittedBy: getCurrentUser()?.id,
        submittedAt: new Date().toISOString(),
        status: 'pending'
    };
   
    reports.push(newReport);
    localStorage.setItem('siteReports', JSON.stringify(reports));
   
    // Notify admin and project manager
    const project = getProjectById(reportData.projectId);
    if (project) {
        addNotification({
            userId: project.projectManagerId,
            title: "New Site Report",
            message: `New report submitted for ${project.name}`,
            type: "report"
        });
    }
   
    addNotification({
        userId: 1,
        title: "New Site Report",
        message: `New report submitted`,
        type: "report"
    });
   
    return newReport;
}

function approveSiteReport(reportId) {
    const reports = getAllSiteReports();
    const index = reports.findIndex(r => r.id === reportId);
    if (index !== -1) {
        reports[index].status = 'approved';
        reports[index].approvedBy = getCurrentUser()?.id;
        reports[index].approvedAt = new Date().toISOString();
        localStorage.setItem('siteReports', JSON.stringify(reports));
    }
}

// ============================================
// 11. EXPENSE CRUD
// ============================================

function getAllExpenses() {
    return JSON.parse(localStorage.getItem('expenses')) || [];
}

function getExpensesByProject(projectId) {
    const expenses = getAllExpenses();
    return expenses.filter(e => e.projectId === projectId)
        .sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate));
}

function addExpense(expenseData) {
    const expenses = getAllExpenses();
    const newId = expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
   
    const newExpense = {
        id: newId,
        ...expenseData,
        recordedBy: getCurrentUser()?.id,
        recordedAt: new Date().toISOString()
    };
   
    expenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    return newExpense;
}

function getTotalExpensesByProject(projectId) {
    const expenses = getExpensesByProject(projectId);
    return expenses.reduce((total, e) => total + e.amount, 0);
}

function deleteExpense(expenseId) {
    let expenses = getAllExpenses();
    expenses = expenses.filter(e => e.id !== expenseId);
    localStorage.setItem('expenses', JSON.stringify(expenses));
}


// ============================================
// 12. INVOICE CRUD
// ============================================

function getAllInvoices() {
    return JSON.parse(localStorage.getItem('invoices')) || [];
}

function getInvoicesByProject(projectId) {
    const invoices = getAllInvoices();
    return invoices.filter(i => i.projectId === projectId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function addInvoice(invoiceData) {
    const invoices = getAllInvoices();
    const newId = invoices.length > 0 ? Math.max(...invoices.map(i => i.id)) + 1 : 1;
   
    const newInvoice = {
        id: newId,
        ...invoiceData,
        createdAt: new Date().toISOString()
    };
   
    invoices.push(newInvoice);
    localStorage.setItem('invoices', JSON.stringify(invoices));
    return newInvoice;
}

function updateInvoiceStatus(invoiceId, status) {
    const invoices = getAllInvoices();
    const index = invoices.findIndex(i => i.id === invoiceId);
    if (index !== -1) {
        invoices[index].status = status;
        if (status === 'paid') {
            invoices[index].paidDate = new Date().toISOString();
        }
        localStorage.setItem('invoices', JSON.stringify(invoices));
    }
}

// ============================================
// 13. DASHBOARD STATISTICS
// ============================================

function getDashboardStats() {
    const currentUser = getCurrentUser();
    const projects = getUserProjects();
    const tasks = getUserTasks();
   
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const delayedProjects = projects.filter(p => p.status === 'delayed').length;
    
   
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
   
    let totalBudget = 0;
    let totalSpent = 0;
    projects.forEach(project => {
        totalBudget += project.budget || 0;
        totalSpent += getTotalExpensesByProject(project.id);
    });
   
    return {
        totalProjects,
        activeProjects,
        completedProjects,
        delayedProjects,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        totalBudget,
        totalSpent,
        remainingBudget: totalBudget - totalSpent
    };
}

// ============================================
// 14. UTILITY FUNCTIONS
// ============================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return 'Not set';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}// ============================================
// js/dashboard.js - Shared Dashboard Logic
// ============================================

console.log("📊 Dashboard.js loaded!");

// ============================================
// AUTH CHECK
// ============================================

// function checkDashboardAuth() {
//     const user = getCurrentUser();
   
//     if (!user) {
//         window.location.href = '../login.html';
//         return null;
//     }
   
//     // Update header with user info
//     updateHeader(user);
   
//     // Check if user is on correct dashboard
//     const path = window.location.pathname;
//     const isAdmin = path.includes('/admin/');
//     const isWorker = path.includes('/worker/');
//     const isClient = path.includes('/client/');
   
//     // Redirect if on wrong dashboard
//     if (isAdmin && user.role !== 'admin') {
//         if (user.role === 'client') {
//             window.location.href = '../client/my-project.html';
//         } else {
//             window.location.href = '../worker/wo-dashboard.html';
//         }
//         return null;
//     }
   
//     if (isWorker && (user.role === 'admin' || user.role === 'client')) {
//         if (user.role === 'admin') {
//             window.location.href = '../admin/dashboard.html';
//         } else {
//             window.location.href = '../client/my-project.html';
//         }
//         return null;
//     }
   
//     if (isClient && user.role !== 'client') {
//         if (user.role === 'admin') {
//             window.location.href = '../admin/dashboard.html';
//         } else {
//             window.location.href = '../worker/wo-dashboard.html';
//         }
//         return null;
//     }
   
//     return user;
// }

// ============================================
// HEADER UPDATE
// ============================================

// function updateHeader(user) {
//     if (!user) return;
   
//     const nameElement = document.querySelector('#userName, .header-profile-text h3');
//     const roleElement = document.querySelector('#userRole, .header-profile-text p');
//     const roleDisplay = document.querySelector('#roleDisplay');

       
   
//     if (nameElement) nameElement.textContent = user.name;
   
//     if (roleElement) {
//         const roleNames = {
//             'admin': 'Admin',
//             'project_manager': 'Project Manager',
//             'site_engineer': 'Site Engineer',
//             'supervisor': 'Supervisor',
//             'contractor': 'Contractor',
//             'architect': 'Architect',
//             'safety_officer': 'Safety Officer',
//             'worker': 'Worker',
//             'client': 'Client',
//             'other': 'Other'
//         };
//         roleElement.textContent = roleNames[user.role] || user.role;
//     }
   
//     if (roleDisplay) {
//         const roleNames = {
//             'admin': 'Admin',
//             'project_manager': 'Project Manager',
//             'site_engineer': 'Site Engineer',
//             'supervisor': 'Supervisor',
//             'contractor': 'Contractor',
//             'architect': 'Architect',
//             'safety_officer': 'Safety Officer',
//             'worker': 'Worker',
//             'client': 'Client',
//             'other': 'Other'
//         };
//         roleDisplay.textContent = roleNames[user.role] || user.role;
//     }
//             const hour = new Date().getHours();
//             let timeRoleDisplay = 'Good Morning';
//             if (hour >= 12 && hour < 17) timeRoleDisplay = 'Good Afternoon';
//             else if (hour >= 17) timeRoleDisplay = 'Good Evening';
//             roleDisplay.textContent = `${timeRoleDisplay}, ${user.name}!`;
  
   
//     // Update notification dot
//     updateNotificationDot();
// }

// ============================================
// NOTIFICATION DOT
// ============================================

// function updateNotificationDot() {
//     const unreadCount = getUnreadNotificationCount();
//     const dot = document.querySelector('.notify-dot');
//     if (dot) {
//         if (unreadCount > 0) {
//             dot.style.display = 'block';
//             dot.textContent = unreadCount;
//         } else {
//             dot.style.display = 'none';
//         }
//     }
// }

// ============================================
// STATS FUNCTIONS
// ============================================

// function updateStats(stats) {
//     // Total Projects
//     const totalEl = document.getElementById('totalProjects');
//     if (totalEl) totalEl.textContent = stats.totalProjects || 0;
   
//     // Active Projects
//     const activeEl = document.getElementById('activeProjects');
//     if (activeEl) activeEl.textContent = stats.activeProjects || 0;
   
//     // Delayed Projects
//     const delayedEl = document.getElementById('delayedProjects');
//     if (delayedEl) delayedEl.textContent = stats.delayedProjects || 0;
   
//     // Total Budget
//     const budgetEl = document.getElementById('totalBudget');
//     if (budgetEl) budgetEl.textContent = '₦' + (stats.totalBudget || 0).toLocaleString();
   
//     // Worker Stats
//     const myProjectsEl = document.getElementById('myProjects');
//     if (myProjectsEl) myProjectsEl.textContent = stats.myProjects || 0;
   
//     const pendingTasksEl = document.getElementById('pendingTasks');
//     if (pendingTasksEl) pendingTasksEl.textContent = stats.pendingTasks || 0;
   
//     const completedTasksEl = document.getElementById('completedTasks');
//     if (completedTasksEl) completedTasksEl.textContent = stats.completedTasks || 0;
   
//     const dueTasksEl = document.getElementById('dueTasks');
//     if (dueTasksEl) dueTasksEl.textContent = stats.dueTasks || 0;
// }

// ============================================
// ACTIVITY FUNCTIONS
// ============================================

// function renderActivities() {
//     console.log("renderActivity Active")
    
//     const containerActivities = document.getElementById('containerId');
//     if (!containerActivities) return;

   
//      const activities = getAllActivities();
//     // Sort by time (newest first)
//     activities.sort((a, b) => {
//         const aTime = a.time === 'Just now' ? 0 : parseInt(a.time) || 999;
//         const bTime = b.time === 'Just now' ? 0 : parseInt(b.time) || 999;
//         return aTime - bTime;
//     });

//     if (activities.length === 0) {
//         containerActivities.innerHTML = `
//             <div style="text-align: center; padding: 40px; color: #6b6b6b;">
//                 <i class="bx bx-hourglass"></i>
//                 <h4>No Recent Activity</h4>
//                 <p>Your activities will appear here</p>
//             </div>
//         `;
//         return;
//     }
   
   
//     const topActivities = activities.slice(0, 10);
   
//     let tableHtml = `
//         <table style="width: 100%;">
//             <thead>
//                 <tr class="table-bg">
//                     <th>Activity</th>
//                     <th>Type</th>
//                     <th>User</th>
//                     <th>Time</th>
//                 </tr>
//             </thead>
//             <tbody>
//     `;
   
//     topActivities.forEach(a => {
//         const typeClass = a.type || 'task';
//         const typeLabel = a.typeLabel || a.type || 'Activity'; 
//         const typeName = a.name
//         tableHtml += `
//             <tr>
//                 <td>${a.message}</td>
//                 <td><span class="type-badge ${typeClass}">${typeLabel}</span></td>
//                  <td class="${typeName}">${getUserName(a.userId)}</td>
//                 <td style="color: #6b6b6b; font-size: 13px;">${a.createdAt}</td>
//             </tr>
//         `;
//     });
//    localStorage.getItem('activities')
//     tableHtml += `
//             </tbody>
//         </table>
//     `;

//     containerActivities.innerHTML = tableHtml;
// }


// function renderActivities() {

//     console.log("renderActivity Active")
    
//     const containerActivities = document.getElementById('containerId');
//     if (!containerActivities) return;

   


//     const activities = getAllActivities();
//     if (activities.length === 0) {
//         containerActivities.innerHTML = `
//             <div style="text-align: center; padding: 40px; color: #6b6b6b;">
//                 <i class="bx bx-hourglass"></i>
//                 <h4>No Recent Activity</h4>
//                 <p>Your activities will appear here</p>
//             </div>
//         `;
//         return;
//     }

       
//     // Sort by time (newest first)
//     activities.sort((a, b) => {
//         const aTime = a.time === 'Just now' ? 0 : parseInt(a.time) || 999;
//         const bTime = b.time === 'Just now' ? 0 : parseInt(b.time) || 999;
//         return aTime - bTime;
//     });
   
   

   
//     let tableHtml = `
//         <table style="width: 100%;">
//             <thead>
//                 <tr class="table-bg">
//                     <th>Activity</th>
//                     <th>Type</th>
//                     <th>User</th>
//                     <th>Time</th>
//                 </tr>
//             </thead>
//             <tbody>
//     `;

//     containerActivities.innerHTML = activities.slice(0, 10).map(activity => 

//  `
//             <tr>
//                 <td>${activity.message}</td>
//                 <td><span class="type-badge ">${activity.type}</span></td>
//                  <td>${activity.user}</td>
//                 <td style="color: #6b6b6b; font-size: 13px;">${(activity.createdAt)}</td>
//             </tr>
//         `
//     ).join("");

// }






// ============================================
// PROJECT FUNCTIONS
// ============================================
 




// function renderProjects() {
//     console.log("renderProject is running");
    
//     const container = document.getElementById('projectsContainer'); 


//     const projects = getAllProjects(maxItems = 5) || [];

    

//     if (projects.length === 0) {
//         container.innerHTML = `
//             <div class="empty-state" style="text-align: center; ">
//                 <i class="bx bx-folder-open"></i>
//                 <h3 style="color: white;">No project Yet</h3>
//                 <p>Create your first projects.</p>
//             </div>

//    `;
//    return;
//     }
    

//     container.innerHTML = projects.map(project => `
            
//                 <div class="project-card activeProject" >
//                     <div class="project-card-head">
//                         <div class="project-card-text">
//                             <h4>${project.name}</h4>
//                             <p>${project.location}</p>
//                         </div>
//                         <span id="statusColor" ${project.status.toLowerCase()}>${project.status}</span>
//                     </div>
//                     <div class="project-progress-container">
//                         <div class="project-progress-wrapper">
//                             <div class="project-progress" style=" width:${project.progress || 0};"></div>
//                         </div>
//                         <span>${project.progress || 0}%</span>
//                     </div>
//                     <div class="start-date">
//                         <p>Start Date</p>
//                         <span>${project.startDate} </span>
//                     </div>
//                     <div class="start-date">
//                         <p>End Date</p>
//                         <span${project.endDate}</span>
//                     </div>
//                     <div class="start-date" >
//                         <p</p>
//                         <span> </span>
//                     </div>

//                     <div class="view-details">
//                     <a href="projects-details.html" onclick="viewProject(${project.id})">View Details</a>
//                     <a href="" onclick="deleteProject(${project.id})">Delete</a>
//                     </div>
//                 </div>
//         `).join("");
//     }


// function renderProjects(projects, projectsContainer, maxItems = 5) {
//     const container = document.getElementById(projectsContainer);
//     if (!container) return;
   
//     if (projects.length === 0) {
//         container.innerHTML = `
//             <div class="empty-state">
//                 <i class="bx bx-folder"></i>
//                 <h4>No Projects</h4>
//                 <p>No projects to display</p>
//             </div>
//         `;
//         return;
//     }
   
//     const displayProjects = projects.slice(0, maxItems);
   
//     container.innerHTML = displayProjects.map(p => {
//         const progressColor = p.status === 'completed' ? '#22C55E' :
//                              p.status === 'delayed' ? '#EF4444' : '#FF5200';
//         return `
//             <div class="project-item">
//                 <div class="project-info">
//                     <div class="name">${p.name}</div>
//                     <div class="location">📍 ${p.location || 'No location'}</div>
//                 </div>
//                 <div class="project-progress">
//                     <div class="bar">
//                         <div class="fill" style="width: ${p.progress || 0}%; background: ${progressColor};"></div>
//                     </div>
//                     <span class="percent">${p.progress || 0}%</span>
//                 </div>
//             </div>
//         `;
//     }).join('');
// }

// ============================================
// TASK FUNCTIONS
// ============================================

// function renderTasks(tasks, containerId, maxItems = 5) {
//     const container = document.getElementById(containerId);
//     if (!container) return;
   
//     if (tasks.length === 0) {
//         container.innerHTML = `
//             <div class="empty-state">
//                 <i class="bx bx-check-circle"></i>
//                 <h4>No Tasks</h4>
//                 <p>No tasks to display</p>
//             </div>
//         `;
//         return;
//     }
   
//     const displayTasks = tasks.slice(0, maxItems);
//     const allProjects = getAllProjects();
   
//     container.innerHTML = displayTasks.map(t => {
//         const statusClass = t.status === 'pending' ? 'status-pending' :
//                            t.status === 'in_progress' ? 'status-progress' :
//                            t.status === 'completed' || t.status === 'done' ? 'status-completed' : 'status-delayed';
       
//         const statusDisplay = t.status === 'in_progress' ? 'In Progress' :
//                              t.status === 'done' ? 'Completed' :
//                              t.status || 'Pending';
       
//         const projectName = allProjects.find(p => p.id === t.projectId)?.name || 'Unknown';
       
//         return `
//             <div class="task-item">
//                 <div class="task-info">
//                     <div class="title">${t.title}</div>
//                     <div class="project">📁 ${projectName} • Due: ${t.dueDate ? formatDate(t.dueDate) : 'No date'}</div>
//                 </div>
//                 <span class="task-status ${statusClass}">${statusDisplay}</span>
//             </div>
//         `;
//     }).join('');
// }

// ============================================
// HELPER FUNCTIONS
// ============================================

// function formatDate(dateString) {
//     if (!dateString) return 'No date';
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString('en-US', options);
// }

// function formatTimeAgo(dateString) {
//     if (!dateString) return 'Recently';
   
//     const now = new Date();
//     const past = new Date(dateString);
//     const diffMs = now - past;
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);
   
//     if (diffMins < 1) return 'Just now';
//     if (diffMins < 60) return diffMins + 'm ago';
//     if (diffHours < 24) return diffHours + 'h ago';
//     if (diffDays < 7) return diffDays + 'd ago';
//     return past.toLocaleDateString();
// }

// function getRoleDisplayName(role) {
//     const names = {
//         'admin': 'Admin',
//         'project_manager': 'Project Manager',
//         'site_engineer': 'Site Engineer',
//         'supervisor': 'Supervisor',
//         'contractor': 'Contractor',
//         'architect': 'Architect',
//         'safety_officer': 'Safety Officer',
//         'worker': 'Worker',
//         'client': 'Client',
//         'other': 'Other'
//     };
//     return names[role] || role;
// }




// ============================================
// ADMIN DASHBOARD LOADER
// ============================================

// function loadAdminDashboard() {
//     const projects = getAllProjects();
//     const tasks = getAllTasks();
//     const users = getAllUsers();
//     const materials = getAllMaterials();




    
//         const totalProjects = projects.length;
//         const activeProjects = projects.filter(p => p.status === 'active').length;
//         const delayedProjects = projects.filter(p => p.status === 'delayed' || p.status === 'on-hold').length;
//         const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);


//         document.getElementById('totalProjects').textContent = totalProjects;
//         document.getElementById('activeProjects').textContent = activeProjects;
//         document.getElementById('delayedProjects').textContent = delayedProjects;
//         document.getElementById('totalBudget').textContent = formatCurrency(totalBudget);

        

//         // ---- UPDATE PROJECT STATUS CHART ----
        

//         if (totalProjects === 0) 
            
//             return {
//                 completed: 0,
//                 inProgress: 0,
//                 notStarted: 0
//             };
        

        
      
//     const completed = projects.filter(p => p.status === 'completed').length;
//         const inProgress = projects.filter(p => p.status === 'active').length;
//         const notStarted = projects.filter(p => p.status === 'on-hold' || p.status === 'delayed').length;

  

   
//  const chartContainer = document.getElementById('projectStatusChart');

//                if (projects.length === 0) {
//                 chartContainer.innerHTML = `
//                     <div style="text-align: center; padding: 20px;">
//                         <i class="bx bx-folder-open" style="font-size: 48px; color: #2a2a2a;"></i>
//                         <p style="color: #6b6b6b; margin-top: 12px;">No projects yet</p>
//                         <a href="projects.html" style="color: #FF5200; text-decoration: none;">Create your first project</a>
//                     </div>
//                 `;
//             } else {
//                 // Simple visual chart
//                 chartContainer.innerHTML = `

//                 <div>
//                     <!-- Circular Progress -->
//                     <div class="circular-progress">
//                         <svg width="200" height="200" viewBox="0 0 200 200">
//                         <!-- Background Circle -->
//                         <circle class="bg-circle" cx="100" cy="100" r="85"/>
                        
//                         <!-- Completed Segment -->
//                         <circle class="segment-completed"
//                                style="width:100%;  height: 100%;  border-radius: 4px;"
//                         id="completed-segment"
//                                 cx="100" cy="100" r="85"
//                                 stroke-dasharray=" ${this.circumference}"
//                                 stroke-dashoffset="${this.circumference}"/>
                        
//                         <!-- In Progress Segment -->
//                         <circle class="segment-inprogress"
//                                 id="inprogress-segment"
//                                 cx="100" cy="100" r="85"
//                                 stroke-dasharray="${totalProjects > 0 ? Math.round((completed/totalProjects) *100) : 0}"
//                                 stroke-dashoffset="${inProgress}"/>
                        
//                         <!-- Not Started Segment -->
//                         <circle class="segment-notstarted"
//                                 id="notstarted-segment"
//                                 cx="100" cy="100" r="85"
//                                 stroke-dasharray="${totalProjects > 0 ? Math.round((completed/totalProjects) *100) : 0}"
//                                 stroke-dashoffset=""/>
//                         </svg>
                    
//                         <div class="center-text">
//                         <div class="percentage" id="totalPercentage">${totalProjects > 0 ? Math.round((completed/totalProjects) + (inProgress/totalProjects) + (notStarted/totalProjects) *100) : 0}%</div>
//                         <div class="label">Overall Progress</div>
//                         </div>
//                     </div>



//             <div class="progress-wrapper">
//                 <div class="progress-container">
//                     <div class="progress-bar">
                  
//                         <div class="progress-fill" style="width:;  height: 100%;  border-radius: 4px;">${totalProjects > 0 ? Math.round((completed/totalProjects) + (inProgress/totalProjects) + (notStarted/totalProjects) *100) : 0}%</div>                      
                       
//                     </div>
//                     <div class="progress-stats">
//                         <span class="completed">${totalProjects > 0 ? Math.round((completed/totalProjects) *100) : 0}%</span> Completed
//                         <span class="in-progress">${totalProjects > 0 ? Math.round((inProgress/totalProjects) *100) : 0}%</span> In Progress
//                         <span class="not-started">${totalProjects > 0 ? Math.round((notStarted/totalProjects) *100) : 0}%</span> Not Started
//                     </div>
//                     </div>


                    
//                     <div style="padding: 10px 0;">
//                         <div style="margin-bottom: 12px;">
//                             <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
//                                 <span style="font-size: 13px; color: #22C55E;">● Completed</span>
//                                 <span style="font-size: 13px;">${completed}</span>
//                             </div>
//                             <div style="background: #1a1a1a; height: 8px; border-radius: 4px; overflow: hidden;">
//                                 <div style="width: ${totalProjects > 0 ? (completed/totalProjects)*100 : 0}%; height: 100%; background: #22C55E; border-radius: 4px;"></div>
//                             </div>
//                         </div>
//                         <div style="margin-bottom: 12px;">
//                             <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
//                                 <span style="font-size: 13px; color: #FF5200;">● In Progress</span>
//                                 <span style="font-size: 13px;">${inProgress}</span>
//                             </div>
//                             <div style="background: #1a1a1a; height: 8px; border-radius: 4px; overflow: hidden;">
//                                 <div style="width: ${totalProjects > 0 ? (inProgress/totalProjects)*100 : 0}%; height: 100%; background: #FF5200; border-radius: 4px;"></div>
//                             </div>
//                         </div>
//                         <div>
//                             <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
//                                 <span style="font-size: 13px; color: #6b6b6b;">● Not Started / Delayed</span>
//                                 <span style="font-size: 13px;">${notStarted}</span>
//                             </div>
//                             <div style="background: #1a1a1a; height: 8px; border-radius: 4px; overflow: hidden;">
//                                 <div style="width: ${totalProjects > 0 ? (notStarted/totalProjects)*100 : 0}%; height: 100%; background: #6b6b6b; border-radius: 4px;"></div>
//                             </div>
//                         </div>
//                     </div>
//                     </div>

//                 `;

 

//             }


   
//     // Build activities
//     const activities = [];
   
//     projects.forEach(p => {
//         if (p.createdAt) {
//             activities.push({
//                 type: 'project',
//                 typeLabel: 'Project',
//                 description: `New project <strong>${p.name}</strong> was created`,
//                 user:  p.createdBy ? getUserName(p.creaatedBy) : 'Admin', 
//                 time: formatTimeAgo(p.createdAt)
//             });
//         }
//     });
   
//     tasks.forEach(t => {
//         if (t.createdAt) {
//             const projectName = getProjectName(t.projectId);
//             activities.push({
//                 type: 'task',
//                 typeLabel: 'Task',
//                 description: `New task <strong>${t.title}</strong> added to <span style="color: #FF5200;">${projectName}</span>`,
//                 user: t.assignedTo ? getUserName(t.assignedTo) : 'Unassigned', 
//                 time: formatTimeAgo(t.createdAt)
//             });
//         }
//     });

//     users.forEach(u => {
//         if (u.createdAt && u.id > 6) {
//             activities.push({
//                 type: 'user',
//                 typeLabel: 'User',
//                 description: `New user <strong>${u.name}</strong> signed up as <span style="color: #FF5200;">${getRoleDisplayName(u.role)}</span>`,
//                  user: u.name, 
//                 time: formatTimeAgo(u.createdAt)
//             });
//         }
//     });

//         // Material activities
//     materials.forEach(m => {
//         if (m.createdAt) {
//             activities.push({
//                 type: 'material',
//                 typeLabel: 'Material',
//                 description: `New material <strong>${m.name}</strong>" added (${m.quantity} ${m.unit})`,
//                 user: 'Admin',
//                 time: formatTimeAgo(t.createdAt)                      
//             });
//         }
//     });
   
//     renderActivities(activities, 'containerId');
//     console.log('acitivities active:', activities)
// }

// ============================================
// WORKER DASHBOARD LOADER
// ============================================

// function loadWorkerDashboard() {
//     const user = getCurrentUser();
//     if (!user) return;
   
//     const allProjects = getAllProjects();
//     const allTasks = getAllTasks();
   
//     // Find projects assigned to this user
//     const myProjects = allProjects.filter(p =>
//         p.projectManagerId === user.id ||
//         p.leadEngineerId === user.id ||
//         (p.assignedTeam && p.assignedTeam.includes(user.id))
//     );
   
//     // Find tasks assigned to this user
//     const myTasks = allTasks.filter(t => t.assignedTo === user.id);
   
//     // Stats
//     const pending = myTasks.filter(t => t.status !== 'completed' && t.status !== 'done');
//     const completed = myTasks.filter(t => t.status === 'completed' || t.status === 'done');
   
//     const today = new Date();
//     const overdue = myTasks.filter(t => {
//         if (t.dueDate && t.status !== 'completed' && t.status !== 'done') {
//             const dueDate = new Date(t.dueDate);
//             return dueDate < today;
//         }
//         return false;
//     });
   
//     updateStats({
//         myProjects: myProjects.length,
//         pendingTasks: pending.length,
//         completedTasks: completed.length,
//         dueTasks: overdue.length
//     });
   
//     // Render projects and tasks
//     renderProjects(myProjects, 'projectsContainer');
//     renderTasks(myTasks, 'tasksContainer');
   
//     // Build activities
//     const activities = [];
   
//     myTasks.forEach(t => {
//         if (t.createdAt) {
//             const projectName = allProjects.find(p => p.id === t.projectId)?.name || 'Unknown';
//             activities.push({
//                 type: 'task',
//                 typeLabel: 'Task',
//                 description: `Task <strong>${t.title}</strong> ${t.status === 'completed' || t.status === 'done' ? 'completed' : 'updated'}`,
//                 time: formatTimeAgo(t.updatedAt || t.createdAt)
//             });
//         }
//     });
   
//     myProjects.forEach(p => {
//         if (p.createdAt) {
//             activities.push({
//                 type: 'project',
//                 typeLabel: 'Project',
//                 description: `Assigned to project <strong>${p.name}</strong>`,
//                 time: formatTimeAgo(p.createdAt)
//             });
//         }
//     });
   
//     renderActivities(activities, 'activityContainer');
// }

// ============================================
// CLIENT DASHBOARD LOADER
// ============================================

// function loadClientDashboard() {
//     const user = getCurrentUser();
//     if (!user) return;
   
//     const projects = getAllProjects();
//     const users = getAllUsers();
//     const clientData = users.find(u => u.id === user.id);
//     const clientProjectId = clientData?.clientProjectId;
   
//     let myProject = null;
//     if (clientProjectId) {
//         myProject = projects.find(p => p.id === clientProjectId);
//     }
   
//     const container = document.getElementById('projectContainer');
//     if (!container) return;
   
//     if (!myProject) {
//         container.innerHTML = `
//             <div class="empty-state">
//                 <i class="bx bx-building-house" style="font-size: 48px;"></i>
//                 <h4>No Project Yet</h4>
//                 <p>You don't have any active projects at the moment.</p>
//                 <p style="font-size: 13px;">Contact your project manager for updates.</p>
//             </div>
//         `;
//         return;
//     }
   
//     // Find project manager name
//     const pm = users.find(u => u.id === myProject.projectManagerId);
//     const pmName = pm ? pm.name : 'Not assigned';
   
//     // Calculate budget used (from expenses)
//     const expenses = getAllExpenses();
//     const projectExpenses = expenses.filter(e => e.projectId === myProject.id);
//     const totalSpent = projectExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
//     const budgetUsed = myProject.budget ? Math.round((totalSpent / myProject.budget) * 100) : 0;
   
//     container.innerHTML = `
//         <div class="project-detail">
//             <h2 style="color: #FF5200; font-size: 24px;">${myProject.name}</h2>
//             <p style="color: #9a9a9a; margin: 8px 0;">📍 ${myProject.location || 'Location not set'}</p>
//             <p style="color: #9a9a9a; margin: 4px 0;">📋 ${myProject.description || 'No description'}</p>
           
//             <div style="margin: 20px 0;">
//                 <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
//                     <span>Project Progress</span>
//                     <span style="color: #FF5200; font-weight: 600;">${myProject.progress || 0}%</span>
//                 </div>
//                 <div style="background: #1a1a1a; height: 10px; border-radius: 5px; overflow: hidden;">
//                     <div style="width: ${myProject.progress || 0}%; height: 100%; background: #FF5200; border-radius: 5px;"></div>
//                 </div>
//             </div>
           
//             <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0;">
//                 <div style="background: #0a0a0a; padding: 16px; border-radius: 8px; border: 1px solid #1a1a1a;">
//                     <p style="color: #9a9a9a; font-size: 12px;">Project Manager</p>
//                     <p style="font-weight: 600;">${pmName}</p>
//                 </div>
//                 <div style="background: #0a0a0a; padding: 16px; border-radius: 8px; border: 1px solid #1a1a1a;">
//                     <p style="color: #9a9a9a; font-size: 12px;">Status</p>
//                     <p style="font-weight: 600; color: ${myProject.status === 'active' ? '#22C55E' : '#F59E0B'};">${myProject.status || 'Active'}</p>
//                 </div>
//             </div>
           
//             <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 16px 0;">
//                 <div style="text-align: center; padding: 12px; background: #0a0a0a; border-radius: 8px;">
//                     <p style="font-size: 20px; font-weight: 700; color: #3b82f6;">${formatDate(myProject.startDate)}</p>
//                     <p style="color: #9a9a9a; font-size: 11px;">Start Date</p>
//                 </div>
//                 <div style="text-align: center; padding: 12px; background: #0a0a0a; border-radius: 8px;">
//                     <p style="font-size: 20px; font-weight: 700; color: #FF5200;">${formatDate(myProject.endDate)}</p>
//                     <p style="color: #9a9a9a; font-size: 11px;">End Date</p>
//                 </div>
//                 <div style="text-align: center; padding: 12px; background: #0a0a0a; border-radius: 8px;">
//                     <p style="font-size: 20px; font-weight: 700; color: #22C55E;">${formatCurrency(myProject.budget || 0)}</p>
//                     <p style="color: #9a9a9a; font-size: 11px;">Budget</p>
//                 </div>
//             </div>
           
//             <div style="text-align: center; margin-top: 16px;">
//                 <a href="messages.html" style="background: #FF5200; color: #fff; text-decoration: none; padding: 10px 24px; border-radius: 8px; display: inline-block;">
//                     💬 Message Project Manager
//                 </a>
//             </div>
//         </div>
//     `;
// }

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

// function loadDashboard() {
//     const user = checkDashboardAuth();
//     if (!user) return;
   
//     const path = window.location.pathname;
   
//     if (path.includes('/admin/')) {
//         console.log("📊 Loading Admin Dashboard");
//         loadAdminDashboard();
//     } else if (path.includes('/worker/')) {
//         console.log("📊 Loading Worker Dashboard");
//         loadWorkerDashboard();
//     } else if (path.includes('/client/')) {
//         console.log("📊 Loading Client Dashboard");
//         loadClientDashboard();
//     }
// }

// ============================================
// RUN ON PAGE LOAD
// ============================================

// document.addEventListener('DOMContentLoaded', loadDashboard);

// console.log("✅ Dashboard.js ready!");




function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// 15. DEMO DATA (For testing - Comment out in production)
// ============================================

function addSampleData() {
    // Only add if no projects exist
    const projects = getAllProjects();
    if (projects.length === 0) {
        // Add a sample project
        const sampleProject = {
            id: 100,
            name: "Sample Project",
            location: "Lagos, Nigeria",
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            budget: 50000000,
            projectManagerId: 2,
            status: "active",
            progress: 25,
            description: "This is a sample project to demonstrate the system."
        };
        projects.unshift(sampleProject);
        localStorage.setItem('projects', JSON.stringify(projects));
       
        // Add sample tasks
        const tasks = getAllTasks();
        const sampleTasks = [
            { id: 100, projectId: 100, title: "Site Inspection", assignedTo: 2, status: "completed", dueDate: new Date().toISOString().split('T')[0] },
            { id: 101, projectId: 100, title: "Foundation Work", assignedTo: 4, status: "in_progress", dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
            { id: 102, projectId: 100, title: "Structural Framework", assignedTo: 2, status: "pending", dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
        ];
        tasks.push(...sampleTasks);
        localStorage.setItem('tasks', JSON.stringify(tasks));
       
        console.log("Sample data added!");
    }
}

function getAllActivities() {
    return JSON.parse(localStorage.getItem("activities")) || [];
}

function saveActivities(activities) {
    localStorage.setItem("activities", JSON.stringify(activities));
}

function addActivity(message, type) {

    const activities = getAllActivities();

    activities.unshift({
        id: Date.now(),
        type,
        message,
        createdAt: new Date().toISOString()
    });

    saveActivities(activities);
}
// ============================================
// INITIALIZE EVERYTHING
// ============================================

initData();

// Uncomment the line below to add sample data for testing
// addSampleData();