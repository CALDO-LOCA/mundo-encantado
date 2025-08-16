// Loja estática com carrinho (localStorage), cupons e checkout simulado
const BRL = v => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})

const PRODUCTS = [
  { id:'p1', title:'Blocos Montessori (20 pcs)', age:'1-4 anos', price:49.9, img:'https://images.unsplash.com/photo-1582719478250-0b7bfa7b6f3a?auto=format&fit=crop&w=800&q=60' },
  { id:'p2', title:'Quebra-cabeça Alfabeto', age:'3-6 anos', price:39.5, img:'https://images.unsplash.com/photo-1582719478639-2d6b3f3a0b1f?auto=format&fit=crop&w=800&q=60' },
  { id:'p3', title:'Ábaco Colorido', age:'2-6 anos', price:59.9, img:'https://images.unsplash.com/photo-1559099158-65f6b9b8a6d6?auto=format&fit=crop&w=800&q=60' },
  { id:'p4', title:'Kit Ciência (Experimentos)', age:'6-10 anos', price:129.0, img:'https://images.unsplash.com/photo-1596496057079-6c4d6bfbf1e2?auto=format&fit=crop&w=800&q=60' },
  { id:'p5', title:'Jogo de Formas e Cores', age:'0-3 anos', price:34.9, img:'https://images.unsplash.com/photo-1601758123927-6d2f3f9d6f4b?auto=format&fit=crop&w=800&q=60' }
];

// ---- Estado ----
const state = {
  cart: JSON.parse(localStorage.getItem('cart_v1')||'[]'),
  feedbacks: JSON.parse(localStorage.getItem('feedbacks_v1')||'[]'),
  promo: null,
  frete: 15.0
};
const save = () => {
  localStorage.setItem('cart_v1', JSON.stringify(state.cart));
  localStorage.setItem('feedbacks_v1', JSON.stringify(state.feedbacks));
};

// ---- Render de produtos ----
const grid = document.getElementById('grid');
const search = document.getElementById('search');
const ageFilter = document.getElementById('ageFilter');
function renderProducts(){
  const term = (search.value||'').toLowerCase();
  const age = ageFilter.value;
  const filtered = PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(term) &&
    (age ? p.age.includes(age) : true)
  );
  grid.innerHTML = filtered.map(p => `
    <article class="card-item">
      <img src="${p.img}" alt="${p.title}">
      <h4>${p.title}</h4>
      <div class="muted small">Idade: ${p.age}</div>
      <div class="row">
        <div class="price">${BRL(p.price)}</div>
        <button class="btn small" data-add="${p.id}">Adicionar</button>
      </div>
    </article>
  `).join('');
}
renderProducts();
search.addEventListener('input', renderProducts);
ageFilter.addEventListener('change', renderProducts);
grid.addEventListener('click', e => {
  const id = e.target?.dataset?.add;
  if(!id) return;
  const product = PRODUCTS.find(x=>x.id===id);
  const exists = state.cart.find(x=>x.id===id);
  if(exists){ exists.qty += 1; } else { state.cart.push({ ...product, qty:1 }); }
  save(); renderCart(); openCart();
});

// ---- Carrinho ----
const drawer = document.getElementById('cartDrawer');
const openBtn = document.getElementById('open-cart');
const closeBtn = document.getElementById('close-cart');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotal');
const freteEl = document.getElementById('frete');
const totalEl = document.getElementById('total');
const cupomInput = document.getElementById('cupom');
const applyCupomBtn = document.getElementById('apply-cupom');
const checkoutSimBtn = document.getElementById('checkout-simulado');
const checkoutMsg = document.getElementById('checkoutMsg');
const cepInput = document.getElementById('cep');
const calcFreteBtn = document.getElementById('calc-frete');

function openCart(){ drawer.classList.add('show'); }
function closeCart(){ drawer.classList.remove('show'); }
openBtn.addEventListener('click', openCart);
closeBtn.addEventListener('click', closeCart);
drawer.addEventListener('click', (e)=>{ if(e.target===drawer) closeCart(); });

function cartSubtotal(){ return state.cart.reduce((s,p)=> s + p.price*p.qty, 0); }

function renderCart(){
  cartCount.textContent = state.cart.reduce((s,i)=>s+i.qty,0);
  cartItems.innerHTML = state.cart.length===0 ? '<p class="muted">Carrinho vazio</p>' :
    state.cart.map(item => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.title}">
        <div style="flex:1">
          <div><b>${item.title}</b></div>
          <div class="muted small">${BRL(item.price)} x ${item.qty}</div>
          <div class="qty">
            <button data-dec="${item.id}">-</button>
            <span>${item.qty}</span>
            <button data-inc="${item.id}">+</button>
            <button data-rem="${item.id}" style="margin-left:6px">Remover</button>
          </div>
        </div>
      </div>
    `).join('');
  let discount = 0;
  const sub = cartSubtotal();
  if(state.promo?.type==='percent') discount = (state.promo.value/100)*sub;
  const frete = state.promo?.type==='frete' ? 0 : state.frete;
  subtotalEl.textContent = BRL(sub - discount);
  freteEl.textContent = BRL(frete);
  totalEl.textContent = BRL(Math.max(0, sub - discount + frete));
}
renderCart();

cartItems.addEventListener('click',(e)=>{
  const idInc = e.target?.dataset?.inc;
  const idDec = e.target?.dataset?.dec;
  const idRem = e.target?.dataset?.rem;
  if(idInc){
    const it = state.cart.find(x=>x.id===idInc); it.qty++; save(); renderCart();
  } else if(idDec){
    const it = state.cart.find(x=>x.id===idDec); it.qty = Math.max(1, it.qty-1); save(); renderCart();
  } else if(idRem){
    state.cart = state.cart.filter(x=>x.id!==idRem); save(); renderCart();
  }
});

applyCupomBtn.addEventListener('click', ()=>{
  const code = (cupomInput.value||'').trim().toUpperCase();
  if(code==='BRINCO10') state.promo = { code, type:'percent', value:10 };
  else if(code==='FREEDEL') state.promo = { code, type:'frete', value:0 };
  else state.promo = null;
  renderCart();
});

calcFreteBtn.addEventListener('click', ()=>{
  // Simulação simples por CEP: termina com par -> frete 0
  const cep = (cepInput.value||'').replace(/\D/g,'');
  if(cep.length<8){ alert('Informe um CEP válido (8 dígitos).'); return; }
  state.frete = (parseInt(cep.slice(-1)) % 2 === 0) ? 0 : 15;
  renderCart();
});

checkoutSimBtn.addEventListener('click', ()=>{
  if(state.cart.length===0){ checkoutMsg.textContent = 'Seu carrinho está vazio.'; return; }
  checkoutMsg.textContent = 'Pedido confirmado! Este é um checkout simulado. Substitua pelos seus links de pagamento.';
  state.cart = []; state.promo=null; save(); renderCart();
  setTimeout(()=>{ checkoutMsg.textContent=''; closeCart(); }, 2500);
});

// ---- Feedback ----
const fbList = document.getElementById('feedback-list');
const fbForm = document.getElementById('feedbackForm');
function renderFeedbacks(){
  if(!state.feedbacks.length){
    fbList.innerHTML = '<p class="muted">Seja o primeiro a avaliar nossos produtos!</p>'; return;
  }
  fbList.innerHTML = state.feedbacks.map(f => `
    <div class="card" style="padding:10px;margin:10px 0">
      <div class="row"><b>${f.name||'Anônimo'}</b><span class="muted small">${new Date(f.date).toLocaleDateString('pt-BR')}</span></div>
      <div>${'★'.repeat(f.rating)}${'☆'.repeat(5 - f.rating)}</div>
      ${f.text ? `<p style="margin:6px 0 0">${f.text}</p>`:''}
    </div>
  `).join('');
}
renderFeedbacks();
fbForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const f = {
    id: Date.now(),
    name: document.getElementById('fbName').value,
    rating: Number(document.getElementById('fbRating').value||5),
    text: document.getElementById('fbText').value,
    date: new Date().toISOString()
  };
  state.feedbacks = [f, ...state.feedbacks].slice(0,50);
  save(); renderFeedbacks();
  fbForm.reset();
});
