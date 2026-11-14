"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", () => {
  const aberto = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!aberto));
  menuToggle.setAttribute("aria-label", aberto ? "Abrir menu" : "Fechar menu");
  mainNav.classList.toggle("is-open", !aberto);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  });
});

const products = document.querySelectorAll(".product-card");
const scenarioTitle = document.querySelector("#scenario-title");
const scenarioDescription = document.querySelector("#scenario-description");
const scenarioStep = document.querySelector("#scenario-step");
const scenarioProgress = document.querySelector("#scenario-progress");
const progressLabel = document.querySelector("#progress-label");
const feedbackMessage = document.querySelector("#feedback-message");
const nextButton = document.querySelector("#next-scenario");
const answerButtons = document.querySelectorAll(".answer-button");

const situations = [
  {
    title: "Seu produto ainda funciona",
    description: "O aparelho funciona normalmente, mas foi lançado um modelo novo com pequenas melhorias. O que você faria?",
    conscious: "manter",
    feedback: "Boa reflexão! Se o produto atende às suas necessidades, continuar usando pode evitar gastos e lixo eletrônico."
  },
  {
    title: "Apareceu um pequeno defeito",
    description: "Seu fone de ouvido parou de funcionar de um lado. Antes de comprar outro, você pode procurar assistência ou avaliar o reparo.",
    conscious: "avaliar",
    feedback: "Ótima escolha! Pesquisar se há conserto pode prolongar a vida útil do produto."
  },
  {
    title: "Você precisa de um aparelho para uma tarefa",
    description: "Um eletrônico emprestado ou que você já possui pode atender à necessidade. Antes de comprar outro, qual seria sua primeira atitude?",
    conscious: "avaliar",
    feedback: "Boa escolha! Avaliar alternativas, como usar um aparelho que você já tem ou pedir emprestado, pode evitar uma compra desnecessária."
  }
];

let currentSituation = 0;
let selectedProduct = "Celular";
let answers = [];

products.forEach((button) => {
  button.addEventListener("click", () => {
    products.forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    selectedProduct = button.dataset.product;
    renderSituation();
    document.querySelector("#scenario-title").textContent =
      currentSituation === 0 ? `${selectedProduct}: vale a pena trocar?` : situations[currentSituation].title;
  });
});

function renderSituation() {
  const situation = situations[currentSituation];
  scenarioStep.textContent = `SITUAÇÃO ${currentSituation + 1} DE ${situations.length}`;
  scenarioTitle.textContent = currentSituation === 0 ? `${selectedProduct}: vale a pena trocar?` : situation.title;
  scenarioDescription.textContent = situation.description;
  scenarioProgress.value = currentSituation;
  progressLabel.textContent = `${Math.round((currentSituation / situations.length) * 100)}% concluído`;
  feedbackMessage.textContent = "";
  nextButton.hidden = true;
  answerButtons.forEach((button) => {
    button.disabled = false;
    button.classList.remove("chosen");
  });
}

answerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.dataset.answer;
    answers[currentSituation] = answer;
    answerButtons.forEach((item) => {
      item.disabled = true;
      item.classList.remove("chosen");
    });
    button.classList.add("chosen");

    const situation = situations[currentSituation];
    if (answer === situation.conscious) {
      feedbackMessage.textContent = situation.feedback;
    } else if (answer === "descartar") {
      feedbackMessage.textContent = "Antes de trocar, pense: o produto ainda atende às suas necessidades? Avalie reparo, reutilização ou doação.";
    } else {
      feedbackMessage.textContent = "Boa ideia! Comparar alternativas antes de decidir ajuda a evitar desperdício.";
    }

    scenarioProgress.value = currentSituation + 1;
    progressLabel.textContent = `${Math.round(((currentSituation + 1) / situations.length) * 100)}% concluído`;
    nextButton.hidden = false;
    nextButton.textContent = currentSituation === situations.length - 1 ? "Ver meu resultado →" : "Próxima situação →";
    updateScore();
  });
});

nextButton.addEventListener("click", () => {
  if (currentSituation < situations.length - 1) {
    currentSituation += 1;
    renderSituation();
  } else {
    document.querySelector("#progresso").scrollIntoView({ behavior: "smooth" });
    document.querySelector("#progress-summary").textContent = "Você concluiu as situações! Continue refletindo antes de comprar, trocar ou descartar.";
  }
});

function updateScore() {
  let conscious = 0;
  let thinking = 0;
  let other = 0;
  answers.forEach((answer, index) => {
    if (!answer) return;
    if (answer === situations[index].conscious) conscious += 1;
    else if (answer === "avaliar") other += 1;
    else thinking += 1;
  });
  const answered = answers.filter(Boolean).length;
  const percent = answered ? Math.round((conscious / answered) * 100) : 0;
  document.querySelector("#conscious-count").textContent = conscious;
  document.querySelector("#thinking-count").textContent = thinking;
  document.querySelector("#other-count").textContent = other;
  document.querySelector("#progress-percent").textContent = `${percent}%`;
  document.querySelector("#progress-summary").textContent = `${answered} de ${situations.length} situações respondidas.`;
  document.querySelector("#progress-ring").setAttribute("aria-label", `${percent}% de escolhas conscientes`);
}

document.querySelector("#reset-progress").addEventListener("click", () => {
  currentSituation = 0;
  answers = [];
  products.forEach((item) => item.classList.remove("selected"));
  renderSituation();
  updateScore();
  document.querySelector("#progress-summary").textContent = "Responda às situações para acompanhar suas escolhas.";
  document.querySelector("#decidir").scrollIntoView({ behavior: "smooth" });
});

const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");
const fields = {
  nome: document.querySelector("#nome"),
  email: document.querySelector("#email"),
  mensagem: document.querySelector("#mensagem")
};

function showFieldError(name, message) {
  document.querySelector(`#${name}-error`).textContent = message;
  fields[name].setAttribute("aria-invalid", message ? "true" : "false");
}

Object.entries(fields).forEach(([name, field]) => {
  field.addEventListener("input", () => showFieldError(name, ""));
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formFeedback.textContent = "";
  let valid = true;

  const nome = fields.nome.value.trim();
  const email = fields.email.value.trim();
  const mensagem = fields.mensagem.value.trim();
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (nome.length < 2) {
    showFieldError("nome", "Digite seu nome (pelo menos 2 caracteres).");
    valid = false;
  } else showFieldError("nome", "");

  if (!emailValido) {
    showFieldError("email", "Digite um e-mail válido, como voce@exemplo.com.");
    valid = false;
  } else showFieldError("email", "");

  if (mensagem.length < 10) {
    showFieldError("mensagem", "Escreva uma mensagem com pelo menos 10 caracteres.");
    valid = false;
  } else showFieldError("mensagem", "");

  if (!valid) {
    formFeedback.textContent = "Revise os campos destacados antes de enviar.";
    return;
  }

  formFeedback.textContent = `Obrigada, ${nome}! A validação funcionou. Este formulário é uma demonstração e ainda não envia e-mails.`;
  contactForm.reset();
  Object.keys(fields).forEach((name) => showFieldError(name, ""));
});
