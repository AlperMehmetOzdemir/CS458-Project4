const express = require("express");
const dotenv = require("dotenv");


dotenv.configure();

const PORT = process.env.PORT || 5000;

const app = express();


app.get("/", (req, res) => {
  res.send("Hello, this is the homepage")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`)
})