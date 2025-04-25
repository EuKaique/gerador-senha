import Toastify from "toastify-js";

import "toastify-js/src/toastify.css";
import "./assets/css/style.css";

const rand = (min, max) => Math.floor(Math.random() * (max - min) + min);
const geraMaiuscula = () => String.fromCharCode(rand(65, 91));
const geraMinuscula = () => String.fromCharCode(rand(97, 123));
const geraNumero = () => String.fromCharCode(rand(48, 58));
const geraSimbolo = () => {
  const simbolos = "!@#$%&*()_+-=";
  return simbolos.charAt(rand(0, simbolos.length));
};

function geraSenha(tamanho, maiusculas, minusculas, numeros, simbolos) {
  const geradores = [];
  if (maiusculas) geradores.push(geraMaiuscula);
  if (minusculas) geradores.push(geraMinuscula);
  if (numeros) geradores.push(geraNumero);
  if (simbolos) geradores.push(geraSimbolo);

  tamanho = Number(tamanho);
  if (!tamanho || geradores.length === 0) return "";

  let senha = "";
  for (let i = 0; i < tamanho; i++) {
    const gerador = geradores[rand(0, geradores.length)];
    senha += gerador();
  }
  return senha;
}

document.addEventListener("DOMContentLoaded", () => {
  const btnNovo = document.getElementById("btn-novo");
  const btnCopiar = document.getElementById("btn-copiar");
  const senhaEl = document.getElementById("senha");

  const inputs = {
    tamanho: document.getElementById("length-input"),
    maiusculas: document.getElementById("letters-max"),
    minusculas: document.getElementById("letters-min"),
    numeros: document.getElementById("numbers"),
    simbolos: document.getElementById("symbols"),
  };

  inputs.tamanho.addEventListener("input", () => {
    const onlyNumbers = inputs.tamanho.value.replace(/[^0-9]/g, "");
    inputs.tamanho.value = onlyNumbers;

    validarFormulario();
  })

  const validarFormulario = () => {
    const tamanho = inputs.tamanho.value >= 4 && inputs.tamanho.value <= 20;
    const peloMenosUm = inputs.maiusculas.checked || inputs.minusculas.checked || inputs.numeros.checked || inputs.simbolos.checked;

    const habilitar = tamanho && peloMenosUm;
    btnNovo.disabled = !habilitar;
    btnCopiar.disabled = true;
  };

  btnNovo.addEventListener("click", () => {
    const novaSenha = geraSenha(
      inputs.tamanho.value,
      inputs.maiusculas.checked,
      inputs.minusculas.checked,
      inputs.numeros.checked,
      inputs.simbolos.checked
    );

    if (novaSenha) {
      senhaEl.textContent = novaSenha;
      btnCopiar.disabled = false;
    } else {
      senhaEl.textContent = "Configure os critérios corretamente.";
      btnCopiar.disabled = true;
    }
  });

  btnCopiar.addEventListener("click", () => {
    const texto = senhaEl.textContent;
    if (!texto || texto === "Configure os critérios corretamente.") return;

    navigator.clipboard.writeText(texto)
      .then(() => {
        Toastify({
          text: "Senha copiada com sucesso!",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#5CB338",
        }).showToast();
      })
      .catch(() => {
        Toastify({
          text: "Não foi possível copiar a senha",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#E52020",
        }).showToast();
      });
  });

  Object.values(inputs).forEach(input => {
    input.addEventListener("input", validarFormulario);
    input.addEventListener("change", validarFormulario);
  });

  validarFormulario();
});
