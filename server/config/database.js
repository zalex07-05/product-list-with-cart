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


export { sequelizeAuth };
export default sequelize;
