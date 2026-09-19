import { EmployeeModel } from "../models/Employee";

export class EmployeeService {
    public async createEmployee(data: { name: string; position: string; baseSalary: number; yearsOfService: number }) {
        const bonus = data.baseSalary * 0.02 * data.yearsOfService;
        const finalSalary = data.baseSalary + bonus;
                    
        const employee = await EmployeeModel.create({
        name: data.name,
        position: data.position,
        baseSalary: data.position,
        yearsOfService: data.yearsOfService,
        finalSalary
        });
        
        return employee;
    }

    public async getEmployees(){
        return await EmployeeModel.find().sort({createdAt: -1})
    }

    public async getEmployeeById(id: string){
        return await EmployeeModel.findById(id);
    }
}