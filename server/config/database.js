import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({path: new URL('../.env', import.meta.url)});

const {
    PGHOST = 'localhost',
    PGDATABASE = 'desserts_db',
    PGUSER = 'postgres',
    PGPASSWORD = 'tu_password',
    PGPORT = '5432',
    PGSSLMODE = 'disable',
} = process.env;

// --- MAIN DATABASE (Products) ---
const sequelizeOptions = {
    host: PGHOST,
    port: Number(PGPORT),
    dialect: 'postgres',
    logging: false,
};

if (PGSSLMODE === 'require') {
    sequelizeOptions.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    };
}

const sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, sequelizeOptions);

// --- AUTHENTICATION DATABASE (Users) ---
const AUTH_HOST = process.env.AUTH_PGHOST || process.env.PGAUTH_HOST || PGHOST;
const AUTH_DATABASE = process.env.AUTH_PGDATABASE || process.env.PGAUTH_DATABASE || PGDATABASE;
const AUTH_USER = process.env.AUTH_PGUSER || process.env.PGAUTH_USER || PGUSER;
const AUTH_PASSWORD = process.env.AUTH_PGPASSWORD || process.env.PGAUTH_PASSWORD || PGPASSWORD;
const AUTH_PORT = process.env.AUTH_PGPORT || PGPORT;
const AUTH_SSLMODE = process.env.AUTH_PGSSLMODE || PGSSLMODE;

const authSequelizeOptions = {
    host: AUTH_HOST,
    port: Number(AUTH_PORT),
    dialect: 'postgres',
    logging: false,
};

if (AUTH_SSLMODE === 'require') {
    authSequelizeOptions.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    };
}

const sequelizeAuth = new Sequelize(AUTH_DATABASE, AUTH_USER, AUTH_PASSWORD, authSequelizeOptions);

// --- ORDERS DATABASE ---
const ORDERS_HOST = process.env.ORDERS_PGHOST || process.env.PGORDERS_HOST || PGHOST;
const ORDERS_DATABASE = process.env.ORDERS_PGDATABASE || process.env.PGORDERS_DATABASE || PGDATABASE;
const ORDERS_USER = process.env.ORDERS_PGUSER || process.env.PGORDERS_USER || PGUSER;
const ORDERS_PASSWORD = process.env.ORDERS_PGPASSWORD || process.env.PGORDERS_PASSWORD || PGPASSWORD;
const ORDERS_PORT = process.env.ORDERS_PGPORT || process.env.PGORDERS_PORT || PGPORT;
const ORDERS_SSLMODE = process.env.ORDERS_PGSSLMODE || process.env.PGORDERS_SSL || PGSSLMODE;

const ordersSequelizeOptions = {
    host: ORDERS_HOST,
    port: Number(ORDERS_PORT),
    dialect: 'postgres',
    logging: false,
};

if (ORDERS_SSLMODE === 'require') {
    ordersSequelizeOptions.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    };
}

const sequelizeOrders = new Sequelize(ORDERS_DATABASE, ORDERS_USER, ORDERS_PASSWORD, ordersSequelizeOptions);

export { sequelizeAuth, sequelizeOrders };
export default sequelize;
