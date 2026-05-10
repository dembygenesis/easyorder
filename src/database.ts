import { Sequelize } from 'sequelize';

if (process.env.DATABASE_URL === undefined) {
  console.error('`DATABASE_URL` must be set as an environment variable');
  process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, { dialect: 'postgres' });

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to database:', error);
}

export default sequelize;
