
// GetUserByEmail function
function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}  // generates random 6 digit aplhanumeric string.


// finding user by email
const isUser = function(email, users) {
  for (const user in users) {
    let userObject = {};
    if (users[user]['email'] === email) {
      userObject = users[user];
      return userObject;
    }
  }
  return null;
};

const getURLsForUser = function(userId, database) {
  let result = {
  };

  for (let key in database) {
    if (userId === database[key].userID) {
      result[key] = {longURL: database[key].longURL};
    }
  }
  return result;
};

module.exports = {
  generateRandomString,
  isUser,
  getURLsForUser
};

