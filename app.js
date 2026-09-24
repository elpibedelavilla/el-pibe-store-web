const apps = [
  {name:'EDTVOD', slug:'edtvod', image:'edtvod.png', pin:'583214'},
  {name:'ES-P2P', slug:'esp2p', image:'esp2p.png', pin:'741926'},
  {name:'Fénix', slug:'fenix', image:'fenix.png', pin:'368517'},
  {name:'Ibero VU', slug:'iberovu', image:'iberovu.png', pin:'925403'},
  {name:'IBO Ibérica', slug:'iboiberica', image:'iboiberica.png', pin:'614872'},
  {name:'iBOX', slug:'ibox', image:'ibox.png', pin:'437195'},
  {name:'IPVanish', slug:'ipvanish', image:'ipvanish.png', pin:'852641'},
  {name:'Media VOD', slug:'mediavod', image:'mediavod.png', pin:'296738'},
  {name:'Neweden', slug:'newe1', image:'newe1.png', pin:'573809'},
  {name:'El Pibe Stream', slug:'elpibestream', image:'elpibestream.jpg', pin:'418625'},
  {name:'Surfshark', slug:'surfshark', image:'surfshark.jpg', pin:'769314'},
  {name:'V8', slug:'v8', image:'v8.png', pin:'135947'},
  {name:'VU Player', slug:'vuplayer', image:'vuplayer.png', pin:'684253'},
  {name:'Dino', slug:'dino', image:'dino.png', pin:'327581'}
];

// Para cambiar precios en el futuro, edita solamente estos valores.
// Los precios con TV BOX se calculan automáticamente sumando TV_BOX_EXTRA.
const packages = [
  {name:'P2P', prices:{3:25, 6:40, 12:70}},
  {name:'IBERICA', prices:{3:30, 6:50, 12:80}},
  {name:'TREX', prices:{3:25, 6:40, 12:70}},
  {name:'CRYSTAL', prices:{3:25, 6:40, 12:60}}
];

const TV_BOX_EXTRA = 50;
const grid = document.getElementById('appsGrid');

function pedirPin(app) {
  let codigo = '';

  const overlay = document.createElement('div');
  overlay.className = 'pin-overlay';

  overlay.innerHTML = `
    <div class="pin-modal">
      <button class="pin-close" type="button" aria-label="Cerrar">×</button>

      <div class="pin-icon">🔐</div>
      <h2>${app.name}</h2>
      <p class="pin-text">Introduce el código de descarga</p>

      <div class="pin-display">
        ${[0,1,2,3,4,5].map(i =>
          `<span class="pin-digit" data-pos="${i}"></span>`
        ).join('')}
      </div>

      <div class="pin-message"></div>

      <div class="pin-keypad">
        ${[1,2,3,4,5,6,7,8,9].map(n =>
          `<button type="button" class="pin-key" data-number="${n}">${n}</button>`
        ).join('')}

        <button type="button" class="pin-key pin-clear">⌫</button>
        <button type="button" class="pin-key" data-number="0">0</button>
        <button type="button" class="pin-key pin-ok">OK</button>
      </div>

      <button type="button" class="pin-cancel">CANCELAR</button>
    </div>
  `;

  document.body.appendChild(overlay);

  const digits = [...overlay.querySelectorAll('.pin-digit')];
  const message = overlay.querySelector('.pin-message');
  const numberKeys = [...overlay.querySelectorAll('[data-number]')];
  const clearKey = overlay.querySelector('.pin-clear');
  const okKey = overlay.querySelector('.pin-ok');
  const cancelKey = overlay.querySelector('.pin-cancel');
  const closeKey = overlay.querySelector('.pin-close');

  function actualizarPantalla() {
    digits.forEach((digit, i) => {
      digit.textContent = i < codigo.length ? '●' : '';
      digit.classList.toggle('filled', i < codigo.length);
    });
  }

  function cerrar() {
    document.removeEventListener('keydown', tecladoFisico, true);
    overlay.remove();
  }

  function comprobar() {
    if (codigo.length !== 6) {
      message.textContent = 'Introduce los 6 números.';
      return;
    }

    if (codigo === app.pin) {
      message.textContent = '✓ Código correcto';
      document.removeEventListener('keydown', tecladoFisico, true);

      setTimeout(() => {
        window.location.href = `https://dl.epdlv72.com/${app.slug}`;
      }, 350);
    } else {
      message.textContent = 'Código incorrecto';
      overlay.querySelector('.pin-modal').classList.add('pin-error');

      setTimeout(() => {
        overlay.querySelector('.pin-modal').classList.remove('pin-error');
      }, 400);

      codigo = '';
      actualizarPantalla();
    }
  }

  function agregarNumero(numero) {
    if (codigo.length < 6) {
      codigo += numero;
      message.textContent = '';
      actualizarPantalla();
    }
  }

  function borrarNumero() {
    codigo = codigo.slice(0, -1);
    message.textContent = '';
    actualizarPantalla();
  }

  function tecladoFisico(e) {
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      agregarNumero(e.key);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      e.stopPropagation();
      borrarNumero();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      comprobar();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      cerrar();
    }
  }

  numberKeys.forEach(btn => {
    btn.addEventListener('click', () => agregarNumero(btn.dataset.number));
  });

  clearKey.addEventListener('click', borrarNumero);
  okKey.addEventListener('click', comprobar);
  cancelKey.addEventListener('click', cerrar);
  closeKey.addEventListener('click', cerrar);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) cerrar();
  });

  document.addEventListener('keydown', tecladoFisico, true);

  actualizarPantalla();

  setTimeout(() => {
    const firstKey = overlay.querySelector('.pin-key');
    if (firstKey) firstKey.focus();
  }, 50);
}
apps.forEach(app => {
  const a = document.createElement('a');
  a.className = 'app-card nav-item';
  a.href = '#';
  a.tabIndex = 0;

  a.innerHTML = `
    <img src="assets/${app.image}" alt="${app.name}">
    <div class="app-name">
      ${app.name}
      <span class="download">DESCARGAR</span>
    </div>
  `;

  a.addEventListener('click', e => {
    e.preventDefault();
    pedirPin(app);
  });

  grid.appendChild(a);
});

function offerCard(pkg, withTv) {
  const article = document.createElement('article');
  article.className = 'offer-card';

  const rows = [3,6,12].map(months => {
    const price = pkg.prices[months] + (withTv ? TV_BOX_EXTRA : 0);
    return `<div class="price-row"><span>${months} MESES</span><strong>${price} €</strong></div>`;
  }).join('');

  article.innerHTML = `
    <div class="offer-name">
      ${pkg.name}${withTv ? '<span class="tv-badge">+ TV BOX</span>' : ''}
    </div>
    ${rows}
  `;

  return article;
}

packages.forEach(pkg =>
  document.getElementById('serviceOffers').appendChild(offerCard(pkg,false))
);

packages.forEach(pkg =>
  document.getElementById('tvOffers').appendChild(offerCard(pkg,true))
);

const tabs = [...document.querySelectorAll('.tab-button')];
let activeView = 'apps';
let currentApp = 0;

function appCards(){
  return [...document.querySelectorAll('.app-card')];
}

function columns(){
  const style = getComputedStyle(grid);
  return style.gridTemplateColumns.split(' ').length || 5;
}

function focusApp(i){
  const cards = appCards();
  currentApp = Math.max(0, Math.min(cards.length - 1, i));
  cards[currentApp].focus({preventScroll:true});
  cards[currentApp].scrollIntoView({
    behavior:'smooth',
    block:'center',
    inline:'nearest'
  });
}

function showView(view, focusContent=false){
  activeView = view;


document.getElementById('appsView').hidden = view !== 'apps';
document.getElementById('offersView').hidden = view !== 'offers';
document.getElementById('helpView').hidden = view !== 'help';
document.getElementById('vpnView').hidden = view !== 'vpn';
  

document.getElementById('appsView')
  .classList.toggle('active-view', view === 'apps');

document.getElementById('offersView')
  .classList.toggle('active-view', view === 'offers');

document.getElementById('helpView')
  .classList.toggle('active-view', view === 'help');
  document.getElementById('vpnView')
  .classList.toggle('active-view', view === 'vpn');
 
  tabs.forEach(t =>
    t.classList.toggle('active', t.dataset.view === view)
  );

  if(focusContent && view === 'apps')
    setTimeout(() => focusApp(currentApp), 0);
  else if(focusContent)
    setTimeout(() => tabs[1].focus(), 0);
}

tabs.forEach(tab => {
  tab.addEventListener('click', () =>
    showView(tab.dataset.view, tab.dataset.view === 'apps')
  );

  tab.addEventListener('focus', () => {
    activeView = tab.dataset.view;
  });
});

appCards().forEach((card,i) =>
  card.addEventListener('focus', () => {
    currentApp=i;
    activeView='apps';
  })
);

document.addEventListener('keydown', e => {
  const el = document.activeElement;
  const tabIndex = tabs.indexOf(el);

  if(tabIndex >= 0){
    if(e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
      e.preventDefault();

      const next = e.key === 'ArrowRight'
        ? Math.min(tabIndex+1,tabs.length-1)
        : Math.max(tabIndex-1,0);

      tabs[next].focus();
      showView(tabs[next].dataset.view, false);

} else if(e.key === 'ArrowDown'){
  e.preventDefault();

  if(el.dataset.view === 'apps'){
    showView('apps', true);
  } else {
    showView(el.dataset.view, false);

    window.scrollBy({
      top: Math.round(window.innerHeight * 0.75),
      left: 0,
      behavior: 'auto'
    });
  }

    } else if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      showView(el.dataset.view, el.dataset.view === 'apps');
    }

    return;
       
  }

  // Desplazamiento con mando en secciones que no son APPS
  if(activeView !== 'apps' && (e.key === 'ArrowDown' || e.key === 'ArrowUp')){
    e.preventDefault();

    const desplazamiento = Math.round(window.innerHeight * 0.75);

    window.scrollBy({
      top: e.key === 'ArrowDown' ? desplazamiento : -desplazamiento,
      left: 0,
      behavior: 'smooth'
    });

    return;
  }

  if(el.classList.contains('app-card')){

    const c = columns();
    let next = currentApp;

    if(e.key === 'ArrowRight')
      next = Math.min(currentApp+1, appCards().length-1);

    else if(e.key === 'ArrowLeft')
      next = Math.max(currentApp-1, 0);

    else if(e.key === 'ArrowDown')
      next = Math.min(currentApp+c, appCards().length-1);

    else if(e.key === 'ArrowUp') {
      if(currentApp < c){
        e.preventDefault();
        tabs[0].focus();
        return;
      }

      next = Math.max(currentApp-c,0);

    } else if(e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      el.click();
      return;

    } else return;

    e.preventDefault();
    focusApp(next);
  }
});

window.addEventListener('load', () => {
  showView('apps');

  const barra = document.querySelector('.top-tabs');

  if (barra) {
    barra.scrollLeft = 0;
  }
});
