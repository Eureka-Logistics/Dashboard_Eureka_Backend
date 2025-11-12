const pool = require('../config/mysql');

exports.getAllCustomers = async (req, res) => {
  try {
    if (!process.env.MYSQL_DB) {
      return res.status(500).json({ error: 'MYSQL_DB is not configured in .env' });
    }

    // Exclude password from response
    const [rows] = await pool.query(
      `SELECT id_user, name, birth_date, gender, email, phone, id_tier, status, date_created, date_updated
       FROM \`${process.env.MYSQL_DB}\`.db_user
       ORDER BY date_created DESC`
    );

    res.status(200).json({ status: 'success', data: rows });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params; // expects id_user
    if (!process.env.MYSQL_DB) {
      return res.status(500).json({ error: 'MYSQL_DB is not configured in .env' });
    }

    const [rows] = await pool.query(
      `SELECT id_user, name, birth_date, gender, email, phone, id_tier, status, date_created, date_updated
       FROM \`${process.env.MYSQL_DB}\`.db_user
       WHERE id_user = ?
       LIMIT 1`,
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ status: 'success', data: rows[0] });
  } catch (error) {
    console.error('Error fetching customer detail:', error);
    res.status(500).json({ error: 'Failed to fetch customer detail' });
  }
};