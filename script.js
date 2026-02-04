// Task Manager Application - Web Infrastructure Project

class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.taskList = document.getElementById('taskList');
        this.taskCount = document.getElementById('taskCount');
        this.clearCompleted = document.getElementById('clearCompleted');
        this.filterBtns = document.querySelectorAll('.filter-btn');

        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.clearCompleted.addEventListener('click', () => this.clearCompletedTasks());

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        this.render();
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (text === '') {
            alert('Please enter a task!');
            return;
        }

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.taskInput.value = '';
        this.render();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.render();
    }

    clearCompletedTasks() {
        this.tasks = this.tasks.filter(t => !t.completed);
        this.saveTasks();
        this.render();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }

    getFilteredTasks() {
        switch(this.currentFilter) {
            case 'active':
                return this.tasks.filter(t => !t.completed);
            case 'completed':
                return this.tasks.filter(t => t.completed);
            default:
                return this.tasks;
        }
    }

    render() {
        const filteredTasks = this.getFilteredTasks();
        
        this.taskList.innerHTML = '';
        
        if (filteredTasks.length === 0) {
            this.taskList.innerHTML = '<li style="text-align: center; color: #999; padding: 20px;">No tasks to display</li>';
        } else {
            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                    <span class="task-text">${this.escapeHtml(task.text)}</span>
                    <button class="delete-btn" data-id="${task.id}">Delete</button>
                `;
                this.taskList.appendChild(li);
            });
        }

        // Add event listeners
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.toggleTask(parseInt(e.target.dataset.id));
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.deleteTask(parseInt(e.target.dataset.id));
            });
        });

        // Update stats
        const activeCount = this.tasks.filter(t => !t.completed).length;
        this.taskCount.textContent = `${activeCount} active task${activeCount !== 1 ? 's' : ''}`;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('tasks');
        return saved ? JSON.parse(saved) : [];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});

