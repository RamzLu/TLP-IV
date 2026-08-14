// * Ejercicio 3

// TODO: aprender Polimorfismo,
// El término polimorfismo tiene origen en las palabras poly (muchos) y
//  morfo (formas), y aplicado a la programación hace referencia a que los
// objetos pueden tomar diferentes formas, significa que objetos de diferentes
// clases pueden ser accedidos utilizando el mismo interfaz, mostrando
// un comportamiento distinto (tomando diferentes formas) según cómo sean
// accedidos

class Empleado {
  protected nombre: string;
  protected antiguedad: number;

  constructor(nombre: string, antiguedad: number) {
    this.nombre = nombre;
    this.antiguedad = antiguedad;
  }

  calcularSueldo(): number {
    return 0;
  }

  describir(): string {
    return `${this.nombre} (${this.antiguedad} años) — sueldo: $${this.calcularSueldo()}`;
  }
}

class EmpleadoFijo extends Empleado {
  sueldoBase: number;

  constructor(nombre: string, antiguedad: number, sueldoBase: number) {
    super(nombre, antiguedad);
    this.sueldoBase = sueldoBase;
  }

  calcularSueldo(): number {
    return this.sueldoBase + this.sueldoBase * 0.02 * this.antiguedad;
  }
}

class EmpleadoPorHoras extends Empleado {
  horasTrabajados: number;
  valorHora: number;

  constructor(
    nombre: string,
    antiguedad: number,
    horasTrabajadas: number,
    valorHora: number,
  ) {
    super(nombre, antiguedad);
    this.horasTrabajados = horasTrabajadas;
    this.valorHora = valorHora;
  }
  calcularSueldo(): number {
    return this.horasTrabajados * this.valorHora;
  }
}

class EmpleadoPorComision extends Empleado {
  ventasDelMEs: number;
  porcentajeComision: number;

  constructor(
    nombre: string,
    antiguedad: number,
    ventasDelMes: number,
    porcentajeComision: number,
  ) {
    super(nombre, antiguedad);
    this.ventasDelMEs = ventasDelMes;
    this.porcentajeComision = porcentajeComision;
  }

  calcularSueldo(): number {
    return this.ventasDelMEs * (this.porcentajeComision / 100);
  }
}

function calcularNomina(empleados: Empleado[]): number {
  // al contador le dan una lista de empleados y devuelve un numero
  let total = 0; // se inicializa en 0 antes de sumar todo
  for (const empleado of empleados) {
    //recorre todos los empleados
    total += empleado.calcularSueldo(); // aca sin descriminar como se calculan sus sueldos recibe el total de cada uno y lo suma
  }
  return total; //retora el total de la suma
} //esta funcion agarra una lista con tdos los trabajadores y consulta cuanto cobran y suman

// * PRUEBAS
const empleados: Empleado[] = [
  new EmpleadoFijo("Ana", 3, 5000000),
  new EmpleadoPorHoras("Bruno", 1, 160, 2500),
  new EmpleadoPorComision("Caro", 5, 1000000, 8),
];

for (const empleado of empleados) {
  console.log(empleado.describir());
}

console.log("nomina total", calcularNomina(empleados));
