import { betterAuth } from 'better-auth';
import { bearer } from 'better-auth/plugins';
import Database from 'better-sqlite3';
import { Pool } from 'pg';

const getDatabase = () => {
  if (process.env.DATABASE_URL) {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return new Database('data/dark-bay.sqlite');
};

export const auth = betterAuth({
  database: getDatabase(),
  plugins: [bearer()],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});
