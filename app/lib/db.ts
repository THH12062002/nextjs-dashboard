import postgres from "postgres";
import { unstable_noStore as noStore } from "next/cache";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

// This is the main connection we'll use for most queries
const postgresClient = postgres(process.env.POSTGRES_URL, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Idle connection timeout in seconds
  connect_timeout: 10, // Connection timeout in seconds
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
  debug: true, // Enable debug mode
});

let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

async function initializeDatabase() {
  if (isInitialized) return;
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    try {
      console.log("Starting database initialization...");

      // Check if tables exist
      const tables = await postgresClient`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;

      const existingTables = tables.map((t) => t.table_name);
      console.log("Existing tables:", existingTables);

      // Create users table if it doesn't exist
      if (!existingTables.includes("users")) {
        console.log("Creating users table...");
        await postgresClient`
          CREATE TABLE users (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
          )
        `;
        console.log("Created users table");
      }

      // Create customers table if it doesn't exist
      if (!existingTables.includes("customers")) {
        console.log("Creating customers table...");
        await postgresClient`
          CREATE TABLE customers (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            image_url VARCHAR(255) NOT NULL
          )
        `;
        console.log("Created customers table");
      }

      // Create invoices table if it doesn't exist
      if (!existingTables.includes("invoices")) {
        console.log("Creating invoices table...");
        await postgresClient`
          CREATE TABLE invoices (
            id VARCHAR(255) PRIMARY KEY,
            customer_id VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            status VARCHAR(255) NOT NULL,
            date DATE NOT NULL,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
          )
        `;
        console.log("Created invoices table");
      }

      // Create revenue table if it doesn't exist
      if (!existingTables.includes("revenue")) {
        console.log("Creating revenue table...");
        await postgresClient`
          CREATE TABLE revenue (
            month VARCHAR(4) NOT NULL,
            revenue INTEGER NOT NULL
          )
        `;
        console.log("Created revenue table");
      }

      // Insert sample data if tables are empty
      const customerCount =
        await postgresClient`SELECT COUNT(*) FROM customers`;
      if (customerCount[0].count === "0") {
        console.log("Inserting sample customers...");
        await postgresClient`
          INSERT INTO customers (id, name, email, image_url)
          VALUES
            ('d6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 'Evil Rabbit', 'evil@rabbit.com', '/customers/evil-rabbit.png'),
            ('3958dc9e-712f-4377-85e9-fec4b6a6442a', 'Delba de Oliveira', 'delba@oliveira.com', '/customers/delba-de-oliveira.png'),
            ('3958dc9e-742f-4377-85e9-fec4b6a6442a', 'Lee Robinson', 'lee@robinson.com', '/customers/lee-robinson.png'),
            ('76d65c26-f784-44a2-ac19-586678f7c2f2', 'Michael Novotny', 'michael@novotny.com', '/customers/michael-novotny.png'),
            ('CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 'Amy Burns', 'amy@burns.com', '/customers/amy-burns.png'),
            ('13D07535-C59E-4157-A011-F8D2EF4E0CBB', 'Balazs Orban', 'balazs@orban.com', '/customers/balazs-orban.png')
        `;
        console.log("Inserted sample customers");
      }

      const invoiceCount = await postgresClient`SELECT COUNT(*) FROM invoices`;
      if (invoiceCount[0].count === "0") {
        console.log("Inserting sample invoices...");
        await postgresClient`
          INSERT INTO invoices (id, customer_id, amount, status, date)
          VALUES
            ('3958dc9e-787f-4377-85e9-fec4b6a6442a', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 157.95, 'pending', '2022-12-06'),
            ('3958dc9e-787f-4377-85e9-fec4b6a6442b', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 203.48, 'pending', '2022-11-14'),
            ('3958dc9e-787f-4377-85e9-fec4b6a6442c', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 30.40, 'paid', '2022-10-29'),
            ('50ca3e18-62cd-11ee-8c99-0242ac120002', '76d65c26-f784-44a2-ac19-586678f7c2f2', 448.00, 'paid', '2023-09-10'),
            ('3958dc9e-787f-4377-85e9-fec4b6a6442e', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 345.77, 'pending', '2023-08-05'),
            ('76d65c26-f784-44a2-ac19-586678f7c2f2', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 542.46, 'pending', '2023-07-16'),
            ('126eed9c-c90c-4ef6-a4a8-fcf7408d3c66', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 6.66, 'pending', '2023-06-27'),
            ('CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', '76d65c26-f784-44a2-ac19-586678f7c2f2', 325.45, 'paid', '2023-06-09'),
            ('13D07535-C59E-4157-A011-F8D2EF4E0CBB', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 12.50, 'paid', '2023-06-17'),
            ('3958dc9e-787f-4377-85e9-fec4b6a6442f', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 85.46, 'paid', '2023-06-07'),
            ('3958dc9e-787f-4377-85e9-fec4b6a6443a', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 5.00, 'paid', '2023-08-19'),
            ('3958dc9e-787f-4377-85e9-fec4b6a6443b', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 89.45, 'paid', '2023-06-03'),
            ('3958dc9e-787f-4377-85e9-fec4b6a6443c', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 10.00, 'paid', '2022-06-05')
        `;
        console.log("Inserted sample invoices");
      }

      const revenueCount = await postgresClient`SELECT COUNT(*) FROM revenue`;
      if (revenueCount[0].count === "0") {
        console.log("Inserting sample revenue data...");
        await postgresClient`
          INSERT INTO revenue (month, revenue)
          VALUES
            ('Jan', 2000),
            ('Feb', 1800),
            ('Mar', 2200),
            ('Apr', 2500),
            ('May', 2300),
            ('Jun', 3200),
            ('Jul', 3500),
            ('Aug', 3700),
            ('Sep', 2500),
            ('Oct', 2800),
            ('Nov', 3000),
            ('Dec', 4800)
        `;
        console.log("Inserted sample revenue data");
      }

      isInitialized = true;
      console.log("Database initialization completed successfully");
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  })();

  return initializationPromise;
}

// Initialize database when the module is imported
initializeDatabase().catch((error) => {
  console.error("Failed to initialize database:", error);
});

// This is a wrapper that ensures the database is initialized before executing any queries
export async function sqlWithInit<T>(
  query: TemplateStringsArray,
  ...values: any[]
): Promise<T[]> {
  await initializeDatabase();
  return postgresClient(query, ...values) as unknown as Promise<T[]>;
}

// Export a wrapped version of sql that ensures initialization
export const sql = Object.assign(
  async <T>(query: TemplateStringsArray, ...values: any[]): Promise<T[]> => {
    await initializeDatabase();
    return postgresClient(query, ...values) as unknown as Promise<T[]>;
  },
  { ...postgresClient }
);
