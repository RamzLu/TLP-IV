# Práctica — Los 4 pilares de la POO + getters y setters

## Configuración inicial

Antes de resolver los ejercicios, armá un proyecto de TypeScript desde cero
(no reutilices uno viejo): inicializá un proyecto de Node, instalá
TypeScript como dependencia de desarrollo, y configurá y creá el
`tsconfig.json`.

Después, creá un archivo por ejercicio: `ej1.ts`, `ej2.ts`, `ej3.ts`,
`ej4.ts`, `ej5.ts`.

En `package.json`, agregá un script por ejercicio dentro de `"scripts"`:

```json
{
  "scripts": {
    "ej1": "node ej1.ts",
    "ej2": "node ej2.ts",
    "ej3": "node ej3.ts",
    "ej4": "node ej4.ts",
    "ej5": "node ej5.ts"
  }
}
```

Al final de cada archivo agregá un bloque de prueba que cree instancias y las use con `console.log`.

## Ejercicio 1 — Abstracción

Modelá una clase `Producto` para un sistema de ventas. Pensá qué datos y
comportamiento importan **para vender**, y qué datos sobran aunque existan
en la realidad (por ejemplo, el color exacto del embalaje).

- Atributos: `nombre`, `precio`, `categoria` (ej: `"electrónica"`,
  `"almacén"`), `stock` (cantidad disponible).
- Método `describir()` que devuelva un string tipo
  `"Teclado ($electrónica): $10000 — 5 unidades"`.
- Método `hayStock(cantidad: number): boolean` que diga si se puede vender
  esa cantidad sin quedar en negativo.
- Método `venderUnidades(cantidad: number)`: si `hayStock(cantidad)` es
  `true`, descuenta del `stock`; si no, no vende nada (decidí vos si avisa
  con un mensaje o lanza un `Error` — cualquiera de las dos es válida,
  pero justificalo).
- Método `aplicarDescuento(porcentaje: number): number` que devuelva el
  precio final sin modificar el `precio` original del producto (el
  descuento es una simulación, no un cambio permanente).

## Ejercicio 2 — Encapsulamiento

Modelá una clase `CuentaBancaria`:

- `titular` (nombre del dueño de la cuenta), fijo desde que se crea.
- `saldo` como `private`, arranca en el monto inicial que se le pase por
  constructor (no siempre 0).
- Un historial de movimientos **privado** (arreglo interno) que registre
  cada depósito y retiro (podés guardar strings tipo `"depósito: +2000"` o
  un objeto con tipo y monto — elegí vos la forma, pero tiene que quedar
  fuera del alcance de quien usa la clase).
- `depositar(monto)`: rechaza (lanzá un `Error`) montos menores o iguales a
  0 además de sumar al saldo.
- `retirar(monto)`: rechaza si el monto pedido supera el saldo disponible,
  y también si el monto es menor o igual a 0.
- `consultarSaldo(): number` que devuelva el saldo actual.
- `obtenerHistorial(): string[]` (o el tipo que hayas elegido) que devuelva
  el historial — pero sin exponer el arreglo interno real (si quien llama
  modifica lo que le devolviste, el historial de la cuenta no se tiene que
  alterar).

Nadie de afuera puede tocar `saldo` ni el historial directamente, solo a
través de esos métodos.

## Ejercicio 3 — Herencia

Modelá:

- Clase base `Empleado` con `nombre` (`protected`), `antiguedad` en años
  (`protected`, cantidad de años trabajados) y `calcularSueldo()` que
  devuelve `0` (la clase base no sabe calcular sueldos reales, cada
  subclase decide cómo).
- Un método `describir(): string` en `Empleado` que devuelva algo como
  `"Juan (3 años) — sueldo: $..."`, usando `this.calcularSueldo()` — este
  método **no se reescribe** en las subclases, ya funciona para cualquier
  tipo de empleado gracias al polimorfismo de `calcularSueldo()`.
- `EmpleadoFijo extends Empleado`, agrega `sueldoBase` y sobreescribe
  `calcularSueldo()`: devuelve `sueldoBase`, más un **bono por
  antigüedad** de un 2% del `sueldoBase` por cada año trabajado.

## Ejercicio 4 — Polimorfismo

Sobre la jerarquía del ejercicio 3, agregá:

- `EmpleadoPorHoras extends Empleado` con `horasTrabajadas` y `valorHora`,
  y su propia versión de `calcularSueldo()` (horas × valor hora, sin bono
  por antigüedad).
- `EmpleadoPorComision extends Empleado` con `ventasDelMes` y
  `porcentajeComision`, y su propia versión de `calcularSueldo()` (ventas ×
  porcentaje).

Armá un arreglo `Empleado[]` con varias instancias mezclando las tres
subclases (`EmpleadoFijo`, `EmpleadoPorHoras`, `EmpleadoPorComision`) y
recorrelo con un `for`, llamando `calcularSueldo()` en cada una sin
preguntar de qué tipo es cada empleado.

Sumá también una función (no un método de clase) `calcularNomina(empleados:
Empleado[]): number` que devuelva el total a pagar sumando el
`calcularSueldo()` de todos.

## Ejercicio 5 — Getters y setters

Modelá una clase `Persona`:

- `dni` como `private readonly`, se recibe por constructor.
- `nombre` público, sin restricciones.
- `edad` como atributo privado, con un `get edad()` que la devuelva y un
  `set edad(valor)` que **rechace** valores negativos o mayores a 120
  (lanzando un `Error` en ambos casos).
- `email` como atributo privado, con un `set email(valor)` que rechace
  (lanzando un `Error`) valores que no contengan `"@"`, y un `get email()`
  que lo devuelva.
- Un `get` de solo lectura `esMayorDeEdad` que devuelva `true` si `edad >=
18` (no guarda ese valor, lo calcula al leerlo).
- Un `get` de solo lectura `datosPublicos` que devuelva un string con
  `nombre` y `esMayorDeEdad`, pero **sin** `dni` ni `email` (son datos
  sensibles que no se exponen juntos con el resto).