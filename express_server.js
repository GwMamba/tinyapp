const express = require("express");
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
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const getUserIdFromEmail = function(email) {
  let foundUserId = null;
  for (const userId in users) {
    if (users[userId].email === email) {
      foundUserId = users[userId].id;
    }
  }

  return foundUserId;
};


function generateRandomString() {
  return Math.random().toString(36).substring(2, 8); 
};  // generates random 6 digit aplhanumeric string.


// Middleware to translate/parse the body
const bodyParser = require("body-parser"); // middleware
const cookieParser = require("cookie-parser"); // sets up cookies

//app.use(cookieParser.urlencoded({ extended: true }));//crashes with this line.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true })); // need to clarify. Apparent creates req.body


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  // if user is not logged in
  if (!userID) {
    // return a 404 error message
    return res.status(401).send(`
    <html>
      <body>
        <p>You must be <a href="/login">logged in</a> to view this page.</p>
      </body>
    </html>
    `);
  }
});

app.get("/login", (req, res) => {
  const currentUser = users[req.session.user_id];
  const templateVars = { user: currentUser };

  if (!currentUser) {
    return res.render("login", templateVars);
  }

  if (currentUser) {
    return res.redirect("/urls");
  }
});


app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id], 
    username: req.cookies["username"],  // Add this line to pass the username
  };
  res.render("urls_show", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const urlObject = urlDatabase[shortURL];
  const userID = req.session.user_id;
  const user = users[userID];// If the shortURL does not exist in the database:
  if (!urlObject) {
    return res.status(404).send("The requested URL was not found on this server.");
  }
  // If user not logged in:
  if (!userID) {
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


app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id]; // const longURL = ...
  res.redirect(longURL);
});



/////////////////////////////////////////////
// app.get above with definitions, app.post below with definitions
/////////////////////////////////////////////

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

app.post("/urls/login", (req, res) => {
  const { username } = req.body;
  if (username) {
    res.cookie("username", username);
    res.redirect("/urls");
  } else {
    res.status(404).send("Bad Request. Please provide a username")
  }
});


app.post("/logout", (req, res) => { // Insert Login Code Here
   req.session = null;
   res.redirect("/login");
});


//////////////////////////////////////////////////
// app.post above with definitions

//////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});