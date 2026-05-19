// Script para listar tablas en la base de datos remota configurada por Sequelize
import 'dotenv/config';
import sequelize from './config/database.js';

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Autenticación OK');
        console.log('Conectado a:', {
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            user: process.env.PGUSER,
            ssl: process.env.PGSSLMODE,
        });
        const [tables] = await sequelize.query(
            "select tablename from pg_tables where schemaname='public' order by tablename;"
        );
        console.log('Tablas en public:', tables.map(t => t.tablename));
        process.exit(0);
    } catch (err) {
        console.error('Error en conexión / consulta:', err.message || err);
        process.exit(1);
    }
})();

