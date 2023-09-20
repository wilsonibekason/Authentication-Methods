"use strict";

var express = require("express");

var jwt = require("jsonwebtoken");

var User = require("../models/User");

var router = express.Router();
router.post("/signup", function _callee(req, res) {
  var _req$body, username, password, existingUser, hashedPassword, newUser;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, username = _req$body.username, password = _req$body.password; // Check if the user already exists

          _context.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            username: username
          }));

        case 4:
          existingUser = _context.sent;

          if (!existingUser) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "User already exists"
          }));

        case 7:
          // Hash the password (You should use bcrypt or another secure method)
          hashedPassword = password; // Replace with password hashing

          newUser = new User({
            username: username,
            password: hashedPassword
          });
          _context.next = 11;
          return regeneratorRuntime.awrap(newUser.save());

        case 11:
          res.status(201).json({
            message: "User created successfully"
          });
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
router.post("/login", function _callee2(req, res) {
  var _req$body2, username, password, user, isPasswordValid, accessToken, refreshToken;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password;
          _context2.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            username: username
          }));

        case 4:
          user = _context2.sent;

          if (user) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            message: "Authentication failed"
          }));

        case 7:
          // Verify the password (You should use bcrypt or another secure method)
          isPasswordValid = password === user.password;

          if (isPasswordValid) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            message: "Authentication failed"
          }));

        case 10:
          // Generate an access token
          accessToken = jwt.sign({
            username: user.username
          }, "your-secret-key", {
            expiresIn: "15m" // Access token expires in 15 minutes

          }); // Generate a refresh token (Store this securely, like in a database)

          refreshToken = jwt.sign({
            username: user.username
          }, "your-refresh-secret-key");
          res.status(200).json({
            accessToken: accessToken,
            refreshToken: refreshToken
          });
          _context2.next = 19;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          res.status(500).json({
            message: "Server error"
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
router.post("/refresh-token", function (req, res) {
  var refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token is required"
    });
  }

  try {
    // Verify the refresh token (You should use the same secret key as in login)
    var decoded = jwt.verify(refreshToken, "your-refresh-secret-key"); // Generate a new access token

    var accessToken = jwt.sign({
      username: decoded.username
    }, "your-secret-key", {
      expiresIn: "15m" // Access token expires in 15 minutes

    });
    res.status(200).json({
      accessToken: accessToken
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({
      message: "Invalid refresh token"
    });
  }
});
module.exports = router;