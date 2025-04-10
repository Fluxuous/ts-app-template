import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"
import { config } from "dotenv"
import path from "path"

// Load environment variables
const envPath = path.resolve(process.cwd(), ".env.local")
config({ path: envPath })

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined")
}

const runMigrate = async () => {
  const connection = postgres(databaseUrl, { max: 1 })
  const db = drizzle(connection)

  console.log("⏳ Running migrations...")

  const start = Date.now()
  await migrate(db, { migrationsFolder: "db/migrations" })
  const end = Date.now()

  console.log(`✅ Migrations completed in ${end - start}ms`)

  process.exit(0)
}

runMigrate().catch((err) => {
  console.error("❌ Migration failed")
  console.error(err)
  process.exit(1)
}) 