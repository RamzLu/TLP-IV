interface EquipoB {
  detalles(): string;
}

class EquipoNotebook implements EquipoB {
  private nombre: string;
  private ram: string;
  private procesador: string;
  constructor(nombre: string, ram: string, procesador: string) {
    this.nombre = nombre;
    this.ram = ram;
    this.procesador = procesador;
  }

  public detalles(): string {
    return `Tipo: Notebook, Nombre: ${this.nombre}, RAM: ${this.ram}, Procesador: ${this.procesador}`;
  }
}

class EquipoDesktop implements EquipoB {
  private nombre: string;
  private ram: string;
  private procesador: string;
  constructor(nombre: string, ram: string, procesador: string) {
    this.nombre = nombre;
    this.ram = ram;
    this.procesador = procesador;
  }

  public detalles(): string {
    return `Tipo: Desktop, Nombre: ${this.nombre}, RAM: ${this.ram}, Procesador: ${this.procesador}`;
  }
}

class EquipoServidor implements EquipoB {
  private nombre: string;
  private ram: string;
  private procesador: string;
  constructor(nombre: string, ram: string, procesador: string) {
    this.nombre = nombre;
    this.ram = ram;
    this.procesador = procesador;
  }

  public detalles(): string {
    return `Tipo: Servidor, Nombre: ${this.nombre}, RAM: ${this.ram}, Procesador: ${this.procesador}`;
  }
}

class EquipoFactory {
  public crearEquipo(
    tipo: string,
    nombre: string,
    ram: string,
    procesador: string,
  ): EquipoB {
    switch (tipo) {
      case "Notebook":
        return new EquipoNotebook(nombre, ram, procesador);
      case "Desktop":
        return new EquipoDesktop(nombre, ram, procesador);
      case "Servidor":
        return new EquipoDesktop(nombre, ram, procesador);
      default:
        throw new Error(`Tipo de equipo no valido`);
    }
  }
}

const factory = new EquipoFactory();
const Notebook = factory.crearEquipo("Notebook", "Dell XPS", "16GB", "i7");
console.log(Notebook.detalles());
