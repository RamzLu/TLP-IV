interface Equipo2 {
  datelles(): string;
}

class Notebook implements Equipo2 {
  constructor(
    private nombre: string,
    private ram: string,
    private procesador: string,
  ) {}

  public datelles(): string {
    return `Tipo: Notebook, nombre: ${this.nombre}, ram: ${this.ram}, procesador ${this.procesador}`;
  }
}
