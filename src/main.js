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
  lengthDisplay.textContent = `${rangeInput.value} characters`;
});

function generatePassword() {
  if (rangeInput.value < 4) {
    alert("Minimum length is 4 characters!");
    return "";
  }

  let characters = "";
  if (majuscules.checked) characters += CHARS.Majuscules;
  if (minuscules.checked) characters += CHARS.Minuscules;
  if (chiffres.checked) characters += CHARS.Chiffres;
  if (symboles.checked) characters += CHARS.Symboles;

  if (characters === "") {
    alert("Please select at least one option!");
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
  let label = "Weak";
  if (strength > 70) {
    color = "green";
    label = "Strong";
  } else if (strength > 40) {
    color = "orange";
    label = "Medium";
  }

  progressBar.style.backgroundColor = color;
  strengthText.textContent = `${label} (${strength}/100)`;
  strengthText.style.color = color;
}

function copyPassword(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Password copied!");
  });
}

function updateStats() {
  const total = savedPasswords.length;
  const strong = savedPasswords.filter(p => calculateStrength(p.password) > 70).length;
  const avgLength =
    total > 0
      ? Math.round(savedPasswords.reduce((acc, p) => acc + p.password.length, 0) / total)
      : 0;

  stats[0].textContent = total;
  stats[1].textContent = strong;
  stats[2].textContent = avgLength;
}

function renderPasswords() {
  savedPasswordsContainer.innerHTML = "";

  if (savedPasswords.length === 0) {
    const noPasswordMsg = document.createElement("p");
    noPasswordMsg.textContent = "No saved passwords";
    noPasswordMsg.className = "text-center text-gray-500 font-semibold";
    savedPasswordsContainer.appendChild(noPasswordMsg);
    return;
  }

  savedPasswords.forEach((item, index) => {
    let color = "red";
    if (item.strength > 70) color = "green";
    else if (item.strength > 40) color = "orange";

    const div = document.createElement("div");
    div.className = "bg-white rounded-xl flex items-start justify-between p-4 shadow gap-4";

    div.innerHTML = `
      <div>
        <span class="text font-mono">${item.password}</span>
        <span class="text block text-gray-500">
          Created on ${item.date} <br>
          Strength: ${item.strength}/100 
          <span style="display:inline-block;width:10px;height:10px;background-color:${color};border-radius:50%;margin-left:5px;"></span>
        </span>
      </div>
      <div class="flex flex-col gap-2">
        <button class="bg-green-500 text-white rounded-xl px-3 py-2">Copy</button>
        <button class="bg-red-500 text-white rounded-xl px-3 py-2">Delete</button>
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
    alert("Please enter the website name!");
    return;
  }

  const password = generatePassword();
  if (password !== "") {
    const strength = calculateStrength(password);
    const creationDate = new Date().toLocaleDateString("en-GB");

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
lengthDisplay.textContent = `${rangeInput.value} characters`;
updateProgressBar(0);
renderPasswords();





