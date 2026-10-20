# Documentación de Patrones de Diseño

En cumplimiento con los requerimientos de la Práctica Integradora, este proyecto implementa los siguientes patrones de diseño para resolver problemas específicos de arquitectura, escalabilidad y mantenimiento.

## 1. Singleton (Creacional)
**Ubicación:** `backend/src/database/DatabaseConnection.ts`

**Justificación:**
El acceso a la base de datos MongoDB debe ser un recurso compartido en toda la aplicación. Se implementó el patrón Singleton garantizando que la clase `DatabaseConnection` tenga un constructor privado y un método estático `getInstance()`. Esto asegura que Express levante y reutilice una única instancia de conexión durante todo el ciclo de vida de la aplicación, evitando fugas de memoria, sobrecarga del servidor y el agotamiento del pool de conexiones.

## 2. Observer (Comportamiento)
**Ubicación:** `backend/src/observer/` y `backend/src/services/NotificationService.ts`

**Justificación:**
Requeríamos que múltiples usuarios fueran alertados cuando un libro cambia de estado (ej. de PRESTADO a DISPONIBLE), pero sin acoplar la lógica del libro con la lógica de notificaciones. 
Implementamos un `EventPublisher` (Sujeto) y definimos a `NotificationService` como un `IObserver`. Cuando `BookService` cambia el estado de un libro, simplemente avisa al publicador. El publicador se encarga de notificar a todos los observadores suscritos (desacoplamiento total).

## 3. Factory (Creacional)
**Ubicación:** `backend/src/notifications/NotifierFactory.ts`

**Justificación:**
El sistema de notificaciones debe ser escalable. Actualmente soportamos notificaciones in-app y por consola, pero en el futuro podríamos agregar Email o SMS. 
Creamos `NotifierFactory` para centralizar la instanciación de los notificadores. El sistema le pide a la Factory un notificador pasando un tipo (`'inapp'` o `'console'`), y la Factory devuelve una clase que respeta la interfaz `INotifier`. Esto respeta el principio Open/Closed (SOLID).

## 4. Adapter (Estructural)
**Ubicación:** `backend/src/notifications/ConsoleNotifierAdapter.ts`

**Justificación:**
Teníamos el requerimiento de enviar notificaciones por consola, pero el comando nativo `console.log` no respeta la interfaz `INotifier` que exige nuestro sistema (el método `send()`). 
Para resolver esta incompatibilidad, creamos la clase `ConsoleNotifierAdapter`. Este adaptador envuelve la funcionalidad de la consola, expone el método `send()` requerido y transforma los datos del evento al formato de texto esperado, permitiendo que el servicio de notificaciones lo utilice de forma transparente.