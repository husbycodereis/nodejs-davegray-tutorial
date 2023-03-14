const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");

fs.readFile(
  //instead of hardcoding '/files/starter.txt'
  path.join(__dirname, "files", "starter.txt"),
  "utf-8",
  (err, data) => {
    if (err) throw err;
    console.log(data);
  }
);
//creates a new file
fs.writeFile(path.join(__dirname, "files", "reply.txt"), "Adamsin", (err) => {
  if (err) throw err;
  console.log("reply.txt creation success");
});
//changes a file and creates a new one if there is no file
fs.appendFile(
  path.join(__dirname, "files", "append.txt"),
  "append cigerim benim",
  (err) => {
    if (err) throw err;
    console.log("append success");
  }
);

fs.writeFile(path.join(__dirname, "files", "sello.txt"), "sello", (err) => {
  if (err) throw err;
  console.log("sello created");
  //renames the file name
  fs.rename(
    path.join(__dirname, "files", "sello.txt"),
    path.join(__dirname, "files", "newSello.txt"),
    (err) => {
      if (err) throw err;
      console.log("newSello created");
    }
  );
});

//same methods above in an async way
const fileOps = async () => {
  try {
    const data = await fsPromise.readFile(
      path.join(__dirname, "files", "starter.txt"),
      "utf-8"
    );
    // unlink deletes the file
    fsPromise.unlink(path.join(__dirname, "files", "starter.txt"));
    await fsPromise.writeFile(
      path.join(__dirname, "files", "promiseWrite.txt"),
      data
    );
    await fsPromise.appendFile(
      path.join(__dirname, "files", "promiseWrite.txt"),
      "\n\n adamin dibisin canim"
    );
    await fsPromise.rename(
      path.join(__dirname, "files", "promiseWrite.txt"),
      path.join(__dirname, "files", "promiseComplete.txt")
    );
    const newData = await fsPromise.readFile(
      path.join(__dirname, "files", "promiseComplete.txt"),
      "utf-8"
    );
    console.log(newData);
  } catch (error) {
    console.log(error);
  }
};

fileOps();

process.on("uncaughtException", (err) => {
  console.log("there is errorrr", err);
  process.exit(1);
});
