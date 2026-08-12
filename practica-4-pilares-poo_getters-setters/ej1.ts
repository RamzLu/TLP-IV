// * Ejercicio 1:
// TODO: Modelar una clase de producto

class Producto {
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;

  constructor(
    nombre: string,
    precio: number,
    categoria: string,
    stock: number,
    // * el constructor es un metodo especial que esta dentro de una clase y se ejecuta autom. al crear un obj nuevo,
    // * lo que hace es dar el valor inicial a las prop del obj y
    // * prepara lo q la clase necesite para funcionar
    // * * Solo puede existir un constructor por clase y si no existe ts crea uno vacio
  ) {
    this.precio = precio;
    this.nombre = nombre; // * "this" sirve para hacer referencia al objeeto actual que se esta ejecutando o
    this.categoria = categoria; // * llamando en una funcion y permite acceder a las props y otros metodos de ese obj
    this.stock = stock;
  }

  describir(): string {
    return `${this.nombre} 
    (${this.categoria}): 
    $${this.precio} 
     - ${this.stock} unidades`; // * Ejemplo : Remera (Ropa): $2500 - 8 unidades
  } // planilla de ficha para los productos

  hayStock(cantidad: number): boolean {
    return cantidad <= this.stock;
  } // * Devuelve true si hay stock suficiente para la cantidad solicitada, false en caso contrario

  venderUnidades(cantidad: number): void {
    // *void es un tipo de retorno que indica que la funcion hace la tarea pero no t devuelve nada nuevo (ni texto ni numero ni bool)
    if (!this.hayStock(cantidad)) {
      // * esta parte verifica si hay stock suficiente para lo q me piden y si no hay lanza error con un msj
      throw new Error(
        `No hay stock suficiente de ${this.nombre}, pediste ${cantidad}, hay ${this.stock}`,
      );
    }
    this.stock -= cantidad; // *si paso la verificacion de stock le resta la cantidad vendida al stock del producto
  }
  // ! Decidi lanzar un error en vez de un console porque es más profesional y a parte vender sin stock es un error de negocio
  // ! y ademas el console no me deja controlar el flujo y el error me deja usar el try catch

  aplicarDescuento(porcentaje: number): number {
    // * aca le pasamos el porcentaje q se quiera rebajar por ej 20 o 30
    return this.precio * (1 - porcentaje / 100); // el % / 100 convierte el 20 en 0.20 y 1 - 0.20 da 0.80
  } // this.precio * 0.80 seria que si el descuento es 20% tenes que pagar el 80% en total
  //si una campera cuesta 1000 y le aplicas un 20% haciendo la cuenta te da 1000*0.80= 800
  //! esta funcion solo calcula la oferta pero no cambia el precio original
}

// * PRUEBAS

const teclado = new Producto("Teclado", 10000, "electronica", 5);

console.log(teclado.describir());
console.log("Hay stock para 3?", teclado.hayStock(3));
console.log("Precio con 40% off", teclado.aplicarDescuento(40));

teclado.venderUnidades(2);

console.log("despues de vender", teclado.describir());

try {
  teclado.venderUnidades(100);
} catch (err) {
  console.log((err as Error).message);
}
