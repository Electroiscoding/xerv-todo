// Initialize Tailwind CSS
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
}

// Firebase configuration placeholder - DO NOT hardcode keys. Use a secure method to input your config.
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Privacy settings: Add user consent for sharing data
let userPrivacyConsent = false; // Default to false; user can toggle in settings

function checkPrivacyConsent() {
  if (userPrivacyConsent) {
    // Proceed with data sharing for competition features
  } else {
    alert('Privacy consent required for competition features.');
  }
}
// Integrate this with UI settings for opt-in/out

// DOM Elements
const taskList = document.getElementById('taskList');
const addTaskButton = document.getElementById('addTask');
const newTaskModal = document.getElementById('newTaskModal');
const closeModal = document.getElementById('closeModal');
const taskForm = document.getElementById('taskForm');
const themeToggle = document.getElementById('themeToggle');

// State Management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Animations
const bounce = (element) => {
    element.classList.add('animate-bounce');
    setTimeout(() => element.classList.remove('animate-bounce'), 1000);
};

const pulse = (element) => {
    element.classList.add('animate-pulse');
    setTimeout(() => element.classList.remove('animate-pulse'), 1000);
};

const shake = (element) => {
    element.classList.add('animate-shake');
    setTimeout(() => element.classList.remove('animate-shake'), 1000);
};

// Task Functions
const renderTasks = () => {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-card bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg';
        taskElement.dataset.index = index;
        
        const priorityClass = task.priority === 'high' ? 'priority-high' :
            task.priority === 'medium' ? 'priority-medium' : 'priority-low';
        
        taskElement.innerHTML = `
            <div class="relative">
                <!-- Confetti for completed tasks -->
                ${task.completed ? `
                    <div class="absolute inset-0 pointer-events-none">
                        <div class="confetti"></div>
                        <div class="confetti"></div>
                        <div class="confetti"></div>
                    </div>
                ` : ''}
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" class="task-checkbox" data-index="${index}" ${task.completed ? 'checked' : ''}>
                        <span class="text-gray-800 ${task.completed ? 'line-through' : ''} ${priorityClass}">
                            ${task.title}
                        </span>
                        <div class="priority-badge px-2 py-1 rounded-full text-xs ${priorityClass}">
                            ${task.priority}
                        </div>
                    </div>
                    
                    <div class="flex space-x-2">
                        <!-- Priority Toggle -->
                        <button class="priority-toggle p-2 rounded-lg hover:bg-gray-200" data-index="${index}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                        </button>
                        
                        <!-- Timer -->
                        <button class="timer-btn p-2 rounded-lg hover:bg-gray-200" data-index="${index}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </button>
                        
                        <!-- Subtasks -->
                        <button class="subtasks-btn p-2 rounded-lg hover:bg-gray-200" data-index="${index}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                            </svg>
                        </button>
                        
                        <!-- Edit -->
                        <button class="edit-task p-2 rounded-lg hover:bg-gray-200" data-index="${index}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                            </svg>
                        </button>
                        
                        <!-- Delete -->
                        <button class="delete-task p-2 rounded-lg hover:bg-gray-200" data-index="${index}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Subtasks Container -->
                <div class="subtasks-container hidden mt-2">
                    ${task.subtasks?.map((subtask, subIndex) => `
                        <div class="subtask flex items-center space-x-2">
                            <input type="checkbox" class="subtask-checkbox" data-index="${index}" data-subindex="${subIndex}" ${subtask.completed ? 'checked' : ''}>
                            <span class="text-sm ${subtask.completed ? 'line-through' : ''}">
                                ${subtask.title}
                            </span>
                        </div>
                    `).join('') || ''}
                </div>
                
                <!-- Progress Bar -->
                <div class="progress-container mt-2">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="progress bg-blue-500 h-2 rounded-full" style="width: ${task.subtasks ? Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100) : 0}%">
                        </div>
                    </div>
                </div>
                
                <!-- Notes -->
                <div class="notes-container mt-2">
                    <button class="toggle-notes p-2 rounded-lg hover:bg-gray-200">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                    </button>
                    ${task.notes ? `
                        <div class="notes mt-2 p-2 bg-gray-50 rounded-lg" style="display: ${task.notesVisible ? 'block' : 'none'}">
                            <p>${task.notes}</p>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Tags -->
                <div class="tags-container mt-2">
                    ${task.tags?.map(tag => `
                        <span class="tag px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 mr-1">
                            ${tag}
                        </span>
                    `).join('') || ''}
                </div>
            </div>
        `;
        
        taskList.appendChild(taskElement);
        slideIn(taskElement);
    });
};

// Add new animations
const addAnimations = () => {
    // Task drag and drop
    taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const target = e.target.closest('.task-card');
        if (target) {
            target.classList.add('hover');
        }
    });

    taskList.addEventListener('dragleave', (e) => {
        const target = e.target.closest('.task-card');
        if (target) {
            target.classList.remove('hover');
        }
    });

    // Task hover effects
    taskList.addEventListener('mouseenter', (e) => {
        const target = e.target.closest('.task-card');
        if (target) {
            target.classList.add('hover');
        }
    });

    taskList.addEventListener('mouseleave', (e) => {
        const target = e.target.closest('.task-card');
        if (target) {
            target.classList.remove('hover');
        }
    });

    // Priority toggle animation
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('priority-toggle')) {
            const index = e.target.dataset.index;
            const task = tasks[index];
            
            // Cycle through priorities
            const priorities = ['low', 'medium', 'high'];
            const currentIndex = priorities.indexOf(task.priority);
            const newIndex = (currentIndex + 1) % priorities.length;
            task.priority = priorities[newIndex];
            
            saveTasks();
            renderTasks();
            
            // Add animation
            const taskCard = e.target.closest('.task-card');
            taskCard.classList.add('priority-change');
            setTimeout(() => taskCard.classList.remove('priority-change'), 500);
        }
    });

    // Timer start/stop animation
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('timer-btn')) {
            const index = e.target.dataset.index;
            const task = tasks[index];
            
            if (!task.timer) {
                task.timer = {
                    startTime: new Date().toISOString(),
                    running: true
                };
            } else {
                task.timer.running = !task.timer.running;
            }
            
            saveTasks();
            renderTasks();
            
            const timerBtn = e.target;
            timerBtn.classList.add('timer-animate');
            setTimeout(() => timerBtn.classList.remove('timer-animate'), 500);
        }
    });

    // Subtasks toggle animation
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('subtasks-btn')) {
            const index = e.target.dataset.index;
            const taskCard = e.target.closest('.task-card');
            const subtasksContainer = taskCard.querySelector('.subtasks-container');
            
            subtasksContainer.classList.toggle('hidden');
            
            // Add animation
            const subtasksBtn = e.target;
            subtasksBtn.classList.add('subtasks-animate');
            setTimeout(() => subtasksBtn.classList.remove('subtasks-animate'), 500);
        }
    });

    // Notes toggle animation
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('toggle-notes')) {
            const index = e.target.dataset.index;
            const task = tasks[index];
            const taskCard = e.target.closest('.task-card');
            const notes = taskCard.querySelector('.notes');
            
            task.notesVisible = !task.notesVisible;
            notes.style.display = task.notesVisible ? 'block' : 'none';
            
            // Add animation
            const toggleBtn = e.target;
            toggleBtn.classList.add('notes-animate');
            setTimeout(() => toggleBtn.classList.remove('notes-animate'), 500);
        }
    });
};

// Initialize animations
addAnimations();

// Update task rendering to include animations
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('task-checkbox')) {
        const index = e.target.dataset.index;
        tasks[index].completed = !tasks[index].completed;
        tasks[index].updatedAt = new Date().toISOString();
        saveTasks();
        renderTasks();
        
        // Add confetti animation
        const taskCard = e.target.closest('.task-card');
        if (tasks[index].completed) {
            const confettiContainer = taskCard.querySelector('.confetti-container');
            if (confettiContainer) {
                confettiContainer.classList.add('confetti-animate');
                setTimeout(() => confettiContainer.classList.remove('confetti-animate'), 2000);
            }
        }
    }
});

const addTask = (taskData) => {
    const newTask = {
        ...taskData,
        id: Date.now(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    newTaskModal.classList.add('hidden');
    taskForm.reset();
    pulse(taskList);
};

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Event Listeners
addTaskButton.addEventListener('click', () => {
    newTaskModal.classList.remove('hidden');
    bounce(addTaskButton);
});

closeModal.addEventListener('click', () => {
    newTaskModal.classList.add('hidden');
});

themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    shake(themeToggle);
});

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    addTask(Object.fromEntries(formData));
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('task-checkbox')) {
        const index = e.target.dataset.index;
        tasks[index].completed = !tasks[index].completed;
        tasks[index].updatedAt = new Date().toISOString();
        saveTasks();
        renderTasks();
        pulse(e.target.closest('.task-checkbox'));
    }

    if (e.target.classList.contains('edit-task')) {
        const index = e.target.dataset.index;
        const task = tasks[index];
        taskForm.elements.title.value = task.title;
        taskForm.elements.priority.value = task.priority || 'medium';
        taskForm.elements.dueDate.value = task.dueDate || '';
        newTaskModal.classList.remove('hidden');
        bounce(e.target);
    }

    if (e.target.classList.contains('delete-task')) {
        const index = e.target.dataset.index;
        if (confirm('Are you sure you want to delete this task?')) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
            shake(e.target.closest('.delete-task'));
        }
    }
});

// Initial Render
renderTasks();
