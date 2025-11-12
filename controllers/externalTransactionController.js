const pool = require('../config/mysql');

exports.getAllTransactions = async (req, res) => {
  try {
    if (!process.env.MYSQL_DB) {
      return res.status(500).json({ error: 'MYSQL_DB is not configured in .env' });
    }

    const [rows] = await pool.query(
      `SELECT id_order, transaction_code, id_user, id_business_unit, type, point, last_point, old_point, no_reference, meta, status, expired_date, date_created, date_updated
       FROM \`${process.env.MYSQL_DB}\`.db_point_transaction
       ORDER BY date_created DESC`
    );

    res.status(200).json({ status: 'success', data: rows });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params; // expects id_order
    if (!process.env.MYSQL_DB) {
      return res.status(500).json({ error: 'MYSQL_DB is not configured in .env' });
    }

    const [rows] = await pool.query(
      `SELECT id_order, transaction_code, id_user, id_business_unit, type, point, last_point, old_point, no_reference, meta, status, expired_date, date_created, date_updated
       FROM \`${process.env.MYSQL_DB}\`.db_point_transaction
       WHERE id_order = ?
       LIMIT 1`,
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ status: 'success', data: rows[0] });
  } catch (error) {
    console.error('Error fetching transaction detail:', error);
    res.status(500).json({ error: 'Failed to fetch transaction detail' });
  }
};