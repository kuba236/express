const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3004;
const PLIK_STRON = path.join(__dirname, "strony.json");

app.get("/", (req, res) => {
  res.send(`
    <h1>Prosty CMS</h1>
    <p>Tytuł strony jest parametrem adresu:</p>
    <a href="/strona/o-mnie">O mnie</a> |
    <a href="/strona/wyksztalcenie">Wykształcenie</a> |
    <a href="/strona/kontakt">Kontakt</a>
  `);
  
});

app.get("/strona/:tytul", (req, res) => {
  
  const strony = JSON.parse(fs.readFileSync(PLIK_STRON, "utf8"));
  const strona = strony[req.params.tytul];

  if (!strona) {
    return res.send("Nie znaleziono takiej strony. <a href='/'>Wróć</a>");
  }

  const tresc = strona.tresc.map((akapit) => `<p>${akapit}</p>`).join("");

  res.send(`
    <h1>${strona.tytul}</h1>
    <h2>${strona.wstep}</h2>
    ${tresc}
    <a href="/">Wróć</a>
  `);
});

app.listen(PORT, () => {
  console.log(`Zadanie 4: http://localhost:${PORT}`);
});
