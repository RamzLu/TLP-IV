interface Producto {
  consultarPrecio(): string;
}

class ProductoFisico implements Producto {
  constructor(private costo: number) {}

  consultarPrecio(): string {
    return `El precio en el local es $${this.costo}`;
  }
}

class ProductoDigital implements Producto {
  constructor(private costo: number) {}

  consultarPrecio(): string {
    return `El precio con envio es $${this.costo + 20}`;
  }
}

class Tienda {
  public cargarProducto(tipo: "Fisico" | "Digital", costo: number): Producto {
    switch (tipo) {
      case "Fisico":
        return new ProductoFisico(costo);
      case "Digital":
        return new ProductoDigital(costo);
      default:
        throw new Error("Tipo de producto no válido");
    }
  }
}

const tienda = new Tienda();
const productoFisico = tienda.cargarProducto("Fisico", 100);
const productoDigital = tienda.cargarProducto("Digital", 100);
console.log(productoFisico.consultarPrecio());
console.log(productoDigital.consultarPrecio());

try {
  const productoInvalido = tienda.cargarProducto("Invalido" as any, 100);
} catch (error) {
  console.error((error as Error).message);
}
