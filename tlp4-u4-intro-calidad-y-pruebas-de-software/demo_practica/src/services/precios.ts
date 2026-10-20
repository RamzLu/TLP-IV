/** Calcula el precio luego de aplicar un porcentaje de descuento. */
export function calcularPrecioFinal(precio: number, descuento: number): number {
  if (!Number.isFinite(descuento) || descuento < 0 || descuento > 100) {
    throw new RangeError("El descuento no puede ser negativo ni mayor a 100");
  } //RangeError es un tipo de error que ya viene incorporado en el lenguaje y se usa específicamente
  // cuando un número está fuera del rango de valores permitidos

  if(!Number.isFinite(precio) || precio < 0){
    throw new RangeError("El precio debe ser un numero finito y no puede ser negativo");
  }
  return precio - (precio * descuento) / 100;
}
