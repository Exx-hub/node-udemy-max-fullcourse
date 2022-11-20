const path = require("path");

module.exports = path.dirname(require.main.filename);

// aternative to __dirname, ".." in path.join()
// helper function to direct you to the root file wherever you are in your project.
// it will give you the root path*
