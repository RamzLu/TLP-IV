import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import '../config/env.js'; 
import { DatabaseConnection } from './DatabaseConnection.js';
import { Role } from '../models/Role.js';

const permisosAdmin = [
    'book:read',
    'book:create',
    'book:update',
    'book:change-status',
    'book:delete',
    'subscription:create',
    'subscription:delete',
    'notification:read',
    'user:read',
    'user:assign-role'
];

const permisosOperador = [
    'book:read',
    'book:create',
    'book:update',
    'book:change-status',
    'subscription:create',
    'subscription:delete',
    'notification:read'
];

const permisosUsuario = [
    'book:read',
    'subscription:create',
    'subscription:delete',
    'notification:read'
];  

async function runSeed() {
    try {
        console.log('Iniciando carga de datos con seed.js...');
        const db = DatabaseConnection.getInstance();
        await db.connect();
        await User.deleteMany({});
        await Role.deleteMany({});
        console.log('coleccion de usuarios limpiada.');

        const adminRole = await Role.create({ name: 'admin', permissions: permisosAdmin });
        const operadorRole = await Role.create({ name: 'operador', permissions: permisosOperador });
        const usuarioRole = await Role.create({ name: 'usuario', permissions: permisosUsuario });
        console.log('roles creados con sus permisos.');

        const saltRounds = 10;
        const hashed_password = await bcrypt.hash('tlp42026', saltRounds);

        const testUsers = [
            { email: 'admin@tp.com', password: hashed_password, role: adminRole._id },
            { email: 'operador@tp.com', password: hashed_password, role: operadorRole._id },
            { email: 'usuario@tp.com', password: hashed_password, role: usuarioRole._id }
        ];

        await User.insertMany(testUsers);
        console.log('Usuarios de prueba insertados con éxito:');
        console.log('- admin@tp.com (Rol: admin)');
        console.log('- operador@tp.com (Rol: operador)');
        console.log('- usuario@tp.com (Rol: usuario)');
        console.log('Contraseña para todos: tlp42026');

        process.exit(0); 
    } catch (error) {
        console.error('Error ejecutando el seed:', error);
        process.exit(1);
    }
}

runSeed();