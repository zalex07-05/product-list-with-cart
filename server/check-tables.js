import 'dotenv/config';
import sequelize, { sequelizeAuth } from './config/database.js';

(async () => {
    try {
        await sequelize.authenticate();
        console.log('--- DB Principal (Productos) ---');
        console.log('Autenticación OK');
        const [tables1] = await sequelize.query(
            "select tablename from pg_tables where schemaname='public' order by tablename;"
        );
        console.log('Tablas en public:', tables1.map(t => t.tablename));

        await sequelizeAuth.authenticate();
        console.log('\n--- DB Autenticación (Usuarios) ---');
        console.log('Autenticación OK');
        const [tables2] = await sequelizeAuth.query(
            "select tablename from pg_tables where schemaname='public' order by tablename;"
        );
        console.log('Tablas en public:', tables2.map(t => t.tablename));

        process.exit(0);
    } catch (err) {
        console.error('Error en conexión / consulta:', err.message || err);
        process.exit(1);
    }
})();
