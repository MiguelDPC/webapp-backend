const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 4000
app.use(bodyParser.json());
app.use(cors());

app.post("/api", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;

  console.log(name + email);

  res.json({
    status: 'success',
    message: 'Data received'
  });
});

app.listen(port, () => {
  console.log('Server started');
})
