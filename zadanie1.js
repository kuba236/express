const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;



app.get("/", (req,res) => {
  res.send(`
    <h1>Sklep spożywczy</h1>
    <p>Wybierz produkty:</p>
    <a href="/produkty?typ=owoce">Owoce</a> |
    <a href="/produkty?typ=warzywa">Warzywa</a>
  `);
});


app.get("/produkty", (req, res) => {
  const typ = req.query.typ;

  const sciezka = path.join(__dirname, "produkty.json");
  const dane = JSON.parse(fs.readFileSync(sciezka, "utf8"));

  if (!typ || !dane[typ]) {
    return res.status(400).send(`
      <h1>Nieznany typ produktów</h1>
      <p>Użyj adresu /produkty?typ=owoce lub /produkty?typ=warzywa.</p>
      <a href="/">Wróć</a>
    `);
  }

  const lista = dane[typ]
    .map((produkt) => `<li>${produkt.nazwa} – ${produkt.cena.toFixed(2)} zł/kg</li>`)
    .join("");

  res.send(`
    <h1>${typ === "owoce" ? "Owoce" : "Warzywa"}</h1>
    <ul>${lista}</ul>
    <a href="/">Wróć</a>
  `);
});

app.listen(PORT, () => {
  console.log(`Zadanie 1: http://localhost:${PORT}`);
});

