const express = require("express");
const cookieSession = require('cookie-session');
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const {isUser, generateRandomString} = require("./helper.js");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "2468",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "1357",
  },
};

// Middleware to translate/parse the body
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true })); // need to clarify. Apparent creates req.body
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
  const templateVars = {
    email: req.session["email"],
    urls: urlDatabase,
  };
  res.render("urls_index", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  const email = req.session.email;

  if (!email) {
    res.redirect("/login");
  }
  const foundUser = isUser(email, users)
  let usersEmail = null;

  if (foundUser) {
    usersEmail = foundUser.email;
  }
  const templateVars = {
    email: usersEmail
  }
  res.render("urls_new", templateVars);
});

app.get("/login", (req, res) => {
  const email = req.session.email;
  const foundUser = isUser(email, users)
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
  const templateVars = {
    email: req.session["email"],
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const urlObject = urlDatabase[shortURL];
  const userID = req.session.user_id;
  const user = users[userID];// If the shortURL does not exist in the database:
  if (urlObject === null) {
    return res.status(404).send("The requested URL was not found on this server.");
  }
  // If user not logged in:
  if (id === null) {
    return res.status(401).send(`
    <html>
      <body>
        <p>You must be <a href="/login">logged in</a> to view this page.</p>
      </body>
    </html>
    `);
  }
  // Use of helper function to check if the URL belongs to the logged in user:
  if (!urlBelongsToUser(shortURL, userID, urlDatabase)) {
    return res.status(403).send("You do not have permission to view this page");
  }
  // If URL exists and belongs to the user, proceed with rendering:
  const templateVars = {
    id: shortURL,
    longURL: urlObject.longURL,
    user: user
  };
  res.render("urls_show", templateVars);
});


/////////////////////////////////////////////
// app.get above with definitions, app.post below with definitions
/////////////////////////////////////////////

//storing the long url,
app.post("/urls", (req, res) => {
  // console.log(req.body);
  const newId = generateRandomString(6);
  urlDatabase[newId] = req.body.longURL;
  res.redirect(`/urls/${newId}`);
  // res.send("Ok");
});


app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = isUser(email, users);

  if (!user) {
    return res.status(403).send("The user associated with this email address could not be found");
  }
  const passwordMatch = bcrypt.compareSync(password, user.password);

  if (!passwordMatch) {
    return res.status(403).send('Sorry, the password you entered is incorrect. Please try again.');
  }
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
  res.redirect("/urls");
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    email: req.session["email"],
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id/update", (req, res) => {
  const id = req.params.id;
  const updateURL = req.body.updateURL;
  if (urlDatabase[id]) {
    urlDatabase[id] = updateURL;
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