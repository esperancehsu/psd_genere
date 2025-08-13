const rangeInput = document.getElementById("range");
const lengthDisplay = rangeInput.nextElementSibling;
const generateBtn = document.getElementById("generate");

const majuscules = document.getElementById("Majuscules");
const minuscules = document.getElementById("Minuscules");
const chiffres = document.getElementById("Chiffres");
const symboles = document.getElementById("Symboles");

const savedPasswordsContainer = document.querySelector(".grid.grid-cols-1");
const stats = document.querySelectorAll(".grid.grid-cols-3 span.text-blue-600");


const progressBar = document.querySelector('[role="progressbar"] > div');
const strengthText = document.getElementById("strengthText"); 

const CHARS = {
  Majuscules: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  Minuscules: "abcdefghijklmnopqrstuvwxyz",
  Chiffres: "0123456789",
  Symboles: "!@#$%^&*()-_=+[]{};:,.<>/?"
};

let savedPasswords = [];

rangeInput.addEventListener("input", () => {
  lengthDisplay.textContent = `${rangeInput.value} caractères`;
});


function generatePassword() {
  if (rangeInput.value < 4) {
    alert("La longueur minimale est de 4 caractères !");
    return "";
  }

  let characters = "";
  if (majuscules.checked) characters += CHARS.Majuscules;
  if (minuscules.checked) characters += CHARS.Minuscules;
  if (chiffres.checked) characters += CHARS.Chiffres;
  if (symboles.checked) characters += CHARS.Symboles;

  if (characters === "") {
    alert("Veuillez sélectionner au moins une option !");
    return "";
  }

  let password = "";
  for (let i = 0; i < rangeInput.value; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}


function calculateStrength(password) {
  let score = 0;
  if (!password) return 0;

  const lengthPoints = Math.min(password.length, 12) * (40 / 12);
  score += lengthPoints;

  let typesCount = 0;
  if (/[A-Z]/.test(password)) typesCount++;
  if (/[a-z]/.test(password)) typesCount++;
  if (/[0-9]/.test(password)) typesCount++;
  if (/[^A-Za-z0-9]/.test(password)) typesCount++;

  score += (typesCount / 4) * 60;

  return Math.round(score);
}


function updateProgressBar(strength) {
  progressBar.style.width = strength + "%";

  let color = "red";
  let label = "Faible";
  if (strength > 70) {
    color = "green";
    label = "Fort";
  } else if (strength > 40) {
    color = "orange";
    label = "Moyen";
  }

  progressBar.style.backgroundColor = color;


  strengthText.textContent = `${label} (${strength}/100)`;
  strengthText.style.color = color;
}

function copyPassword(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Mot de passe copié !");
  });
}


function updateStats() {
  const total = savedPasswords.length;
  const forts = savedPasswords.filter(p => calculateStrength(p.password) > 70).length;
  const longueurMoyenne =
    total > 0
      ? Math.round(savedPasswords.reduce((acc, p) => acc + p.password.length, 0) / total)
      : 0;

  stats[0].textContent = total;
  stats[1].textContent = forts;
  stats[2].textContent = longueurMoyenne;
}


function renderPasswords() {
  savedPasswordsContainer.innerHTML = "";

  savedPasswords.forEach((item, index) => {
    let color = "red";
    if (item.strength > 70) color = "green";
    else if (item.strength > 40) color = "orange";

    const div = document.createElement("div");
    div.className =
      "bg-white rounded-xl flex items-start justify-between p-4 shadow gap-4";

    div.innerHTML = `
      <div>
        <span class="text font-mono">${item.password}</span>
        <span class="text block text-gray-500">
          Créé le ${item.date} <br>
          Force: ${item.strength}/100 
          <span style="display:inline-block;width:10px;height:10px;background-color:${color};border-radius:50%;margin-left:5px;"></span>
        </span>
      </div>
      <div class="flex flex-col gap-2">
        <button class="bg-green-500 text-white rounded-xl px-3 py-2">Copier</button>
        <button class="bg-red-500 text-white rounded-xl px-3 py-2">Supprimer</button>
      </div>
    `;

    div.querySelector(".bg-green-500").addEventListener("click", () => {
      copyPassword(item.password);
    });

    div.querySelector(".bg-red-500").addEventListener("click", () => {
      savedPasswords.splice(index, 1);
      renderPasswords();
      updateStats();
    });

    savedPasswordsContainer.appendChild(div);
  });
}

generateBtn.addEventListener("click", () => {
  const website = document.getElementById("website").value.trim();
  if (website === "") {
    alert("Veuillez entrer le nom du site web !");
    return;
  }

  const password = generatePassword();
  if (password !== "") {
    const strength = calculateStrength(password);
    const creationDate = new Date().toLocaleDateString("fr-FR");

    savedPasswords.push({
      password,
      website,
      date: creationDate,
      strength: strength
    });

    renderPasswords();
    updateStats();
    updateProgressBar(strength);
  }
});

rangeInput.min = 4;
rangeInput.value = 17;
lengthDisplay.textContent = `${rangeInput.value} caractères`;
updateProgressBar(0);
