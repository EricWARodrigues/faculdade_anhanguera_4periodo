document.getElementById("contactForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Impede o envio do formulário

  // Limpa mensagens de erro
  document.querySelectorAll(".error").forEach(function(error) {
    error.textContent = "";
    error.style.display = "none";
  });
  document.getElementById("formMessage").textContent = "";

  // Validação
  let hasError = false;

  const name = document.getElementById("name").value.trim();
  if (name === "") {
    // Gerado por IA
    // const errorElement = document.getElementById("nameError");
    // errorElement.textContent = "Por favor, insira seu nome.";
    // errorElement.style.display = "block";
    // hasError = true;
    // Código do professor
    document.getElementById("nameError").textContent = "Por favor, insira seu nome.";
    document.getElementById("nameError").style.display = "block";
    hasError = true;
  }

  const email = document.getElementById("email").value.trim();
  if (email === "") {
    document.getElementById("emailError").textContent = "Por favor, insira seu email.";
    document.getElementById("emailError").style.display = "block";
    hasError = true;
  }

  const subject = document.getElementById("subject").value.trim();
  if (subject === "") {
    document.getElementById("subjectError").textContent = "Por favor, insira um assunto.";
    document.getElementById("subjectError").style.display = "block";
    hasError = true;
  }

  const message = document.getElementById("message").value.trim();
  if (message === "") {
    document.getElementById("messageError").textContent = "Por favor, insira uma mensagem.";
    document.getElementById("messageError").style.display = "block";
    hasError = true;
  }

  // Exibir mensagem de sucesso ou erro
  if (!hasError) {
    document.getElementById("formMessage").textContent = "Formulário enviado com sucesso!";
    document.getElementById("formMessage").style.color = "green";
    // Aqui você pode adicionar código para enviar os dados do formulário para um servidor, se necessário
  } else {
    document.getElementById("formMessage").textContent = "Por favor, corrija os erros acima e tente novamente.";
    document.getElementById("formMessage").style.color = "red";
  }
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}