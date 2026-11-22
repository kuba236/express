const express = require('express');
const fs = require('fs');
const path = require('path');

const server = express();
const webPort = 3000;
const pagesPath = path.join(__dirname, 'strony.json');

server.use(express.urlencoded({ extended: true }));

function loadPages() {
    return JSON.parse(fs.readFileSync(pagesPath, 'utf-8'));
}

function savePages(data) {
    fs.writeFileSync(pagesPath, JSON.stringify(data, null, 4), 'utf-8');
}

function validateTitle(slug) {
    if (!slug || !slug.trim()) {
        return 'Page name is required.';
    }
    if (!/^[a-z0-9_-]+$/.test(slug)) {
        return 'Page name can contain only lowercase letters, digits, "-" and "_" (no spaces).';
    }
    if (slug.length < 3 || slug.length > 30) {
        return 'Page name must be between 3 and 30 characters.';
    }
    if (slug === 'newpage') {
        return '"newpage" is a reserved name.';
    }
    return null;
}

function validateContent(content) {
    if (!content || !content.trim()) {
        return 'Content is required.';
    }
    if (content.length > 2000) {
        return 'Content can have at most 2000 characters.';
    }
    return null;
}

function renderForm(error = '', values = {}) {
    return `
        <h1>Add new page</h1>
        ${error ? `<p style="color:red">${error}</p>` : ''}
        <form method="POST" action="/page">
            <label>Page name (used in the link):</label><br>
            <input name="title" value="${values.title || ''}" placeholder="e.g. our-offer" required><br><br>
            <label>Content:</label><br>
            <textarea name="content" rows="8" cols="40" required>${values.content || ''}</textarea><br><br>
            <button type="submit">Save</button>
        </form>
    `;
}

server.get('/', (req, res) => {
    const data = loadPages();
    const links = Object.keys(data)
        .map((key) => `<a href="/page?title=${key}">${data[key].tytul || key}</a>`)
        .join(' | ');

    res.send(`
        <h1>CMS</h1>
        <p>${links} | <a href="/page?title=newpage">Nowa strona</a></p>
    `);
});

server.get('/page', (req, res) => {
    const slug = req.query.title;
    const data = loadPages();

    if (!slug) {
        return res.status(400).send('Missing parameter. Try /page?title=o-mnie');
    }

    if (slug === 'newpage') {
        return res.send(renderForm());
    }

    const entry = data[slug];

    if (!entry) {
        return res.status(404).send(`Page "${slug}" not found`);
    }

    const paragraphs = Array.isArray(entry.tresc)
        ? entry.tresc.map((line) => `<p>${line}</p>`).join('')
        : `<p>${entry.tresc}</p>`;

    res.send(`
        <h1>${entry.tytul}</h1>
        <h2>${entry.wstep || ''}</h2>
        ${paragraphs}
    `);
});

server.post('/page', (req, res) => {
    const { title, content } = req.body;

    const error = validateTitle(title) || validateContent(content);
    if (error) {
        return res.status(400).send(renderForm(error, { title, content }));
    }

    const data = loadPages();

    if (data[title]) {
        return res.status(400).send(renderForm('A page with this name already exists.', { title, content }));
    }

    data[title] = {
        tytul: title,
        wstep: '',
        tresc: content.trim().split(/\r?\n/),
    };
    savePages(data);

    res.send(`Page saved! <a href="/page?title=${title}">Open it</a>`);
});

server.listen(webPort, () => {
    console.log(`Server is running on http://localhost:${webPort}`);
});