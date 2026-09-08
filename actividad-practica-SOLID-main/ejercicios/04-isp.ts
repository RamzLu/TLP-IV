// interface MultifunctionPrinter {
//   print(document: string): void;
//   scan(document: string): void;
//   fax(document: string): void;
// }

// class SimplePrinter implements MultifunctionPrinter {
//   print(document: string): void {
//     console.log(`Imprimiendo: ${document}`);
//   }

//   scan(_document: string): void {
//     throw new Error("Esta impresora no puede escanear");
//   }

//   fax(_document: string): void {
//     throw new Error("Esta impresora no puede enviar fax");
//   }
// }

// new SimplePrinter().print("tarea.txt");


// El codigo original tenia una interfaz grande que hacia print dacn y faz, cualquier cosa que implementa
//  esta obligada a usar los tres metodos aunque en la practica no pueda hacer todos

// La solucion es partir cada interfaz grande en interfaces chicas una por capacidad 
// y cada clase implementa lo que puede cumplir

interface Printer{
  print(document: string):void;
}

interface Scanner {
  scan(document: string): void;
}

interface Fax {
  fax(document:string): void;
}


// aca esta funcion solo implementa lo que puede de verdad hacer y no tiene que
// fingir que hace scan o fax

class SimplePrinter implements Printer {
  print(document: string): void{
    console.log(`Imprimiendo: ${document}`)
  }
}


// una impresora multifuncion si puede implementar las tres porque de verda sabe hacer las 3 cosas


class MultifunctionPrinter implements Printer, Scanner, Fax {
  print(document: string): void {
    console.log(`Imprimiendo: ${document}`);
  }
 
  scan(document: string): void {
    console.log(`Escaneando: ${document}`);
  }
 
  fax(document: string): void {
    console.log(`Enviando fax: ${document}`);
  }
}


// y ahora una funcion tambien puede pedir una sola capacidad que necesita, aca no le importa
// si el objeto tambien sabe escanear o mandar fax solo le pide que sepa imprimir, es como
// las otras funciones pero non se arriesga a llamar un metodo que no soporta
function imprimirDocumento(print: Printer, document: string): void {
  print.print(document)
}


const simple = new SimplePrinter();
imprimirDocumento(simple, "tarea.txt");
 
const multifuncion = new MultifunctionPrinter();
imprimirDocumento(multifuncion, "informe.pdf");
multifuncion.scan("informe.pdf");
multifuncion.fax("informe.pdf");
 