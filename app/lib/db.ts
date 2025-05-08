import postgres from "postgres";

const sql = postgres(
  "postgres://postgres:123456@localhost:5432/nextjs-dashboard",
  {
    max: 10, // Maximum number of connections
    idle_timeout: 20, // Idle connection timeout in seconds
    connect_timeout: 10, // Connection timeout in seconds
    ssl: false, // Disable SSL for local development
    debug: true, // Enable debug mode
  }
);

let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

async function initializeDatabase() {
  if (isInitialized) return;
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    try {
      // Check if tables exist
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;

      if (tables.length === 0) {
        console.log("Creating database tables...");

        // Create users table
        await sql`
          CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
          )
        `;

        // Create customers table
        await sql`
          CREATE TABLE IF NOT EXISTS customers (
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            image_url VARCHAR(255)
          )
        `;

        // Create invoices table
        await sql`
          CREATE TABLE IF NOT EXISTS invoices (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            customer_id UUID NOT NULL REFERENCES customers(id),
            amount INTEGER NOT NULL,
            status VARCHAR(255) NOT NULL,
            date DATE NOT NULL
          )
        `;

        // Create revenue table
        await sql`
          CREATE TABLE IF NOT EXISTS revenue (
            month VARCHAR(4) PRIMARY KEY,
            revenue INTEGER NOT NULL
          )
        `;

        // Insert sample data
        await sql`
          INSERT INTO users (id, name, email, password) VALUES
          ('410544b2-4001-4271-9855-fec4b6a6442a', 'User', 'user@nextmail.com', '123456')
        `;

        await sql`
          INSERT INTO customers (id, name, email, image_url) VALUES
          ('d6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 'Evil Rabbit', 'evil@rabbit.com', '/customers/evil-rabbit.png'),
          ('3958dc9e-712f-4377-85e9-fec4b6a6442a', 'Delba de Oliveira', 'delba@oliveira.com', '/customers/delba-de-oliveira.png'),
          ('3958dc9e-742f-4377-85e9-fec4b6a6442a', 'Lee Robinson', 'lee@robinson.com', '/customers/lee-robinson.png'),
          ('76d65c26-f784-44a2-ac19-586678f7c2f2', 'Michael Novotny', 'michael@novotny.com', '/customers/michael-novotny.png'),
          ('CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 'Amy Burns', 'amy@burns.com', '/customers/amy-burns.png'),
          ('13D07535-C59E-4157-A011-F8D2EF4E0CBB', 'Balazs Orban', 'balazs@orban.com', '/customers/balazs-orban.png')
        `;

        await sql`
          INSERT INTO invoices (customer_id, amount, status, date) VALUES
          ('d6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 15795, 'pending', '2022-12-06'),
          ('3958dc9e-712f-4377-85e9-fec4b6a6442a', 20348, 'pending', '2022-11-14'),
          ('CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 3040, 'paid', '2022-10-29'),
          ('76d65c26-f784-44a2-ac19-586678f7c2f2', 44800, 'paid', '2023-09-10'),
          ('13D07535-C59E-4157-A011-F8D2EF4E0CBB', 34577, 'pending', '2023-08-05'),
          ('3958dc9e-742f-4377-85e9-fec4b6a6442a', 54246, 'pending', '2023-07-16')
        `;

        await sql`
          INSERT INTO revenue (month, revenue) VALUES
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

        console.log("Database initialized successfully!");
      } else {
        console.log("Database tables already exist.");
      }
      isInitialized = true;
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

// Wrap the sql client to ensure database is initialized
const sqlWithInit = async (...args: Parameters<typeof sql>) => {
  await initializeDatabase();
  return sql(...args);
};

export { sqlWithInit as sql };
