
// GetUserByEmail function
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

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}  // generates random 6 digit aplhanumeric string.


module.exports = {isUser, generateRandomString};