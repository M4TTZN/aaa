const totalCasas = 100;
let playerPos = 0;
let score = 0;

// Perguntas Reais e Educativas
const cartasComuns = [
    { q: "Um colega está com um lanche que cheira forte e você não gosta. O que fazer?", opts: ["Falar 'Que nojo!' alto.", "Ignorar e focar no seu próprio lanche."], correct: 1, prize: 10 },
    { q: "Você quer usar o computador, mas tem outra pessoa. Como pedir?", opts: ["Perguntar quanto tempo falta para ela terminar.", "Desligar o monitor para ela sair."], correct: 0, prize: 10 },
    { q: "A professora está explicando algo, mas você lembrou de um desenho legal.", opts: ["Interromper para contar do desenho.", "Esperar ela terminar para falar com ela."], correct: 1, prize: 10 }
];

const cartasDificeis = [
    { q: "SUPER DESAFIO: Alguém está sendo excluído da brincadeira injustamente. Como agir?", opts: ["Ficar quieto para não sobrar para você.", "Convidar a pessoa para o seu grupo e falar com o monitor."], correct: 1, prize: 50 },
    { q: "SUPER DESAFIO: Você sentiu uma crise de raiva chegando. Qual a melhor técnica?", opts: ["Gritar o mais alto possível.", "Pedir licença para ir a um lugar calmo e respirar fundo."], correct: 1, prize: 50 }
];

// Gerar o caminho em formato de circuito (Sinuoso)
function generatePath() {
    const path = document.getElementById('game-path');
    for (let i = 0; i < totalCasas; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        if (i % 10 === 0 && i !== 0) tile.classList.add('obstacle-node');
        
        // Lógica de seno/cosseno para fazer o caminho curvo e divertido
        const x = (i * 80) % 1600;
        const row = Math.floor((i * 80) / 1600);
        const y = row * 150 + (Math.sin(i * 0.5) * 40); // Ondulação
        
        tile.style.left = `${x}px`;
        tile.style.top = `${y}px`;
        tile.innerText = i === 0 ? "🚀" : (i % 10 === 0 ? "🔥" : i);
        tile.id = `tile-${i}`;
        path.appendChild(tile);
    }
    updatePlayer(0);
}

function rollDice() {
    const val = Math.floor(Math.random() * 6) + 1;
    document.getElementById('dice-value').innerText = val;
    movePlayer(val);
}

function movePlayer(steps) {
    playerPos = Math.min(totalCasas - 1, playerPos + steps);
    updatePlayer(playerPos);

    setTimeout(() => {
        const isHard = playerPos % 10 === 0 && playerPos !== 0;
        openCard(isHard);
    }, 700);
}

function updatePlayer(pos) {
    const tile = document.getElementById(`tile-${pos}`);
    const player = document.getElementById('player');
    player.style.left = tile.style.left;
    player.style.top = (parseInt(tile.style.top) - 20) + 'px';
    document.getElementById('current-step').innerText = pos;
    tile.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' });
}

function openCard(isHard) {
    const deck = isHard ? cartasDificeis : cartasComuns;
    const card = deck[Math.floor(Math.random() * deck.length)];
    
    const modal = document.getElementById('modal');
    document.getElementById('card-type-label').innerText = isHard ? "🔥 SUPER DESAFIO" : "📘 CARTA SOCIAL";
    document.getElementById('question-text').innerText = card.q;
    
    const box = document.getElementById('options-box');
    box.innerHTML = '';
    
    card.opts.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerText = opt;
        btn.onclick = () => {
            if (index === card.correct) {
                score += card.prize;
                alert("✨ Incrível! Resposta correta!");
            } else {
                playerPos = Math.max(0, playerPos - 4);
                alert("❌ Ops! Essa atitude não ajudou. Volte 4 casas.");
                updatePlayer(playerPos);
            }
            modal.classList.add('hidden');
            document.getElementById('stars').innerText = score;
        };
        box.appendChild(btn);
    });
    modal.classList.remove('hidden');
}

window.onload = generatePath;
