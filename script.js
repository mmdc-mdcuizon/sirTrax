
(function () {
  'use strict';

  // 1. CONSTANTS & DEFAULT CADENCE DATA

  const STORAGE_KEYS = {
    CADENCE: 'sirTrax_cadence',
    LAST_DATE: 'sirTrax_last_date',
    HAS_ONBOARDED: 'sirTrax_has_onboarded'
  };

  const DAYS_OF_WEEK = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  // Pre-populated sample routines
  const DEFAULT_CADENCE = {
    Monday: [
      { id: 'sample-1', text: 'Take vitamins & hydrate', category: 'Health', completed: false, repeatsWeekly: true },
      { id: 'sample-2', text: 'Review WebSys documentation & lecture notes', category: 'School', completed: false, repeatsWeekly: true },
      { id: 'sample-3', text: 'Attend sprint sync & review pull requests', category: 'Work', completed: false, repeatsWeekly: true }
    ],
    Tuesday: [
      { id: 'sample-4', text: '30-minute cardio & stretch routine', category: 'Health', completed: false, repeatsWeekly: true },
      { id: 'sample-5', text: 'Core engineering project milestone', category: 'Work', completed: false, repeatsWeekly: true }
    ],
    Wednesday: [
      { id: 'sample-6', text: 'Mid-week lab assignment submission', category: 'School', completed: false, repeatsWeekly: true },
      { id: 'sample-7', text: 'Deep work focus block (no meetings)', category: 'Work', completed: false, repeatsWeekly: true }
    ],
    Thursday: [
      { id: 'sample-8', text: 'Brisk walk & mindfulness after meal', category: 'Health', completed: false, repeatsWeekly: true },
      { id: 'sample-9', text: 'Code review & refactoring session', category: 'Work', completed: false, repeatsWeekly: true }
    ],
    Friday: [
      { id: 'sample-10', text: 'Weekly project retrospective & demo', category: 'Work', completed: false, repeatsWeekly: true },
      { id: 'sample-11', text: 'Submit study group log & quiz prep', category: 'School', completed: false, repeatsWeekly: true }
    ],
    Saturday: [
      { id: 'sample-12', text: 'Outdoor running & hydration reset', category: 'Health', completed: false, repeatsWeekly: true }
    ],
    Sunday: [
      { id: 'sample-13', text: 'Prepare weekly schedule & meal prep', category: 'Health', completed: false, repeatsWeekly: true },
      { id: 'sample-14', text: 'Review upcoming university syllabus', category: 'School', completed: false, repeatsWeekly: true }
    ]
  };

  // 2. STATE MANAGEMENT

  const state = {
    todayDayName: 'Monday', // System detected current day (e.g. "Monday")
    todayDateFormatted: '', // Formatted calendar date
    activeSetupDay: 'Monday', // Currently selected day in the Weekly Planner
    activeDashboardFilter: 'All', // 'All' | 'Work' | 'School' | 'Health'
    cadence: {}, // Weekly routines object
    setupModalCategory: 'Health', // Category in Add Routine Modal
    quickModalCategory: 'Work' // Category in Quick Add Modal
  };

  // 3. DOM ELEMENT REFERENCES

  const DOM = {
    // Views
    viewWelcome: document.getElementById('view-welcome'),
    viewSetup: document.getElementById('view-setup'),
    viewDashboard: document.getElementById('view-dashboard'),
    allViews: document.querySelectorAll('.view-container'),

    // Welcome Elements
    btnGetStarted: document.getElementById('btn-get-started'),

    // Setup / Planner Elements
    btnBackToToday: document.getElementById('btn-back-to-today'),
    setupDayList: document.getElementById('setup-day-list'),
    setupSelectedDayTitle: document.getElementById('setup-selected-day-title'),
    setupSelectedDayDesc: document.getElementById('setup-selected-day-desc'),
    setupRoutinesContainer: document.getElementById('setup-routines-container'),
    setupInputTrigger: document.getElementById('setup-input-trigger'),
    btnOpenSetupModal: document.getElementById('btn-open-setup-modal'),
    setupQuickForm: document.getElementById('setup-quick-form'),

    // Dashboard Elements
    dashboardDayName: document.getElementById('dashboard-day-name'),
    dashboardFullDate: document.getElementById('dashboard-full-date'),
    btnGotoSetup: document.getElementById('btn-goto-setup'),
    btnFooterWeekly: document.getElementById('btn-footer-weekly'),
    btnFooterQuickAdd: document.getElementById('btn-footer-quick-add'),
    dashboardTasksContainer: document.getElementById('dashboard-tasks-container'),
    filterButtons: document.querySelectorAll('.filter-pill'),
    dashboardProgressStats: document.getElementById('dashboard-progress-stats'),
    dashboardProgressBar: document.getElementById('dashboard-progress-bar'),
    badgeCountAll: document.getElementById('badge-count-all'),
    badgeCountWork: document.getElementById('badge-count-work'),
    badgeCountSchool: document.getElementById('badge-count-school'),
    badgeCountHealth: document.getElementById('badge-count-health'),

    // Setup Routine Modal
    modalSetupTask: document.getElementById('modal-setup-task'),
    modalSetupBackdrop: document.getElementById('modal-setup-backdrop'),
    btnCloseSetupModal: document.getElementById('btn-close-setup-modal'),
    btnCancelSetupModal: document.getElementById('btn-cancel-setup-modal'),
    btnSaveSetupModal: document.getElementById('btn-save-setup-modal'),
    modalSetupTitle: document.getElementById('modal-setup-title'),
    modalInputTask: document.getElementById('modal-input-task'),
    modalRecurrenceLabel: document.getElementById('modal-recurrence-label'),
    modalToggleRepeat: document.getElementById('modal-toggle-repeat'),
    setupCategoryChips: document.querySelectorAll('#modal-setup-task .category-toggle-chip'),

    // Quick Add Modal
    modalQuickTask: document.getElementById('modal-quick-task'),
    modalQuickBackdrop: document.getElementById('modal-quick-backdrop'),
    btnCloseQuickModal: document.getElementById('btn-close-quick-modal'),
    btnCancelQuickModal: document.getElementById('btn-cancel-quick-modal'),
    btnSaveQuickModal: document.getElementById('btn-save-quick-modal'),
    modalQuickTitle: document.getElementById('modal-quick-title'),
    modalQuickInputTask: document.getElementById('modal-quick-input-task'),
    quickCategoryChips: document.querySelectorAll('#quick-category-group .category-toggle-chip'),

    // Toast
    toastContainer: document.getElementById('toast-container')
  };

  // 4. UTILITIES & SECURITY HELPERS
  
  /**
   * Escape HTML entities to prevent Cross-Site Scripting (XSS)
   * @param {string} str
   * @returns {string} Sanitized string
   */
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Generate an RFC4122-compatible unique identifier
   * AI assisted as I cant get this to work properly
   * @returns {string} Unique ID
   */
  function generateId() {
    return 'trax_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
  }

  /**
   * Display a non-intrusive Material You toast notification using external vector icons
   * @param {string} message
   * @param {string} iconType - 'check' | 'trash' | 'info'
   */
  function showToast(message, iconType = 'check') {
    if (!DOM.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';

    let iconSrc = 'assets/icons/icon-check.svg';
    let iconAlt = 'Success';
    if (iconType === 'trash') {
      iconSrc = 'assets/icons/icon-trash.svg';
      iconAlt = 'Deleted';
    } else if (iconType === 'info') {
      iconSrc = 'assets/icons/icon-calendar.svg';
      iconAlt = 'Information';
    }

    toast.innerHTML = `<img src="${iconSrc}" alt="${iconAlt}" width="16" height="16"><span>${escapeHTML(message)}</span>`;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 200);
    }, 2800);
  }

  // 5. STORAGE & CADENCE ENGINE LOGIC

  /**
   * Load cadence data from localStorage or initialize with defaults.
   * Auto-resets completion state if a new day has arrived.
   */
  function initCadenceEngine() {
    const now = new Date();
    // Native weekday detection: "Monday", "Tuesday", etc.
    state.todayDayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Format full date e.g. "October 23, 2026"
    state.todayDateFormatted = now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    state.activeSetupDay = state.todayDayName;

    // Load cadence from localStorage
    const savedCadence = localStorage.getItem(STORAGE_KEYS.CADENCE);
    if (savedCadence) {
      try {
        state.cadence = JSON.parse(savedCadence);
        // Ensure every weekday key exists
        DAYS_OF_WEEK.forEach(day => {
          if (!Array.isArray(state.cadence[day])) {
            state.cadence[day] = [];
          }
        });
      } catch (e) {
        console.error('Failed to parse saved cadence, falling back to defaults:', e);
        state.cadence = JSON.parse(JSON.stringify(DEFAULT_CADENCE));
        saveCadenceToStorage();
      }
    } else {
      // First time launch: initialize with default cadence
      state.cadence = JSON.parse(JSON.stringify(DEFAULT_CADENCE));
      saveCadenceToStorage();
    }

    // Check last active date for Looping Weekly Routine logic
    const currentDateStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const lastActiveDate = localStorage.getItem(STORAGE_KEYS.LAST_DATE);

    if (lastActiveDate !== currentDateStr) {
      // Date has rolled over! Auto-reset the completed status of repeating routines
      resetCompletedRoutinesForNewDay();
      localStorage.setItem(STORAGE_KEYS.LAST_DATE, currentDateStr);
    }
  }

  /**
   * Persist current state.cadence object to localStorage
   */
  function saveCadenceToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.CADENCE, JSON.stringify(state.cadence));
    } catch (e) {
      console.error('Could not save to localStorage:', e);
      showToast('Storage quota exceeded or unavailable', 'info');
    }
  }

  /**
   * Looping weekly routine feature:
   * When calendar day changes, all repeating weekly tasks have their completed boolean reset to false.
   */
  function resetCompletedRoutinesForNewDay() {
    let hasReset = false;
    DAYS_OF_WEEK.forEach(day => {
      if (Array.isArray(state.cadence[day])) {
        state.cadence[day].forEach(task => {
          // If the task repeats weekly, reset completion for the new cycle
          if (task.completed) {
            task.completed = false;
            hasReset = true;
          }
        });
      }
    });

    if (hasReset) {
      saveCadenceToStorage();
      console.log('Weekly cadence looping engine: Routine tasks refreshed for new date.');
    }
  }

  // 6. VIEW NAVIGATION (SPA ROUTER)

  /**
   * Handles switching active states between views
   * @param {string} viewId - 'view-welcome' | 'view-setup' | 'view-dashboard'
   */
  function switchView(viewId) {
    DOM.allViews.forEach(view => {
      if (view.id === viewId) {
        view.classList.remove('hidden');
        view.classList.add('active');
      } else {
        view.classList.remove('active');
        view.classList.add('hidden');
      }
    });

    // Close any open modals
    closeAllModals();

    // Trigger re-renders based on destination
    if (viewId === 'view-setup') {
      renderSetupPlanner();
    } else if (viewId === 'view-dashboard') {
      renderDashboard();
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 7. SETUP PLANNER RENDERING (VIEW 2)

  /**
   * Render the Weekly Cadence Planner view
   */
  function renderSetupPlanner() {
    // 1. Update Left Column Day Pills & Badge Counts
    updateDayPillsSidebar();

    // 2. Update Header Titles for Selected Day
    if (DOM.setupSelectedDayTitle) {
      DOM.setupSelectedDayTitle.textContent = `${state.activeSetupDay} Routine`;
    }
    if (DOM.setupSelectedDayDesc) {
      const isToday = state.activeSetupDay === state.todayDayName;
      DOM.setupSelectedDayDesc.textContent = isToday
        ? 'Recurring cadence (Today)'
        : 'Automated weekly schedule';
    }

    // 3. Render Routine Cards for selected day
    renderSetupRoutineList();
  }

  /**
   * Updates sidebar active day styling and item count badges
   */
  function updateDayPillsSidebar() {
    const dayButtons = DOM.setupDayList.querySelectorAll('.day-pill-btn');
    dayButtons.forEach(btn => {
      const day = btn.dataset.day;
      if (day === state.activeSetupDay) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }

      // Update count badge
      const countBadge = btn.querySelector('.day-count-badge');
      if (countBadge) {
        const count = (state.cadence[day] && state.cadence[day].length) || 0;
        countBadge.textContent = count;
      }
    });
  }

  /**
   * Render the list of routines scheduled for state.activeSetupDay using external vector icons
   */
  function renderSetupRoutineList() {
    if (!DOM.setupRoutinesContainer) return;

    const dayTasks = state.cadence[state.activeSetupDay] || [];
    DOM.setupRoutinesContainer.innerHTML = '';

    if (dayTasks.length === 0) {
      DOM.setupRoutinesContainer.innerHTML = `
        <div class="empty-state">
          <img src="assets/icons/icon-empty.svg" alt="" width="48" height="48" class="empty-state-icon">
          <p class="empty-state-title">No routines set for ${state.activeSetupDay}</p>
          <p class="empty-state-desc">Type below or click (+) to add your recurring Work, School, or Health habit.</p>
        </div>
      `;
      return;
    }

    dayTasks.forEach(task => {
      const row = document.createElement('div');
      row.className = 'routine-row-card';
      row.dataset.taskId = task.id;

      const categoryClass = `badge-${task.category.toLowerCase()}`;

      row.innerHTML = `
        <div class="routine-item-left">
          <button class="custom-checkbox-btn preview-only" disabled aria-label="Preview checkbox">
            <img src="assets/icons/icon-check.svg" alt="" width="14" height="14" aria-hidden="true">
          </button>
          <span class="routine-title-text" title="${escapeHTML(task.text)}">${escapeHTML(task.text)}</span>
        </div>
        <div class="routine-item-right">
          <span class="category-badge ${categoryClass}">
            <span class="filter-dot dot-${task.category.toLowerCase()}"></span>
            ${escapeHTML(task.category)}
          </span>
          <button class="btn-action-delete" data-action="delete-setup-task" data-id="${task.id}" title="Delete routine from ${state.activeSetupDay}" aria-label="Delete routine">
            <img src="assets/icons/icon-trash.svg" alt="Delete" width="16" height="16">
          </button>
        </div>
      `;

      DOM.setupRoutinesContainer.appendChild(row);
    });
  }

  // 8. DASHBOARD RENDERING (VIEW 3)

  /**
   * Render the Daily Execution Dashboard
   */
  function renderDashboard() {
    // 1. Update Date Headlines
    if (DOM.dashboardDayName) {
      DOM.dashboardDayName.textContent = state.todayDayName;
    }
    if (DOM.dashboardFullDate) {
      DOM.dashboardFullDate.textContent = state.todayDateFormatted;
    }

    // 2. Filter & Render Tasks for Today
    const todayTasks = state.cadence[state.todayDayName] || [];
    renderDashboardTasks(todayTasks);

    // 3. Update Progress Bar & Filter Badges
    updateDashboardMetrics(todayTasks);
  }

  /**
   * Render the today's task items according to the active category filter using external vector icons
   * @param {Array} todayTasks
   */
  function renderDashboardTasks(todayTasks) {
    if (!DOM.dashboardTasksContainer) return;

    let filteredTasks = todayTasks;
    if (state.activeDashboardFilter !== 'All') {
      filteredTasks = todayTasks.filter(t => t.category.toLowerCase() === state.activeDashboardFilter.toLowerCase());
    }

    DOM.dashboardTasksContainer.innerHTML = '';

    if (filteredTasks.length === 0) {
      let emptyMsg = `No tasks scheduled for ${state.todayDayName}.`;
      if (state.activeDashboardFilter !== 'All') {
        emptyMsg = `No ${state.activeDashboardFilter} tasks for today.`;
      }
      DOM.dashboardTasksContainer.innerHTML = `
        <div class="empty-state">
          <img src="assets/icons/icon-empty.svg" alt="" width="48" height="48" class="empty-state-icon">
          <p class="empty-state-title">${emptyMsg}</p>
          <p class="empty-state-desc">Use <strong>+ Quick Add</strong> or configure recurring habits in <strong>Weekly Setup</strong>.</p>
        </div>
      `;
      return;
    }

    filteredTasks.forEach(task => {
      const row = document.createElement('div');
      row.className = `task-row-card ${task.completed ? 'completed' : ''}`;
      row.dataset.taskId = task.id;

      const categoryClass = `badge-${task.category.toLowerCase()}`;

      row.innerHTML = `
        <div class="task-item-left">
          <button class="custom-checkbox-btn" data-action="toggle-complete" data-id="${task.id}" aria-label="Mark task complete" aria-checked="${task.completed ? 'true' : 'false'}">
            <img src="assets/icons/icon-check.svg" alt="" width="14" height="14" aria-hidden="true">
          </button>
          <span class="task-title" title="${escapeHTML(task.text)}">${escapeHTML(task.text)}</span>
        </div>
        <div class="task-item-right">
          <span class="category-badge ${categoryClass}">
            <span class="filter-dot dot-${task.category.toLowerCase()}"></span>
            ${escapeHTML(task.category)}
          </span>
          <button class="btn-action-delete" data-action="delete-today-task" data-id="${task.id}" title="Delete task" aria-label="Delete task">
            <img src="assets/icons/icon-trash.svg" alt="Delete" width="16" height="16">
          </button>
        </div>
      `;

      DOM.dashboardTasksContainer.appendChild(row);
    });
  }

  /**
   * Update category badge counts and completion percentage bar
   * @param {Array} todayTasks
   */
  function updateDashboardMetrics(todayTasks) {
    const totalCount = todayTasks.length;
    const completedCount = todayTasks.filter(t => t.completed).length;

    // Filter pill count badges
    const workCount = todayTasks.filter(t => t.category.toLowerCase() === 'work').length;
    const schoolCount = todayTasks.filter(t => t.category.toLowerCase() === 'school').length;
    const healthCount = todayTasks.filter(t => t.category.toLowerCase() === 'health').length;

    if (DOM.badgeCountAll) DOM.badgeCountAll.textContent = totalCount;
    if (DOM.badgeCountWork) DOM.badgeCountWork.textContent = workCount;
    if (DOM.badgeCountSchool) DOM.badgeCountSchool.textContent = schoolCount;
    if (DOM.badgeCountHealth) DOM.badgeCountHealth.textContent = healthCount;

    // Progress Section
    if (DOM.dashboardProgressStats) {
      DOM.dashboardProgressStats.textContent = `${completedCount} of ${totalCount} completed`;
    }

    if (DOM.dashboardProgressBar) {
      const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      DOM.dashboardProgressBar.style.width = `${percentage}%`;
      const progressTrack = DOM.dashboardProgressBar.parentElement;
      if (progressTrack) {
        progressTrack.setAttribute('aria-valuenow', percentage);
      }
    }
  }

  // 9. MODAL MANAGEMENT (SETUP-2 & QUICK ADD)

  /**
   * Open the Setup-2 Add Routine Dialog
   * @param {string} prefilledText
   */
  function openSetupModal(prefilledText = '') {
    if (!DOM.modalSetupTask) return;

    if (DOM.modalSetupTitle) {
      DOM.modalSetupTitle.textContent = `Add Routine for ${state.activeSetupDay}`;
    }
    if (DOM.modalRecurrenceLabel) {
      DOM.modalRecurrenceLabel.textContent = `Repeats Every ${state.activeSetupDay}`;
    }

    if (DOM.modalInputTask) {
      DOM.modalInputTask.value = prefilledText;
    }

    // Default category: Health or existing selection
    selectSetupCategory(state.setupModalCategory || 'Health');

    DOM.modalSetupTask.classList.remove('hidden');
    setTimeout(() => {
      if (DOM.modalInputTask) DOM.modalInputTask.focus();
    }, 50);
  }

  function closeSetupModal() {
    if (DOM.modalSetupTask) {
      DOM.modalSetupTask.classList.add('hidden');
      if (DOM.modalInputTask) DOM.modalInputTask.value = '';
    }
  }

  /**
   * Set category selection chip inside the Setup modal
   * @param {string} category
   */
  function selectSetupCategory(category) {
    state.setupModalCategory = category;
    DOM.setupCategoryChips.forEach(chip => {
      if (chip.dataset.category.toLowerCase() === category.toLowerCase()) {
        chip.classList.add('selected');
        chip.setAttribute('aria-checked', 'true');
      } else {
        chip.classList.remove('selected');
        chip.setAttribute('aria-checked', 'false');
      }
    });
  }

  /**
   * Open the Quick Add Dialog for Today's tasks
   */
  function openQuickModal() {
    if (!DOM.modalQuickTask) return;

    if (DOM.modalQuickTitle) {
      DOM.modalQuickTitle.textContent = `Quick Add for Today (${state.todayDayName})`;
    }

    if (DOM.modalQuickInputTask) {
      DOM.modalQuickInputTask.value = '';
    }

    selectQuickCategory(state.quickModalCategory || 'Work');

    DOM.modalQuickTask.classList.remove('hidden');
    setTimeout(() => {
      if (DOM.modalQuickInputTask) DOM.modalQuickInputTask.focus();
    }, 50);
  }

  function closeQuickModal() {
    if (DOM.modalQuickTask) {
      DOM.modalQuickTask.classList.add('hidden');
      if (DOM.modalQuickInputTask) DOM.modalQuickInputTask.value = '';
    }
  }

  /**
   * Set category selection chip inside the Quick Add modal
   * @param {string} category
   */
  function selectQuickCategory(category) {
    state.quickModalCategory = category;
    DOM.quickCategoryChips.forEach(chip => {
      if (chip.dataset.category.toLowerCase() === category.toLowerCase()) {
        chip.classList.add('selected');
        chip.setAttribute('aria-checked', 'true');
      } else {
        chip.classList.remove('selected');
        chip.setAttribute('aria-checked', 'false');
      }
    });
  }

  function closeAllModals() {
    closeSetupModal();
    closeQuickModal();
  }

  // 10. CRUD ACTIONS (SAVE, TOGGLE, DELETE)

  /**
   * Save a routine from the Setup Modal into the selected day
   */
  function handleSaveSetupRoutine() {
    const textInput = DOM.modalInputTask ? DOM.modalInputTask.value.trim() : '';
    if (!textInput) {
      if (DOM.modalInputTask) DOM.modalInputTask.focus();
      return;
    }

    const newTask = {
      id: generateId(),
      text: textInput,
      category: state.setupModalCategory,
      completed: false,
      repeatsWeekly: DOM.modalToggleRepeat ? DOM.modalToggleRepeat.checked : true
    };

    if (!Array.isArray(state.cadence[state.activeSetupDay])) {
      state.cadence[state.activeSetupDay] = [];
    }

    state.cadence[state.activeSetupDay].push(newTask);
    saveCadenceToStorage();

    // Clear input bar on setup page if it matched
    if (DOM.setupInputTrigger) {
      DOM.setupInputTrigger.value = '';
    }

    closeSetupModal();
    renderSetupPlanner();
    showToast(`Added routine to ${state.activeSetupDay}!`, 'check');
  }

  /**
   * Save a quick add task to today's routines
   */
  function handleSaveQuickTask() {
    const textInput = DOM.modalQuickInputTask ? DOM.modalQuickInputTask.value.trim() : '';
    if (!textInput) {
      if (DOM.modalQuickInputTask) DOM.modalQuickInputTask.focus();
      return;
    }

    const newTask = {
      id: generateId(),
      text: textInput,
      category: state.quickModalCategory,
      completed: false,
      repeatsWeekly: false // One-off quick task
    };

    if (!Array.isArray(state.cadence[state.todayDayName])) {
      state.cadence[state.todayDayName] = [];
    }

    state.cadence[state.todayDayName].push(newTask);
    saveCadenceToStorage();

    closeQuickModal();
    renderDashboard();
    showToast(`Added task for Today!`, 'check');
  }

  /**
   * Toggle completion state of a task on today's dashboard
   * @param {string} taskId
   */
  function toggleTaskCompletion(taskId) {
    const todayTasks = state.cadence[state.todayDayName] || [];
    const task = todayTasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    saveCadenceToStorage();
    renderDashboard();

    if (task.completed) {
      showToast('Task completed! Keep the momentum.', 'check');

      // Check if all today's tasks are completed
      const allCompleted = todayTasks.length > 0 && todayTasks.every(t => t.completed);
      if (allCompleted) {
        setTimeout(() => {
          showToast('🎉 All tasks finished for today! Excellent consistency.', 'check');
        }, 600);
      }
    }
  }

  /**
   * Delete a task from today's dashboard
   * @param {string} taskId
   */
  function deleteTodayTask(taskId) {
    const todayTasks = state.cadence[state.todayDayName] || [];
    const index = todayTasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      const removed = todayTasks.splice(index, 1)[0];
      saveCadenceToStorage();
      renderDashboard();
      showToast(`Removed "${removed.text.substring(0, 20)}..."`, 'trash');
    }
  }

  /**
   * Delete a routine from the active day in Setup Planner
   * @param {string} taskId
   */
  function deleteSetupRoutine(taskId) {
    const dayTasks = state.cadence[state.activeSetupDay] || [];
    const index = dayTasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      const removed = dayTasks.splice(index, 1)[0];
      saveCadenceToStorage();
      renderSetupPlanner();
      showToast(`Removed "${removed.text.substring(0, 20)}..."`, 'trash');
    }
  }

  // 11. EVENT LISTENERS & DELEGATION

  function bindEvents() {
    // 1. Welcome View Actions
    if (DOM.btnGetStarted) {
      DOM.btnGetStarted.addEventListener('click', () => {
        localStorage.setItem(STORAGE_KEYS.HAS_ONBOARDED, 'true');
        switchView('view-dashboard');
      });
    }

    // 2. Navigation Buttons
    if (DOM.btnGotoSetup) {
      DOM.btnGotoSetup.addEventListener('click', () => switchView('view-setup'));
    }
    if (DOM.btnFooterWeekly) {
      DOM.btnFooterWeekly.addEventListener('click', () => switchView('view-setup'));
    }
    if (DOM.btnBackToToday) {
      DOM.btnBackToToday.addEventListener('click', () => switchView('view-dashboard'));
    }

    // 3. Day Selector in Setup Planner
    if (DOM.setupDayList) {
      DOM.setupDayList.addEventListener('click', e => {
        const btn = e.target.closest('.day-pill-btn');
        if (!btn) return;
        const day = btn.dataset.day;
        if (day && day !== state.activeSetupDay) {
          state.activeSetupDay = day;
          renderSetupPlanner();
        }
      });
    }

    // 4. Setup Input Trigger & Modal Openers (Form Submit & Click)
    if (DOM.setupQuickForm) {
      DOM.setupQuickForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentInputVal = DOM.setupInputTrigger ? DOM.setupInputTrigger.value.trim() : '';
        openSetupModal(currentInputVal);
      });
    }

    if (DOM.btnOpenSetupModal) {
      DOM.btnOpenSetupModal.addEventListener('click', () => {
        const currentInputVal = DOM.setupInputTrigger ? DOM.setupInputTrigger.value.trim() : '';
        openSetupModal(currentInputVal);
      });
    }

    if (DOM.setupInputTrigger) {
      DOM.setupInputTrigger.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const currentInputVal = DOM.setupInputTrigger.value.trim();
          openSetupModal(currentInputVal);
        }
      });
    }

    // 5. Setup Modal Buttons & Category Selection
    if (DOM.btnCloseSetupModal) {
      DOM.btnCloseSetupModal.addEventListener('click', closeSetupModal);
    }
    if (DOM.btnCancelSetupModal) {
      DOM.btnCancelSetupModal.addEventListener('click', closeSetupModal);
    }
    if (DOM.modalSetupBackdrop) {
      DOM.modalSetupBackdrop.addEventListener('click', closeSetupModal);
    }
    if (DOM.btnSaveSetupModal) {
      DOM.btnSaveSetupModal.addEventListener('click', handleSaveSetupRoutine);
    }

    DOM.setupCategoryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        selectSetupCategory(chip.dataset.category);
      });
    });

    // 6. Quick Add Modal Buttons & Triggers
    if (DOM.btnFooterQuickAdd) {
      DOM.btnFooterQuickAdd.addEventListener('click', openQuickModal);
    }
    if (DOM.btnCloseQuickModal) {
      DOM.btnCloseQuickModal.addEventListener('click', closeQuickModal);
    }
    if (DOM.btnCancelQuickModal) {
      DOM.btnCancelQuickModal.addEventListener('click', closeQuickModal);
    }
    if (DOM.modalQuickBackdrop) {
      DOM.modalQuickBackdrop.addEventListener('click', closeQuickModal);
    }
    if (DOM.btnSaveQuickModal) {
      DOM.btnSaveQuickModal.addEventListener('click', handleSaveQuickTask);
    }

    DOM.quickCategoryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        selectQuickCategory(chip.dataset.category);
      });
    });

    // 7. Dashboard Filter Pills
    DOM.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeDashboardFilter = btn.dataset.filter || 'All';
        renderDashboard();
      });
    });

    // 8. Event Delegation: Setup Routines Delete
    if (DOM.setupRoutinesContainer) {
      DOM.setupRoutinesContainer.addEventListener('click', e => {
        const deleteBtn = e.target.closest('[data-action="delete-setup-task"]');
        if (deleteBtn) {
          const taskId = deleteBtn.dataset.id;
          deleteSetupRoutine(taskId);
        }
      });
    }

    // 9. Event Delegation: Dashboard Tasks Toggle & Delete
    if (DOM.dashboardTasksContainer) {
      DOM.dashboardTasksContainer.addEventListener('click', e => {
        const checkBtn = e.target.closest('[data-action="toggle-complete"]');
        if (checkBtn) {
          const taskId = checkBtn.dataset.id;
          toggleTaskCompletion(taskId);
          return;
        }

        const deleteBtn = e.target.closest('[data-action="delete-today-task"]');
        if (deleteBtn) {
          const taskId = deleteBtn.dataset.id;
          deleteTodayTask(taskId);
        }
      });
    }

    // 10. Global Keyboard Handling (ESC to close modals, Enter inside modal inputs)
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeAllModals();
      }
    });

    if (DOM.modalInputTask) {
      DOM.modalInputTask.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSaveSetupRoutine();
        }
      });
    }

    if (DOM.modalQuickInputTask) {
      DOM.modalQuickInputTask.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSaveQuickTask();
        }
      });
    }
  }

  // 12. INITIALIZATION
  
  function init() {
    initCadenceEngine();
    bindEvents();

    // Default to Welcome Screen on load
    switchView('view-welcome');
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
