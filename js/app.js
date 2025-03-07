let clicks = 0;
let posiciones = Array(10).fill(null);
let posicionesJugador = Array(10).fill(null);
let posicionesIA = Array(10).fill(null);
let ganador = [];

// Matriz de memoria de aprendizaje - almacena patrones ganadores
let memoria = Array(25).fill().map(() => Array(3).fill(null));

function iniciarJuego() {
  ocultarMensajeGanador();
  document.getElementById('board-container').addEventListener('click', manejarMovimiento);
  document.getElementById('next-game').addEventListener('click', reiniciarJuegoUI);
  document.getElementById('reset').addEventListener('click', reiniciarJuegoUI);
  document.getElementById('resetMemory').addEventListener('click', borrarMemoria);
}

// Maneja movimientos del jugador y la IA
function manejarMovimiento(evento) {
  clicks++;
  
  if (clicks === 1) {
    manejarPrimerMovimiento(evento);
  } else {
    manejarMovimientosPosterior(evento);
  }
}

// Maneja el primer movimiento del juego
function manejarPrimerMovimiento(evento) {
  const celda = evento.target;
  const posicion = extraerPosicion(evento);
  
  if (!posicion) return;
  
  // Coloca X
  colocarX(evento);
  posicionesJugador[posicion] = 'X';
  posiciones[posicion] = 'X';
  
  // Respuesta al primer movimiento
  if (posicion == '1') {
    moverIA(6); 
    posicionesIA[7] = 'X';
    posiciones[7] = 'X';
  } else {
    moverIA(0); 
    posicionesIA[1] = 'X';
    posiciones[1] = 'X';
  }
}

function manejarMovimientosPosterior(evento) {
  const posicion = extraerPosicion(evento);
  
  // Verifica si la celda ya está ocupada
  if (posiciones[posicion] === 'X') return;
  
  colocarX(evento);
  posicionesJugador[posicion] = 'X';
  posiciones[posicion] = 'X';
  
  // Verificacion de que jugador ganó
  ganador = posicionesJugador;
  if (buscarGanador()) {
    mostrarMensajeGanador();
    return;
  }
  
  // Turno de la IA 
  const movimientoIA = encontrarPosicionDefensiva() - 1;
  moverIA(movimientoIA);
  
  const posicionIA = encontrarPosicionDefensiva();
  posicionesIA[posicionIA] = 'X';
  posiciones[posicionIA] = 'X';
  
  ganador = posicionesIA;
  if (buscarGanador()) {
    mostrarMensajeGanador();
  }
}

// Encuentra posición defensiva basada en lo aprendido
function encontrarPosicionDefensiva() {
  for (let x = 0; x < memoria.length; x++) {
    if (memoria[x][0] != null) {
      const posicion = validarPatron(memoria[x][0], memoria[x][1], memoria[x][2]);
      if (posicion !== false) {
        return posicion;
      }
    }
  }
  
  // Busca patrones de posición única
  for (let x = 0; x < memoria.length; x++) {
    if (memoria[x][0] != null) {
      const posicion = validarPatronUnico(memoria[x][0], memoria[x][1], memoria[x][2]);
      if (posicion !== false) {
        return posicion;
      }
    }
  }
  
  // Si no coincide ningún patrón, toma la primera posición disponible
  for (let i = 1; i < posiciones.length; i++) {
    if (posiciones[i] != 'X') {
      return i;
    }
  }
  
  return false;
}

function validarPatron(x, y, z) {
  if (posicionesJugador[x] == 'X') {
    if ((posicionesJugador[y] == 'X') || (posicionesJugador[z] == 'X')) {
      if (posiciones[x] != 'X') {
        return x;
      }
      if (posiciones[y] != 'X') {
        return y;
      }
      if (posiciones[z] != 'X') {
        return z;
      }
    }
  }
  return false;
}

function validarPatronUnico(x, y, z) {
  if ((posicionesJugador[x] == 'X') || (posicionesJugador[y] == 'X') || (posicionesJugador[z] == 'X')) {
    if (posiciones[x] != 'X') {
      return x;
    }
    if (posiciones[y] != 'X') {
      return y;
    }
    if (posiciones[z] != 'X') {
      return z;
    }
  }
  return false;
}

// Busca ganador y actualiza matriz de memoria
function buscarGanador() {
  // Comprueba fila 1
  if (ganador[1] == 'X') {
    if ((ganador[2] == 'X') && (ganador[3] == 'X')) {
      memoria[0][0] = 1; memoria[0][1] = 2; memoria[0][2] = 3;
      memoria[8][0] = 3; memoria[8][1] = 2; memoria[8][2] = 1;
      memoria[9][0] = 2; memoria[9][1] = 1; memoria[9][2] = 3;
      return true;
    }
    if ((ganador[4] == 'X') && (ganador[7] == 'X')) {
      memoria[1][0] = 1; memoria[1][1] = 4; memoria[1][2] = 7;
      memoria[10][0] = 7; memoria[10][1] = 4; memoria[10][2] = 1;
      memoria[23][0] = 4; memoria[23][1] = 7; memoria[23][2] = 1;
      return true;
    }
    if ((ganador[5] == 'X') && (ganador[9] == 'X')) {
      memoria[2][0] = 1; memoria[2][1] = 5; memoria[2][2] = 9;
      memoria[11][0] = 9; memoria[11][1] = 5; memoria[11][2] = 1;
      memoria[12][0] = 5; memoria[12][1] = 1; memoria[12][2] = 9;
      return true;
    }
  }
  // Comprueba fila 2
  if (ganador[2] == 'X') {
    if ((ganador[5] == 'X') && (ganador[8] == 'X')) {
      memoria[3][0] = 2; memoria[3][1] = 5; memoria[3][2] = 8;
      memoria[13][0] = 8; memoria[13][1] = 5; memoria[13][2] = 2;
      memoria[14][0] = 5; memoria[14][1] = 2; memoria[14][2] = 8;
      return true;
    }
  }
  // Comprueba diagonal y fila 3
  if (ganador[3] == 'X') {
    if ((ganador[5] == 'X') && (ganador[7] == 'X')) {
      memoria[4][0] = 3; memoria[4][1] = 5; memoria[4][2] = 7;
      memoria[15][0] = 7; memoria[15][1] = 5; memoria[15][2] = 3;
      memoria[16][0] = 5; memoria[16][1] = 3; memoria[16][2] = 7;
      return true;
    }
    if ((ganador[6] == 'X') && (ganador[9] == 'X')) {
      memoria[5][0] = 3; memoria[5][1] = 6; memoria[5][2] = 9;
      memoria[17][0] = 9; memoria[17][1] = 6; memoria[17][2] = 3;
      memoria[18][0] = 6; memoria[18][1] = 3; memoria[18][2] = 9;
      return true;
    }
  }
  // Comprueba fila central
  if (ganador[4] == 'X') {
    if ((ganador[5] == 'X') && (ganador[6] == 'X')) {
      memoria[6][0] = 4; memoria[6][1] = 5; memoria[6][2] = 6;
      memoria[19][0] = 6; memoria[19][1] = 5; memoria[19][2] = 4;
      memoria[20][0] = 5; memoria[20][1] = 4; memoria[20][2] = 6;
      return true;
    }
  }
  // Comprueba fila inferior
  if (ganador[7] == 'X') {
    if ((ganador[8] == 'X') && (ganador[9] == 'X')) {
      memoria[7][0] = 7; memoria[7][1] = 8; memoria[7][2] = 9;
      memoria[21][0] = 9; memoria[21][1] = 8; memoria[21][2] = 7;
      memoria[22][0] = 8; memoria[22][1] = 7; memoria[22][2] = 9;
      return true;
    }
  }
  return false;
}

function moverIA(indice) {
  const celdas = document.querySelectorAll('.cuadro');
  celdas[indice].textContent = 'O';
}

function colocarX(evento) {
  const celda = evento.target;
  celda.textContent = 'X';
}

function extraerPosicion(evento) {
  const celda = evento.target;
  return celda.getAttribute('data-number');
}

function mostrarMensajeGanador() {
  document.getElementById('info-partida').style.display = 'block';
}

function ocultarMensajeGanador() {
  document.getElementById('info-partida').style.display = 'none';
}

function reiniciarJuegoUI() {
  ocultarMensajeGanador();
  reiniciarJuego();
}

function reiniciarJuego() {
  const celdas = document.querySelectorAll('.cuadro');
  celdas.forEach(celda => celda.textContent = '');
  
  posiciones = Array(10).fill(null);
  posicionesJugador = Array(10).fill(null);
  posicionesIA = Array(10).fill(null);
  ganador = [];
  clicks = 0;
}

function borrarMemoria() {
  location.reload();
}
const botonBorraMemoria = document.getElementById("borrarMemoria");
botonBorraMemoria.addEventListener("click", borrarMemoria);

// Inicializa el juego 
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('modal').style.display = 'none';
  iniciarJuego();
});