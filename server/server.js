const app = require("./app");
const { port } = require("./config/env");
const { testConnection } = require("./config/db");

const startServer = async () => {
  try {
    await testConnection();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MySQL:", error.message);
    process.exit(1);
  }
};

startServer();
