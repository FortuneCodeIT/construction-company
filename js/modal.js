

   document.addEventListener("DOMContentLoaded", () => {  
            populateDropdowns();
            renderProjects(); // Assuming you have this function in projects.js
            loadProjectManager();
            projectUpdate();        
   });


    const openModal = document.getElementById('openModal');
    const closeModal = document.getElementById('cancelBtn')
    const materialModal = document.getElementById('requestModal');

        if(openModal) {
            openModal.addEventListener('click', () => {
                materialModal.style.display = "flex";
            });
        }

        if(closeModal) {
            closeModal.addEventListener('click', () => {
                materialModal.style.display = "none";
            });
        }



  // Populate manager and client dropdowns
    function populateDropdowns() {
            const users = getAllUsers() || []; // Assume you have getAllUsers() in data.js
            
            const managerSelect = document.getElementById("manager");
            // const engineerSelect = document.getElementById("engineer");
            const clientSelect = document.getElementById("client");

            users.forEach(user => {
                const option = document.createElement("option");
                option.value = user.id;
                option.textContent = user.name;

                // Add to manager dropdown
                const optionClone = option.cloneNode(true);
                managerSelect.appendChild(optionClone);

                // Add to engineer dropdown
                // const engineerClone = option.cloneNode(true);
                // engineerSelect.appendChild(engineerClone);

                // Add to client dropdown
                const clientOption = option.cloneNode(true);
                clientSelect.appendChild(clientOption);
            });
        }
    function openProjectModal() {
    console.log('Opening project Modal');

    const users = getAllUsers();

    const pmSelect = document.getElementById('manager');
    const pms = users.filter(u => u.role === 'project_manager' || u.role === 'admin');
    
    pmSelect.innerHTML = `<option value="">Select Project Manager</option>`;
    pms.forEach(u => {
        pmSelect.innerHTML += `<option value="${u.id}">${u.name}</option>`;
    });

    const assignTeam = document.getElementById('projectAssignee')

    const workers = users.filter(u => u.role !== 'admin' && u.role !== 'client' && u.role !== 'project_manager' && u.status === 'active');

    const roleGroup = {
        'engineer': 'Engineers',
        'supervisor': 'Supervisors',
        'worker': 'Workers'
    }


    assignTeam.innerHTML = `<option value="">Select Other Teams</option>`;

    Object.keys(roleGroup).forEach(role => {
        const roleWorkers = workers.filter(u => u.role === role);
        if (roleWorkers.length > 0) {
            assignTeam.innerHTML += `<option disabled style="color: #FF5200; font-weight: bold;" >-- ${roleGroup[role]} --</option>`;
            roleWorkers.forEach(u => {
                assignTeam.innerHTML += `<option value="${u.id}">${u.name}</option>`;
            });
        }
    });


    const clientSelect = document.getElementById('client');
    const clients = users.filter(u => u.role === 'client');
    
    clientSelect.innerHTML = `<option value="">Select Client</option>`;
    clients.forEach(u => {
        clientSelect.innerHTML += `<option value="${u.id}">${u.name}</option>`;
    });


    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').value = today;
    document.getElementById('endDate').value = '';

    document.getElementById('projectForm').reset();
    document.getElementById('status').value = 'pending';
    document.getElementById('formError').value = '';

    
    document.getElementById('status').value = 'active';



    document.getElementById('addProjectModal').style.display = 'flex';
}

        
let isAddingProject = false;
 
function handleAddProject(event) {

    if (event) event.preventDefault();


    if (isAddingProject) {
        console.log('Preject already being added, please wait...');
        return;
    }

        console.log('handleAddProject() called!');

        isAddingProject = true;

        // Validate fields
        const projectName = document.getElementById("projectName").value.trim();
        const location = document.getElementById("location").value.trim();
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;
        const budget = document.getElementById("budget").value;
        const projectManagerId = document.getElementById("manager").value;
        const assigneeId = document.getElementById("projectAssignee").value;
        const clientId = document.getElementById("client").value;
        const status = document.getElementById("status").value;
        const range = document.getElementById("range").value;
        const description = document.getElementById("description").value.trim();
        const formError = document.getElementById('formError');



        if (!projectName) {
            formError.textContent = "Please fill in all required fields.";
            document.getElementById("projectName").style.borderColor = '#EF4444'
            document.getElementById("projectName").focus();
            return;
        }

        if (!location || !startDate || !endDate || !budget || !projectManagerId || !clientId || !status || !description) {
            formError.textContent = "Please fill in all required fields.";
           return;
            
        } else {
            formError.textContent = "Project added successfully"
            formError.style.color = "#22C55E"
        }

         
        
        // Create project object
        const newProject = {
            id: Date.now(),
            name: projectName,
            location: location,
            startDate: startDate,
            endDate: endDate,
            budget: Number(budget),
            projectManagerId: projectManagerId,
            assigneeId: assigneeId,
            clientId: clientId,
            status: status,
            description: description,
            progress: 0, // default progress,
            createdAt: new Date().toISOString()
        };

        const result = addProject(newProject);

        if (result) {
            formError.innerHTML = 'Project "${name}" created successfuly!';
            formError.style.color = 'green';
        }


                // Clear form
        setTimeout(() => {
        closeProjectModal();

        document.getElementById('projectForm').reset();
        formError.textContent = '';
         
        renderProjects();
         loadDashboard();
        isAddingProject = false;
         
        }, 2000);

          
        

        // Add activity
        addActivity(
            `Project created: ${projectName}`, 
            "project"
        );



        // Refresh project list and dashboard

        loadDashboard(); // Assuming you have this function in dashboard.js

}





// creat task object

function handleAddTask() {
console.log("Add Task function called");

    const title = document.getElementById('taskTitle').value.trim();
    const projectId = document.getElementById('taskProject').value;
    const assignedTo = document.getElementById('taskAssignee').value;
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const description = document.getElementById('taskDescription').value.trim();
    const status = document.getElementById('taskStatus')?.value;

    const taskError = document.getElementById('taskError');

    taskError.textContent = '';
    taskError.className = '';

    const hasError = false;
    const errorMessages = [];
    
        if (!title) {
            document.getElementById('taskTitle').style.borderColor = '#EF4444';
            document.getElementById('taskTitle').focus();
            taskError.textContent = 'Please enter a task title';
            hasError = true;
        } else if (title.length < 3) {
            taskError.textContent = "Task title must be at least 3 characters";
            document.getElementById('taskTitle').style.borderColor = '#EF4444';
            document.getElementById('taskTitle').focus();
            hasError = true
        }

        if (!projectId) {
            taskError.textContent = "Please select a project"
            document.getElementById('taskTitle').style.borderColor = '#EF4444';
            hasError = true
        }

        if (!assignedTo) {
            taskError.textContent = "Please assign this task to someone";
            document.getElementById('taskTitle').style.borderColor = '#EF4444';
            hasError = true
        }

        if (dueDate) {
            const today = new Date();
            const due = new Date(dueDate);
            if (due < today) {
                console.warn('Due date is in the past');
            }
        }

        if (hasError) {
            taskError.innerHTML = errorMessages.join('<br>');
            console.log('validation error:', errorMessages);

            return false;
        }

        console.log('all validation passed');

const newTask = {
    id: Date.now(),
    title: title,
    projectId: parseInt(projectId),
    assignedTo: parseInt(assignedTo),
    priority: priority,
    dueDate: dueDate,
    description: description,
    status: status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};


    console.log('New task object:', newTask);

    const result = addTask(newTask);

    if (result) {
        taskError.textContent = 'Task "${title}" created successfully!';
        taskError.style.color = 'green';



        
            // Close modal after delay
        setTimeout(() => {

           closeTaskModal();

            renderTasks();
            document.getElementById('taskForm').reset();
            taskError.textContent = "";
        }, 2000);
              
        

    // Send notification to assigned user
    addNotification({
        userId: assignedTo,
        title: "New Task Assigned",
        message: `You have been assigned a new task: "${title}"`,
        type: "task"
    });
  } else {
    taskError.textContent = 'Failed to create task. please try again.';
    taskError.style.display = 'block';
    alert('Failed to create task. please try again.');
  }

}





function createUser() {
    console.log("🔵 Creating new user...");
    
    // Get values
    const name = document.getElementById('userFullName').value.trim();
    const email = document.getElementById('userEmail').value;
    const phone = document.getElementById('userPhone').value;
    const role = document.getElementById('userModalRole').value;
    const department = document.getElementById('userDepartment').value;
    const password = document.getElementById('userPassword').value;
    const confirmPassword = document.getElementById('userConfirmPassword').value;
    const status = document.getElementById('userStatus').value;
    
    const errorDiv = document.getElementById('formError');
    const successDiv = document.getElementById('formSuccess');
    
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    // Validation
    const errors = [];
    
    if (!name) {
        errors.push('Please enter a full name');
        document.getElementById('userFullName').focus();
    }
    
    if (!email) {
        errors.push('Please enter an email address');
        document.getElementById('userEmail').focus();
    } else if (!email.includes('@') || !email.includes('.')) {
        errors.push('Please enter a valid email address');
        document.getElementById('userEmail').focus();
    }
    
    if (!role) {
        errors.push('Please select a role');
        document.getElementById('userRole').focus();
    }
    
    if (!password) {
        errors.push('Please create a password');
        document.getElementById('userPassword').focus();
    } else if (password.length < 6) {
        errors.push('Password must be at least 6 characters');
        document.getElementById('userPassword').focus();
    }
    
    if (password !== confirmPassword) {
        errors.push('Passwords do not match');
        document.getElementById('userConfirmPassword').focus();
    }
    
    // Check if email already exists
    const existingUsers = getAllUsers();
    const emailExists = existingUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
        errors.push('A user with this email already exists');
        document.getElementById('userEmail').focus();
    }
    
    if (errors.length > 0) {
        errorDiv.innerHTML = '❌ ' + errors.join('<br>');
        errorDiv.style.display = 'block';
        return;
    }
    
    // Create user
    const newUser = {
        name: name,
        email: email,
        phone: phone || '',
        password: password,
        confirmPassword: confirmPassword,
        role: role,
        department: department || '',
        status: status || 'active'
    };
    
    const result = addUser(newUser);

    let newUsers = getAllUsers() || [];
        newUsers.push(newUser);
        localStorage.setItem("newTasks", JSON.stringify(newUsers));
    
    if (result) {
        successDiv.innerHTML = `✅ User "${name}" created successfully! They can now login.`;
        successDiv.style.display = 'block';
        
        // Clear form
        document.getElementById('createUserForm').reset();
        
        // Reload users list
        renderUsers();
        
        // Close modal after delay
        setTimeout(() => {
            closeCreateUserModal();
        }, 2000);
    } else {
        errorDiv.innerHTML = '❌ Failed to create user. Please try again.';
        errorDiv.style.display = 'block';
    }
}


function handleAddMaterial() {
    console.log('Add Material function called')

    const materialName = document.getElementById('materialName').value.trim();
    const category = document.getElementById('materialCategory').value;
    const quantity = parseInt(document.getElementById('materialQuantity').value);
    const unit = document.getElementById('materialUnit').value;
    const status = document.getElementById('materialStatus').value;
    const minStock = parseInt(document.getElementById('minStock').value) || 0;

    const materialError = document.getElementById('materialError');

    materialError.textContent = '';


    if (!materialName) {
        materialError.textContent = 'Please enter material name';
        materialError.style.color = 'red';
        document.getElementById('materialName').focus();
        return;
    }

    if (!category) {
        materialError.textContent = 'Please enter material name';
        materialError.style.color = 'red';
         document.getElementById('materialName').focus();
        return;
    }

    if (isNaN(quantity) || quantity < 0) {
        materialError.textContent = 'Please enter a valid quantity';
        materialError.style.color = 'red';
         document.getElementById('materialName').focus();
        return;
    }

    if (!unit) {
        materialError.textContent = 'Please select a unit';
        materialError.style.color = 'red';
         document.getElementById('materialName').focus();
        return;
    }



    const newMaterial = {
        id: Date.now(),
        materialName: materialName,
        category: category,
        quantity: quantity,
        unit: unit,
        status: status,
        minStock: minStock,
        createdAt: new Date().toISOString()
    }
    console.log(' New material object:', newMaterial)
    const result = addMaterial(newMaterial);

    let newMaterials = getAllMaterials() || [];
        newMaterials.push(newMaterial);
        localStorage.setItem("newMaterials", JSON.stringify(newMaterials));
    
    if (result) {
        materialError.textContent = '✅ "${materialName}" successfully added to ${category} list.';
        materialError.style.color = 'green';


        
        
    setTimeout(() => {
        materialModal.style.display = "none";

        renderMaterial();
          // Clear form
         document.getElementById('materialForm').reset();
        materialError.textContent = '';
      },2000);  
        // Reload users list


    } else {
        errorDiv.innerHTML = '❌ Failed to create user. Please try again.';
        errorDiv.style.display = 'block';
    }
    

}


function handleAddExpense() {
            console.log("🔵 handleAddExpense() called!");

            const projectId = document.getElementById('expenseProject').value;
            const category = document.getElementById('expenseCategory').value;
            const description = document.getElementById('expenseDescription').value.trim();
            const amount = parseFloat(document.getElementById('expenseAmount').value);
            const expenseDate = document.getElementById('expenseDate').value;

            const expenseError = document.getElementById('expenseError');

            expenseError.textContent = '';


            if (!projectId) {
                expenseError.textContent = 'Please select a project',
                expenseError.style.color = '#EF4444'
                document.getElementById('expenseProject').focus();
                return;
            }

            if (!category) {
                expenseError.textContent = 'Please select a category',
                expenseError.style.color = '#EF4444'
                document.getElementById('expenseProject').focus();
                return;
            }

            if (!description) {
                expenseError.textContent = 'Please enter a description',
                expenseError.style.color = '#EF4444';
                document.getElementById('expenseProject').focus();
                return;
            }

            if (isNaN(amount) || amount <= 0) {
                expenseError.textContent = 'Please enter a valid amount',
                expenseError.style.color = '#EF4444';
                document.getElementById('expenseProject').focus();
                return
            }

            // else if (errors.length > 0) {
            //     errorDiv.innerHTML = '❌ ' + errors.join('<br>');
            //     errorDiv.style.display = 'block';
            //     return;
            // }

            // if (hasError) {
            //     materialError.innerHTML = errorMessages.join('<br>');
            //     console.log('validation error:', errorMessages);

            //     return false;
            // }
            const newExpense = {
                id: Date.now(),
                projectId: parseInt(projectId),
                category: category,
                description: description,
                amount: amount,
                expenseDate: expenseDate || new Date().toISOString().split('T')[0],
                recordedAt: new Date().toISOString(),
                status: 'pending' // Add status for pending cost tracking
            };

            console.log("✅ New expense:", newExpense);

            const result = addExpense(newExpense);
                    
            let newExpenses = getAllExpenses() || [];
                newExpenses.push(newExpense);
                localStorage.setItem("newExpenses", JSON.stringify(newExpenses));
            

            if (result) {
                expenseError.textContent = '✅ Expense added successfully!';
                expenseError.style.color = 'green';


                setTimeout(() => {
                 closeExpenseModal();
    
                renderExpenses();
                document.getElementById('expenseForm').reset();
                expenseError.textContent = '';
               },2000); 
              
                // Reload with current filter
                renderBudgetData(currentFilter);
                addActivity(`Expense added: ${description} (${formatCurrency(amount)})`, 'expense');
            } else {
                errorDiv.innerHTML = '❌ Failed to add expense. Please try again.';
                errorDiv.style.display = 'block';
            }
        }



function handleAddMember() {
    console.log('render members called')

    const name = document.getElementById('memberName').value.trim();
    const email = document.getElementById('memberEmail').value.trim();
    const phone = document.getElementById('memberPhone').value.trim();
    const role = document.getElementById('memberRole').value;
    const department = document.getElementById('memberDepartment').value;
    const status = document.getElementById('memberStatus').value;
    const password = document.getElementById('memberPassword').value;
    const confirmPassword = document.getElementById('memberConfirmPassword').value;

    const memberError = document.getElementById('memberError');

    memberError.textContent = '';

    if (!name) {
        memberError.textContent = 'Please enter the member\'s full name';
        document.getElementById('memberName').focus();
        return;
    }

    if (!email) {
        memberError.textContent = 'Please enter an email address'
        document.getElementById('memberEmai')
    } else if (!email.includes('@') || !email.includes('.')) {
        memberError.textContent = 'Please enter a valid email address';
        document.getElementById('memberEmail').focus();
    }

    // else if (!/-[-\s@]+$/.test(email)) {


    const existingMembers = getAllUsers();
    const emailExists = existingMembers.some(member => member.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
        memberError.textContent = 'A member with this email already exists';
        document.getElementById('memberEmail').focus();
    }


    if (!role) {
        memberError.textContent = 'Please select a role';
        document.getElementById('memberRole').focus();
    }

    if (!password) {
        memberError.textContent = 'Please create a password';
        document.getElementById('memberPassword').focus();
    } else if (password.length < 6) {
        memberError.textContent = 'Password must be at least 6 characters';
        document.getElementById('memberPassword').focus();
    }

    if (password !== confirmPassword) {
        memberError.textContent = 'Passwords do not match';
        document.getElementById('memberConfirmPassword').focus();
    }

    if (memberError.textContent) {
        memberError.style.color = '#EF4444';
        return;
    }


    const newMember = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone || '',
        role: role, 
        department: department || '',
        status: status || 'active',
        password: password,
        createdAt: new Date().toISOString()
    };

    console.log('New member object:', newMember);

    const result = addUser(newMember);

     let newMembers = getAllUsers() || [];
                newMembers.push(newMember);
                localStorage.setItem("newMembers", JSON.stringify(newMembers));

    if (result) {
        memberError.textContent = `✅ Member "${name}" created successfully! They can now login.`;
        memberError.style.color = 'green';

       
        // Clear form
        setTimeout(() => {
        closeMemberModal();

        renderMembers();
        document.getElementById('memberForm').reset();
        memberError.textContent = '';
        }, 2000);

    } else {
        memberError.textContent = '❌ Failed to create member. Please try again.';
        memberError.style.color = '#EF4444';
    }

}
