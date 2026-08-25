interface EquipoAdaptador {
  nombre: string;
  tipo: string;
  estado: string;
}

interface Inventario {
  agregarEquipo(nombre: string, tipo: string, estado: string): void;
  listarEquipos(): EquipoAdaptador[];
}

class InventarioViejo {
  private items: {
    itemNombre: string;
    tipoItem: string;
    estadoItem: string;
  }[] = [];
  public agregarItem(nombre: string, tipo: string, estado: string): void {
    this.items.push({ itemNombre: nombre, tipoItem: tipo, estadoItem: estado });
  }
  public obtenerItems(): {
    itemNombre: string;
    tipoItem: string;
    estadoItem: string;
  }[] {
    return this.items;
  }
}

class AdaptadorInventario implements Inventario {
  private inventarioViejo: InventarioViejo;

  constructor(inventarioViejo: InventarioViejo) {
    this.inventarioViejo = inventarioViejo;
  }
  public agregarEquipo(nombre: string, tipo: string, estado: string): void {
    this.inventarioViejo.agregarItem(nombre, tipo, estado);
  }
  public listarEquipos(): EquipoAdaptador[] {
    const itemsViejos = this.inventarioViejo.obtenerItems();

    return itemsViejos.map(
      (item): EquipoAdaptador => ({
        nombre: item.itemNombre,
        tipo: item.tipoItem,
        estado: item.estadoItem,
      }),
    );
  }
}
const inventarioViejo = new InventarioViejo();
const adaptador = new AdaptadorInventario(inventarioViejo);
adaptador.agregarEquipo("Servidor Dell", "Servidor", "disponible");
console.log(adaptador.listarEquipos());
// [{ nombre: "Servidor Dell", tipo: "Servidor", estado: "disponible" }]
