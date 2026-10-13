// CODIGO ABIERTO BY YUNG SAMY - DISCORD: likeadversario
// GITHUB: https://github.com/yungsamy4p/manual-delictual
// INSTAGRAM: https://www.instagram.com/yungsamy4p

document.addEventListener('DOMContentLoaded', () => {

  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  const filterPills = document.querySelectorAll('.pill');
  const cmdCards = document.querySelectorAll('.cmd-card');
  const moduleGroups = document.querySelectorAll('.module-group');
  const cmdCount = document.getElementById('cmdCount');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  // Actualizar contador inicial
  if (cmdCount) {
    cmdCount.textContent = cmdCards.length;
  }

  // FILTRADO POR TEXTO Y CATEGORÍA
  let currentCategory = 'all';

  function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();

    if (query.length > 0) {
      clearSearch.style.display = 'block';
    } else {
      clearSearch.style.display = 'none';
    }

    let visibleCards = 0;

    moduleGroups.forEach(group => {
      const groupCategory = group.getAttribute('data-module');
      const cardsInGroup = group.querySelectorAll('.cmd-card');
      let groupHasMatch = false;

      cardsInGroup.forEach(card => {
        const textToSearch = (
          card.innerText + ' ' + 
          (card.getAttribute('data-keywords') || '')
        ).toLowerCase();

        const matchesQuery = query === '' || textToSearch.includes(query);
        const matchesCategory = currentCategory === 'all' || groupCategory === currentCategory;

        if (matchesQuery && matchesCategory) {
          card.style.display = 'flex';
          groupHasMatch = true;
          visibleCards++;
        } else {
          card.style.display = 'none';
        }
      });

      // Mostrar u ocultar el grupo entero si no tiene coincidencias
      group.style.display = groupHasMatch ? 'block' : 'none';
    });

    if (cmdCount) {
      cmdCount.textContent = visibleCards;
    }
  }

  searchInput.addEventListener('input', applyFilters);

  clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    applyFilters();
    searchInput.focus();
  });

  // FILTRADO POR BOTONES (PILLS)
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-filter');
      applyFilters();
    });
  });

  // COPIAR COMANDO AL PORTAPAPELES
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Comando copiado: ${textToCopy}`);
      } catch (err) {
        // Fallback para navegadores antiguos
        const input = document.createElement('input');
        input.value = textToCopy;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast(`Comando copiado: ${textToCopy}`);
      }
    });
  });

  function showToast(message) {
    if (!toast) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // SIMULADOR INTERACTIVO DE /acto-semanal Y /stop-misiones
  const simRobo = document.getElementById('simRobo');
  const simEstadoCiclo = document.getElementById('simEstadoCiclo');
  const simProgreso = document.getElementById('simProgreso');
  const progresoVal = document.getElementById('progresoVal');
  const btnSimular = document.getElementById('btnSimular');
  const terminalOutput = document.getElementById('terminalOutput');

  if (simProgreso && progresoVal) {
    simProgreso.addEventListener('input', (e) => {
      progresoVal.textContent = `${e.target.value} / 3`;
    });
  }

  if (btnSimular) {
    btnSimular.addEventListener('click', () => {
      const robo = simRobo.value;
      const estado = simEstadoCiclo.value;
      const completados = parseInt(simProgreso.value, 10);
      const limite = 3;

      terminalOutput.textContent = 'Procesando interacción Discord /acto-semanal...\n';

      setTimeout(() => {
        // MISIONES CONGELADAS CON /stop-misiones
        if (estado === 'pausado') {
          terminalOutput.textContent = 
`❌ INTERACCIÓN RECHAZADA (CÓDIGO: MISIONES_STOPPED)

<:warnilegal:1516913733778276432> Misiones Semanales Pausadas:
El registro de misiones semanales se encuentra temporalmente congelado por la Administración para gestión y liquidación del sistema.

🔒 Ningún dato de tu organización se ha perdido.
📡 Estado: Espera a que el Staff reanude el ciclo con /stop-misiones accion:🟢 Reanudar.`;
          return;
        }

        // LÍMITE SEMANAL ALCANZADO
        if (completados >= limite) {
          terminalOutput.textContent = 
`❌ CUOTA ALCANZADA (CÓDIGO: MAX_LIMIT_REACHED)

<:warnilegal:1516913733778276432> Límite Semanal Alcanzado:
La organización ya completó su cuota de ${limite}/${limite} actos de la misión semanal.

Esperen al reinicio de la Administración para volver a registrar.`;
          return;
        }

        // REGISTRO EXITOSO
        const nuevos = completados + 1;
        const metaCumplida = nuevos >= limite;
        const idRandom = Math.floor(100 + Math.random() * 900);

        terminalOutput.textContent = 
`✅ RESPUESTA DISCORD EMBED [200 OK]

🎯 MISIÓN SEMANAL: ACTO REGISTRADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ID Registro: #REG-${idRandom}
Robo Seleccionado: ${robo}
Fecha: ${new Date().toLocaleDateString('es-CL')} (DD/MM/AA)
Progreso Semanal: ${nuevos}/${limite} Completados

Miembros: Operador_1, Operador_2, Operador_3
Evidencia Foto: [https://cdn.discordapp.com/.../prueba.png]

${metaCumplida ? '🏆 ¡META SEMANAL COMPLETADA! (Notificado al canal de logs del Staff)' : '⏳ Continúa la operación criminal.'}`;
      }, 400);
    });
  }

});
