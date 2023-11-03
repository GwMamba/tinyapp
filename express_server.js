const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Middleware to translate/parse the body
app.use(express.urlencoded({ extended: true }));

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id]; // const longURL = ...
  res.redirect(longURL);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

?

/////////////////////////////////////////////
// app.get above with definitions, app.post below with definitions
/////////////////////////////////////////////


function generateRandomString() {
  return Math.random().toString(36).substring(2, 8); 
};  // generates random 6 digit aplhanumeric string.

//storing the long url,
app.post('/urls', (req, res) => {
  const longURL = req.body.longURL; //long url from the request body
  const ID = generateRandomString();  // generate short id
  urlDatabase[ID] = longURL;  //stick into the database
  res.redirect(`/urls/${ID}`);  //redirect
});




app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  if (urlDatabase[id]) {
    delete urlDatabase[id];
    res.redirect("/urls");
  } else {
    res.status(404).send("URL not found")
  }
});

app.post("/urls/:id/update", (req, res) => {
  const id = req.params.id;
  console.log(id);
  const updateURL = req.body.updateURL;
  console.log(updateURL);
  if (urlDatabase[id]) {
    urlDatabase[id] = updateURL;
    res.redirect("/urls");
  } else {
    res.status(404).send("URL not found")
  }
});

/*
app.post("/urls/:id/update", (req, res) => {
  const id = req.params.id;
  const newLongURL = req.body.newLongURL;
  if (urlDatabase[id]) {
    res.redirect("/urls");
  } else {
    res.status(404).send("URL not found")
  }
});
*/

//////////////////////////////////////////////////

//////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});