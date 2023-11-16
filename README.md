# TinyApp Project

TinyApp is a full-stack web application built with Node.js and Express that allows users to shorten long URLs (à la bit.ly).

## Purpose

This project was published for learning purposes as part of my learnings at Lighthouse Labs (LHL).

## Final Product

!["Register Page"](https://github.com/GwMamba/tinyapp-old/blob/feature/security/docs/Register_Page.jpg?raw=true)

!["Login Page"](https://github.com/GwMamba/tinyapp-old/blob/feature/security/docs/Login_Page.jpg?raw=true)

!["MyURLs Page"](https://github.com/GwMamba/tinyapp-old/blob/feature/security/docs/MyUrls_Page.jpg?raw=true)

!["Create TinyUrls Page"](https://github.com/GwMamba/tinyapp-old/blob/feature/security/docs/Create_TinyURL.jpg?raw=true)

!["TinyURLs Result Page"](https://github.com/GwMamba/tinyapp-old/blob/feature/security/docs/TinyURL_Result_Page.jpg?raw=true)

## Features

Shorten URLs
Personal URL Dashboard
URL Editing
URL Deletion
User Registration and Authentication
Encrypted Cookies
Responsive Design

## Dependencies

Node.js
Express
EJS
bcryptjs
body-parser
cookie-session

## Getting Started

Install all dependencies (using the npm install command).
Run the development web server using the node express_server.js command.
Visit http://localhost:8080/ in your browser to start using TinyApp.

## File Structure

express_server.js: Server setup and route definitions.
views/: Directory for EJS templates.
public/: Static files like stylesheets and client-side scripts.
Helper functions.
test/: Assertion tests for helper function.

## Security

TinyApp uses bcryptjs for hashing passwords and cookie-session for encrypted session management.

## Credits

This app was developed by Gerald Mwangi. A great many thanks to the LHL mentors and instructors who were involved in assisting me in the journey to create it.