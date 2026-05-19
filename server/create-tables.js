// Script para crear tablas en la base de datos remota usando sync({ alter: true })
import 'dotenv/config';
import {sequelize} from './models/index.js';

(async () => {
    try {
        await sequelize.sync({alter: true});
        console.log('sync({ alter: true }) completado — tablas creadas/actualizadas si hacía falta');
        process.exit(0);
    } catch (err) {
        console.error('Error sincronizando:', err);
        process.exit(1);
    }
})();

