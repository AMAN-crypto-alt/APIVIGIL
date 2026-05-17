const fs = require("fs");

const logError = (msg) => {
  fs.appendFileSync("errors.log", `${new Date()} - ${msg}\n`);
};

module.exports = { logError };