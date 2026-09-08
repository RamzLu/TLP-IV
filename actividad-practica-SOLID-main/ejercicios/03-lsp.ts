// class Rectangle {
//   constructor(protected width: number, protected height: number) {}

//   setWidth(width: number): void {
//     this.width = width;
//   }

//   setHeight(height: number): void {
//     this.height = height;
//   }

//   area(): number {
//     return this.width * this.height;
//   }
// }

// class Square extends Rectangle {
//   setWidth(width: number): void {
//     this.width = width;
//     this.height = width;
//   }

//   setHeight(height: number): void {
//     this.width = height;
//     this.height = height;
//   }
// }

// function resizeRectangle(rectangle: Rectangle): void {
//   rectangle.setWidth(5);
//   rectangle.setHeight(10);
//   console.log(`Area esperada: 50. Area obtenida: ${rectangle.area()}`);
// }

// resizeRectangle(new Rectangle(1, 1));
// resizeRectangle(new Square(1, 1));


// en el codigo anterior habia un choque matematico y de codigo ya que en la vida real tecnicamente el cuadrado
// es un tipo de rectangulo pero hacerlo en codigo se rompe el sistema

// la funcion resizeRectangle asume que esta trabajando con una figura de lados independientes
// la logica seria que si fija el ancho en 5 y al alto en 10 el area matematica seria 50
// ! pero para evitar que el cuadrado se deforme y deje de ser un cuadrado se modifico qlos controladores de ancho y largo
// ! si le cambias el ancho tambien su alto para queden igual

// el "jefe" da la orden de orden de cambiar el ancho a 5 pero para que el cuadrado sobreviva
// ! tiene una regla de supervivenvia que hace que su ancho y alto valga lo mismo y en este punto es 5x5
// luego se le pide que cambie su alto a 10, pero para no deformarse 
// ! sobreescribe su ancho y queda en 10x10 
// ! esto termina en error y arruinando el programa el cual esperaba un area matematica de 50 pero termina siendo 100

interface Shape  {
  area(): number
}

// el rectangulo ya no es el padre de cuadrado es independiente
class Rectangle  implements Shape {
 private width: number;
  private height: number;
  
  constructor(width: number, height: number){
    this.width = width
    this.height = height
  }

  setWidth(width:number): void {
    this.width = width;
  }

  setHeight(height:number): void {
    this.height = this.height
  }

  area(): number {
    return this.width * this.height;
  }
}


// el cuadrado tambien es independiente y no un exte4nd de rectangulo 
// ya que el cuadrado tiene su propia logica, un solo lado porquew de ancho y largo son siempre iguales
// no hererda un contrato que no puede cumplir

class Square implements Shape {
  private side: number

  constructor(side: number) {
    this.side = side
  }

  setSide(side:number): void {
    this.side = side
  }

  area(): number {
    return this.side * this.side;
  }
}


// esta funcion trabaja con cualquier forma/shape sin asumir que tiene setWidth/setHeight 
// solo pide lo que el contrato Shape promete q es area
function printArea(shape:Shape): void{
  console.log(`La area es ${shape.area()}`)
}


// ejemplo
const rectangle = new Rectangle(5,10)
rectangle.setWidth(5)
rectangle.setHeight(10)
printArea(rectangle) //deberia ser 50

const square = new Square(1)
square.setSide(5)
printArea(square)