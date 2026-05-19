/* eslint-env node */
import {Sequelize} from 'sequelize';

// Leer configuración desde variables de entorno con valores por defecto
const {
    PGHOST = 'localhost',
    PGDATABASE = 'desserts_db',
    PGUSER = 'postgres',
    PGPASSWORD = 'tu_password',
    PGSSLMODE = 'disable',
} = process.env;

const sequelizeOptions = {
    host: PGHOST,
    dialect: 'postgres',
    logging: false,
};

// Habilitar SSL cuando PGSSLMODE='require' (útil para Neon u otras DBs remotas)
if (PGSSLMODE === 'require') {
    // rejectUnauthorized: false permite conexiones a proveedores que usan certificados autofirmados
    sequelizeOptions.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    };
}

const sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, sequelizeOptions);

export default sequelize;