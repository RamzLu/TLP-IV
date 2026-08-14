// * Ejercicio 3

// TODO: aprender getters/seters
//el getter (obtener/leer) te deja consultar un dato pero sin darte el control para que lo rompas
//el setter (establecer/modificar) cuando alguien quiere cambiar un dato el setter lo frena revisa que el valor nuevo tenga sentido y si esta todo bien recien ahi lo guarda

class Persona {
  private readonly dni: string;
  nombre: string;
  private _edad: number; //el guion bajo es una convencion comun para indicar q son variables que se gestionan mediante metodos de getters y setters (para validar datos de forma controlada)
  private _email: string;

  constructor(dni: string, nombre: string, edad: number, email: string) {
    this.dni = dni;
    this.nombre = nombre;
    this._edad = 0; // esto seria un relleno provisorio porque typescript es estricto te exige q las vatiables internas no arranquen de la nada entonces se le da un valor inicial de mentira y q despues se pasan a datos reales por los setters
    this._email = "";
    this.edad = edad; // por que no se guarda directamente en this._edad?
    //  porque al hacerlo con this.edad obliga a q el dato pase por el setter
    //  en el segundo 0, si la edad es negativa o el email es cualquiera el
    // sistema se frena
    this.email = email;
  }

  get edad(): number {
    //el get indica q es un getter y edad sera el nombre con el q se pide el dato
    return this._edad;
  }

  set edad(valor: number) {
    // el set indica un setter y cambia la edad por el numero nuevo
    if (valor < 0 || valor > 120) {
      throw new Error(`Edad inválida: ${valor}. Debe estar entre 0 y 120`);
    }
    this._edad = valor;
  }

  get email(): string {
    return this._email;
  }

  set email(valor: string) {
    if (!valor.includes("@")) {
      throw new Error(`Email inválido: "${valor}" debe contener "@"`);
    }
    this._email = valor;
  }

  get esMayorEdad(): boolean {
    return this._edad >= 18;
  }

  get DatosPublicos(): string {
    return `${this.nombre} (${this.esMayorEdad ? "mayor" : "menor"} de edad)`;
  }
}
const persona = new Persona("30111222", "Lu", 21, "lu@example.com");
console.log(persona.DatosPublicos);
console.log("¿Es mayor?", persona.esMayorEdad);

persona.edad = 17;
console.log("Después de cambiar edad a 17:", persona.DatosPublicos);
console.log("¿Es mayor?", persona.esMayorEdad);

try {
  persona.edad = 200;
} catch (error) {
  console.log("Error esperado:", (error as Error).message);
}

try {
  persona.email = "no-es-un-email";
} catch (error) {
  console.log("Error esperado:", (error as Error).message);
}
