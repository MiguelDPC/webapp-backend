const handler = require('./database/userhandler.js');
const dbhandler = require('./database/dbhandler');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 4000;
const session = require('express-session');
const pool = handler.grabPool();
const pgSession = require('connect-pg-simple')(session);
const https = require('https')
const fs = require('fs')


app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  sameSite: 'none'
}));

app.use(session({
  store: new pgSession({
    pool : handler.grabPool()
  }),
  secret: "cookie",
  saveUninitialized: true,
  resave: false,
  cookie: { domain: '.app.localhost', secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 }
}));

app.post("/getsessionid", async (req, res) => {
  res.json(req.session.id);
})

app.post("/deleteuser", async (req, res) => {
  const UserID = req.body.UserID;

  response = await dbhandler.deleteuser(UserID);
  res.json(response)
})

app.post("/edituser", async (req, res) => {
  const UserID = req.body.UserID;
  const field = req.body.field;
  const data =req.body.data;

  response = await dbhandler.edituser(UserID, field, data)
  res.json(response)
})
 
app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password; 

  response = await handler.login(username, password);
  
  //password correct, user exits
  if(response.message) {
    if(response.role === "undefined"){
      req.session.role = "user"
    } else {
      req.session.role = response.role;
    }
    req.session.user = req.body.username;
    req.session.auth = response.message;
    console.log(req.session.auth)
  }

  console.log("response in /login: " + response.message)
  res.json(response);  
});

app.post("/CreateUser", async (req, res) => {
  let phone = 0;
  let address = 'NULL';
  let city = 'NULL'
  let state = 'NULL';
  let zip = 0;
  let notes = 'NULL';
  let title = 'NULL';

  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  if(req.body.phone != ""){phone = req.body.phone};
  if(req.body.address != ""){address = req.body.address};
  if(req.body.city != ""){city = req.body.city};
  if(req.body.state != ""){state = req.body.state};
  if(req.body.zip != ""){zip = req.body.zip};
  if(req.body.notes != ""){notes = req.body.notes};
  if(req.body.title != ""){title = req.body.title};
  const role = req.body.role;
  const building = req.body.building;

  response = await handler.CreateEmployee(username,password,email, firstname, lastname, phone, address, city, state, zip, notes, title, role, building);

  res.json(response)
})

app.post("/searchforusers", async (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const building = req.body.building;

  response = await dbhandler.searchforusers(firstname, lastname, email, building);

  res.json(response)
})

app.post("/authenticated", async (req, res) => {
  let sessId = req.body.sessId;
  console.log(req.session) 
  if(req.session.user){
    console.log(req.session.user)
  } else {
    req.session.user = sessId;
    console.log("setting user")
  }
  res.json({status: '200', message: "good"})   
})

app.post("/createtable", async (req, res) => {
  const buildingname = req.body.building;
  response = await dbhandler.createBuilding(buildingname);
  res.json(response)
})

app.post("/endsession", async (req, res) => {
  req.session.destroy();
  res.json({status: '200'})
})

app.listen(port, () => {
  console.log('Server started');
})
