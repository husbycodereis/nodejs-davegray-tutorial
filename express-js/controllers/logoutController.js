const User = require("../model/User");
const { response, json } = require("express");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //no content;

  const refreshToken = cookies.jwt;
  //is refreshToken in usersDB
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    response.clearCookie("jwt", {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.sendStatus(204); //success without content;
  }

  //Delete the refreshToken in the DB
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);
  res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); //secure true - only serves on https
  return res.sendStatus(204); //success without content;
};

module.exports = { handleLogout };

//Delete the refreshToken in the local DB
//  const otherUsers = usersDB.users.filter(
//   (person) => person.refreshToken !== foundUser.refreshToken
// );
// const currentUser = { ...foundUser, refreshToken: "" };
// usersDB.setUsers([...otherUsers, currentUser]);
// await fsPromises.writeFile(
//   path.join(__dirname, "..", "model", "users.json"),
//   JSON.stringify(usersDB.users)
// );
