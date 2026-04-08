const app = require("./app");
const { port } = require("./config/env");

// Initialize the database connection on startup.
require("./config/db");

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
