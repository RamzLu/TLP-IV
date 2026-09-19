import { EmployeeModel } from "../models/Employee";
import { IEmployee } from "../interfaces/IEmployee";

export class EmployeeRepository {
    public async create(data: Partial<IEmployee>){
        return await EmployeeModel.create(data)
    }

    public async findAll(){
        return await EmployeeModel.find().sort({createdAt: -1})
    }

    public async findById(id: string){
        return await EmployeeModel.findById(id)
    }
}