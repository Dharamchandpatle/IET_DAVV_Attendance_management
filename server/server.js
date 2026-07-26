const app = require("./app");
const { port, host } = require("./config/env");
const { testConnection } = require("./config/db");

const startServer = async () => {
  const tryListen = (currentPort, attempt = 0) => {
    const server = app.listen(currentPort, host, () => {
      console.log(`Server is running on http://${host}:${currentPort}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE' && attempt < 3) {
        const nextPort = currentPort + 1;
        console.warn(`Port ${currentPort} is busy. Retrying ${nextPort}...`);
        server.close();
        tryListen(nextPort, attempt + 1);
        return;
      }

      console.error('Server could not start:', error.message);
      process.exit(1);
    });
  };

  try {
    await testConnection();
    tryListen(port);
  } catch (error) {
    console.error('MySQL connection failed or server could not start:', error.message);
    console.warn('Starting server in fallback mode while database connectivity is unavailable.');
    tryListen(port);
  }
};

startServer();
