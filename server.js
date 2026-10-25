const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'cadence.json');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files directly from the project root
app.use(express.static(path.join(__dirname)));

// Helper: Read cadence data safely from JSON file
async function readCadenceData() {
  try {
    const rawData = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(rawData);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File doesn't exist yet; return empty days structure
      return {
        Monday: [], Tuesday: [], Wednesday: [], Thursday: [],
        Friday: [], Saturday: [], Sunday: []
      };
    }
    throw err;
  }
}

// Helper: Write cadence data safely to JSON file
async function writeCadenceData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// --- REST API ROUTES ---

// 1. GET /api/routines - Retrieve entire weekly cadence state
app.get('/api/routines', async (req, res) => {
  try {
    const data = await readCadenceData();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Error reading cadence data:', err);
    res.status(500).json({ success: false, error: 'Internal server error reading cadence' });
  }
});

// 2. POST /api/routines - Add a new routine task (with server-side validation)
app.post('/api/routines', async (req, res) => {
  try {
    const { day, task } = req.body;

    // Server-side input validation
    if (!day || !task || typeof task.text !== 'string' || !task.text.trim() || !task.category) {
      return res.status(400).json({
        success: false,
        error: 'Validation error: day, valid task text, and category are required'
      });
    }

    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!validDays.includes(day)) {
      return res.status(400).json({ success: false, error: 'Invalid day of week' });
    }

    const cadence = await readCadenceData();
    if (!Array.isArray(cadence[day])) {
      cadence[day] = [];
    }

    // Ensure sanitized data structure
    const sanitizedTask = {
      id: task.id || ('trax_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6)),
      text: task.text.trim(),
      category: task.category,
      completed: Boolean(task.completed),
      repeatsWeekly: task.repeatsWeekly !== undefined ? Boolean(task.repeatsWeekly) : true
    };

    cadence[day].push(sanitizedTask);
    await writeCadenceData(cadence);

    res.status(201).json({ success: true, data: sanitizedTask });
  } catch (err) {
    console.error('Error saving routine:', err);
    res.status(500).json({ success: false, error: 'Internal server error saving routine' });
  }
});

// 3. PATCH /api/routines/toggle - Toggle task completion status
app.patch('/api/routines/toggle', async (req, res) => {
  try {
    const { day, taskId } = req.body;

    if (!day || !taskId) {
      return res.status(400).json({ success: false, error: 'Day and taskId are required' });
    }

    const cadence = await readCadenceData();
    const dayTasks = cadence[day] || [];
    const targetTask = dayTasks.find(t => t.id === taskId);

    if (!targetTask) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    targetTask.completed = !targetTask.completed;
    await writeCadenceData(cadence);

    res.status(200).json({ success: true, data: targetTask });
  } catch (err) {
    console.error('Error toggling task:', err);
    res.status(500).json({ success: false, error: 'Internal server error toggling task' });
  }
});

// 4. DELETE /api/routines/:day/:id - Remove a routine
app.delete('/api/routines/:day/:id', async (req, res) => {
  try {
    const { day, id } = req.params;
    const cadence = await readCadenceData();

    if (!cadence[day]) {
      return res.status(404).json({ success: false, error: 'Day not found' });
    }

    const initialLength = cadence[day].length;
    cadence[day] = cadence[day].filter(t => t.id !== id);

    if (cadence[day].length === initialLength) {
      return res.status(404).json({ success: false, error: 'Task not found on specified day' });
    }

    await writeCadenceData(cadence);
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ success: false, error: 'Internal server error deleting task' });
  }
});

// 5. POST /api/routines/reset-rollover - Looping reset across days
app.post('/api/routines/reset-rollover', async (req, res) => {
  try {
    const cadence = await readCadenceData();
    let resetCount = 0;

    Object.keys(cadence).forEach(day => {
      if (Array.isArray(cadence[day])) {
        cadence[day].forEach(task => {
          if (task.repeatsWeekly && task.completed) {
            task.completed = false;
            resetCount++;
          }
        });
      }
    });

    if (resetCount > 0) {
      await writeCadenceData(cadence);
    }

    res.status(200).json({ success: true, message: `Rollover complete: ${resetCount} routines reset` });
  } catch (err) {
    console.error('Error executing rollover:', err);
    res.status(500).json({ success: false, error: 'Failed to execute day rollover' });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`⚡ sirTrax server active at http://localhost:${PORT}`);
});