interface Equipo {
  nombre: string;
  tipo: string;
  estado: "disponible" | "en reparacion" | string;
}

class Inventario {
  private static instancia: Inventario;
  private equipos: Equipo[] = [];
  private constructor() {}

  public static obtenerInstancia(): Inventario {
    if (!Inventario.instancia) {
      Inventario.instancia = new Inventario();
    }
    return Inventario.instancia;
  }
  public agregarEquipo(nombre: string, tipo: string, estado: string): void {
    const nuevoEquipo: Equipo = { nombre, tipo, estado };
    this.equipos.push(nuevoEquipo);
  }

  public listarEquipos(): Equipo[] {
    return this.equipos;
  }
}

const inventario1 = Inventario.obtenerInstancia();
const inventario2 = Inventario.obtenerInstancia();

inventario1.agregarEquipo("Notebook HP", "Portatil", "disponible");
console.log(inventario1.listarEquipos());
