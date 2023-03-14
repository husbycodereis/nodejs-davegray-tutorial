//1) node runs on backend server not in a browser
//2) the console is the terminal window
console.log("hello canim");
//3) global object instead of window object
// console.log(global);
//4) has common core modules
//5) CommonJS modules instead of ES6

const { add, subtract, multiply, divide } = require("./math");

console.log(add(2, 3));
console.log(subtract(2, 3));
console.log(multiply(2, 4));
console.log(divide(2, 4));

const os = require("os");
const path = require("path");

// console.log(os.type());
// console.log(os.version());
// console.log(os.homedir());

// console.log(__dirname);
// console.log(__filename);

// console.log(path.basename(__filename));
// console.log(path.parse(__filename));
