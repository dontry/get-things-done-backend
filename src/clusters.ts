import cluster from "cluster";
import os from "os";
import { logger } from "./utils/logger";
import { Server } from "./server";

const CPUS = os.cpus();
if (cluster.isMaster) {
  CPUS.forEach(() => cluster.fork());
  cluster.on("listening", worker => {
    logger.debug(`Cluster ${worker.process.pid}  connects`);
  });
  cluster.on("disconnect", worker => {
    logger.debug(`Cluster ${worker.process.pid}  disconnects`);
  });
  cluster.on("exit", worker => {
    logger.debug(`Cluster ${worker.process.pid} exits`);
    cluster.fork();
    // Garante que um novo cluster inicie se um antigo morrer
  });
} else {
  const server = new Server();
  server.run();
}
