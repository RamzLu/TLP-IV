import{ Request, Response } from 'express';

import { EmployeeService } from '../services/EmployeeService';
import { Employee } from '../models/Employee';

export class EmployeeController {

    private employeeService: EmployeeService

    constructor(){
        this.employeeService = new EmployeeService()
    }
     
    public createEmployee = async (req: Request, res: Response) => {
        try {
            const { name, position, baseSalary, yearsOfService } = req.body;
        
            if (!name || !position) {
            return res.status(400).json({ message: 'Nombre y puesto son obligatorios' });
            }
        
            if (typeof baseSalary !== 'number' || baseSalary <= 0) {
            return res.status(400).json({ message: 'El salario base debe ser mayor a 0' });
            }
        
            if (
            typeof yearsOfService !== 'number' ||
            yearsOfService < 0 ||
            !Number.isInteger(yearsOfService)
            ) {
            return res.status(400).json({ message: 'La antigüedad debe ser un entero mayor o igual a 0' });
            }

            const employee = await this.employeeService.createEmployee({
            name,
            position,
            baseSalary,
            yearsOfService
            });
        
            console.log(`Empleado creado: ${employee.name} - salario final: ${employee.finalSalary}`);
            return res.status(201).json(employee);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    public getEmployee = async (_req: Request, res: Response) => {
         try {
            const employees = await this.employeeService.getEmployees()
            return res.json(employees);            return res.json(employees);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

public getEmployeeId = async (req: Request, res: Response) => {
    try {
      const employee = await this.employeeService.getEmployeeById(String(req.params.id)); //se pone string porque req.params puede tener multiples string y en EmployeeService define q solo recibe uno, entonces usamos el casteo de tipos 

      if (!employee) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }

      return res.json(employee);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
    }
}