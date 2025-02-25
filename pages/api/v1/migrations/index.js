import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {

  const allowedMethos = ["GET", "POST"];

  if (!allowedMethos.includes(request.method)) {

    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });

  }

  let dbClient;

  try {

    dbClient = await database.getNewClient();

    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };


    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);

      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }

      return response.status(200).json(migratedMigrations);
    }

  } catch (error) {

    console.error(error)
    throw error;

  } finally {
    await dbClient.end();
  }
}

// export default async function migrations(request, response) {
//   const defaultMigrationOptions = {
//     databaseUrl: process.env.DATABASE_URL,
//     dryRun: false,
//     dir: join("infra", "migrations"),
//     direction: "up",
//     verbose: true,
//     migrationsTable: "pgmigrations",
//   };



//   const dryRun = request.method === "GET";
//   const migrations = await migrationRunner(defaultMigrationOptions);
//   const responseCode = request.method === "GET" ? 200 : 201;

//   return response.status(responseCode).json(migrations);
// }
