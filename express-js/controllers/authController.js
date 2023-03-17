const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password) {
    return res.status(400).json({ message: "username or password required" });
  }
  const foundUser = usersDB.users.find((u) => u.username === user);
  if (!foundUser) {
    return res.sendStatus(401).json({ message: "no user found" }); //unauthorized
  }
  //evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    //create JWT to use with other routes
    return res.json({ success: `User ${user} is logged in` });
  } else {
    return res.sendStatus(401);
  }
};

module.exports = { handleLogin };
