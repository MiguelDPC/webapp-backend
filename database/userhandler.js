const { Pool, Client } = require('pg')
const session = require('express-session')
const bcrypt = require("bcrypt")

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'companydb',
  password: 'MAdapc2023',
  port: 5432,
});

(async () => {
  try {
    const {rows} = await pool.query('SELECT current_user');
    const currentUser = rows[0]['current_user']
  } catch (err) {
    console.error(err)
  }
})

function grabPool(){return pool}

async function hashPassword(password) {
  console.log(password)
  const hash = await bcrypt.hash(password, 10)
  return hash;
}

async function comparePassword(password, hash) {
  const result = await bcrypt.compare(password, hash);
  return result
}

async function sessionCallback(sessionID) {
  const text = "SELECT sess FROM session WHERE sid = '" + sessionID + "'";

  try {
    const res = await pool.query(text)
    return {status: '200', message: res.rows[0]["sess"]};
  } catch (err) {
    console.log(err);
    return {status: '500', message: "session does not exist"};
  }
}

async function login(username, password) {
  const text = "SELECT password FROM accounts WHERE username = '" + username +"'";
  
  try {
    const res = await pool.query(text)
    const result = await comparePassword(password, res.rows[0]["password"])
    if(result){
      let text = "SELECT role FROM accounts WHERE username = '" + username + "'"
      let res = await pool.query(text)
      console.log("Role in login: " + res.rows[0]["role"])
      return {status: '200', message: result, role: res.rows[0]["role"]};
     } else {
      return {status: '200', message: result}
     }
  } catch (err) {
    console.error(err)
    return {status: '500', message: err, role: "user"}
  }
   
}

async function CreateEmployee(username, password, email, firstname, lastname, phone, address, city, state, zip, notes, title, role, building) {
  const hashedPassword = await hashPassword(password);
  const text = 'INSERT INTO accounts(username, password, email, firstname, lastname, phone, address, city, state, zip, notes, title, role, building) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *'
  const values = [username, hashedPassword, email, firstname, lastname, phone, address, city, state, zip, notes, title, role, building]

  try {
    const res = await pool.query(text, values) 
    return {status: '200', message: res.rows[0]};
  } catch (err) {
    console.error(err)
    return {status: '500', message: err};
  }
}

module.exports.CreateEmployee = CreateEmployee;
module.exports.login = login;
module.exports.grabPool = grabPool;
module.exports.sessionCallback = sessionCallback;
