interface Observador {
  actualizar(mensaje: string): void;
}

class Soporte implements Observador {
  public actualizar(mensaje: string): void {
    console.log(`Soporte notificado: ${mensaje}`);
  }
}

class Equipo {
  private nombre: string;
  private tipo: string;
  private estado: string;
  private observadores: Observador[] = [];

  constructor(nombre: string, tipo: string, estado: string) {
    this.nombre = nombre;
    this.tipo = tipo;
    this.estado = estado;
  }

  public agregarObservador(observador: Observador): void {
    this.observadores.push(observador);
  }

  private notificarObservadores(): void {
    const mensaje = `${this.nombre} ha cambiado su estado a ${this.estado}`;
    for (const observador of this.observadores) {
      observador.actualizar(mensaje);
    }
  }

  public cambiarEstado(nuevoEstado: string): void {
    this.estado = nuevoEstado;
    this.notificarObservadores();
  }

  public getEstado(): string {
    return this.estado;
  }
}

const soporte = new Soporte();
const equipo = new Equipo("Notebook HP", "Portátil", "disponible");
equipo.agregarObservador(soporte);
equipo.cambiarEstado("en reparación");
