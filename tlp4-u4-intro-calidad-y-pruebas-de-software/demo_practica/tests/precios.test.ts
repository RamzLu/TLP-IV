import { describe, expect, it } from 'vitest';
import { calcularPrecioFinal } from '../src/services/precios.ts';

describe('calcularPrecioFinal', () => {
  it('aplica un descuento del 10 %', () => {
    expect(calcularPrecioFinal(1000, 10)).toBe(900);
  });

  it('conserva el precio si el descuento es cero', () => {
    expect(calcularPrecioFinal(1000, 0)).toBe(1000);
  });

  it('rechaza descuentos superiores al 100 %', () => {
    expect(() => calcularPrecioFinal(1000, 150)).toThrow(RangeError);
  });
//it es la instrucción que define un caso de prueba individual o un comportamiento específico que queremos comprobar

//toBe es la herramienta que te asegura que el número que calculó tu aplicación 
// es milimétricamente idéntico al que la regla de negocio exige
  it('devuelve cero con un descuento del 100 %', () => {
    expect(calcularPrecioFinal(1000, 100)).toBe(0);
  });
  it('rechazar precio negativo', ()=>{
    expect(() => calcularPrecioFinal(-100, 10)).toThrow(RangeError)
  })

  it('rechaza descuento negativos', ()=>{
    expect(()=> calcularPrecioFinal(1000, -10)).toThrow(RangeError)
  });

  it('rechazar precios NaN', ()=>{
    expect(()=> calcularPrecioFinal(NaN, 10)).toThrow(RangeError)
  })

  it('rechazar descuentos NaN', ()=>{
    expect(()=> calcularPrecioFinal(1000, NaN)).toThrow(RangeError)
  })
  
});
