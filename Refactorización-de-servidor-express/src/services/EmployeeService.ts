import { EmployeeModel } from "../models/Employee";
import { EmployeeRepository } from "../repositories/EmployeeRepository";
export class EmployeeService {
    private employeeRepository: EmployeeRepository;
    
    constructor(){
        this.employeeRepository = new EmployeeRepository()
    }
    
    public async createEmployee(data: { name: string; position: string; baseSalary: number; yearsOfService: number }) {
        const bonus = data.baseSalary * 0.02 * data.yearsOfService;
        const finalSalary = data.baseSalary + bonus;
                    

        const employee = await this.employeeRepository.create({
        name: data.name,
        position: data.position,
        baseSalary: data.baseSalary,
        yearsOfService: data.yearsOfService,
        finalSalary
        });
        
        return employee;
    }

    public async getEmployees(){
        return await this.employeeRepository.findAll()
    }

    public async getEmployeeById(id: string){
        return await this.employeeRepository.findById(id);
    }
}