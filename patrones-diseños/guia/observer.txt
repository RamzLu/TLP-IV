interface Notificar {
  estreno(pelicula: string): string;
}

class Cine implements Notificar {
  constructor(private nombre: string) {}

  estreno(pelicula: string): string {
    return `El cine ${this.nombre} anuncia próximamente ${pelicula}`;
  }
}

class Distribuidor {
  private cines: Cine[] = [];

  public agregarTienda(cine: Cine): void {
    this.cines.push(cine);
  }

  public agregarPelicula(pelicula: string): void {
    console.log(`*El distribuidor actualizo el catalogo: ${pelicula}*`);
    this.notificarCines(pelicula);
  }

  private notificarCines(pelicula: string): void {
    for (const tienda of this.cines) {
      console.log(tienda.estreno(pelicula));
    }
  }
}

const distribuidor = new Distribuidor();
const tienda1 = new Cine("Avenida");
const tienda2 = new Cine("Italia");

distribuidor.agregarTienda(tienda1);
distribuidor.agregarTienda(tienda2);

distribuidor.agregarPelicula("Spider-Man: Across the Spider-Verse");
