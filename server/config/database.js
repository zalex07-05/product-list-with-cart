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

    AUTH_PGHOST = 'localhost',
    AUTH_PGDATABASE = 'auth_db',
    AUTH_PGUSER = 'postgres',
    AUTH_PGPASSWORD = 'tu_password',
    AUTH_PGPORT = '5432',
    AUTH_PGSSLMODE = 'disable',

    PEDIDOS_PGHOST = 'localhost',
    PEDIDOS_PGDATABASE = 'pedidos_db',
    PEDIDOS_PGUSER = 'postgres',
    PEDIDOS_PGPASSWORD = 'tu_password',
    PEDIDOS_PGPORT = '5432',
    PEDIDOS_PGSSLMODE = 'disable',
} = process.env;

// --- PRODUCTS DATABASE ---
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
const ORDERS_HOST = process.env.PEDIDOS_PGHOST || process.env.ORDERS_PGHOST || PGHOST;
const ORDERS_DATABASE = process.env.PEDIDOS_PGDATABASE || process.env.ORDERS_PGDATABASE || PGDATABASE;
const ORDERS_USER = process.env.PEDIDOS_PGUSER || process.env.ORDERS_PGUSER || PGUSER;
const ORDERS_PASSWORD = process.env.PEDIDOS_PGPASSWORD || process.env.ORDERS_PGPASSWORD || PGPASSWORD;
const ORDERS_PORT = process.env.PEDIDOS_PGPORT || process.env.ORDERS_PGPORT || PGPORT;
const ORDERS_SSLMODE = process.env.PEDIDOS_PGSSLMODE || process.env.ORDERS_PGSSLMODE || PGSSLMODE;

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
