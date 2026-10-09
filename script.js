const tarjetas = [...document.querySelectorAll(".tarjeta")];
const zonas = [...document.querySelectorAll(".zona")];
const pool = document.getElementById("tarjetas");
const resultado = document.getElementById("resultado");
const zonaAmbas = document.getElementById("zonaAmbas");
const contenedorZonas = document.getElementById("zonas");
const preguntaFinal = document.getElementById("preguntaFinal");

let arrastrada = null;
let ambasVisible = false;

tarjetas.forEach(tarjeta => {
  tarjeta.addEventListener("dragstart", () => {
    arrastrada = tarjeta;
    tarjeta.classList.add("dragging");
  });

  tarjeta.addEventListener("dragend", () => {
    tarjeta.classList.remove("dragging");
    arrastrada = null;
  });
});

zonas.forEach(zona => {
  zona.addEventListener("dragover", e => {
    e.preventDefault();
    zona.classList.add("sobre");
  });

  zona.addEventListener("dragleave", () => {
    zona.classList.remove("sobre");
  });

  zona.addEventListener("drop", e => {
    e.preventDefault();
    zona.classList.remove("sobre");

    if (!arrastrada) return;

    zona.querySelector(".drop").appendChild(arrastrada);
    arrastrada.classList.remove("correcta", "incorrecta");
  });
});

pool.addEventListener("dragover", e => e.preventDefault());

pool.addEventListener("drop", e => {
  e.preventDefault();
  if (!arrastrada) return;

  pool.appendChild(arrastrada);
  arrastrada.classList.remove("correcta", "incorrecta");
});

/*
  Ctrl + Shift + A -> muestra u oculta "Ambas"
  Ctrl + Shift + N -> abre la pregunta final
*/
document.addEventListener("keydown", e => {
  const tecla = e.key.toLowerCase();

  if (e.ctrlKey && e.shiftKey && tecla === "a") {
    e.preventDefault();

    ambasVisible = !ambasVisible;

    zonaAmbas.classList.toggle("visible", ambasVisible);
    zonaAmbas.setAttribute("aria-hidden", ambasVisible ? "false" : "true");
    contenedorZonas.classList.toggle("mostrar-ambas", ambasVisible);

    if (!ambasVisible) {
      zonaAmbas.querySelectorAll(".tarjeta").forEach(t => pool.appendChild(t));
    }
  }

  if (e.ctrlKey && e.shiftKey && tecla === "n") {
    e.preventDefault();

    if (!preguntaFinal.open) {
      preguntaFinal.showModal();
    }
  }
});

document.getElementById("cerrarDialog").addEventListener("click", () => {
  preguntaFinal.close();
});

preguntaFinal.addEventListener("click", e => {
  if (e.target === preguntaFinal) {
    preguntaFinal.close();
  }
});

document.getElementById("comprobar").addEventListener("click", () => {
  let correctas = 0;
  let ubicadas = 0;

  tarjetas.forEach(t => {
    t.classList.remove("correcta", "incorrecta");

    const zona = t.closest(".zona");
    if (!zona) return;

    ubicadas++;

    if (zona.dataset.zona === t.dataset.respuesta) {
      t.classList.add("correcta");
      correctas++;
    } else {
      t.classList.add("incorrecta");
    }
  });

  if (ubicadas < tarjetas.length) {
    resultado.textContent = "Faltan tarjetas por ubicar.";
  } else if (correctas === tarjetas.length) {
    resultado.textContent = "Correcto. Justifiquen las elecciones usando FROM, RUN y CMD.";
  } else {
    resultado.textContent = `${correctas} de ${tarjetas.length} correctas.`;
  }
});

document.getElementById("reiniciar").addEventListener("click", () => {
  tarjetas.forEach(t => {
    t.classList.remove("correcta", "incorrecta");
    pool.appendChild(t);
  });

  resultado.textContent = "";
  ambasVisible = false;
  zonaAmbas.classList.remove("visible");
  zonaAmbas.setAttribute("aria-hidden", "true");
  contenedorZonas.classList.remove("mostrar-ambas");

  if (preguntaFinal.open) {
    preguntaFinal.close();
  }
});
