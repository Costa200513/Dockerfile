const tarjetas = [
  ...document.querySelectorAll(".tarjeta")
];

const zonas = [
  ...document.querySelectorAll(".zona")
];

const pool =
  document.getElementById("tarjetas");

const resultado =
  document.getElementById("resultado");

const zonaAmbas =
  document.getElementById("zonaAmbas");

const contenedorZonas =
  document.getElementById("zonas");

const preguntaFinal =
  document.getElementById("preguntaFinal");

let arrastrada = null;

let ambasVisible = false;


/* =========================
   ARRASTRAR TARJETAS
========================= */

tarjetas.forEach((tarjeta) => {

  tarjeta.addEventListener(
    "dragstart",
    () => {

      arrastrada = tarjeta;

      tarjeta.classList.add(
        "dragging"
      );

    }
  );


  tarjeta.addEventListener(
    "dragend",
    () => {

      tarjeta.classList.remove(
        "dragging"
      );

      arrastrada = null;

    }
  );

});


/* =========================
   ZONAS DE DESTINO
========================= */

zonas.forEach((zona) => {

  zona.addEventListener(
    "dragover",
    (event) => {

      event.preventDefault();

      zona.classList.add(
        "sobre"
      );

    }
  );


  zona.addEventListener(
    "dragleave",
    () => {

      zona.classList.remove(
        "sobre"
      );

    }
  );


  zona.addEventListener(
    "drop",
    (event) => {

      event.preventDefault();

      zona.classList.remove(
        "sobre"
      );


      if (!arrastrada) {
        return;
      }


      const destino =
        zona.querySelector(
          ".drop"
        );


      destino.appendChild(
        arrastrada
      );


      arrastrada.classList.remove(
        "correcta",
        "incorrecta"
      );

    }
  );

});


/* =========================
   DEVOLVER AL INICIO
========================= */

pool.addEventListener(
  "dragover",
  (event) => {

    event.preventDefault();

  }
);


pool.addEventListener(
  "drop",
  (event) => {

    event.preventDefault();


    if (!arrastrada) {
      return;
    }


    pool.appendChild(
      arrastrada
    );


    arrastrada.classList.remove(
      "correcta",
      "incorrecta"
    );

  }
);


/* =========================
   COMBINACIONES DE TECLAS
========================= */

/*

Ctrl + Shift + A
Muestra u oculta
la sección "Ambas".

Ctrl + Shift + N
Muestra la pregunta final.

*/

document.addEventListener(
  "keydown",
  (event) => {

    const tecla =
      event.key.toLowerCase();


    /* MOSTRAR AMBAS */

    if (
      event.ctrlKey &&
      event.shiftKey &&
      tecla === "a"
    ) {

      event.preventDefault();


      ambasVisible =
        !ambasVisible;


      zonaAmbas.classList.toggle(
        "visible",
        ambasVisible
      );


      zonaAmbas.setAttribute(
        "aria-hidden",
        ambasVisible
          ? "false"
          : "true"
      );


      contenedorZonas.classList.toggle(
        "mostrar-ambas",
        ambasVisible
      );


      /*
      Si se vuelve a ocultar
      la sección Ambas,
      sus tarjetas regresan
      al espacio inicial.
      */

      if (!ambasVisible) {

        const tarjetasAmbas =
          zonaAmbas.querySelectorAll(
            ".tarjeta"
          );


        tarjetasAmbas.forEach(
          (tarjeta) => {

            pool.appendChild(
              tarjeta
            );

          }
        );

      }

    }


    /* PREGUNTA FINAL */

    if (
      event.ctrlKey &&
      event.shiftKey &&
      tecla === "n"
    ) {

      event.preventDefault();


      if (!preguntaFinal.open) {

        preguntaFinal.showModal();

      }

    }

  }
);


/* =========================
   CERRAR DIALOG
========================= */

document
  .getElementById("cerrarDialog")
  .addEventListener(
    "click",
    () => {

      preguntaFinal.close();

    }
  );


/*
También se puede cerrar
haciendo clic fuera
del cuadro.
*/

preguntaFinal.addEventListener(
  "click",
  (event) => {

    if (
      event.target ===
      preguntaFinal
    ) {

      preguntaFinal.close();

    }

  }
);


/* =========================
   COMPROBAR RESPUESTAS
========================= */

document
  .getElementById("comprobar")
  .addEventListener(
    "click",
    () => {

      let correctas = 0;

      let ubicadas = 0;


      tarjetas.forEach(
        (tarjeta) => {

          tarjeta.classList.remove(
            "correcta",
            "incorrecta"
          );


          const zona =
            tarjeta.closest(
              ".zona"
            );


          if (!zona) {
            return;
          }


          ubicadas++;


          const respuesta =
            tarjeta.dataset.respuesta;


          const seleccion =
            zona.dataset.zona;


          if (
            seleccion ===
            respuesta
          ) {

            tarjeta.classList.add(
              "correcta"
            );

            correctas++;

          } else {

            tarjeta.classList.add(
              "incorrecta"
            );

          }

        }
      );


      if (
        ubicadas <
        tarjetas.length
      ) {

        resultado.textContent =
          "Faltan tarjetas por ubicar.";

        return;

      }


      if (
        correctas ===
        tarjetas.length
      ) {

        resultado.textContent =
          "Correcto. Justifiquen las elecciones usando FROM, RUN y CMD.";

      } else {

        resultado.textContent =
          `${correctas} de ${tarjetas.length} correctas.`;

      }

    }
  );


/* =========================
   REINICIAR
========================= */

document
  .getElementById("reiniciar")
  .addEventListener(
    "click",
    () => {

      tarjetas.forEach(
        (tarjeta) => {

          tarjeta.classList.remove(
            "correcta",
            "incorrecta"
          );


          pool.appendChild(
            tarjeta
          );

        }
      );


      resultado.textContent =
        "";


      ambasVisible =
        false;


      zonaAmbas.classList.remove(
        "visible"
      );


      zonaAmbas.setAttribute(
        "aria-hidden",
        "true"
      );


      contenedorZonas.classList.remove(
        "mostrar-ambas"
      );


      if (
        preguntaFinal.open
      ) {

        preguntaFinal.close();

      }

    }
  );
