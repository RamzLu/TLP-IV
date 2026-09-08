// type PaymentType = "card" | "cash";

// class PaymentProcessor {
//   pay(type: PaymentType, amount: number): void {
//     switch (type) {
//       case "card":
//         console.log(`Pagando $${amount} con tarjeta`);
//         break;
//       case "cash":
//         console.log(`Pagando $${amount} en efectivo`);
//         break;
//       default:
//         throw new Error("Medio de pago no soportado");
//     }
//   }
// }

// new PaymentProcessor().pay("card", 100);


//problema del cosigo actual
// si quisieramos agregar un nuevo tipo de pago tendriamos que modificar la clase ya que solo puede valer card o cash
// y la relga del principio de ABierto/Cerrado dice que cuando queremos agregar una nueva funcion no
// tendiramos que desarmar y tocar las partes que ya funcionan perfectamente, el objetivo es
// agregar un nuevo metodo sin tocar la clase, para esto podemos usar lo dado en las clases de los pilares de la poo, es decir el polimorfismo



// hacemos una interfaz
interface PaymentMethod  {
  pay(amount: number): void; //cualquier  cosa que sea un metodo de pago debe implementar un pago con un monto
}


class CardPayment implements PaymentMethod {
  pay(amount: number): void {
    console.log(`Pagando $${amount} con tarjeta`);
  }
}


class CashPayment implements PaymentMethod {
  pay(amount: number): void {
    console.log(`Pagando $${amount} en efectivo`);
  }
}


class MercadoPagoPayment implements PaymentMethod {
  pay(amount: number): void {
    console.log(`Pagando $${amount} con MercadoPago`);
  }
}


// esta clase gestiona el cobro 
class PaymentProcessor {
  process(method: PaymentMethod, amount: number): void {
    method.pay(amount);
  }
}

const processor = new PaymentProcessor();
 
processor.process(new CardPayment(), 100);
processor.process(new CashPayment(), 50);
processor.process(new MercadoPagoPayment(), 200); 