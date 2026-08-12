# Guía — Instalación de TypeScript y Programación Orientada a Objetos

## Instalación y configuración de TypeScript

### Paso 1 — Crear el `package.json`

Parado en la carpeta raíz del proyecto:

```bash
npm init -y
```

El `package.json` es la "cédula de identidad" del proyecto: nombre, versión,
dependencias y scripts. El flag `-y` acepta todos los valores por defecto. Se
genera algo así:

```json
{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {},
  "type": "commonjs"
}
```

Cambiá a mano una sola cosa: `"type": "commonjs"` → `"type": "module"`. Eso
le dice a Node que use la sintaxis moderna de módulos (`import`/`export`) en
lugar de la vieja (`require`).

### Paso 2 — Instalar TypeScript

```bash
npm i -D typescript
```

`i` = install. `-D` = dependencia **de desarrollo**: TypeScript es una
herramienta que se usa mientras se programa (verificar tipos), no código que
el programa necesite para funcionar en producción. Esto crea la carpeta
`node_modules/` (las dependencias descargadas — nunca se toca a mano ni se
sube a git) y el `package-lock.json` (versiones exactas instaladas).

**Instalación local vs. global**

La instalación de arriba (`npm i -D typescript`) es **local**: TypeScript
queda guardado dentro de `node_modules/` de ese proyecto puntual, y solo se
puede correr con `npx tsc` (o desde un script del `package.json`). Es la
forma recomendada: cada proyecto fija su propia versión de TypeScript, sin
depender de lo que haya instalado en la máquina.

También existe la instalación **global**, disponible en cualquier carpeta
sin pasar por `npx`:

```bash
npm i -g typescript
```

Con esto el comando `tsc` queda disponible directo en la terminal, en
cualquier proyecto:

```bash
tsc --version
tsc --init
```

La desventaja: todos los proyectos de la máquina comparten esa misma
versión global de TypeScript, así que si un proyecto necesita una versión
distinta hay conflicto. Para los ejercicios de la materia alcanza con la
instalación local (`npx tsc`); la global sirve más como herramienta de uso
personal, para tipear rápido `tsc` en cualquier lado sin `npx`.

### Paso 3 — Crear el `tsconfig.json`

Es la configuración del verificador de tipos: qué tan estricto es y qué
sintaxis permite. Hay dos formas de crearlo:

**Opción A — generarlo con el propio TypeScript**

```bash
npx tsc --init
```

Esto crea un `tsconfig.json` con **todas** las opciones disponibles, la
mayoría comentadas (`// "opcion": valor`) con una breve descripción de qué
hace cada una. Sirve para explorar qué existe, pero el archivo generado no
viene listo para trabajar: hay que descomentar y ajustar las opciones que
importan (ver tabla abajo), y lo ideal es borrar el resto para no tener un
archivo de 100 líneas con ruido.

**Opción B — escribirlo a mano**

Más rápido para un proyecto simple como los de la materia: crear
`tsconfig.json` en la raíz directamente con el contenido final, sin pasar
por el archivo gigante comentado.

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "strict": true,
    "noEmit": true,
    "erasableSyntaxOnly": true,
    "allowImportingTsExtensions": true,
    "skipLibCheck": true
  }
}
```

Cualquiera de las dos formas termina en el mismo lugar: un `tsconfig.json`
con estas opciones activas. Son las que hacen falta, ni una más:

| Opción                                   | Qué hace                                                                                                                                                                                                                                                 |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `strict: true`                           | Activa todos los chequeos estrictos. Sin esto, TS deja pasar `null`/`undefined` sin avisar y pierde la mitad del valor. **La más importante de todas** — en el archivo generado por `--init` viene comentada, hay que descomentarla.                     |
| `noEmit: true`                           | `tsc` solo **verifica**, no genera archivos `.js`. No hacen falta porque Node ejecuta el `.ts` directo.                                                                                                                                                  |
| `target` / `module` / `moduleResolution` | Qué versión de JavaScript y qué sistema de módulos asume. `es2022` + `nodenext` = Node moderno. En el archivo generado, `target` suele venir en una versión más vieja (`es2016` o similar) — conviene subirla.                                           |
| `erasableSyntaxOnly`                     | Prohíbe la sintaxis de TS que Node no puede ejecutar directo (`enum`, parameter properties). Así `tsc` limpio garantiza que `node archivo.ts` funciona. Es una opción nueva: puede no aparecer en versiones viejas de TypeScript generadas por `--init`. |
| `allowImportingTsExtensions`             | Permite importar archivos escribiendo la extensión `.ts` en el `import` (necesario porque acá no se compila a `.js`).                                                                                                                                    |
| `skipLibCheck`                           | No verifica los tipos de las librerías de `node_modules` (más rápido, y esos errores no son propios).                                                                                                                                                    |

El resto de las opciones que trae `--init` (hay decenas: `outDir`,
`declaration`, `sourceMap`, opciones de JSX, etc.) son para casos que no
aplican a este curso — compilar a `.js` para producción, generar tipos para
publicar una librería, React, etc. Dejarlas comentadas o borrarlas.

### Verificar que quedó bien

```bash
node --version   # tiene que ser 23.6 o superior
npx tsc          # sin archivos .ts todavía da "No inputs were found" — es normal
```

### Ejecutar TypeScript

Node moderno (23.6+) ejecuta archivos `.ts` directamente, sin compilar:

```bash
node archivo.ts
```

`node archivo.ts` **ejecuta pero NO verifica tipos** (Node solo "borra" las
anotaciones). Los errores de tipos se ven de dos formas:

- **VS Code** los subraya en rojo mientras se escribe (gratis, automático).
- **`npx tsc`** los lista todos por consola, revisando todo el proyecto sin
  ejecutar nada.

Regla de trabajo: si `npx tsc` no está limpio, el código no está terminado.

Limitación de Node al ejecutar TS: solo soporta sintaxis "borrable". No usar
`enum` ni _parameter properties_ (`constructor(private x: string)`) — con
`erasableSyntaxOnly` activo, `tsc` los marca como error. Declarar las
propiedades explícitamente es además más claro para aprender.

### Tipos básicos

```ts
let titulo: string = "Clean Code";
let paginas: number = 464;
let leido: boolean = false;

// Inferencia: si se asigna al declarar, TS deduce el tipo solo.
let autor = "Robert Martin"; // TS ya sabe que es string
autor = 42; // ERROR: Type 'number' is not assignable to type 'string'

// Unión de tipos: "puede ser esto O esto"
let estado: "disponible" | "prestado" = "disponible";

// Tipo de retorno de una función (después del paréntesis)
function describir(nombre: string, precio: number): string {
  return `${nombre}: $${precio}`;
}

// Función que no devuelve nada
function saludar(nombre: string): void {
  console.log(`Hola, ${nombre}`);
}
```

### Arreglos

```ts
// Tipo: TIPO[] — arreglo donde todos los elementos son de ese tipo
const numeros: number[] = [1, 2, 3];
const nombres: string[] = ["Ana", "Luis"];

nombres.push("Carla"); // ok
nombres.push(42); // ERROR: number no es string

// Métodos útiles (devuelven arreglos/valores nuevos, no modifican el original)
const pares: number[] = numeros.filter((n) => n % 2 === 0);
const dobles: number[] = numeros.map((n) => n * 2);
const total: number = numeros.reduce((suma, n) => suma + n, 0);

// Arreglo que no se puede modificar (ni push, ni asignar por índice)
const diasSemana: readonly string[] = ["lun", "mar", "mié"];
diasSemana.push("jue"); // ERROR: Property 'push' does not exist on type
// 'readonly string[]'
```

---

## Programación Orientada a Objetos

### Introducción

**¿Qué problema resuelve?**

Antes de POO, el estilo dominante era la programación estructurada: funciones
que operan sobre datos que viajan por todos lados como parámetros. El
problema aparece cuando el sistema crece: los mismos datos son tocados por
decenas de funciones distintas, y si cambia la forma de esos datos, hay que
salir a cazar cada función que los usa. No hay un lugar único responsable de
mantener esos datos coherentes.

POO propone otra unidad de organización: en vez de separar "datos" por un
lado y "funciones" por otro, se agrupan en una misma entidad que sabe cómo
cuidarse a sí misma. Esa entidad es el **objeto**.

**Vocabulario base**

- **Clase**: el molde/plantilla. Define qué atributos y qué comportamiento va
  a tener cualquier cosa creada a partir de ella. Es una idea, no existe en
  memoria como "una cosa usable" todavía.
- **Objeto / instancia**: una cosa concreta creada a partir de la clase, con
  su **propio estado independiente** del de otras instancias de la misma
  clase.
- **Atributo**: un dato que el objeto guarda (estado). Ej: `nombre`, `edad`.
- **Método**: una función que pertenece al objeto y que normalmente opera
  sobre su propio estado. Ej: `ladrar()`.
- **Mensaje**: cuando un objeto le "pide" algo a otro llamando a uno de sus
  métodos. La idea histórica de POO (Alan Kay, Smalltalk) es literalmente
  esa: objetos que se mandan mensajes entre sí, cada uno responsable de
  decidir cómo responder.

**Instanciar**

"Instancia" es el objeto concreto que existe en memoria en tiempo de
ejecución, resultado de **instanciar** una clase — es decir, de invocar su
constructor (`new NombreClase(...)`). La clase es la definición; la instancia
es la materialización real y utilizable de esa definición.

- La **clase** existe en tiempo de definición — es información sobre la
  forma que van a tener los objetos, no un objeto en sí.
- La **instancia** existe en tiempo de ejecución, ocupa memoria propia, y
  tiene valores concretos en sus atributos.
- Cada `new` produce una instancia distinta con su propio estado, aunque los
  métodos no se duplican por instancia — todas las instancias de una misma
  clase comparten la misma implementación de sus métodos. Lo que varía entre
  instancias es el estado (atributos), no el comportamiento (métodos).

**Analogía**: la clase es el plano de una casa. Instanciar es construir una
casa real a partir de ese plano. Se pueden construir 10 casas (10 instancias)
con el mismo plano — todas con la misma distribución de ambientes (mismos
métodos) — pero cada una tiene su propia dirección y sus propios muebles
adentro (su propio estado).

**Los 4 pilares**

1. **Abstracción**: modelar solo lo que le importa al problema, ignorar el
   resto.
2. **Encapsulamiento**: el objeto protege su propio estado. Nadie de afuera
   lo modifica directamente sin pasar por sus métodos.
3. **Herencia**: una clase puede reutilizar y extender el comportamiento de
   otra.
4. **Polimorfismo**: distintos objetos pueden responder al mismo mensaje de
   formas distintas, sin que quien lo llama necesite saber con cuál está
   hablando exactamente.

### Clases, objetos y métodos

**Constructor**

El constructor es un método especial que se ejecuta automáticamente cuando
se hace `new NombreClase(...)`. Su trabajo es dejar el objeto en un estado
inicial válido — inicializar los atributos con los valores que se le pasan.

```ts
class Libro {
  titulo: string;
  autor: string;

  constructor(titulo: string, autor: string) {
    this.titulo = titulo;
    this.autor = autor;
  }
}
```

Si no se define un constructor, la clase usa uno vacío implícito. Si la
clase necesita datos para tener sentido (un `Libro` sin título no tiene
sentido), el constructor debería exigirlos como parámetros — así es
imposible crear una instancia inválida.

**`this`**

Dentro de un método, `this` referencia **a la instancia concreta** sobre la
que se invocó el método, no a la clase en general.

```ts
class Libro {
  titulo: string;
  leido: boolean;

  constructor(titulo: string) {
    this.titulo = titulo;
    this.leido = false;
  }

  marcarComoLeido(): void {
    this.leido = true;
  }
}

const libro1 = new Libro("1984");
const libro2 = new Libro("Dune");
libro1.marcarComoLeido();
// libro1.leido es true, libro2.leido sigue en false — this apunta a
// un objeto distinto en cada llamada.
```

**Atributos de instancia vs. atributos de clase (`static`)**

- **Atributo de instancia**: pertenece a cada objeto por separado
  (`this.titulo`).
- **Atributo de clase (`static`)**: pertenece a la clase misma, no a cada
  instancia — todas las instancias lo comparten. Se accede como
  `Libro.contador`, no `instancia.contador`.

```ts
class Libro {
  static totalLibros = 0;

  titulo: string;

  constructor(titulo: string) {
    this.titulo = titulo;
    Libro.totalLibros++;
  }
}

new Libro("A");
new Libro("B");
console.log(Libro.totalLibros); // 2
```

Si `totalLibros` fuera un atributo de instancia normal, cada `Libro` tendría
su propio contador arrancando en 0 — no serviría para contar el total.
`static` existe justamente para datos que le pertenecen al concepto "Libro"
en general, no a un libro particular.

**Métodos**

Un método es una función definida dentro de la clase que opera típicamente
sobre `this`. La diferencia entre un método y una función suelta es que el
método tiene acceso directo al estado del objeto vía `this`, sin que se lo
pasen como parámetro.

```ts
class Libro {
  titulo: string;
  autor: string;
  paginas: number;

  constructor(titulo: string, autor: string, paginas: number) {
    this.titulo = titulo;
    this.autor = autor;
    this.paginas = paginas;
  }

  describir(): string {
    return `${this.titulo} (${this.autor}), ${this.paginas} págs.`;
  }
}

const libro = new Libro("El Principito", "Saint-Exupéry", 96);
console.log(libro.describir());
```

### Abstracción y encapsulamiento

**Abstracción**

Abstracción es decidir **qué modelar y qué ignorar** para el problema que se
está resolviendo. Ningún objeto puede (ni debe) representar la realidad
completa — se modelan solo los atributos y comportamientos relevantes para
el sistema que se está construyendo.

Ejemplo: un `Empleado` en un sistema de sueldos necesita `nombre`,
`sueldoBase`, `calcularSueldo()`. No necesita `colorDeOjos` ni
`comidaFavorita` — esos datos son reales de la persona, pero irrelevantes
para el problema "calcular cuánto cobra". La abstracción correcta depende
del problema, no del objeto "en sí".

**Encapsulamiento**

Encapsulamiento es que el objeto **protege su propio estado**: nadie de
afuera lo modifica directamente sin pasar por los métodos que el objeto
expone. El objeto decide qué operaciones son válidas sobre sí mismo.

**Modificadores de acceso**

- `public` (default si no se pone nada): accesible desde cualquier lugar.
- `private`: solo accesible desde dentro de la propia clase. Ni siquiera una
  clase hija puede acceder.
- `protected`: accesible desde la propia clase y sus clases hijas
  (subclases), pero no desde afuera.

Ejemplo: una `CuentaBancaria` guarda el `saldo` como `private` y solo lo
modifica a través de `depositar()` y `retirar()`. Nadie de afuera puede leer
ni cambiar `cuenta.saldo` directamente — solo puede pedirle a la cuenta que
deposite o retire.

Exponer estado directamente (`public saldo`) es un olor de diseño porque
elimina el control que la clase tiene sobre sus propias reglas: si `saldo`
fuera público, cualquiera podría hacer `cuenta.saldo = -500` y romper la
regla de negocio "no se puede retirar más de lo que hay" sin pasar por
`retirar()`.

**`readonly`**

`readonly` impide **reasignar** una propiedad después del constructor, ni
siquiera desde adentro de la clase. Se usa para datos que se fijan al crear
el objeto y no cambian nunca (ej: un `id`).

Ejemplo: una `Persona` guarda su `dni` como `readonly`. Se fija una sola vez
al crear el objeto y no se puede volver a asignar después.

Se puede combinar con `private`: `private readonly`.

**Getters/setters: cuándo tienen sentido y cuándo son burocracia**

Un getter/setter tiene sentido cuando agrega **valor real** — validación,
cálculo derivado, o control de quién puede leer/escribir:

Ejemplo: `CuentaBancaria` expone un `get saldo()` de solo lectura, sin `set`
— se puede consultar el saldo desde afuera, pero no asignarlo directamente.

Es solo burocracia cuando el getter/setter no hace nada más que copiar el
valor sin ninguna regla — en ese caso es lo mismo que si la propiedad fuera
`public` directamente, solo que con más código. Si no hay ninguna regla que
proteger, no hace falta el getter/setter.

**Patrón típico: colección privada con acceso controlado**

Ejemplo: una `Biblioteca` guarda sus libros en un arreglo privado y solo
permite agregarlos a través de `agregar(libro)` — nadie de afuera puede
vaciar la lista ni meter libros sin pasar por ese método.

Así nadie de afuera puede hacer `biblioteca.libros = []` ni meter elementos
sin pasar por `agregar()` — el arreglo es un detalle interno.

### Herencia, polimorfismo y sobrecarga

**Herencia**

Herencia permite que una clase (subclase/clase hija) reutilice y extienda el
comportamiento de otra (superclase/clase base), usando `extends`.

Ejemplo: `EmpleadoFijo extends Empleado`. Hereda el `nombre` de la clase
base y agrega su propio atributo `sueldoBase`, sobreescribiendo
`calcularSueldo()` para que devuelva ese valor fijo.

**El test de "¿es-un?"**

Herencia solo tiene sentido cuando hay una relación real "es-un":
`EmpleadoFijo` **es un** `Empleado`. Si la relación real es "tiene-un"
(`Auto` tiene un `Motor`, no "es un" `Motor`), herencia es la herramienta
equivocada — ahí corresponde **composición** (el `Auto` guarda una instancia
de `Motor` como atributo). Usar herencia donde corresponde composición
genera acoplamiento excesivo: la subclase queda atada a implementación de la
clase base que no necesita, solo para heredar un par de métodos.

**Polimorfismo**

Polimorfismo es que distintos objetos responden al mismo mensaje (mismo
nombre de método) de formas distintas, sin que quien lo llama necesite saber
con cuál está hablando exactamente:

Ejemplo: `EmpleadoFijo` y `EmpleadoPorHoras` calculan el sueldo cada uno a su
manera. Al recorrer una lista de `Empleado` y llamar `calcularSueldo()` en
cada uno, cada objeto responde con su propio cálculo, sin que el código que
los recorre necesite saber con cuál está tratando.

**Override (sobreescritura)**: una subclase redefine un método que ya existe
en la clase base, con la misma firma. Es lo que hace
`EmpleadoFijo.calcularSueldo()` arriba.

**Sobrecarga (overload) vs. sobreescritura (override)**

No son lo mismo, aunque suenan parecido:

- **Override (sobreescritura)**: una subclase redefine un método que ya
  existe en la clase base, con la misma firma. Es lo que hace
  `EmpleadoFijo.calcularSueldo()` arriba.
- **Overload (sobrecarga)**: la **misma clase** define múltiples firmas para
  un método con el mismo nombre, que aceptan distintos tipos/cantidad de
  parámetros. En TypeScript se declaran las firmas por separado y una sola
  implementación las maneja:

```ts
class Calculadora {
  sumar(a: number, b: number): number;
  sumar(a: number, b: number, c: number): number;
  sumar(a: number, b: number, c?: number): number {
    return c !== undefined ? a + b + c : a + b;
  }
}
```

Override cambia el comportamiento heredado; overload da variantes del mismo
método dentro de la misma clase.