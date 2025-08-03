// --- DOM Elements ---
const todoList = document.getElementById('todo-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const deleteBox = document.getElementById('delete-box');

// Modals & Overlays
const pinLockModal = document.getElementById('pin-lock-modal');
const taskDetailsModal = document.getElementById('task-details-modal');
const geoTaskModal = document.getElementById('geo-task-modal');
const confirmationModal = document.getElementById('confirmation-modal');
const focusModeOverlay = document.getElementById('focus-mode-overlay');
const zenTimerModal = document.getElementById('zen-timer-modal');
const aiAssistant = document.getElementById('ai-assistant');
const toastContainer = document.getElementById('toast-container');

// PIN Lock Elements
const pinTitleEl = document.getElementById('pin-title');
const pinMessageEl = document.getElementById('pin-message');
const pinInputEl = document.getElementById('pin-input');
const pinBtnEl = document.getElementById('pin-btn');
const pinErrorEl = document.getElementById('pin-error');

// Pomodoro Timer Elements
const timerDisplayEl = document.getElementById('timer-display');
const timerStartBtn = document.getElementById('timer-start-btn');
const timerPauseBtn = document.getElementById('timer-pause-btn');
const timerResetBtn = document.getElementById('timer-reset-btn');
const timerProgressBar = document.getElementById('timer-progress-bar');
const zenTimerBtn = document.getElementById('zen-timer-btn');

// Calendar Elements
const calendarEl = document.getElementById('calendar');
const currentMonthYearEl = document.getElementById('current-month-year');
const prevMonthBtn = document.getElementById('prev-month-btn');
const nextMonthBtn = document.getElementById('next-month-btn');

// Analytics & Gamification Elements
const statsChartEl = document.getElementById('stats-chart');
const completionRateEl = document.getElementById('completion-rate');
const streakInfoEl = document.getElementById('streak-info');
const xpDisplayEl = document.getElementById('xp-display');
const xpBarFill = document.getElementById('xp-bar-fill');
const badgesContainer = document.getElementById('badges-container');
const suggestionsPanel = document.getElementById('suggestions-panel');
const suggestionTextEl = document.getElementById('suggestion-text');
const dailyChallengeTextEl = document.getElementById('daily-challenge-text');
const dailyChallengeBtn = document.getElementById('daily-challenge-btn');
const dailyEffortBar = document.getElementById('daily-effort-bar');
const dailyEffortTextEl = document.getElementById('daily-effort-text');
const motivationMeter = document.getElementById('motivation-meter');
const motivationBar = document.getElementById('motivation-bar');
const motivationMessage = document.getElementById('motivation-message');

// File I/O Elements
const exportBtn = document.getElementById('export-btn');
const importFile = document.getElementById('import-file');
const magicButton = document.getElementById('magic-button');

// Task Interaction Buttons
const feelingLuckyBtn = document.getElementById('feeling-lucky-btn');
const cleanModeBtn = document.getElementById('clean-mode-btn');

// Footer Element
const currentYearSpan = document.getElementById('current-year');

// --- State Variables ---
let tasks = [];
let currentTheme = 'day';
let pin = null;
let selectedTaskId = null;
let pomodoroTime = 25 * 60; // 25 minutes
let pomodoroIsRunning = false;
let pomodoroInterval;
let currentPomodoroSession = 'focus';
let lastTaskAddedTime = Date.now();
let currentFilter = 'all';
let currentCalendarDate = new Date();
let streak = { current: 0, lastCheckDate: null };
let xp = 0;
const badges = {
    'First Task': false,
    'Streak Starter': false,
    'Pomodoro Pro': false,
};
const dailyChallenge = { text: '', completed: false, date: null };
let motivationLevel = 0;
const taskQuotes = [];

// --- Sounds ---
const soundComplete = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); // Placeholder
const soundDelete = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'); // Placeholder
const soundAdd = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'); // Placeholder


// --- Gamification Data ---
const XP_PER_TASK = 10;
const BADGE_THRESHOLDS = {
    'First Task': 1,
    'Streak Starter': 3,
    'Pomodoro Pro': 10
};
const BADGE_EMOJIS = {
    'First Task': '✨',
    'Streak Starter': '🔥',
    'Pomodoro Pro': '🍅'
};
const productivityTips = [
    "Break down large tasks into smaller, manageable steps.",
    "Try the 'two-minute rule': if a task takes less than two minutes, do it immediately.",
    "Use the Pomodoro Technique to stay focused and avoid burnout.",
    "Schedule your most important tasks for when you have the most energy.",
    "Don't aim for perfection; aim for progress.",
    "Take regular breaks to rest your mind and body.",
    "Keep your workspace tidy to reduce distractions.",
    "Review your goals at the end of each day."
];
const motivationalMessages = [
    "Keep going!", "You're doing great!", "Almost there!", "Productivity unlocked!", "Unstoppable!"
];
const dailyChallenges = [
    "Finish 3 tasks before 7 PM.",
    "Complete a task with an effort of 7 or higher.",
    "Use the Pomodoro timer for one session.",
    "Write a note for a task.",
    "Add a subtask to an existing task."
];

// --- Core Functions: Data Persistence & Rendering ---

/**
 * Generates a unique ID for a new task.
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Saves the current application state to localStorage.
 */
function saveData() {
    try {
        localStorage.setItem('todo-tasks', JSON.stringify(tasks));
        localStorage.setItem('todo-theme', currentTheme);
        localStorage.setItem('todo-pin', pin);
        localStorage.setItem('todo-streak', JSON.stringify(streak));
        localStorage.setItem('todo-xp', xp);
        localStorage.setItem('todo-badges', JSON.stringify(badges));
        localStorage.setItem('todo-daily-challenge', JSON.stringify(dailyChallenge));
        localStorage.setItem('todo-task-quotes', JSON.stringify(taskQuotes));
    } catch (e) {
        console.error("Failed to save data to localStorage:", e);
    }
}

/**
 * Loads the application state from localStorage.
 */
function loadData() {
    try {
        const storedTasks = localStorage.getItem('todo-tasks');
        const storedTheme = localStorage.getItem('todo-theme');
        const storedPin = localStorage.getItem('todo-pin');
        const storedStreak = localStorage.getItem('todo-streak');
        const storedXp = localStorage.getItem('todo-xp');
        const storedBadges = localStorage.getItem('todo-badges');
        const storedChallenge = localStorage.getItem('todo-daily-challenge');
        const storedQuotes = localStorage.getItem('todo-task-quotes');

        if (storedTasks) tasks = JSON.parse(storedTasks);
        if (storedTheme) setTheme(storedTheme);
        if (storedPin && storedPin !== 'null') pin = storedPin;
        if (storedStreak) streak = JSON.parse(storedStreak);
        if (storedXp) xp = parseInt(storedXp);
        if (storedBadges) Object.assign(badges, JSON.parse(storedBadges));
        if (storedChallenge) Object.assign(dailyChallenge, JSON.parse(storedChallenge));
        if (storedQuotes) Object.assign(taskQuotes, JSON.parse(storedQuotes));

    } catch (e) {
        console.error("Failed to load data from localStorage, clearing corrupted data.", e);
        localStorage.clear();
        tasks = [];
        currentTheme = 'day';
        pin = null;
        streak = { current: 0, lastCheckDate: null };
        xp = 0;
        Object.keys(badges).forEach(key => badges[key] = false);
        dailyChallenge = { text: '', completed: false, date: null };
        taskQuotes = [];
    }
}

/**
 * Renders tasks on the page based on the current state and filter.
 */
function renderTasks() {
    todoList.innerHTML = '';
    
    // Sort tasks: pinned first, then by dateCreated
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.pinned !== b.pinned) {
            return b.pinned ? -1 : 1;
        }
        return new Date(b.dateCreated) - new Date(a.dateCreated);
    });
    
    const filteredTasks = sortedTasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        if (currentFilter.startsWith('date-')) {
            const date = currentFilter.split('date-')[1];
            return new Date(task.dateCreated).toISOString().split('T')[0] === date;
        }
        return true;
    });

    if (filteredTasks.length === 0) {
        todoList.innerHTML = `<p class="empty-list-message">No tasks found.</p>`;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''} ${task.pinned ? 'pinned' : ''} ${task.isFrozen ? 'frozen' : ''}`;
        li.draggable = true;
        li.dataset.id = task.id;
        
        li.innerHTML = `
            <span class="todo-item-text">
                <input type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Toggle task completion">
                <span class="task-title-text">${task.text}</span>
                ${task.acronym ? `<span class="acronym-tag">${task.acronym}</span>` : ''}
                ${task.moodTag ? `<span class="mood-tag">${task.moodTag}</span>` : ''}
            </span>
            <div class="todo-item-actions">
                <button class="action-btn freeze-btn" data-action="freeze" aria-label="Freeze task">
                    <i class="fas ${task.isFrozen ? 'fa-lock' : 'fa-lock-open'}"></i>
                </button>
                <button class="action-btn pin-btn" data-action="pin" aria-label="Pin task">
                    <i class="fas fa-thumbtack"></i>
                </button>
                <button class="action-btn geo-btn" data-action="geo" aria-label="Set location for task">
                    <i class="fas fa-map-marker-alt"></i>
                </button>
                <button class="action-btn" data-action="edit" aria-label="Edit task details">
                    <i class="fas fa-info-circle"></i>
                </button>
            </div>
        `;
        todoList.appendChild(li);
    });
    drawChart();
    renderBadges();
    updateXpBar();
    updateDailyEffort();
}

/**
 * Adds a new task to the list.
 */
function addTask(text) {
    // Feature 19: Task Similarity Detector
    const existingTask = tasks.find(t => t.text.toLowerCase().includes(text.toLowerCase()) || text.toLowerCase().includes(t.text.toLowerCase()));
    if (existingTask) {
        if (window.confirm("Looks like a similar task already exists. Do you want to merge or add anyway?")) {
            // Logic to merge could go here, for now, just add
            // For this implementation, we will just continue with adding a new task
        } else {
            return;
        }
    }
    
    const newTask = {
        id: generateId(),
        text,
        completed: false,
        pinned: false,
        isFrozen: false, // Feature 1: Frozen Tasks
        moodTag: null, // Feature 2: Mood Tagging
        effort: 5, // Feature 9: Effort Estimator
        geoTag: null, // Feature 7: Geo-based Tasks
        acronym: generateAcronym(text), // Feature 11: Acronym Generator
        notes: '',
        subtasks: [],
        photo: null,
        dateCreated: new Date().toISOString(),
        history: [{ type: 'created', timestamp: new Date().toISOString() }], // Feature 4: Timelapse History
    };
    tasks.push(newTask);
    saveData();
    renderTasks();
    renderCalendar(currentCalendarDate);
    lastTaskAddedTime = Date.now();
    soundAdd.play();

    // Gamification check
    if (tasks.length >= BADGE_THRESHOLDS['First Task'] && !badges['First Task']) {
        badges['First Task'] = true;
        showToast('You earned the First Task badge!');
        saveData();
    }
}

// --- Feature Implementations ---

// 1. Basic Task Manager
taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText) {
        addTask(taskText);
        taskInput.value = '';
    }
});
todoList.addEventListener('change', e => {
    if (e.target.type === 'checkbox') {
        const taskItem = e.target.closest('.todo-item');
        const taskId = taskItem.dataset.id;
        const task = tasks.find(t => t.id === taskId);
        if (task && !task.isFrozen) {
            task.completed = e.target.checked;
            if (task.completed) {
                // Award XP for completion
                xp += XP_PER_TASK;
                showToast(`Task completed! +${XP_PER_TASK} XP`);
                soundComplete.play();
                motivationLevel += 20;
                updateMotivationMeter();
                // Feature 6: Confetti Effect
                startConfetti();
                // Feature 15: Task-Generated Quotes
                const quoteText = `Completed "${task.text}" at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`;
                taskQuotes.push(quoteText);
                saveData();
            }
            task.history.push({ type: 'completed', timestamp: new Date().toISOString() }); // Feature 4
            saveData();
            renderTasks();
            updateStreak();
        } else if (task && task.isFrozen) {
            e.target.checked = !e.target.checked;
            showToast('This task is frozen and cannot be changed!', 'error');
        }
    }
});
todoList.addEventListener('click', e => {
    const btn = e.target.closest('.action-btn');
    const taskItem = e.target.closest('.todo-item');
    if (!taskItem || !btn) return;
    const taskId = taskItem.dataset.id;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const action = btn.dataset.action;
    if (action === 'pin') {
        task.pinned = !task.pinned;
        saveData();
        renderTasks();
    } else if (action === 'edit') {
        openTaskDetailsModal(taskId);
    } else if (action === 'freeze') { // Feature 1: Frozen Tasks
        task.isFrozen = !task.isFrozen;
        task.history.push({ type: task.isFrozen ? 'frozen' : 'unfrozen', timestamp: new Date().toISOString() });
        saveData();
        renderTasks();
        showToast(task.isFrozen ? 'Task frozen!' : 'Task unfrozen!');
    } else if (action === 'geo') { // Feature 7: Geo-based Tasks
        openGeoTaskModal(taskId);
    }
});
// Feature 17: Focus Spotlight (Dim other tasks on hover)
todoList.addEventListener('mouseover', e => {
    const taskItem = e.target.closest('.todo-item');
    if (taskItem) {
        document.querySelectorAll('.todo-item').forEach(item => {
            if (item !== taskItem) {
                item.classList.add('focus-spotlight');
            }
        });
    }
});
todoList.addEventListener('mouseout', e => {
    document.querySelectorAll('.todo-item').forEach(item => {
        item.classList.remove('focus-spotlight');
    });
});

// 2. Drag & Drop Task Reordering
let draggingItem = null;
todoList.addEventListener('dragstart', e => {
    if (e.target.classList.contains('todo-item') && !e.target.classList.contains('frozen')) {
        draggingItem = e.target;
        e.dataTransfer.setData('text/plain', draggingItem.dataset.id);
        setTimeout(() => e.target.classList.add('dragging'), 0);
    }
});
todoList.addEventListener('dragend', e => {
    e.target.classList.remove('dragging');
    draggingItem = null;
    
    // Reorder the tasks array to match the DOM order
    const newOrder = Array.from(todoList.children).map(item => item.dataset.id);
    tasks.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));
    
    saveData();
    renderTasks();
});
todoList.addEventListener('dragover', e => {
    e.preventDefault();
    if (!draggingItem) return;
    const afterElement = getDragAfterElement(todoList, e.clientY);
    if (afterElement == null) {
        todoList.appendChild(draggingItem);
    } else {
        todoList.insertBefore(draggingItem, afterElement);
    }
});
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
// Drag to delete box
deleteBox.addEventListener('dragover', e => {
    e.preventDefault();
    deleteBox.classList.add('drag-over');
});
deleteBox.addEventListener('dragleave', () => {
    deleteBox.classList.remove('drag-over');
});
deleteBox.addEventListener('drop', e => {
    deleteBox.classList.remove('drag-over');
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
        tasks = tasks.filter(task => task.id !== id);
        saveData();
        renderTasks();
        soundDelete.play();
        showToast('Task deleted!', 'info');
    }
});

// 3. Dynamic Theme Switcher
const themeButtons = document.querySelectorAll('.theme-switcher button');
themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.id.split('-')[1];
        setTheme(theme);
        saveData();
    });
});
function setTheme(themeName) {
    document.body.className = `${themeName}-theme`;
    themeButtons.forEach(btn => btn.classList.remove('active'));
    document.getElementById(`theme-${themeName}-btn`).classList.add('active');
    currentTheme = themeName;
    drawChart();
}

// 4. Pomodoro Timer
function updateTimerDisplay() {
    const minutes = Math.floor(pomodoroTime / 60);
    const seconds = pomodoroTime % 60;
    timerDisplayEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const initialTime = currentPomodoroSession === 'focus' ? 25 * 60 : 5 * 60;
    const progress = (pomodoroTime / initialTime);
    timerProgressBar.style.width = `${(1 - progress) * 100}%`;
}
function startTimer() {
    if (pomodoroIsRunning) return;
    pomodoroIsRunning = true;
    timerStartBtn.disabled = true;
    timerPauseBtn.disabled = false;
    pomodoroInterval = setInterval(() => {
        pomodoroTime--;
        updateTimerDisplay();
        if (pomodoroTime <= 0) {
            clearInterval(pomodoroInterval);
            pomodoroIsRunning = false;
            // Play a sound to notify the user
            soundComplete.play();
            
            if (currentPomodoroSession === 'focus') {
                showToast('Pomodoro session complete! Starting a 5-minute break.');
                currentPomodoroSession = 'break';
                pomodoroTime = 5 * 60;
                // Gamification check for pomodoro
                if (xp >= BADGE_THRESHOLDS['Pomodoro Pro'] && !badges['Pomodoro Pro']) {
                    badges['Pomodoro Pro'] = true;
                    showToast('You earned the Pomodoro Pro badge!');
                    saveData();
                }
            } else {
                showToast('Break time is over. Back to work!');
                currentPomodoroSession = 'focus';
                pomodoroTime = 25 * 60;
            }
            updateTimerDisplay();
            timerStartBtn.disabled = false;
            timerPauseBtn.disabled = true;
        }
    }, 1000);
}
function pauseTimer() {
    clearInterval(pomodoroInterval);
    pomodoroIsRunning = false;
    timerStartBtn.disabled = false;
    timerPauseBtn.disabled = true;
}
function resetTimer() {
    pauseTimer();
    currentPomodoroSession = 'focus';
    pomodoroTime = 25 * 60;
    updateTimerDisplay();
}
timerStartBtn.addEventListener('click', startTimer);
timerPauseBtn.addEventListener('click', pauseTimer);
timerResetBtn.addEventListener('click', resetTimer);

// 5. Mini Calendar with Task Filter
function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    currentMonthYearEl.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    calendarEl.innerHTML = `
        <div class="calendar-day-label">Su</div><div class="calendar-day-label">Mo</div>
        <div class="calendar-day-label">Tu</div><div class="calendar-day-label">We</div>
        <div class="calendar-day-label">Th</div><div class="calendar-day-label">Fr</div>
        <div class="calendar-day-label">Sa</div>
    `;
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const tasksByDate = tasks.reduce((acc, task) => {
        const dateKey = new Date(task.dateCreated).toISOString().split('T')[0];
        acc[dateKey] = (acc[dateKey] || 0) + 1;
        return acc;
    }, {});
    for (let i = 0; i < firstDayOfMonth; i++) calendarEl.innerHTML += '<div></div>';
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDate = new Date(year, month, i);
        const dayDateKey = dayDate.toISOString().split('T')[0];
        const hasTasks = tasksByDate[dayDateKey] > 0;
        const isToday = dayDateKey === new Date().toISOString().split('T')[0];
        const isSelected = currentFilter === `date-${dayDateKey}`;
        calendarEl.innerHTML += `<div class="calendar-day current-month ${hasTasks ? 'has-tasks' : ''} ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}" data-date="${dayDateKey}">${i}</div>`;
    }
}
prevMonthBtn.addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar(currentCalendarDate);
});
nextMonthBtn.addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar(currentCalendarDate);
});
calendarEl.addEventListener('click', e => {
    if (e.target.classList.contains('calendar-day')) {
        const dateKey = e.target.dataset.date;
        currentFilter = `date-${dateKey}`;
        document.querySelectorAll('.filter-bar button').forEach(btn => btn.classList.remove('active'));
        renderTasks();
        renderCalendar(currentCalendarDate); // Re-render calendar to show selection
    }
});

// 6. Pinned Tasks - Handled by the sort logic in renderTasks()

// 7. Analytics Dashboard
function drawChart() {
    const completedCount = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const ctx = statsChartEl.getContext('2d');
    ctx.clearRect(0, 0, statsChartEl.width, statsChartEl.height);
    if (totalTasks === 0) {
        ctx.font = "16px Inter";
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
        ctx.textAlign = 'center';
        ctx.fillText("No tasks yet!", statsChartEl.width / 2, statsChartEl.height / 2);
        completionRateEl.textContent = 'Completion Rate: 0%';
        return;
    }
    const completionRate = Math.round((completedCount / totalTasks) * 100);
    completionRateEl.textContent = `Completion Rate: ${completionRate}%`;
    const completionAngle = (completedCount / totalTasks) * 2 * Math.PI;
    ctx.beginPath();
    ctx.arc(100, 100, 80, 0, completionAngle, false);
    ctx.lineTo(100, 100);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
    ctx.fill();
    ctx.beginPath();
    ctx.arc(100, 100, 80, completionAngle, 2 * Math.PI, false);
    ctx.lineTo(100, 100);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
    ctx.fill();
}
function updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    if (streak.lastCheckDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const allTasksCompleted = tasks.length > 0 && tasks.every(t => t.completed);
    if (allTasksCompleted) {
        streak.current = streak.lastCheckDate === yesterday ? streak.current + 1 : 1;
        streak.lastCheckDate = today;
    } else {
        if (streak.lastCheckDate !== yesterday) streak.current = 0;
    }
    streakInfoEl.textContent = `Streak: ${streak.current} day${streak.current !== 1 ? 's' : ''}`;
    // Gamification check for streak
    if (streak.current >= BADGE_THRESHOLDS['Streak Starter'] && !badges['Streak Starter']) {
        badges['Streak Starter'] = true;
        showToast('You earned the Streak Starter badge!');
        saveData();
    }
    saveData();
}

// 8. Subtasks with Progress Bar - Handled in task details modal
function renderSubtasks(subtasks) {
    const subtaskListEl = document.getElementById('subtask-list');
    subtaskListEl.innerHTML = subtasks.map(subtask => `
        <li class="subtask-item ${subtask.completed ? 'completed' : ''}">
            <input type="checkbox" data-subtask-id="${subtask.id}" ${subtask.completed ? 'checked' : ''}>
            <span>${subtask.text}</span>
        </li>
    `).join('');
    updateSubtaskProgressBar(subtasks);
}
function updateSubtaskProgressBar(subtasks) {
    const total = subtasks.length;
    const completed = subtasks.filter(s => s.completed).length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    document.getElementById('subtask-progress-fill').style.width = `${progress}%`;
}
document.getElementById('subtask-list').addEventListener('change', e => {
    if (e.target.type === 'checkbox') {
        const subtaskId = e.target.dataset.subtaskId;
        const task = tasks.find(t => t.id === selectedTaskId);
        if (task) {
            const subtask = task.subtasks.find(s => s.id === subtaskId);
            if (subtask) {
                subtask.completed = e.target.checked;
                renderSubtasks(task.subtasks);
                saveData();
            }
        }
    }
});
document.getElementById('subtask-form').addEventListener('submit', e => {
    e.preventDefault();
    const subtaskText = document.getElementById('subtask-input').value.trim();
    if (subtaskText && selectedTaskId) {
        const task = tasks.find(t => t.id === selectedTaskId);
        if (task) {
            task.subtasks.push({ id: generateId(), text: subtaskText, completed: false });
            renderSubtasks(task.subtasks);
            document.getElementById('subtask-input').value = '';
            saveData();
        }
    }
});

// 9. Focus Mode
let focusModeInterval;
function activateFocusMode() {
    const pendingTasks = tasks.filter(t => !t.completed);
    if (pendingTasks.length === 0) {
        showToast('No pending tasks to focus on!');
        return;
    }
    const taskToFocus = pendingTasks[0];
    document.getElementById('focus-mode-task-title').textContent = taskToFocus.text;
    focusModeOverlay.classList.add('active');
    
    let focusTime = 25 * 60;
    const timerDisplay = document.getElementById('focus-mode-timer-display');
    timerDisplay.textContent = '25:00';
    focusModeInterval = setInterval(() => {
        focusTime--;
        const minutes = Math.floor(focusTime / 60);
        const seconds = focusTime % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        if (focusTime <= 0) {
            clearInterval(focusModeInterval);
            exitFocusMode();
            showToast('Focus session complete!');
        }
    }, 1000);
}
function exitFocusMode() {
    clearInterval(focusModeInterval);
    focusModeOverlay.classList.remove('active');
}
document.getElementById('focus-mode-btn').addEventListener('click', activateFocusMode);
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && focusModeOverlay.classList.contains('active')) {
        exitFocusMode();
    }
});

// 10. Gamification XP + Badges
function updateXpBar() {
    const maxXP = 100; // Example max XP for a level
    const progress = (xp % maxXP) / maxXP;
    xpBarFill.style.width = `${progress * 100}%`;
    xpDisplayEl.textContent = `XP: ${xp}`;
}
function renderBadges() {
    badgesContainer.innerHTML = '';
    for (const badgeName in badges) {
        if (badges[badgeName]) {
            const badgeEl = document.createElement('span');
            badgeEl.className = 'badge';
            badgeEl.title = badgeName;
            badgeEl.textContent = BADGE_EMOJIS[badgeName];
            badgesContainer.appendChild(badgeEl);
        }
    }
}
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 11. PIN-Lock Mode
function handlePinAction() {
    const enteredPin = pinInputEl.value;
    pinErrorEl.style.display = 'none';
    if (pin === null) { // Set PIN
        if (enteredPin.length === 4) {
            pin = enteredPin;
            saveData();
            pinLockModal.classList.remove('active');
        } else {
            pinErrorEl.textContent = "PIN must be 4 digits.";
            pinErrorEl.style.display = 'block';
        }
    } else { // Enter PIN
        if (enteredPin === pin) {
            pinLockModal.classList.remove('active');
        } else {
            pinErrorEl.textContent = "Incorrect PIN. Try again.";
            pinErrorEl.style.display = 'block';
        }
    }
    pinInputEl.value = '';
}
pinBtnEl.addEventListener('click', handlePinAction);
pinInputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') handlePinAction();
});

// 12. Photo Attachment to Task
document.getElementById('photo-input').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = event => {
            const task = tasks.find(t => t.id === selectedTaskId);
            if (task) {
                task.photo = event.target.result;
                const imgPreview = document.getElementById('task-photo-preview');
                imgPreview.src = task.photo;
                imgPreview.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);
    }
});
function openTaskDetailsModal(id) {
    selectedTaskId = id;
    const task = tasks.find(t => t.id === id);
    if (task) {
        document.getElementById('task-details-title').textContent = task.text;
        document.getElementById('task-notes').value = task.notes;
        // Feature 2: Mood Tagging
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('active'));
        if (task.moodTag) {
            document.querySelector(`.mood-btn[data-mood="${task.moodTag}"]`).classList.add('active');
        }
        document.getElementById('current-mood-tag').textContent = task.moodTag || '';
        // Feature 9: Effort Estimator
        document.getElementById('effort-slider').value = task.effort;
        document.getElementById('effort-value').textContent = task.effort;
        // Feature 4: Timelapse Task History
        renderTaskHistory(task.history);
        renderSubtasks(task.subtasks);
        const imgPreview = document.getElementById('task-photo-preview');
        if (task.photo) {
            imgPreview.src = task.photo;
            imgPreview.style.display = 'block';
        } else {
            imgPreview.style.display = 'none';
        }
        taskDetailsModal.classList.add('active');
    }
}
document.getElementById('save-task-details-btn').addEventListener('click', () => {
    const task = tasks.find(t => t.id === selectedTaskId);
    if (task) {
        task.notes = document.getElementById('task-notes').value;
        const activeMood = document.querySelector('.mood-btn.active');
        task.moodTag = activeMood ? activeMood.dataset.mood : null;
        task.effort = parseInt(document.getElementById('effort-slider').value);
        task.history.push({ type: 'updated', timestamp: new Date().toISOString() });
    }
    taskDetailsModal.classList.remove('active');
    selectedTaskId = null;
    saveData();
    renderTasks();
});
document.getElementById('mood-selector').addEventListener('click', e => {
    const btn = e.target.closest('.mood-btn');
    if (btn) {
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('current-mood-tag').textContent = btn.dataset.mood;
    }
});
document.getElementById('effort-slider').addEventListener('input', e => {
    document.getElementById('effort-value').textContent = e.target.value;
});

// 13. Auto Suggestions / Reminders Panel
function showSuggestions() {
    const now = Date.now();
    const threeHours = 3 * 60 * 60 * 1000;
    suggestionsPanel.style.display = 'none';
    const pendingTasksCount = tasks.filter(t => !t.completed).length;
    if ((now - lastTaskAddedTime) > threeHours && pendingTasksCount === 0) {
        suggestionTextEl.textContent = "It's been a while since you've added a task. Time to plan something?";
        suggestionsPanel.style.display = 'block';
    } else if (pendingTasksCount > 5) {
        suggestionTextEl.textContent = `You have ${pendingTasksCount} pending tasks. Time to knock some out?`;
        suggestionsPanel.style.display = 'block';
    }
}
setInterval(showSuggestions, 15000); // Check every 15 seconds

// 14. Export/Import Tasks
exportBtn.addEventListener('click', () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todo-list-tasks.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Tasks exported successfully!');
});
importFile.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = event => {
            try {
                const importedTasks = JSON.parse(event.target.result);
                if (Array.isArray(importedTasks)) {
                    tasks = importedTasks;
                    saveData();
                    renderTasks();
                    renderCalendar(currentCalendarDate);
                    showToast('Tasks imported successfully!');
                } else {
                    showToast('Error: Invalid JSON file format.');
                }
            } catch (error) {
                showToast('Error: Could not read file. Is it a valid JSON file?');
            }
        };
        reader.readAsText(file);
    }
});

// 15. Magic Button (Random Productivity Tip)
magicButton.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * productivityTips.length);
    showToast(productivityTips[randomIndex]);
});

// --- NEW FEATURE IMPLEMENTATIONS ---

// Feature 3: Random Task Suggestion
feelingLuckyBtn.addEventListener('click', () => {
    const pendingTasks = tasks.filter(t => !t.completed);
    if (pendingTasks.length > 0) {
        const randomTask = pendingTasks[Math.floor(Math.random() * pendingTasks.length)];
        const taskElement = document.querySelector(`[data-id="${randomTask.id}"]`);
        if (taskElement) {
            taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            taskElement.style.outline = '3px solid var(--accent-color)';
            setTimeout(() => taskElement.style.outline = 'none', 3000);
            showToast(`You're feeling lucky! Try "${randomTask.text}"`);
        }
    } else {
        showToast('No pending tasks to choose from!', 'info');
    }
});

// Feature 4: Timelapse Task History
function renderTaskHistory(history) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = history.map(item => `
        <li class="history-item">
            <strong>${item.type}</strong> at ${new Date(item.timestamp).toLocaleString()}
        </li>
    `).join('');
}

// Feature 5: Daily Challenge Mode
function generateDailyChallenge() {
    const today = new Date().toISOString().split('T')[0];
    if (dailyChallenge.date !== today) {
        const randomChallenge = dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)];
        dailyChallenge.text = randomChallenge;
        dailyChallenge.completed = false;
        dailyChallenge.date = today;
        saveData();
    }
    dailyChallengeTextEl.textContent = dailyChallenge.text;
    dailyChallengeBtn.disabled = dailyChallenge.completed;
    dailyChallengeBtn.textContent = dailyChallenge.completed ? 'Completed!' : 'I Did It!';
}
dailyChallengeBtn.addEventListener('click', () => {
    // Logic to check if challenge is met would go here, for now we just mark it as complete
    dailyChallenge.completed = true;
    dailyChallengeBtn.disabled = true;
    dailyChallengeBtn.textContent = 'Completed!';
    showToast('Daily Challenge Completed! Great job!');
    saveData();
});

// Feature 6: Confetti Effect on Completion
function startConfetti() {
    const confettiCanvas = document.createElement('canvas');
    confettiCanvas.id = 'confetti-canvas';
    document.body.appendChild(confettiCanvas);
    const confetti = new ConfettiGenerator({ target: confettiCanvas });
    confetti.render();
    setTimeout(() => {
        confetti.clear();
        confettiCanvas.remove();
    }, 3000);
}

// Feature 7: Geo-based Tasks
function openGeoTaskModal(id) {
    selectedTaskId = id;
    const task = tasks.find(t => t.id === id);
    if (task && task.geoTag) {
        document.getElementById('location-input').value = task.geoTag.name;
    } else {
        document.getElementById('location-input').value = '';
    }
    geoTaskModal.classList.add('active');
}
document.getElementById('save-location-btn').addEventListener('click', () => {
    const task = tasks.find(t => t.id === selectedTaskId);
    const locationName = document.getElementById('location-input').value;
    if (task && locationName) {
        task.geoTag = { name: locationName };
    } else if (task) {
        task.geoTag = null;
    }
    saveData();
    geoTaskModal.classList.remove('active');
    renderTasks();
});

// Feature 9: Effort Estimator (Daily visualization)
function updateDailyEffort() {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(t => t.dateCreated.startsWith(today));
    const totalEffort = todayTasks.reduce((sum, task) => sum + task.effort, 0);
    const maxEffort = 100; // arbitrary max
    const progress = Math.min(totalEffort, maxEffort) / maxEffort;
    dailyEffortBar.style.width = `${progress * 100}%`;
    dailyEffortTextEl.textContent = `${totalEffort} / ${maxEffort} Effort`;
}

// Feature 10: Night Owl Lock
// No specific UI for this, but the logic would be:
// const now = new Date();
// const hour = now.getHours();
// const isNightOwlTime = hour >= 22 || hour <= 5; // 10 PM to 5 AM
// if (!isNightOwlTime && document.body.classList.contains('night-theme')) {
//    // disable editing logic
// }

// Feature 11: Task Acronym Generator
function generateAcronym(text) {
    const words = text.split(' ');
    if (words.length < 3) return null;
    return words.map(word => word.charAt(0).toUpperCase()).join('');
}

// Feature 12: Motivation Meter
function updateMotivationMeter() {
    const maxMotivation = 100;
    const progress = Math.min(motivationLevel, maxMotivation) / maxMotivation;
    motivationBar.style.width = `${progress * 100}%`;
    
    if (motivationLevel > 0) {
        motivationMessage.style.opacity = '1';
        let messageIndex = Math.floor((motivationLevel / maxMotivation) * motivationalMessages.length);
        messageIndex = Math.min(messageIndex, motivationalMessages.length - 1);
        motivationMessage.textContent = motivationalMessages[messageIndex];
    } else {
        motivationMessage.style.opacity = '0';
    }
    if (motivationLevel >= maxMotivation) {
        motivationLevel = 0;
        showToast('You unlocked a power-up! Keep it up!');
    }
}

// Feature 13: Clean Mode
cleanModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('clean-mode');
});

// Feature 14: AI-like Assistant (Scripted)
let assistantInactiveTimer;
let assistantState = 0;
function showAssistantMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'assistant-message';
    messageEl.textContent = message;
    document.getElementById('assistant-body').appendChild(messageEl);
    document.getElementById('assistant-body').scrollTop = document.getElementById('assistant-body').scrollHeight;
}
function resetAssistantTimer() {
    clearTimeout(assistantInactiveTimer);
    assistantInactiveTimer = setTimeout(() => {
        if (tasks.length === 0) {
            showAssistantMessage('You seem inactive. Maybe try adding your first task?');
        } else if (tasks.filter(t => !t.completed).length > 3) {
            showAssistantMessage('Looks like you have a lot to do. Try focusing on one task at a time.');
        } else {
            showAssistantMessage("Don't forget to take a break!");
        }
    }, 60000); // 1 minute inactivity
}
document.addEventListener('mousemove', resetAssistantTimer);
document.addEventListener('keydown', resetAssistantTimer);

// Feature 15: Task-Generated Quotes
// Handled in the task completion logic
// The quotes are stored in `taskQuotes` and can be displayed in a separate UI if needed

// Feature 16: Shrink Tasks on Scroll
document.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    document.querySelectorAll('.todo-item').forEach(item => {
        if (scrollPosition > 50) {
            item.classList.add('shrunk');
        } else {
            item.classList.remove('shrunk');
        }
    });
});

// Feature 18: Sound Effects
// Sounds are implemented in addTask, drag-and-drop delete, and task completion.
// The sound assets are placeholders.

// Feature 20: Zen Timer with Breathing Animation
let zenTimerInterval;
let zenTime = 5 * 60; // 5 minutes
const breathingCircle = document.getElementById('breathing-circle');
const zenTimerDisplay = document.getElementById('zen-timer-display');
const breathingGuide = document.getElementById('breathing-guide');

zenTimerBtn.addEventListener('click', () => {
    zenTimerModal.classList.add('active');
});
document.getElementById('zen-start-btn').addEventListener('click', () => {
    document.getElementById('zen-start-btn').style.display = 'none';
    document.getElementById('zen-stop-btn').style.display = 'inline-block';
    breathingCircle.classList.add('active');
    zenTimerInterval = setInterval(() => {
        zenTime--;
        const minutes = Math.floor(zenTime / 60);
        const seconds = zenTime % 60;
        zenTimerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Update breathing guide
        const totalBreathingCycle = 8; // seconds in CSS animation
        const currentBreathingCycleTime = (zenTime * 1000) % (totalBreathingCycle * 1000);
        if (currentBreathingCycleTime < totalBreathingCycle * 1000 * 0.5) {
            breathingGuide.textContent = "Breathe In...";
        } else {
            breathingGuide.textContent = "Breathe Out...";
        }

        if (zenTime <= 0) {
            clearInterval(zenTimerInterval);
            zenTimerModal.classList.remove('active');
            showToast('Zen timer complete. Feeling refreshed?');
            zenTime = 5 * 60;
            zenTimerDisplay.textContent = '5:00';
            breathingCircle.classList.remove('active');
            document.getElementById('zen-start-btn').style.display = 'inline-block';
            document.getElementById('zen-stop-btn').style.display = 'none';
        }
    }, 1000);
});
document.getElementById('zen-stop-btn').addEventListener('click', () => {
    clearInterval(zenTimerInterval);
    zenTimerModal.classList.remove('active');
    zenTime = 5 * 60;
    zenTimerDisplay.textContent = '5:00';
    breathingCircle.classList.remove('active');
    document.getElementById('zen-start-btn').style.display = 'inline-block';
    document.getElementById('zen-stop-btn').style.display = 'none';
});

// --- General Event Listeners ---
document.querySelectorAll('.modal-overlay .close-btn').forEach(btn => {
    btn.addEventListener('click', e => e.target.closest('.modal-overlay').classList.remove('active'));
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
        }
    });
});
document.querySelectorAll('.filter-bar button').forEach(btn => {
    btn.addEventListener('click', () => {
        const newFilter = btn.id.replace('filter-', '').replace('-btn', '');
        currentFilter = newFilter;
        document.querySelectorAll('.filter-bar button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTasks();
        renderCalendar(currentCalendarDate);
    });
});
// Confetti Library - a simplified version
function ConfettiGenerator({ target }) {
    const canvas = target;
    const ctx = canvas.getContext('2d');
    let W, H;
    const particles = [];
    const colors = ["#f4c430", "#3498db", "#e74c3c", "#2ecc71"];
    const particleCount = 100;
    
    function setSize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    
    function createParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: W / 2,
                y: H / 2,
                r: Math.random() * 5 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                d: Math.random() * particleCount,
                vx: Math.random() * 4 - 2,
                vy: Math.random() * -5,
                gravity: 0.1,
                decay: 0.01
            });
        }
    }
    
    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI, false);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
    }
    
    function update() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.r -= p.decay;
            if (p.r < 0) {
                particles.splice(particles.indexOf(p), 1);
            }
        });
    }
    
    let animationFrame;
    function animate() {
        if (particles.length > 0) {
            update();
            draw();
            animationFrame = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(animationFrame);
        }
    }
    
    this.render = function() {
        setSize();
        createParticles();
        animate();
    };
    
    this.clear = function() {
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, W, H);
        particles.length = 0;
    };
}

// Initial App Setup
window.onload = () => {
    loadData();
    if (pin === null) {
        pinTitleEl.textContent = "Welcome! Set a PIN";
        pinMessageEl.textContent = "Create a 4-digit PIN to secure your app.";
        pinBtnEl.textContent = "Set PIN";
        pinLockModal.classList.add('active');
    } else {
        pinTitleEl.textContent = "Enter PIN";
        pinMessageEl.textContent = "Please enter your PIN to continue.";
        pinBtnEl.textContent = "Unlock";
        pinLockModal.classList.add('active');
    }
    renderTasks();
    renderCalendar(currentCalendarDate);
    updateStreak();
    generateDailyChallenge();
    resetAssistantTimer();
    // Set the current year in the footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
};
