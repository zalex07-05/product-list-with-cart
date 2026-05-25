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


// --- AUTH DATABASE (Users) ---
const authSequelizeOptions = {
    host: AUTH_PGHOST,
    port: Number(AUTH_PGPORT),
    dialect: 'postgres',
    logging: false,
};

if (AUTH_PGSSLMODE === 'require') {
    authSequelizeOptions.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    };
}

const sequelizeAuth = new Sequelize(AUTH_PGDATABASE, AUTH_PGUSER, AUTH_PGPASSWORD, authSequelizeOptions);


// --- PEDIDOS DATABASE (Orders + Products target) ---
const pedidosSequelizeOptions = {
    host: PEDIDOS_PGHOST,
    port: Number(PEDIDOS_PGPORT),
    dialect: 'postgres',
    logging: false,
};

if (PEDIDOS_PGSSLMODE === 'require') {
    pedidosSequelizeOptions.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    };
}

const sequelizePedidos = new Sequelize(PEDIDOS_PGDATABASE, PEDIDOS_PGUSER, PEDIDOS_PGPASSWORD, pedidosSequelizeOptions);


export { sequelizeAuth, sequelizePedidos };
export default sequelize;
