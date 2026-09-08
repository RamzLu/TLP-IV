// class EmailSender {
//   send(to: string, message: string): void {
//     console.log(`Correo para ${to}: ${message}`);
//   }
// }

// class OrderService {
//   createOrder(customerEmail: string): void {
//     console.log("Pedido creado");

// !    const emailSender = new EmailSender(); 
//     emailSender.send(customerEmail, "Tu pedido fue creado");
//   }
// }

// new OrderService().createOrder("ana@example.com");


// en el codigo original hacia const emailSender = new EmailSender();, donde rompe 
// el Principio de Inversión de Dependencia (la letra D de SOLID), que dice que debemos
//  depender de ideas generales (abstracciones) y no de objetos específicos (concreciones).

// el EmailSender actuaria como por ejemplo una empresa de mensajeria y OrderService como el empleado que registra
// la compra

// El error esta en que OrderService no solo registra el pedido sino que el mismo fabrica o contrata al EmailSender
// estan pegados uno a otro

// * Esto hace que sea rigido a cambios:
// es decir que si el dia de mañana el negocio decide que quiere avisar
// de otra forma no puede hcerlo facilmente y se obliga abrir el codigo y modificar instrucciones

// * Tambien es dificil de probar:
// es decir que si quieren hacer simulaciones para verificar que la creacion de pedidos funciona
//  no pueden desconectar el envio de correos, y cada vez que hagan una prueba el empleado creara un
//  EmailSender real y enviara correos reales


// aca hacemos la abstraccion (o el contrato) de4 la que va a depender OrderService, este solo va a
// conocer esto, no sabe (ni le debe importar) que existe EmailSender
interface Notifier {
  send(to: string, menssage:string): void;
}


// el email sender es un detalle de bajo nivel (porque es solo una implementacion
//  tecnica especifica que es como se manda el aviso), es una forma concreta de notificar y cumple con Notifier

class EmailSender implements Notifier {
  send(to: string, message: string): void{
     console.log(`Correo para ${to}: ${message}`);
  }
}

class OrderService{
  private notifier: Notifier;

  constructor(notifier: Notifier){
    this.notifier= notifier 
  }

  createOrder(customerEmail:string): void{
    console.log("Pedido creado")

  // aqui solo usa lo que le hayan pasado sea lo q sea, mientras cumpla con la interfaz de Notifier
  this.notifier.send(customerEmail, "Tu pedido fue creado")
  }
}


// ejemplo de uso

const emailService = new OrderService(new EmailSender());
emailService.createOrder("ana@example.com");