import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';

// Cargar .env explícitamente desde la carpeta server
dotenv.config({path: new URL('../.env', import.meta.url)});

// Leer configuración desde variables de entorno con valores por defecto
const {
    PGHOST = 'localhost',
    PGDATABASE = 'desserts_db',
    PGUSER = 'postgres',
    PGPASSWORD = 'tu_password',
    PGPORT = '5432',
    PGSSLMODE = 'disable',
} = process.env;

const sequelizeOptions = {
    host: PGHOST,
    port: Number(PGPORT),
    dialect: 'postgres',
    logging: false,
};

// Habilitar SSL cuando PGSSLMODE='require'
if (PGSSLMODE === 'require') {
    sequelizeOptions.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    };
}

const sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, sequelizeOptions);

export default sequelize;