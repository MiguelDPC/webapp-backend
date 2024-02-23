const handler = require('./database/userhandler.js');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 4000

app.use(bodyParser.json());
app.use(cors());

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username)
  response = await handler.login(username, password);

  //Handle calls to database
  res.json(response);

  
});

app.post("/CreateUser", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const building = req.body.building;

  response = await handler.CreateEmployee(username,password,email,building);

  res.json(response)
})


app.listen(port, () => {
  console.log('Server started');
})
