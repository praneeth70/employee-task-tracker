const db = require('../config/db');

// 1. Get All Tasks (With Filters)
exports.getTasks = async (req, res) => {
  try {
    const { status, employeeId } = req.query;
    
    // Base Query: Join with Employees to get the Assignee Name
    let query = `
      SELECT t.id, t.title, t.description, t.status, t.priority, 
             t.due_date as "dueDate", t.employee_id as "employeeId",
             e.name as "assigneeName"
      FROM tasks t
      LEFT JOIN employees e ON t.employee_id = e.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;

    // Dynamic Filters
    if (status) {
      query += ` AND t.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    if (employeeId) {
      query += ` AND t.employee_id = $${paramIndex}`;
      params.push(employeeId);
      paramIndex++;
    }

    query += ` ORDER BY t.due_date ASC`;

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Create Task
exports.createTask = async (req, res) => {
  const { title, description, status, priority, dueDate, employeeId } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO tasks (title, description, status, priority, due_date, employee_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, status || 'TODO', priority || 'MEDIUM', dueDate, employeeId || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Update Task Status
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // We only update status for the drag-and-drop feel
  try {
    await db.query('UPDATE tasks SET status = $1 WHERE id = $2', [status, id]);
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Delete Task
exports.deleteTask = async (req, res) => {
  try {
    await db.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Dashboard Stats (The "A" Grade Feature)
exports.getStats = async (req, res) => {
  try {
    const total = await db.query('SELECT COUNT(*) FROM tasks');
    const completed = await db.query("SELECT COUNT(*) FROM tasks WHERE status = 'COMPLETED'");
    const pending = await db.query("SELECT COUNT(*) FROM tasks WHERE status != 'COMPLETED'");

    res.json({
      totalTasks: parseInt(total.rows[0].count),
      completedTasks: parseInt(completed.rows[0].count),
      pendingTasks: parseInt(pending.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};