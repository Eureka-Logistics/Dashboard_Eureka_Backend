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
      `SELECT 
         u.id_user, u.name, u.birth_date, u.gender, u.email, u.phone, u.id_tier, u.status, u.date_created, u.date_updated,
         t.name AS tier_name,
         t.desription AS tier_description,
         t.min_point AS tier_min_point,
         t.max_point AS tier_max_point,
         t.benefit AS tier_benefit
       FROM \`${process.env.MYSQL_DB}\`.db_user u
       LEFT JOIN \`${process.env.MYSQL_DB}\`.db_tier t ON u.id_tier = t.id_tier
       WHERE u.id_user = ?
       LIMIT 1`,
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Shape response to include tier name explicitly
    const row = rows[0];
    const data = {
      id_user: row.id_user,
      name: row.name,
      birth_date: row.birth_date,
      gender: row.gender,
      email: row.email,
      phone: row.phone,
      status: row.status,
      date_created: row.date_created,
      date_updated: row.date_updated,
      // bungkus detail tier sebagai objek agar mudah konsumsi frontend
      tier: {
        id_tier: row.id_tier ?? null,
        name: row.tier_name ?? null,
        description: row.tier_description ?? null,
        min_point: row.tier_min_point ?? null,
        max_point: row.tier_max_point ?? null,
        benefit: row.tier_benefit ?? null,
      }
    };

    res.status(200).json({ status: 'success', data });
  } catch (error) {
    console.error('Error fetching customer detail:', error);
    res.status(500).json({ error: 'Failed to fetch customer detail' });
  }
};