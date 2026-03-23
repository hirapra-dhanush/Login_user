const { pool } = require("../config/db");

// CREATE USER
exports.createUser = async (data) => {
  const { name, email, password, role } = data;

  const [result] = await pool.query(
    "CALL create_user(?, ?, ?, ?)",
    [name, email, password, role]
  );

  return result;
};

// GET ALL USERS
exports.getAllUsers = async () => {
  const [result] = await pool.query("CALL get_all_users()");
  return result[0]; // important
};

// GET USER BY ID
exports.getUserById = async (id) => {
  const [result] = await pool.query("CALL get_user_by_id(?)", [id]);
  return result[0][0]; // single user
};

// UPDATE USER
exports.updateUser = async (id, data) => {
  const { role, status } = data;

  const [result] = await pool.query(
    "CALL update_user(?, ?, ?)",
    [id, role, status]
  );

  return result;
};

// DELETE USER
exports.deleteUser = async (id) => {
  const [result] = await pool.query("CALL delete_user(?)", [id]);
  return result;
};