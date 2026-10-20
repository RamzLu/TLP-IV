# Laboratorio introductorio: pruebas automatizadas en Express.js

**Taller de Lenguajes de Programación IV · Unidad 4 · Octubre de 2026**

## Propósito

En esta práctica se utilizará una API de precios desarrollada con Express.js y TypeScript para comprobar comportamientos mediante pruebas automatizadas. El proyecto ya contiene pruebas: algunas pasan y una falla intencionalmente. El objetivo es comprender los resultados, localizar el defecto y verificar una corrección.

Al finalizar podrás distinguir una prueba unitaria de una prueba de integración, interpretar aserciones de Vitest y comprobar respuestas HTTP con Supertest.

## 1. Preparar el entorno

Necesitás Node.js **22.18 o posterior** (preferentemente Node.js 24), npm, un editor de código y una terminal. El proyecto usa TypeScript ejecutado directamente por Node, sin `ts-node` ni `tsx`.

Abrí la carpeta **demo_practica** en Visual Studio Code y ejecutá:

```bash
node --version
npm --version
npm install
```

El comando `npm install` instala las dependencias y genera `package-lock.json`. Si tu versión de Node es anterior a la indicada, actualizala antes de continuar.

La estructura del proyecto es:

```text
├── src/
│   ├── app.ts
│   ├── server.ts
│   └── services/
│       └── precios.ts
├── tests/
│   ├── precios.test.ts
│   └── api.test.ts
├── .github/
│   └── workflows/
│       └── pruebas.yml
├── package.json
└── tsconfig.json
```

**Importante:** no es necesario crear nuevos archivos de configuración ni reemplazar `package.json`. Los scripts y las dependencias ya están incluidos.

## 2. Conocer la aplicación

Abrí `src/services/precios.ts`. Allí se encuentra la función `calcularPrecioFinal(precio, descuento)`, que resta un porcentaje al precio recibido. Por el momento, la función **no valida** los valores de entrada.

En `src/app.ts` hay dos rutas:

- `GET /healthy`: devuelve un mensaje que confirma que la API responde.
- `POST /api/precios/calcular`: recibe `precio` y `descuento` en formato JSON y devuelve el total calculado.

Iniciá el servidor:

```bash
npm run dev
```

Abrí `http://localhost:3000/healthy` en el navegador. Deberías ver:

```json
{ "estado": "ok" }
```

En otra terminal probá el cálculo con `curl`:

```bash
curl -X POST http://localhost:3000/api/precios/calcular \
  -H 'Content-Type: application/json' \
  -d '{"precio":1000,"descuento":10}'
```

Resultado esperado:

```json
{ "total": 900 }
```

En **PowerShell** también podés utilizar:

```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/api/precios/calcular' `
  -Method Post -ContentType 'application/json' `
  -Body '{"precio":1000,"descuento":10}'
```

**Preguntas:** ¿qué archivo contiene la regla de cálculo? ¿Qué archivo define la ruta HTTP? ¿En qué se diferencian sus responsabilidades?

> **Respuesta:**
>
> - La regla de cálculo está en `src/services/precios.ts`, dentro de la función `calcularPrecioFinal`.
> - La ruta HTTP está definida en `src/app.ts` (`GET /healthy` y `POST /api/precios/calcular`).
> - **Diferencia de responsabilidades:** `precios.ts` se encarga de la lógica de negocio (cómo se calcula el precio y qué valores son válidos) y no sabe nada de HTTP. `app.ts` se encarga de la parte web: recibe la petición, toma `precio` y `descuento` del JSON, llama al servicio y convierte el resultado o el error en una respuesta HTTP (200 si todo sale bien, 400 si los datos son inválidos, 500 ante un error inesperado).

## 3. Ejecutar las pruebas disponibles

Detené el servidor con `Ctrl+C` o abrí otra terminal en el proyecto. Ejecutá:

```bash
npm test
```

El proyecto incluye **cinco pruebas**: tres en `tests/precios.test.ts` y dos en `tests/api.test.ts`. Inicialmente, deberían **pasar cuatro y fallar una**.

En `tests/precios.test.ts` identificá estas instrucciones:

- `describe(...)`: agrupa pruebas relacionadas.
- `it(...)`: describe un comportamiento que se quiere comprobar.
- `expect(...)`: expresa una expectativa sobre el resultado.
- `toBe(...)`: comprueba igualdad para valores como números.
- `toThrow(RangeError)`: comprueba que una función lance un error del tipo indicado.

Leé la prueba que contiene `calcularPrecioFinal(1000, 150)`. ¿Qué comportamiento exige? ¿Qué hace realmente el código? **Todavía no modifiques la implementación.**

> **Respuesta:**
>
> - **Qué exige la prueba:** que al pedir un descuento del 150 % la función **lance un `RangeError`**, porque un descuento mayor al 100 % no es válido según la regla de negocio.
> - **Qué hace realmente el código (antes de corregirlo):** no valida nada. Simplemente calcula `1000 - (1000 * 150) / 100` y devuelve `-500`, sin lanzar ningún error. Por eso la prueba falla: esperaba un `RangeError` y recibió un número negativo.

## 4. Interpretar la falla

La prueba inicial incluye la siguiente comprobación:

```typescript
it("rechaza descuentos superiores al 100 %", () => {
  expect(() => calcularPrecioFinal(1000, 150)).toThrow(RangeError);
});
```

Observá que la función se escribe dentro de `() => ...` para que Vitest pueda ejecutarla y comprobar si lanza un error. Es distinto de pasar directamente el resultado de la función a `expect`.

Respondé antes de continuar:

1. ¿Qué total devuelve actualmente un descuento del 150 % sobre $1.000?
2. ¿Por qué ese resultado no cumple la regla de negocio?
3. ¿Por qué la prueba falla si la función terminó de ejecutarse?

> **Respuestas:**
>
> 1. Devuelve **-500** (1000 − 1500).
> 2. Porque un descuento no puede superar el 100 %: un total negativo no tiene sentido en una venta (el comercio terminaría "pagándole" al cliente). La regla de negocio exige rechazar ese valor con un `RangeError`, no calcularlo.
> 3. Porque la prueba no verifica que la función "termine de ejecutarse", sino que **lance un error**. La función terminó normalmente y devolvió `-500` sin lanzar ninguna excepción, así que `toThrow(RangeError)` no encontró el error esperado y la prueba falló.

## 5. Corregir la función de cálculo

Modificá **solo** `src/services/precios.ts`. Antes de realizar la operación, incorporá comprobaciones para que:

- El precio sea un número finito, igual o mayor que cero.
- El descuento sea un número finito entre 0 y 100, inclusive.
- Los valores inválidos provoquen un `RangeError`.

Podés utilizar `Number.isFinite(...)`, comparaciones e instrucciones `throw new RangeError('...')`. **Conservá la fórmula de cálculo para las entradas válidas.**

Volvé a ejecutar:

```bash
npm test
```

Ahora deberían pasar las **cinco pruebas**. Si alguna falla, leé el resultado de Vitest y revisá qué comportamiento espera.

> **Resolución:** se modificó únicamente `src/services/precios.ts`, agregando las validaciones antes del cálculo y conservando la fórmula original:
>
> ```typescript
> /** Calcula el precio luego de aplicar un porcentaje de descuento. */
> export function calcularPrecioFinal(
>   precio: number,
>   descuento: number,
> ): number {
>   if (!Number.isFinite(descuento) || descuento < 0 || descuento > 100) {
>     throw new RangeError("El descuento no puede ser negativo ni mayor a 100");
>   }
>
>   if (!Number.isFinite(precio) || precio < 0) {
>     throw new RangeError(
>       "El precio debe ser un numero finito y no puede ser negativo",
>     );
>   }
>   return precio - (precio * descuento) / 100;
> }
> ```
>
> Con este cambio, la prueba del 150 % pasa y las pruebas originales siguen pasando.

## 6. Agregar pruebas unitarias

Abrí `tests/precios.test.ts` y agregá, dentro de `describe`, nuevas pruebas para las siguientes reglas:

| Entrada                        | Resultado esperado |
| ------------------------------ | ------------------ |
| Precio 1.000 y descuento 100 % | Total 0            |
| Precio -100 y descuento 10 %   | Lanza `RangeError` |
| Precio 1.000 y descuento -10 % | Lanza `RangeError` |

Por ejemplo, para el caso límite:

```typescript
it("devuelve cero con un descuento del 100 %", () => {
  expect(calcularPrecioFinal(1000, 100)).toBe(0);
});
```

Escribí las otras dos pruebas siguiendo el modelo de `toThrow(RangeError)` que ya existe. Ejecutá `npm test` y verificá el resultado.

**Desafío adicional:** agregá una prueba para `NaN` como precio. ¿La validación actual lo rechaza?

> **Resolución:** pruebas agregadas dentro del `describe` en `tests/precios.test.ts`:
>
> ```typescript
> it("devuelve cero con un descuento del 100 %", () => {
>   expect(calcularPrecioFinal(1000, 100)).toBe(0);
> });
>
> it("rechazar precio negativo", () => {
>   expect(() => calcularPrecioFinal(-100, 10)).toThrow(RangeError);
> });
>
> it("rechaza descuento negativos", () => {
>   expect(() => calcularPrecioFinal(1000, -10)).toThrow(RangeError);
> });
>
> // Desafío adicional
> it("rechazar precios NaN", () => {
>   expect(() => calcularPrecioFinal(NaN, 10)).toThrow(RangeError);
> });
>
> it("rechazar descuentos NaN", () => {
>   expect(() => calcularPrecioFinal(1000, NaN)).toThrow(RangeError);
> });
> ```
>
> **Respuesta al desafío:** sí, la validación actual rechaza `NaN` como precio. `Number.isFinite(NaN)` devuelve `false`, entonces `!Number.isFinite(precio)` es `true` y se lanza el `RangeError`. Si la función solo comprobara `precio < 0`, `NaN` pasaría la validación, porque cualquier comparación con `NaN` da `false`.

## 7. Primera prueba de integración HTTP

Hasta ahora se probó la función de manera aislada. Ahora comprobarás cómo colaboran **la ruta HTTP de Express y el servicio de cálculo**.

Abrí `tests/api.test.ts`. Las pruebas existentes utilizan Supertest:

```typescript
const respuesta = await request(app)
  .post("/api/precios/calcular")
  .send({ precio: 1000, descuento: 10 });

expect(respuesta.status).toBe(200);
expect(respuesta.body).toEqual({ total: 900 });
```

La llamada `request(app)` permite probar la aplicación sin iniciar manualmente un servidor en el puerto 3000. El código `200` significa que la petición se procesó correctamente.

Agregá dentro del bloque `describe('API de precios', ...)` esta nueva prueba:

```typescript
it("responde HTTP 400 ante un descuento inválido", async () => {
  const respuesta = await request(app)
    .post("/api/precios/calcular")
    .send({ precio: 1000, descuento: 150 });

  expect(respuesta.status).toBe(400);
  expect(respuesta.body).toHaveProperty("error");
});
```

El código `400` indica que la petición contiene datos que el servidor no acepta. La ruta de `src/app.ts` ya contempla la respuesta `400` cuando el servicio lanza `RangeError` o `TypeError`.

Ejecutá `npm test` nuevamente. Explicá por qué esta comprobación es de **integración** y no solamente una prueba unitaria.

> **Respuesta:** es una prueba de **integración** porque no evalúa una función aislada: envía una petición HTTP real a la aplicación y hace que participen **varias partes a la vez**: la ruta de Express en `app.ts` (que recibe el JSON y arma la respuesta) y el servicio `calcularPrecioFinal` en `precios.ts` (que detecta el descuento inválido y lanza el `RangeError`). La prueba comprueba que ambas se comuniquen bien: el servicio lanza el error y la ruta lo convierte en un `400` con una propiedad `error`. Una prueba unitaria solo verificaría que la función lance el error, sin mirar nada del HTTP.

## 8. Diferenciar pruebas y verificación de tipos

Ejecutá:

```bash
npm run typecheck
```

Este comando usa TypeScript para analizar tipos, pero **no ejecuta las pruebas**. Por otra parte, Node puede ejecutar los archivos `.ts` compatibles directamente, pero no comprueba sus tipos durante esa ejecución.

**Pregunta:** ¿por qué conviene utilizar tanto `typecheck` como `npm test`?

> **Respuesta:** porque cada uno detecta un tipo de problema distinto y se complementan. `npm run typecheck` analiza el código sin ejecutarlo y encuentra errores como variables mal escritas, importaciones de archivos que no existen o pasar un string donde se esperaba un número; además es más rápido que correr las pruebas. En cambio, `npm test` ejecuta el código y verifica que se comporte según las reglas de negocio (por ejemplo, que un descuento del 150 % sea rechazado). Un programa puede tener los tipos correctos y aun así calcular mal, y puede pasar las pruebas habituales y tener un error de tipos que no se ejercitó. Usando ambos se cubren las dos clases de fallas.

## 9. Integración continua: extensión opcional

El proyecto ya contiene `.github/workflows/pruebas.yml`. Abrí ese archivo e identificá los pasos que ejecutará GitHub Actions: descargar el repositorio, preparar Node, instalar dependencias, comprobar tipos y correr las pruebas.

Si querés probarlo en GitHub:

1. Ejecutá `npm install` antes de subir el repositorio y conservá `package-lock.json` para versionarlo.
2. Subí los archivos del proyecto a un repositorio, **sin** incluir `node_modules`.
3. Entrá a la pestaña **Actions** y revisá la ejecución iniciada con tu `push`.
4. Comprobá qué ocurre si una prueba falla y luego se corrige.

En la versión actualizada del proyecto, el workflow utiliza `npm install`. Después de generar y versionar `package-lock.json`, se recomienda cambiarlo a `npm ci` para obtener instalaciones reproducibles.

## 10. Registro de resultados

| Comprobación                     | Resultado                                      | Observación                                                                                                                                                       |
| -------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Respuesta de `GET /healthy`      | Devuelve `{"estado":"ok"}`                     | La prueba original fallaba porque buscaba la ruta /salud, al corregirla a /healthy pasó con éxito                                                                 |
| Primera ejecución de `npm test`  | 4 pruebas pasaron, 1 falló                     | Falló la prueba del descuento del 150 % porque la función no validaba los límites y devolvía un saldo negativo (-500)                                             |
| Corrección del servicio          | Las cinco pruebas iniciales pasaron            | Se agregaron en `precios.ts` validaciones con `Number.isFinite` y comparaciones que lanzan `RangeError` para precio y descuento inválidos; se conservó la fórmula |
| Nuevas pruebas unitarias         | Todas las pruebas de `precios.test.ts` pasaron | Se agregaron: descuento 100 % (total 0), precio negativo, descuento negativo y, como desafío, precio `NaN` y descuento `NaN`; ambos `NaN` son rechazados          |
| Prueba de integración HTTP 400   | Pasó: respuesta 400 con propiedad `error`      | Comprueba que la ruta de Express y el servicio trabajan juntos: el servicio lanza `RangeError` y `app.ts` lo convierte en una respuesta HTTP 400                  |
| Verificación `npm run typecheck` | Finalizó sin errores de tipos                  | Analiza los tipos sin ejecutar las pruebas ni generar archivos; complementa a `npm test`                                                                          |

## 11. Preguntas de cierre

1. ¿Qué diferencia hay entre comprobar manualmente una respuesta y ejecutar una prueba automatizada?
2. ¿Cuál fue la causa de la primera prueba fallida?
3. ¿Por qué es útil incluir casos inválidos además de los casos habituales?
4. ¿Qué parte del sistema comprueba `tests/precios.test.ts` y qué partes comprueba `tests/api.test.ts`?
5. ¿Qué ventajas ofrece ejecutar las pruebas después de cada modificación?

> **Respuestas:**
>
> 1. En la prueba manual una persona ejecuta acciones, mira el resultado y lo compara con lo esperado; hay que repetirla a mano cada vez y depende de que alguien se acuerde de hacerla. En la prueba automatizada esa comprobación está escrita como código, se ejecuta con un solo comando (`npm test`), da resultados repetibles y avisa cuáles pasaron y cuáles fallaron.
> 2. La función `calcularPrecioFinal` no validaba los valores de entrada. Con un descuento del 150 % devolvía `-500` en lugar de lanzar un `RangeError`, por lo que incumplía la regla de negocio que dice que el descuento debe estar entre 0 y 100.
> 3. Porque los casos habituales (como un 10 % de descuento) pueden funcionar bien y ocultar defectos que solo aparecen con entradas inesperadas (150 %, valores negativos, `NaN`). Los casos inválidos y límite revelan esos errores antes de que lleguen a los usuarios y dejan documentado cómo debe reaccionar el sistema.
> 4. `tests/precios.test.ts` comprueba **una sola parte**, la función `calcularPrecioFinal` del servicio, de forma aislada (pruebas unitarias). `tests/api.test.ts` comprueba **varias partes trabajando juntas**: la ruta HTTP de Express (`app.ts`) y el servicio de cálculo, mediante peticiones con Supertest (pruebas de integración).
> 5. Permiten detectar enseguida si un cambio rompió algo que antes funcionaba (regresiones), dan confianza para modificar o mejorar el código, ahorran tiempo de pruebas manuales y hacen que los errores se encuentren cuando son más fáciles de ubicar y corregir.

**Referencias:** [Vitest](https://vitest.dev/guide/) · [Supertest](https://github.com/ladjs/supertest) · [Node.js: TypeScript](https://nodejs.org/api/typescript.html) · [GitHub Actions](https://docs.github.com/actions)
