const express = require("express");

const app = express();
const PORT = 3002;

app.get("/", (req, res) => {
  res.send(`
    <h1>Poradnik do gry – wybierz postać</h1>
    <ul>
      <li><a href="/wojownik">Wojownik</a></li>
      <li><a href="/mag">Mag</a></li>
      <li><a href="/lucznik">Łucznik</a></li>
    </ul>
  `);
});

app.get("/wojownik", (req, res) => {
  res.send(`
    <h1>Wojownik</h1>
    <p>Ma dużo punktów życia. Walcz z bliska i używaj tarczy.</p>
    <a href="/">Wróć do wyboru postaci</a>
  `);
});


app.get("/mag", (req, res) => {
  res.send(`
    <h1>Mag</h1>
    <p>Zadaje duże obrażenia zaklęciami. Pilnuj poziomu many i zachowuj dystans.</p>
    <a href="/">Wróć do wyboru postaci</a>
  `);
});



app.get("/lucznik", (req, res) => {
  res.send(`
    <h1>Łucznik</h1>
    <p>Atakuje z daleka. Poruszaj się szybko i nie pozwól wrogom podejść blisko.</p>
    <a href="/">Wróć do wyboru postaci</a>
  `);
});

app.listen(PORT, () => {
  console.log(`Zadanie 2: http://localhost:${PORT}`);
});
