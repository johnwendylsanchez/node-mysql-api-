import 'dotenv/config';
import config from '../config.json';
import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refresh-token.model';

const db: any = {};
export let sequelize: Sequelize;
export default db;

initialize();

async function initialize() {
    const host = process.env.DB_HOST || config.database.host;
    const port = Number(process.env.DB_PORT) || config.database.port;
    const user = process.env.DB_USER || config.database.user;
    const password = process.env.DB_PASSWORD || config.database.password;
    const database = process.env.DB_NAME || config.database.database;

    const connection = await mysql.createConnection({ host, port, user, password });

    // Create DB if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // Connect to DB using Sequelize
    sequelize = new Sequelize(database, user, password, { dialect: 'mysql', host, port });

    // Init Models
    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);

    // Define relationships
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    // Sync models with database
    await sequelize.sync({ alter: true });
}