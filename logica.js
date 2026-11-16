/* Lógica de los cuatro ejercicios. Sin dependencias externas. */
(function (global) {
  'use strict';
  function normalizarVocales(texto) {
    return texto.toLowerCase().replace(/[áéíóúü]/g,
      letra => ({á:'a', é:'e', í:'i', ó:'o', ú:'u', ü:'u'})[letra]);
  }
  function prepararPalindromo(texto) {
    // Se conserva la ñ: no es equivalente a n en español.
    return normalizarVocales(texto.normalize('NFC'))
      .replace(/[^\p{L}\p{N}]/gu, '');
  }
  function esPalindromo(texto) {
    const limpio = prepararPalindromo(texto);
    if (!limpio) throw new Error('Escribe al menos una letra o un número.');
    return limpio === Array.from(limpio).reverse().join('');
  }
  function compararNumeros(valor1, valor2) {
    if (!valor1.trim() || !valor2.trim()) {
      throw new Error('Completa los dos números.');
    }
    const a = Number(valor1), b = Number(valor2);
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      throw new Error('Introduce números finitos válidos.');
    }
    if (a === b) return 'Los dos números son iguales: ' + a;
    return 'El número mayor es: ' + (a > b ? a : b);
  }
  function analizarVocales(texto) {
    const conteo = {a: 0, e: 0, i: 0, o: 0, u: 0};
    const frase = normalizarVocales(texto.normalize('NFC'));
    for (const letra of frase) {
      if (Object.hasOwn(conteo, letra)) conteo[letra]++;
    }
    const presentes = Object.keys(conteo).filter(v => conteo[v] > 0);
    return {presentes, conteo};
  }
  const api = {normalizarVocales, prepararPalindromo,
    esPalindromo, compararNumeros, analizarVocales};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.Lab = api;
})(typeof window !== 'undefined' ? window : globalThis);
