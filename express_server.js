const express = require("express");
const cookieSession = require('cookie-session');
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const {
  isUser,
  generateRandomString,
  getURLsForUser
} = require("./helper.js");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca/",
    userID: "abc123",
  },
  i3BoGr: {
    longURL: "https://www.google.ca/",
    userID: "abc123",
  },
};

const users = {};

// Middleware to translate/parse the body
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["key1", "key2"],
}));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const email = req.session.email;
  if (!email) {
    res.redirect("/login");
  }
  const user = isUser(email, users);

  const urls = getURLsForUser(user.id, urlDatabase);

  const templateVars = {
    email,
    urls
  };
  res.render("urls_index", templateVars);
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  if (urlDatabase[id]) {
    const longURL = urlDatabase[id].longURL;
    res.redirect(longURL);
  } else {
    res.status(404).send('The short URL you are trying to access does not exist.');
  }
});


app.get("/urls/new", (req, res) => {
  const email = req.session.email;

  if (!email) {
    res.redirect("/login");
  }
  const foundUser = isUser(email, users);
  let usersEmail = null;

  if (foundUser) {
    usersEmail = foundUser.email;
  }
  const templateVars = {
    email: usersEmail
  };
  res.render("urls_new", templateVars);
});

app.get("/login", (req, res) => {
  const email = req.session.email;
  const foundUser = isUser(email, users);
  let usersEmail = null;

  if (foundUser) {
    usersEmail = foundUser.email;
  }
  const templateVars = {
    email: usersEmail
  };
  res.render("login", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = { email: req.session["email"] };
  res.render("register", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const userID = req.session.userID;
  if (!userID) {
    return res.send("You need to be logged in.");
  }
  const shortURL = req.params.id;
  const url = urlDatabase[shortURL];
  console.log("url", url);

  if (!urlDatabase[shortURL]) {
    res.send(
      "It looks like the shortened URL you're trying to access doesn't exist in our database. Please make sure you have the correct URL or create a new shortened link."
    );
  }
  if (userID !== url.userID) {
    return res.send("You are not authorized to view this. The URL does not belong to you.");
  }
  const templateVars = {
    email: req.session["email"],
    id: shortURL,
    longURL: urlDatabase[shortURL].longURL,
  };
  res.render("urls_show", templateVars);
});


/////////////////////////////////////////////
// app.get above with definitions, app.post below with definitions
/////////////////////////////////////////////

//storing the long url,
app.post("/urls", (req, res) => {
  const newId = generateRandomString(6);
  const user = isUser(req.session.email, users);

  if (!user) {
    return res.send(
      "Access to this URL is restricted to logged-in users. Please log in to view this page."
    );
  }
  urlDatabase[newId] = { longURL: req.body.longURL, userID: user.id };

  return res.redirect(`/urls/${newId}`);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = isUser(email, users);
  console.log("user", user);

  if (!user) {
    return res.status(403).send("The user associated with this email address could not be found");
  }
  const passwordMatch = bcrypt.compareSync(password, user.password);

  if (!passwordMatch) {
    return res.status(403).send('Sorry, the password you entered is incorrect. Please try again.');
  }
  req.session.userID = user.id;
  req.session.email = email;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {

  req.session = null;
  res.redirect("login");

});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("Bad Request - Please provide an email AND password");
  }
  if (isUser(email, users)) {
    return res
      .status(400)
      .send("Bad Request - This e-mail address has already been registered");
  }
  const id = generateRandomString(6);

  const hashedPassword = bcrypt.hashSync(password, 8);

  const user = {
    id,
    email,
    password: hashedPassword
  };
  users[id] = user;

  req.session.email = email;
  req.session.userID = id;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id/update", (req, res) => {
  const userID = req.session.userID;
  if (!userID) {
    return res.send("You need to be logged in.");
  }
  const id = req.params.id;
  const updateURL = req.body.updateURL;
  if (urlDatabase[id]) {
    console.log(urlDatabase[id]);
    urlDatabase[id].longURL = updateURL;
    console.log(updateURL);
    res.redirect("/urls");
  } else {
    res.status(404).send("URL not found");
  }
});

//////////////////////////////////////////////////
// app.post above with definitions
//////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});