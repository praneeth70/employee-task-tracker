const db = require('../config/db');

// 1. Get All Employees
exports.getAllEmployees = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT id, name, email, phone, department, job_title as "jobTitle" 
      FROM employees 
      ORDER BY name ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Create Employee
exports.createEmployee = async (req, res) => {
  const { name, email, phone, department, jobTitle } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO employees (name, email, phone, department, job_title) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, phone, department, jobTitle]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};