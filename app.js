'use strict';
const $ = id => document.getElementById(id);
function conectarFormulario(id, salida, accion) {
  $(id).addEventListener('submit', evento => {
    evento.preventDefault();
    try { $(salida).textContent = accion(); }
    catch (error) { $(salida).textContent = error.message; }
  });
}
conectarFormulario('palForm', 'palResultado', () => {
  const texto = $('palTexto').value;
  const limpio = Lab.prepararPalindromo(texto);
  return (Lab.esPalindromo(texto) ? 'Sí, es un palíndromo.' : 'No es un palíndromo.')
    + '\nTexto comparado: ' + limpio;
});
conectarFormulario('mayorForm', 'mayorResultado', () =>
  Lab.compararNumeros($('numero1').value, $('numero2').value));
conectarFormulario('vocalesForm', 'vocalesResultado', () => {
  const frase = $('frase').value;
  if (!frase.trim()) throw new Error('Escribe una frase.');
  const {presentes, conteo} = Lab.analizarVocales(frase);
  $('conteoResultado').textContent = Object.entries(conteo)
    .map(([v, n]) => v + ': ' + n).join('   |   ');
  return presentes.length ? 'Vocales: ' + presentes.join(', ')
    : 'No se encontraron vocales.';
});

// AJAX: estados reales del objeto XMLHttpRequest.
const estados = ['0 - No iniciada', '1 - Abierta; cargando',
  '2 - Cabeceras recibidas', '3 - Descargando contenido', '4 - Completada'];
$('urlInput').value = window.location.href;
let ocupada = false;
$('ajaxForm').addEventListener('submit', evento => {
  evento.preventDefault();
  if (ocupada) return;
  let url;
  try {
    url = new URL($('urlInput').value.trim());
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
  } catch {
    $('estado').textContent = 'URL inválida: utiliza http:// o https://.';
    return;
  }
  ocupada = true;
  $('mostrarBtn').disabled = true;
  $('contenido').textContent = '';
  $('cabeceras').textContent = '';
  $('codigoEstado').textContent = '-';
  $('historial').textContent = '';
  const xhr = new XMLHttpRequest();
  xhr.timeout = 15000;
  const registrar = mensaje => {
    $('estado').textContent = mensaje;
    $('historial').textContent += mensaje + '\n';
  };
  const terminar = () => {
    ocupada = false;
    $('mostrarBtn').disabled = false;
  };
  const mostrarMetadatos = () => {
    $('cabeceras').textContent = xhr.getAllResponseHeaders()
      || '(No hay cabeceras accesibles.)';
    $('codigoEstado').textContent = xhr.status
      ? xhr.status + ' ' + (xhr.statusText || '(sin texto de estado)')
      : 'Sin respuesta HTTP accesible (status 0)';
  };
  registrar(estados[xhr.readyState]);
  xhr.onreadystatechange = () => {
    registrar(estados[xhr.readyState]);
    if (xhr.readyState >= 2) mostrarMetadatos();
    if (xhr.readyState === 3 || xhr.readyState === 4) {
      $('contenido').textContent = xhr.responseText;
    }
  };
  xhr.onload = () => {
    mostrarMetadatos();
    $('contenido').textContent = xhr.responseText;
    registrar(xhr.status >= 200 && xhr.status < 300
      ? 'Completada: respuesta HTTP satisfactoria.'
      : 'Completada: respuesta HTTP ' + xhr.status + '.');
  };
  xhr.onerror = () => registrar('Error de red o bloqueo del navegador (por ejemplo, CORS).');
  xhr.ontimeout = () => registrar('Tiempo de espera agotado (15 segundos).');
  xhr.onabort = () => registrar('Petición cancelada.');
  xhr.onloadend = terminar;
  try {
    xhr.open('GET', url.href, true);
    xhr.send();
  } catch (error) {
    registrar('No se pudo iniciar la petición: ' + error.message);
    terminar();
  }
});
