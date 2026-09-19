- **Principio de Responsabilidad Única (SRP):** Es el principio con mayor impacto en esta refactorización. Se eliminó la concentración de responsabilidades del archivo `server.ts`, delegando tareas específicas a capas independientes:

  - **Rutas (**`EmployeeRoutes`**):** Su única responsabilidad es enlazar las peticiones HTTP (endpoints) con los métodos del controlador correspondiente.
  - **Controladores (**`EmployeeController`**):** Se encargan exclusivamente de recibir las peticiones HTTP, validar que los datos básicos estén presentes (como `req.body`), derivar la tarea al servicio y devolver los códigos de estado HTTP (200, 201, 400).
  - **Servicios (**`EmployeeService`**):** Aislan la regla de negocio. Es el único lugar de la aplicación donde reside la fórmula de cálculo del salario (salario base + 2% por año de antigüedad). No tiene conocimiento de Express (`req`, `res`) ni de Mongoose.
  - **Repositorios (**`EmployeeRepository`**):** Centralizan la interacción directa con la base de datos. Si se requiere una consulta a Mongoose, se realiza obligatoriamente aquí.
  - **Manejador de errores (**`errorHandler`**):** Centraliza la captura y el formato de las respuestas de error del servidor, evitando bloques de código repetitivos en los controladores.

- **Principio de Inversión de Dependencias (DIP):** Se aplicó para desacoplar el núcleo de la aplicación de las herramientas externas.

  - El `EmployeeService` no interactúa directamente con `EmployeeModel` (Mongoose), sino que depende del `EmployeeRepository`. Esto permite que, si se cambia el motor de base de datos en el futuro, el servicio y la lógica de negocio permanezcan intactos.

  - La clase de configuración `DB` no busca las variables de entorno por sí misma, sino que depende de que el `server.ts` le inyecte la configuración externa (`IConfiguration`) a través de su constructor.

- **Principio de Segregación de Interfaces (ISP):** Se aplicó al crear la interfaz estricta `IEmployee`. En lugar de depender del tipo genérico e inflado `Document` de Mongoose, el código define un contrato exacto con las propiedades específicas del dominio (nombre, posición, salario). Esta interfaz se utiliza tanto para definir el esquema (`Schema<IEmployee>`) como para tipar las respuestas de los repositorios.

## Análisis del Archivo docker-compose.yml

El archivo `docker-compose.yml` funciona como un script de orquestación que define y configura contenedores Docker. Su función principal en este proyecto es levantar la infraestructura necesaria (la base de datos) con un solo comando (`docker compose up -d`), garantizando que cualquier desarrollador tenga el mismo entorno de ejecución sin tener que instalar o configurar el motor de base de datos directamente en su sistema operativo.

El archivo levanta un único servicio denominado `mongodb` con la siguiente configuración:

1. `image: mongo:8`: Indica a Docker que descargue y utilice la imagen oficial de MongoDB en su versión 8 desde Docker Hub.

2. `container_name: empleados-mongodb`: Asigna un nombre personalizado y legible al contenedor para facilitar su administración desde la terminal.

3. `restart: unless-stopped`: Define una política de reinicio automático. Si el contenedor falla, o si se reinicia la computadora host, Docker volverá a encender la base de datos automáticamente, a menos que un usuario la haya detenido manualmente.

4. `ports: - "27017:27017"`: Establece la comunicación de red. Mapea el puerto 27017 de la máquina host local hacia el puerto 27017 interno del contenedor. Esto permite que la API de Express (que corre en la máquina local) pueda conectarse a la base de datos usando `localhost:27017`.

5. `volumes: - mongo_data:/data/db`: Configura la persistencia de datos. Los contenedores son efímeros; si se borran, su información interna desaparece. Esta directiva crea un volumen virtual llamado `mongo_data` y lo enlaza a la carpeta interna `/data/db` (donde MongoDB guarda físicamente los archivos). Esto asegura que los empleados creados no se pierdan al apagar el contenedor.

   ### Relación con el funcionamiento de la aplicación

   Este servicio provee el almacenamiento persistente requerido por el Repositorio de la aplicación. El archivo `.env` define la variable `MONGO_URI=mongodb://localhost:27017/employees_db`, la cual apunta directamente al puerto expuesto por este archivo `docker-compose`. Sin este contenedor en ejecución, el método `database.connect()` del servidor fallará al intentar iniciar la API.