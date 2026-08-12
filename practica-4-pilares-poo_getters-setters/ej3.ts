// * Ejercicio 3

// TODO: aprender herencia, q es un sistema que permite a una clase nueva copiar los datos y las funciones de otra clase ya existente

class Empleado {
  protected nombre: string;
  // * protected (en vez de private) porque las subclases necesitan pdoer leer esos datos
  // * directamente via "this.name/antiguedad" y si fueran private las clases hija no podrian acceder
  protected antiguedad: number;

  constructor(nombre: string, antiguedad: number) {
    this.nombre = nombre;
    this.antiguedad = antiguedad;
  }

  calcularSueldo(): number {
    return 0;
  }
  // ! un empleado generico no tiene sueldo fijo pq no se sabe que puesto ocupa, un vendedor cobra comisiones, un admin cobre por mes y un pasante por hora
  // ! entonces este molde pone un 0 q es provisional

  describir(): string {
    return `${this.nombre} (${this.antiguedad} años) - sueldo: $${this.calcularSueldo()} )`;
  } // esta funcion solo llama a calcularSueldo() y recibe un monto final, no necesita tener una planilla para cada puesto de trabajo
}

class EmpleadoFijo extends Empleado {
  // * extends significa que este puesto es un hijo del model de Empleado
  // * Hereda automaticamente todo lo que ya se armo antes y sabe tener nombre, antiguedad y la funcion de describir() sin nececidad de volver a escribirlo
  sueldoBase: number; // ! Este dato es exclusivo de este tipo de trabajador, por ejemplo $500000

  constructor(nombre: string, antiguedad: number, sueldoBase: number) {
    super(nombre, antiguedad); // * la palabra super es un llamado al molde del padre (Empleado)
    // * hace q el modelo padre se encargue de la tarea q domina (registrar el nombre y la antiguedad)

    this.sueldoBase = sueldoBase; // * una vez q la clase padre termino con los datos generales, el hijo se encarga de guardar su dato propio (el sueldo mensual)
  }

  calcularSueldo(): number {
    const bonoPorAntiguedad = this.sueldoBase * 0.02 * this.antiguedad; // calcula el sueldo en base a la fidelidad, el 0.02 representa el 2% y eso se multiplica por la cantidad de años que tiene dentro de la empresa por el sueldo base
    return this.sueldoBase + bonoPorAntiguedad; // hace la suma final sueldo final = sueldo basico + extra por años trabajados
  }
}

// * PRUEBAS

const generico = new Empleado("Base", 1);
console.log(generico.describir()); //Base (1 años) - sueldo: $0 )

const fijo = new EmpleadoFijo("Ana", 3, 500000);
console.log(fijo.describir()); // Ana (3 años) - sueldo: $530000 )
