import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  console.log('🌱 Seeding database with users...');

  const pool = new Pool({
    user: 'lifegraph_user',
    password: 'lifegraph_password',
    host: 'localhost',
    port: 5433,
    database: 'lifegraph_db',
  });

  try {
    // Clear existing users
    await pool.query('DELETE FROM "users"');
    console.log('✓ Cleared existing users');

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Users to seed
    const users = [
      { email: 'alice@example.com', name: 'Alice Johnson', timezone: 'America/New_York' },
      { email: 'bob@example.com', name: 'Bob Smith', timezone: 'America/Chicago' },
      { email: 'charlie@example.com', name: 'Charlie Brown', timezone: 'America/Denver' },
      { email: 'diana@example.com', name: 'Diana Prince', timezone: 'America/Los_Angeles' },
      { email: 'eve@example.com', name: 'Eve Wilson', timezone: 'Europe/London' },
      { email: 'frank@example.com', name: 'Frank Miller', timezone: 'Europe/Paris' },
      { email: 'grace@example.com', name: 'Grace Lee', timezone: 'Asia/Tokyo' },
      { email: 'henry@example.com', name: 'Henry Davis', timezone: 'Asia/Shanghai' },
      { email: 'iris@example.com', name: 'Iris Martinez', timezone: 'America/Mexico_City' },
      { email: 'jack@example.com', name: 'Jack Robinson', timezone: 'Europe/Berlin' },
      { email: 'karen@example.com', name: 'Karen White', timezone: 'Australia/Sydney' },
      { email: 'liam@example.com', name: 'Liam OBrien', timezone: 'Europe/Dublin' },
      { email: 'maya@example.com', name: 'Maya Patel', timezone: 'Asia/Kolkata' },
      { email: 'noah@example.com', name: 'Noah Taylor', timezone: 'Pacific/Auckland' },
      { email: 'olivia@example.com', name: 'Olivia Garcia', timezone: 'America/Argentina/Buenos_Aires' },
      { email: 'peter@example.com', name: 'Peter Anderson', timezone: 'Europe/Amsterdam' },
      { email: 'quinn@example.com', name: 'Quinn Stewart', timezone: 'America/Toronto' },
      { email: 'rachel@example.com', name: 'Rachel Green', timezone: 'America/New_York' },
      { email: 'sam@example.com', name: 'Sam Johnson', timezone: 'Europe/Rome' },
      { email: 'tara@example.com', name: 'Tara Singh', timezone: 'Asia/Bangkok' },
      { email: 'uma@example.com', name: 'Uma Kumar', timezone: 'Asia/Dubai' },
      { email: 'victor@example.com', name: 'Victor Hernandez', timezone: 'America/Mexico_City' },
    ];

    let createdCount = 0;
    for (const user of users) {
      try {
        await pool.query(
          'INSERT INTO "users" (id, email, name, password, timezone, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
          [uuidv4(), user.email, user.name, hashedPassword, user.timezone],
        );
        console.log(`✓ Created user: ${user.email}`);
        createdCount++;
      } catch (error: any) {
        console.error(`Error creating user ${user.email}:`, error.message);
      }
    }

    const result = await pool.query('SELECT COUNT(*) as count FROM "users"');
    const totalUsers = result.rows[0].count;
    console.log(`\n✅ Seeding complete! Total users in database: ${totalUsers}`);
  } catch (error) {
    console.error('🔴 Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
