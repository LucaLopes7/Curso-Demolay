// Adicione esta linha no TOPO para carregar as variáveis do .env
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// RECUPERAÇÃO DAS VARIÁVEIS DE AMBIENTE
// Se a variável não for encontrada no .env, usa uma string de fallback como precaução.
const PALAVRA_CORRETA = process.env.PALAVRA_SECRETA || "DEMOLAY_PADRAO"; 
const SESSION_SECRET = process.env.SESSION_SECRET || "fallback_session_secret"; // <-- Novo

// --- Configuração do Express e Middleware ---
// Permite que o servidor leia os dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração da Sessão (AGORA USA A VARIÁVEL DE AMBIENTE)
app.use(session({
    // Usa a variável SESSION_SECRET do arquivo .env
    secret:"eF2g#XpW!8qK7jR3zY@hA5tM$bV4nC6dL9sP0uI&oT%yL1sF7gH3jK5lZ9xQ2cW0vB4nE8rT6yU1iO", 
    resave: false,
    saveUninitialized: false, 
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // Expira em 24 horas
}));

// --- Rotas da Aplicação ---

// 1. Rota para Login (Recebe a senha do gate.html)
app.post('/login', (req, res) => {
    const inputWord = req.body.emulationWord ? req.body.emulationWord.toUpperCase().trim() : '';

    if (inputWord === PALAVRA_CORRETA) {
        // CRIAÇÃO DA SESSÃO SEGURA NO SERVIDOR
        req.session.accessGranted = true; 
        res.redirect('/modulos.html'); // Redireciona para o conteúdo protegido
    } else {
        // Se incorreta, volta para o gate com um parâmetro de erro
        res.redirect('/gate.html?error=1'); 
    }
});

// 2. Middleware de Proteção de Conteúdo (Protege o modulos.html)
app.use('/modulos.html', (req, res, next) => {
    // A única verificação confiável: A sessão segura no SERVIDOR
    if (req.session.accessGranted) {
        next(); // Se tiver acesso, continua a servir o arquivo
    } else {
        res.redirect('/gate.html');
    }
});

// 3. Rota de Logout (para encerrar a sessão)
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/index.html');
        }
        // Limpa o cookie da sessão do lado do cliente
        res.clearCookie('connect.sid'); 
        res.redirect('/index.html'); // Redireciona para a página inicial
    });
});

// Rota de serviço de arquivos estáticos (HTML, CSS, JS, Imagens, etc.)
app.use(express.static(path.join(__dirname, '')));

// Inicializa o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Palavra Secreta: ${PALAVRA_CORRETA}`); // Log útil para desenvolvimento
});