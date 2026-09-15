import { Router } from "express";
import { EmployeeController } from "../controllers/EmployeeController";

export class EmployeeRoutes{
    public router: Router;

    private employeeController: EmployeeController

    constructor(){
        this.router = Router()
        this.employeeController = new EmployeeController()
        this.initializeRoutes() 
    }

    private initializeRoutes(){ //es private porque solo lo usa la clase por dentro (en el constructor) 
        this.router.post('/employees', this.employeeController.createEmployee)
        this.router.get('/employees', this.employeeController.getEmployee)
        this.router.get('/employees/:id', this.employeeController.getEmployeeId)
    }
}