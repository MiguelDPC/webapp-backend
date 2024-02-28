const { Pool, Client } = require('pg')
const session = require('express-session')

const pool = new Pool({
  user: 'postgres',
  whost: 'localhost',
  database: 'companydb',
  password: 'MAdapc2023',
  port: 5432,
});

async function createBuilding(building) {
  console.log("IN CREATE")
  const text = "CREATE TABLE accounts(id SERIAL PRIMARY KEY, username VARCHAR UNIQUE NOT NULL, password VARCHAR NOT NULL, email VARCHAR NOT NULL, firstname VARCHAR NOT NULL, lastname VARCHAR NOT NULL, phone BIGINT UNIQUE, address VARCHAR, city VARCHAR, state VARCHAR, zip INTEGER, notes VARCHAR, title VARCHAR, role VARCHAR NOT NULL, building VARCHAR NOT NULL)";
  res = await pool.query(text)

  try {
    const res = await pool.query(text)
    return {status: '200', message: res.rows[0]};
  } catch (err) {
    console.error(err)
    return {status: '500', message: err};
  }
}

async function searchforusers(firstname, lastname, email, building) {
  console.log("IN SEARCH")
  if(firstname != ""){
    const text = "SELECT * FROM accounts WHERE firstname = '" + firstname + "'";
    try{
      const res = await pool.query(text)
      if (res.rows.length == 0) {return {status: '500', message: "No Users Found"}}
      return {status: '200', message: res.rows}
    } catch (err){
      console.log(err)
    }
  } else if(lastname != ""){
    const text = "SELECT * FROM accounts WHERE lastname = '" + lastname + "'";
    try {
      const res = await pool.query(text)
      if (res.rows.length == 0) {return {status: '500', message: "No Users Found"}}
      return {status: '200', message: res.rows}
    } catch (err){
      console.log(err)
    }
  } else if(email != ""){
    const text = "SELECT * FROM accounts WHERE email= '" + email + "'";
    try{
      const res = await pool.query(text)
      if (res.rows.length == 0) {return {status: '500', message: "No Users Found"}}
      return {status: '200', message: res.rows}
    } catch (err){
      console.log(err)
    }
  } else if(building != ""){
    const text = "SELECT * FROM accounts WHERE building= '" + building + "'";
    try{
      const res = await pool.query(text)
      if (res.rows.length == 0) {return {status: '500', message: "No Users Found"}}
      console.log(res.rows)
      return {status: '200', message: res.rows}
    } catch (err){
      console.log(err)
    }
  } else {
    return {status: '500', message: "No Users Found"}
  }
}

async function deleteuser(UserID) {
  console.log("In Delete")
  const text = "DELETE FROM accounts WHERE id = '" + UserID + "'";
  try{
    const res = await pool.query(text)
    return {status: '200', message: "Action Completed"}
  } catch (err){
    console.log(err)
    return {status: '500', message: "User Not Found"}
  }
}

async function edituser(UserID, field, data) {
  console.log("In edit")
  const text = "UPDATE accounts SET " + field + " = '" + data + "' WHERE id = '" + UserID + "'"

  try{
    const res = await pool.query(text)
    return {status: '200', message: "Action Completed"}
  } catch (err){
    console.log(err)
    return {status: '500', message: "User Not Found"}
  }
}

module.exports.edituser = edituser;
module.exports.deleteuser = deleteuser;
module.exports.searchforusers = searchforusers;
module.exports.createBuilding = createBuilding;
