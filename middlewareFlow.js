const express = require("express");

const app = express();

const port = 8080;

// custom middleware that gets called on every request.
app.use((req, res, next) => {
  console.log("middleware");
  next();
});

app.use("/test", require("./routes/testRoute"));

app.use((req, res, next) => {
  console.log("another middleware");
  res.send("cutting the request here!");
});

app.get("/", (req, res) => {
  console.log("root route");
  res.send("hello from express!");
});

app.listen(port, () => console.log(`Server Listening on port: ${port}.`));
