const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleLogin = async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password) {
    return res.status(400).json({ message: "username or password required" });
  }
  const foundUser = usersDB.users.find((u) => u.username === user);
  if (!foundUser) {
    return res.sendStatus(409).json({ message: "no user found" }); //unauthorized
  }
  //evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    //create JWT to use with other routes
    console.log(process.env.ACCESS_TOKEN_SECRET);
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    //Saving refresh token with current user
    const otherUsers = usersDB.users.filter(
      (person) => person.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, //one day in miliseconds
      sameSite: "None",
      secure: true,
    });
    return res.json({ accessToken, refreshToken });
  } else {
    return res.sendStatus(401);
  }
};

module.exports = { handleLogin };
