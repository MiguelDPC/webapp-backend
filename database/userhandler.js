const { Pool, Client } = require('pg')
const bcrypt = require("bcrypt")
const pool = new Pool({
  user: 'postgres',
  whost: 'localhost',
  database: 'companydb',
  password: 'MAdapc2023',
  port: 5432,
});

(async () => {
  try {
    const {rows} = await pool.query('SELECT current_user');
    const currentUser = rows[0]['current_user']
    console.log(currentUser);
  } catch (err) {
    console.error(err)
  }
})

async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 10)
  console.log(hash);
  return hash;
}

async function comparePassword(password, hash) {
  const result = await bcrypt.compare(password, hash);
  return result
}

async function login(username, password) {
  const text = "SELECT password FROM builda WHERE username = '" + username +"'";
  
  try {
    const res = await pool.query(text)
    console.log(res.rows[0]["password"])
    const result = await comparePassword(password, res.rows[0]["password"])
    return {status: '200', message: result}
  } catch (err) {
    console.error(err)
    return {status: '500', message: "User not found"}
  }
   
}

async function CreateEmployee(username, password, email, building) {
  const hashedPassword = await hashPassword(password);
  const text = 'INSERT INTO build' + building + ' (username, password, email, building) VALUES($1, $2, $3, $4) RETURNING *'
  const values = [username, hashedPassword, email, building]

  try {
    const res = await pool.query(text, values)
    console.log(res.rows[0])
    return {status: '200', message: res.rows[0]};
   } catch (err) {
    console.error(err)
    return {status: '500', message: err};
  }
}

module.exports.CreateEmployee = CreateEmployee;
module.exports.login = login;
