const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;


function createDeck() {
  const d = [];
  for (const suit of SUITS)
    for (const rank of RANKS)
      d.push({ rank, suit });
  return d;
}

function shuffleDeck(d) {
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

function drawCard() {
  if (deck.length === 0) deck = shuffleDeck(createDeck());
  return deck.pop();
}


function cardValue(card) {
  if (['J', 'Q', 'K'].includes(card.rank)) return 10;
  if (card.rank === 'A') return 11;
  return parseInt(card.rank);
}

function calculateScore(hand) {
  let score = 0, aces = 0;
  for (const card of hand) {
    score += cardValue(card);
    if (card.rank === 'A') aces++;
  }
  while (score > 21 && aces > 0) { score -= 10; aces--; }
  return score;
}

function isBlackjack(hand) {
  if (hand.length !== 2) return false;
  const ranks = hand.map(c => c.rank);
  return ranks.includes('A') && ranks.some(r => ['10', 'J', 'Q', 'K'].includes(r));
}


function cardLabel(card) {
  return card.rank + card.suit;
}

function renderHand(hand, containerId, hideSecond = false) {
  const container = document.getElementById(containerId);
  container.innerHTML = hand.map((card, i) =>
    (hideSecond && i === 1) ? '[?]' : cardLabel(card)
  ).join('  ');
}

function updateScores(hideDealer = false) {
  document.getElementById('player-score').textContent =
    'Score : ' + calculateScore(playerHand);
  document.getElementById('dealer-score').textContent = hideDealer
    ? 'Score : ' + cardValue(dealerHand[0])
    : 'Score : ' + calculateScore(dealerHand);
}

function setMessage(msg) {
  document.getElementById('message').textContent = msg;
}

function setButtons(hitEnabled, standEnabled) {
  document.getElementById('btn-hit').disabled = !hitEnabled;
  document.getElementById('btn-stand').disabled = !standEnabled;
  document.getElementById('btn-new-game').style.display = gameOver ? 'inline' : 'none';
}


function startGame() {
  deck = shuffleDeck(createDeck());
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];
  gameOver = false;

  renderHand(dealerHand, 'dealer-cards', true);
  renderHand(playerHand, 'player-cards', false);
  updateScores(true);
  setButtons(true, true);

  if (isBlackjack(playerHand)) {
    revealDealer();
    gameOver = true;
    setMessage(isBlackjack(dealerHand)
      ? 'Égalité — Double Blackjack !'
      : 'BLACKJACK ! Vous gagnez !'
    );
    setButtons(false, false);
    return;
  }

  setMessage('Tirez ou Restez ?');
}

function hit() {
  if (gameOver) return;
  playerHand.push(drawCard());
  renderHand(playerHand, 'player-cards', false);
  updateScores(true);
  const score = calculateScore(playerHand);
  if (score > 21) {
    gameOver = true;
    revealDealer();
    setMessage('Vous avez dépassé 21 — Vous perdez !');
    setButtons(false, false);
  } else if (score === 21) {
    stand();
  }
}

function stand() {
  if (gameOver) return;
  revealDealer();
  dealerPlay();
}

function revealDealer() {
  renderHand(dealerHand, 'dealer-cards', false);
  updateScores(false);
}

function dealerPlay() {
  const interval = setInterval(() => {
    if (calculateScore(dealerHand) < 17) {
      dealerHand.push(drawCard());
      renderHand(dealerHand, 'dealer-cards', false);
      updateScores(false);
    } else {
      clearInterval(interval);
      determineWinner();
    }
  }, 600);
}

function determineWinner() {
  gameOver = true;
  const p = calculateScore(playerHand);
  const d = calculateScore(dealerHand);
  setButtons(false, false);
  if (d > 21)        setMessage(`La banque dépasse 21 — Vous gagnez ! (${p} vs ${d})`);
  else if (p > d)    setMessage(`Vous gagnez ! (${p} vs ${d})`);
  else if (d > p)    setMessage(`La banque gagne. (${p} vs ${d})`);
  else               setMessage(`Égalité — Push ! (${p} vs ${d})`);
}


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-hit').addEventListener('click', hit);
  document.getElementById('btn-stand').addEventListener('click', stand);
  document.getElementById('btn-new-game').addEventListener('click', startGame);
  startGame();
});