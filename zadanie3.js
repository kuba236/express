const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3003;
const USERS_DATABASE = path.join(__dirname, "uzytkownicy.json");

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send(`
    <h1>Rejestracja</h1>
    <form action="/rejestracja" method="POST">
      <label>Imię: <input name="imie" required></label><br><br>
      <label>E-mail: <input name="email" type="email" required></label><br><br>
      <label>Wiek: <input name="wiek" type="number" min="1" required></label><br><br>
      <label>Hasło: <input name="haslo" type="password" required></label><br>
      <small>Minimum 8 znaków, mała i wielka litera oraz cyfra.</small><br><br>
      <button type="submit">Zarejestruj</button>
    </form>
  `);
});

app.post("/rejestracja", (req, res) => {
  const imie = req.body.imie?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const haslo = req.body.haslo;
  const wiek = Number(req.body.wiek);

  if (!Number.isInteger(wiek) || wiek < 18) {
    return res.send("Rejestracja jest dostępna tylko dla osób pełnoletnich. <a href='/'>Wróć</a>");
  }

  const silneHaslo = haslo.length >= 8
    && /[a-z]/.test(haslo)
    && /[A-Z]/.test(haslo)
    && /[0-9]/.test(haslo);

  if (!silneHaslo) {
    return res.status(400).send("Hasło jest za słabe. <a href='/'>Wróć</a>");
  }

  const uzytkownicy = JSON.parse(fs.readFileSync(USERS_DATABASE, "utf8"));

  if (uzytkownicy.some((uzytkownik) => uzytkownik.email === email)) {
    return res.send("Użytkownik z takim e-mailem już istnieje. <a href='/'>Wróć</a>");
  }

  uzytkownicy.push({
    imie,
    email,
    wiek,
    haslo
  });

  fs.writeFileSync(USERS_DATABASE, JSON.stringify(uzytkownicy, null, 2));
  res.send("Rejestracja zakończona pomyślnie. <a href='/'>Wróć</a>");
});

app.listen(PORT, () => {
  console.log(`Zadanie 3: http://localhost:${PORT}`);
});
