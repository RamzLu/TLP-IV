import mongoose from "mongoose";

export interface IConfiguration{
    mongoUrl: string;
    dbName: string;
}

export class DB {
    private mongOUri: string;
    private dbName: string;

    constructor({mongoUrl, dbName}: IConfiguration){
        this.mongOUri = mongoUrl;
        this.dbName = dbName;
    }

    public async connect() {
        try {
            await mongoose.connect(this.mongOUri, {
                dbName: this.dbName
            })
            console.log('Mongodb conectado')
        } catch (error) {
            console.error('error al conectar la bd', error)
            process.exit(1)
            
        }
    }
}