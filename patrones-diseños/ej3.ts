interface Observador {
  actualizar(mensaje: string): void;
}

class Soporte implements Observador {
  public actualizar(mensaje: string): void {
    console.log(`Soporte notificado: ${mensaje}`);
  }
}
