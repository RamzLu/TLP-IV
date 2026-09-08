//ejercicio de principio de responsabilidad unica 

// interface User { // esto es una una interfaz, lo que hace es definir que cualquier cosa que sea
//   username: string; // user debe tener un username y un email, es como un contrato y que debe cumplir con estas propiedades
//   email: string;
// }

// class UserManager { // se crea una clase llemada UserManager
//   users: User[] = []; // es una propiedad (dato que vive dentro de una clase) que seria un arreglo de User y empieza vacio y donde se guardaran los usuarios

//   register(username: string, email: string): string { //hacemos un metodo (funcion que estan dentro de una clase) llamado register que recibe un username y un email 
//     if (!email.includes("@")) { //validamos que el email tenga @
//       throw new Error("El correo no es valido"); //si no lo tiene no es valido
//     }

//     this.users.push({ username, email }); //en caso que pase la validacion hace push dentro del arreglo/lista, creando un objeto User con username y email
//     return this.sendWelcomeEmail(email);//aca se le dice a la funcion que envie un email de bienvenida al usuario y se le pasa el email
//   }

//   private sendWelcomeEmail(email: string): string { //(ptrivate porque es un metodo que solo se va usar dentro de la clase, nadie fuera de ella lo puede llamar directamente)
//     return `Email enviado a ${email}`;
//   }
// }
 
// ! cual seria el problema con este codigo? seria que el UserManager tiene muchas responsabilidades,
// guarda los usuarios haciendo push
// valida los datos
// envia emails


// si mañana se cambia la forma de mandar emails, de validacion y la forma de como se guardan los datos, tiene que tocar el UserManager haciendo
// que la clase no cumpla con la s de solid y sea fragil y dificil de mantener


//la forma de solucionar haciedno una clase por responsabilidad:

interface User {
username: string;
email: string;
}

//hacemos una clase para validar el email
class UserValidator {
  static validate(username:string, email:string): void { //static porque no tenemos que crear nada, void porque no devuelve nada, solo valida
    if (!email.includes("@")) {
      throw new Error("El correo no es valido");
    }

    // de paso hacemos una validacion para que el username no sea vacio
    if(username.trim() === "") {
      throw new Error("El nombre de usuario no puede estar vacio");
    }
  }
}

// clase para enviar emails
class EmailService{
  sendWelcomeEmail(email: string): string {
    return  `Email enviado a ${email}`;
  }
}


// ahora si entra el UserManager

class UserManager {
  users: User[] = [];
  private emailService : EmailService;

  constructor(emailService: EmailService) {
    this.emailService  = emailService;
  }

  register(username: string, email: string): string {
    // hace la validacion de los datos
    UserValidator.validate(username, email); 
    // guarda el usuario en el arreglo
    this.users.push({username, email});
    // envia el email de bienvenida
   return this.emailService.sendWelcomeEmail(email);
  }
}

//ejemplos de uso
const emailService = new EmailService();
const userManager = new UserManager(emailService);

const resultado = userManager.register("juan123", "juan@mail.com");
console.log(resultado);
