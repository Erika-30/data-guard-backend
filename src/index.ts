import { app } from "./app";
import { pool } from "./db/config/dbConfig";

const port = 3000;

const gracefulShutdown = () => {
  pool.end(() => {
    console.log("\nApplication ended gracefully");
    process.exit(0);
  });
};
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

app.listen(port, () => console.log(`Escuchando al puerto ${port}`));
