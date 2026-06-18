const SUITS = ['♠','♥','♦','♣'];
const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

let deck=[], player=[], dealer=[], over=false;

const $  = id => document.getElementById(id);
const el = (id, txt, cls) => { $(id).textContent=txt; if(cls!==undefined) $(id).className=cls; };

function shuffle(d) {
  for(let i=d.length-1;i>0;i--){const j=Math.random()*i|0;[d[i],d[j]]=[d[j],d[i]];}
  return d;
}

function deal() {
  if(!deck.length) deck=shuffle(SUITS.flatMap(s=>RANKS.map(r=>({r,s}))));
  return deck.pop();
}

function score(hand) {
  let s=0,a=0;
  for(const c of hand){s+=['J','Q','K'].includes(c.r)?10:c.r==='A'?11:+c.r;if(c.r==='A')a++;}
  while(s>21&&a--) s-=10;
  return s;
}

function isBJ(h) {
  return h.length===2&&h.some(c=>c.r==='A')&&h.some(c=>['10','J','Q','K'].includes(c.r));
}

function cardHTML(c, hidden, delay) {
  if(hidden) return `<div class="card hidden" style="animation-delay:${delay}ms"></div>`;
  const red = '♥♦'.includes(c.s);
  return `<div class="card ${red?'red':'black'}" style="animation-delay:${delay}ms">
    <div class="card-corner"><b>${c.r}</b><span>${c.s}</span></div>
    <div class="card-center">${c.s}</div>
    <div class="card-corner card-corner-bot"><b>${c.r}</b><span>${c.s}</span></div>
  </div>`;
}

function render(hand, id, hideSecond=false) {
  $(id).innerHTML = hand.map((c,i)=>cardHTML(c,hideSecond&&i===1,i*80)).join('');
}

function refresh(hideDealer=false) {
  el('player-score','Score : '+score(player));
  el('dealer-score','Score : '+(hideDealer ? (['J','Q','K'].includes(dealer[0].r)?10:dealer[0].r==='A'?11:+dealer[0].r) : score(dealer)));
}

function buttons(hit, stand) {
  $('btn-hit').disabled=!hit;
  $('btn-stand').disabled=!stand;
  $('btn-new-game').style.display=over?'inline-block':'none';
}

function msg(txt, cls='') { el('message',txt,cls); }

function revealDealer() {
  render(dealer,'dealer-cards');
  refresh();
}

function finish() {
  over=true;
  const p=score(player), d=score(dealer);
  buttons(false,false);
  if(d>21)     msg(`Banque dépasse 21 — Vous gagnez ! (${p} vs ${d})`,'win');
  else if(p>d) msg(`Vous gagnez ! (${p} vs ${d})`,'win');
  else if(d>p) msg(`Banque gagne. (${p} vs ${d})`,'lose');
  else         msg(`Égalité — Push ! (${p} vs ${d})`,'push');
}

function startGame() {
  deck=shuffle(SUITS.flatMap(s=>RANKS.map(r=>({r,s}))));
  player=[deal(),deal()];
  dealer=[deal(),deal()];
  over=false;
  render(dealer,'dealer-cards',true);
  render(player,'player-cards');
  refresh(true);
  buttons(true,true);
  if(isBJ(player)) {
    revealDealer(); over=true;
    msg(isBJ(dealer)?'Égalité — Double Blackjack !':'BLACKJACK ! Vous gagnez !', isBJ(dealer)?'push':'win');
    buttons(false,false);
  } else {
    msg('Tirez ou Restez ?');
  }
}

function hit() {
  if(over) return;
  player.push(deal());
  render(player,'player-cards');
  refresh(true);
  const s=score(player);
  if(s>21){ over=true; revealDealer(); msg('Dépassé 21 — Vous perdez !','lose'); buttons(false,false); }
  else if(s===21) stand();
}

function stand() {
  if(over) return;
  revealDealer();
  const iv=setInterval(()=>{
    if(score(dealer)<17){ dealer.push(deal()); render(dealer,'dealer-cards'); refresh(); }
    else { clearInterval(iv); finish(); }
  },700);
}

$('btn-hit').onclick=hit;
$('btn-stand').onclick=stand;
$('btn-new-game').onclick=startGame;
startGame();