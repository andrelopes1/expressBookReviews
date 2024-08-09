const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the session contains an access token
    if (req.session && req.session.accessToken) {
        try {
            // Verify the JWT access token stored in the session
            const decoded = jwt.verify(req.session.accessToken, 'fingerprint_customer');
            req.user = decoded; // Attach the decoded user information to the request object
            next(); // Proceed to the next middleware or route handler
        } catch (err) {
            // If the token is invalid or expired, deny access
            return res.status(401).send('Unauthorized: Invalid or expired token');
        }
    } else {
        // If no session or access token is found, deny access
        return res.status(401).send('Unauthorized: No access token found in session');
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));


