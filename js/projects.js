// add task
function addTask() {      
        const title = document.getElementById('taskTitle').value.trim();
        const projectId = document.getElementById('taskProject').value;
        const assignedTo = document.getElementById('taskAssignee').value;
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const description = document.getElementById('taskDescription').value.trim();
        const status = document.getElementById('taskStatus').value;
        const taskError = document.getElementById("taskError");

        const taskForm = document.getElementById("taskForm");


        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();

          if (!title) {
                taskError.textContent = "Please enter a task title";
                return;
            }

            if (!projectId) {
                taskError.textContent = "Please select a project"
                return;
            }

            if (!assignedTo) {
                taskError.textContent = "Please assign this task to someone";
                return;
            }
 
            // creat task object
            const newTask = {
                id: Date.now(),
                title: title,
                projectId: projectId,
                assignedTo: assignedTo,
                priority: priority,
                dueDate: dueDate || null,
                description: description || '',
                status: status,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

 
            // save to localStorage
            addTask(newTask);

            // show success message
            taskError.textContent = `Task "${title}" created successfully!`;

            // close modal
            closeTaskModal();

            // Reload tasks table
            loadTasks();

            // Send notification to assigned user
            addNotification({
                userId: assignedTo,
                title: "New Task Assigned",
                message: `You have been assigned a new task: "${title}"`,
                type: "task"
            });


            renderTasks();
            loadDashboard();
            });
            
}