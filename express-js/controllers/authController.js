const User = require("../model/User");
bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password) {
    return res.status(400).json({ message: "username or password required" });
  }
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(409).json({ message: "no user found" }); //unauthorized

  //evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    //create JWT to use with other routes
    console.log(process.env.ACCESS_TOKEN_SECRET);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30000s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log("result", result);
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, //one day in miliseconds
      sameSite: "None",
      //remove the line below when using thunderclient
      // secure: true,
    });
    return res.json({ accessToken, refreshToken });
  } else {
    return res.sendStatus(401);
  }
};

module.exports = { handleLogin };

//Saving refresh token with current user on localdb
// const otherUsers = await User.find()
//   .filter((person) => person.username !== foundUser.username)
//   .exec();
// const currentUser = { ...foundUser, refreshToken };
// usersDB.setUsers([...otherUsers, currentUser]);
// await fsPromises.writeFile(
//   path.join(__dirname, "..", "model", "users.json"),
//   JSON.stringify(usersDB.users)
// );
