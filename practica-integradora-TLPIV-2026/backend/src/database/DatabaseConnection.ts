import mongoose from "mongoose";

export class DatabaseConnection {
    //creamos una espacio privado que sera nuestra unica conexion a la base de datos 
    private static instance: DatabaseConnection

    //aca hacemos el constructor privado para evitar que se instancie con new desde afuera
    private constructor(){}

    //metodo para obtener esa intancia de la bd
    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance){ //si la propiedad de instancia esta nulo
            DatabaseConnection.instance = new DatabaseConnection() // se crea una nueva instancia de DatabaseConnection
        }

        return DatabaseConnection.instance; //sino usa la que ya esta hecha
    }
    

    public async connect (): Promise<void> {
        try {
            const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

            const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`
            await mongoose.connect(uri);
            console.log('Conexión a MongoDB establecida con éxito.')
        } catch (error) {
            console.error('Error al conectar con MongoDB:', error);
            process.exit(1);
        }
    }
}