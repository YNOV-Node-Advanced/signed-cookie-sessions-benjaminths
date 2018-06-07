const express = require("express");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const app = express();
app.use(cookieParser());

const username = "Benjamin";

const middleware = (req, res, next) => {
  const cookieValue = res.cookie("pd");

  if (!cookieValue) {
    console.log("cookie created");
    let privateKey = "azertyuiop";

    let signature = crypto
      .createHash("sha256")
      .update(username + privateKey)
      .digest("base64");

    res.cookie("test", JSON.stringify({ username, signature }), {
      expires: new Date(Date.now() + 9000),
      httpOnly: true
    });
  }

  const { username, signature } = JSON.parse(cookieValue);
  let signatureCheck = crypto
    .createHash("sha256")
    .update(username + privateKey)
    .digest("base64");

  if (signature !== signatureCheck) {
    console.log("pas signé");
  } else {
    console.log("signé");
  }
};

app.use(middleware);

app.get("/", function(req, res, next) {
  res.send("Hello World");
});

app.listen(3000);
