// * Ejercicio 2
// TODO: practicar el encapsulamiento

class CuentaBancaria {
  titular: string;
  private saldo: number; // cantidad de plata que hay dentro
  // la palabra private es como ponerle un candado de seguridad, es decir nadie de afuera puede acceder
  // y cambiar el numero directamente y solo las funciones autorizadas del banco
  private historial: string[]; //"libreta" con lista ([]) de movimientos (depositos, retiros etc)

  constructor(titular: string, saldoInicial: number = 0) {
    //aqui pide el nombre del titular y con cuanta plata abris la cueenta, si no pone nada es 0
    this.titular = titular;
    this.saldo = saldoInicial;
    this.historial = [];
  }

  depositar(monto: number): void {
    if (monto <= 0) {
      throw new Error("El monto a depositar dee ser mayor a 0");
    }
    this.saldo += monto; // es el saldo nuevo = lo q ya tenia + lo q se ingreso
    this.historial.push(`deposito: +${monto}`); //agrega el monto al deposito
  }

  retirar(monto: number): void {
    if (monto <= 0) {
      throw new Error("El monto a retirar debe ser mayor a 0");
    }
    if (monto > this.saldo) {
      throw new Error(
        `Saldo insuficiente: intentaste retirar ${monto}, hay ${this.saldo}`,
      );
    }
    this.saldo -= monto;
    this.historial.push(`retiro: -${monto}`);
  }
  consultarSaldo(): Number {
    return this.saldo;
  }

  obtenerHistorial(): string[] {
    return [...this.historial];
    //aca devolvemos una copa del arreglo y no la referencia real
    // ! si devolvieramos la real quien recibe el arreglo podria hacer un
    // ! push y modificaria el estado interno sin pasar por depositar o retirar
  }
}
// * PRUEBAS

const cuenta = new CuentaBancaria("Lu", 5000);
cuenta.depositar(2000);
cuenta.retirar(1000);
console.log("Saldo actual:", cuenta.consultarSaldo());
console.log("Historial:", cuenta.obtenerHistorial());

// probamos que el historial q se devuelve es una copia y no se rompa el interno

const copia = cuenta.obtenerHistorial();

copia.push("+99999999999");
console.log("Historial real:", cuenta.obtenerHistorial());

try {
  cuenta.retirar(9999999999);
} catch (error) {
  console.log((error as Error).message);
}
