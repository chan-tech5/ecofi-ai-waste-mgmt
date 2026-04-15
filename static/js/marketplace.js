/* ═══════════════════════════════════════
   MARKETPLACE.JS — EcoFi Eco-Commerce
   ═══════════════════════════════════════ */

// ── Product database ──
const PRODUCTS = [
    {
        id: 'tote-bag',
        name: 'Recycled Tote Bag',
        desc: 'Durable everyday tote made from upcycled plastic bottles. Stylish, sturdy, and completely waste-free.',
        price: 299,
        original: 499,
        category: 'bags',
        image: '/static/images/Recycled Tote Bag1.jpeg',
        rating: 4.8,
        reviews: 142,
        eco: ['Saves 12 bottles', 'Zero plastic waste'],
        popular: true,
        new: false,
    },
    {
        id: 'recycled-notebook',
        name: 'Eco Recycled Notebook',
        desc: '100% recycled paper, tree-free, and fully biodegradable. 200-page ruled notebook for everyday writing.',
        price: 199,
        original: 349,
        category: 'stationery',
        image: '/static/images/Recycled Notebook.jpeg',
        rating: 4.6,
        reviews: 98,
        eco: ['100% recycled paper', 'Saves 1 tree'],
        popular: true,
        new: false,
    },
    {
        id: 'water-bottle',
        name: 'Recycled Water Bottle',
        desc: 'BPA-free 750ml bottle crafted from recycled ocean plastics. Double-wall insulated, keeps drinks cold 24 hours.',
        price: 449,
        original: 699,
        category: 'bottles',
        image: '/static/images/Recycled Water Bottle.jpeg',
        rating: 4.9,
        reviews: 217,
        eco: ['Prevents ocean plastic', 'Replaces 500 single-use bottles'],
        popular: true,
        new: false,
    },
    {
        id: 'bamboo-cutlery',
        name: 'Bamboo Cutlery Set',
        desc: 'Portable fork, knife, spoon & straw kit in a roll-up cotton pouch. Perfect for on-the-go zero-waste dining.',
        price: 349,
        original: 549,
        category: 'home',
        image: '/static/images/bamboo-cutlery.jpg',
        rating: 4.7,
        reviews: 86,
        eco: ['Replaces 1000 plastic cutlery', 'Biodegradable'],
        popular: false,
        new: true,
    },
    {
        id: 'eco-tshirt',
        name: 'Organic Cotton Eco Tee',
        desc: 'Soft, breathable t-shirt made from 100% organic cotton and dyed with plant-based, non-toxic dyes.',
        price: 599,
        original: 899,
        category: 'fashion',
        image: '/static/images/eco-tshirt.jpg',
        rating: 4.5,
        reviews: 64,
        eco: ['Organic cotton', 'Chemical-free dyes'],
        popular: false,
        new: true,
    },
    {
        id: 'seed-pencils',
        name: 'Plantable Seed Pencils (Set of 10)',
        desc: 'Pencils made from recycled newspaper — plant them when they\'re used up and watch herbs grow!',
        price: 179,
        original: 299,
        category: 'stationery',
        image: '/static/images/seed-pencils.jpg',
        rating: 4.8,
        reviews: 153,
        eco: ['Grows into plants', 'No-waste design'],
        popular: true,
        new: false,
    },
    {
        id: 'compost-bin',
        name: 'Home Compost Bin',
        desc: 'Compact kitchen countertop compost bin made from recycled steel. Charcoal filter for zero odor.',
        price: 799,
        original: 1199,
        category: 'home',
        image: '/static/images/compost-bin.jpg',
        rating: 4.6,
        reviews: 72,
        eco: ['Diverts 200kg waste/year', 'Recycled steel body'],
        popular: false,
        new: true,
    },
    {
        id: 'jute-backpack',
        name: 'Jute & Canvas Backpack',
        desc: 'Handcrafted jute-canvas backpack with padded laptop sleeve. Perfect eco-commute companion.',
        price: 899,
        original: 1399,
        category: 'bags',
        image: '/static/images/jute-backpack.jpg',
        rating: 4.7,
        reviews: 55,
        eco: ['Handwoven jute', 'Fair-trade certified'],
        popular: false,
        new: true,
    },
    {
        id: 'bamboo-toothbrush',
        name: 'Bamboo Toothbrush (Pack of 4)',
        desc: 'Biodegradable bamboo handles with charcoal-infused bristles. Soft, effective, and planet-friendly.',
        price: 249,
        original: 399,
        category: 'home',
        image: '/static/images/bamboo-toothbrush.jpg',
        rating: 4.5,
        reviews: 189,
        eco: ['Saves 4 plastic brushes', 'Compostable handle'],
        popular: true,
        new: false,
    },
    {
        id: 'plant-pot',
        name: 'Recycled Plastic Plant Pot',
        desc: 'Beautiful self-watering pot made from 100% recycled plastic waste. Available in earthy tones.',
        price: 349,
        original: 549,
        category: 'garden',
        image: '/static/images/plant-pot.jpg',
        rating: 4.4,
        reviews: 41,
        eco: ['Made from waste plastic', 'Self-watering design'],
        popular: false,
        new: true,
    },
    {
        id: 'coffee-mug',
        name: 'Upcycled Travel Coffee Mug',
        desc: '350ml double-wall insulated mug crafted from recycled stainless steel. Leak-proof silicone lid.',
        price: 499,
        original: 749,
        category: 'bottles',
        image: '/static/images/coffee-mug.jpg',
        rating: 4.7,
        reviews: 123,
        eco: ['Recycled stainless steel', 'Replaces 1000+ cups'],
        popular: true,
        new: false,
    },
    {
        id: 'seed-bomb',
        name: 'Wildflower Seed Bombs (Pack of 12)',
        desc: 'Hand-rolled clay seed bombs with native wildflower seeds. Toss, water, and watch nature bloom!',
        price: 199,
        original: 299,
        category: 'garden',
        image: '/static/images/seed-bombs.jpg',
        rating: 4.9,
        reviews: 97,
        eco: ['Supports pollinators', 'Organic seeds'],
        popular: false,
        new: true,
    },
];

// ── State ──
let cart = JSON.parse(localStorage.getItem('ecofi_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('ecofi_wishlist') || '[]');
let qvQty = 1;
let qvProduct = null;

// ═══════════════════════════════════════
// Particles
// ═══════════════════════════════════════
(function initParticles() {
    const c = document.getElementById('particles');
    if (!c) return;
    const ctx = c.getContext('2d');
    let dots = [];
    function resize() { c.width = innerWidth; c.height = innerHeight; }
    resize(); addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
        dots.push({ x: Math.random()*c.width, y: Math.random()*c.height, r: Math.random()*2+.5, dx: (Math.random()-.5)*.4, dy: (Math.random()-.5)*.4 });
    }
    function draw() {
        ctx.clearRect(0,0,c.width,c.height);
        dots.forEach((d,i)=>{
            d.x+=d.dx; d.y+=d.dy;
            if(d.x<0||d.x>c.width) d.dx*=-1;
            if(d.y<0||d.y>c.height) d.dy*=-1;
            ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
            ctx.fillStyle='rgba(0,200,83,.35)'; ctx.fill();
            for(let j=i+1;j<dots.length;j++){
                const dx=d.x-dots[j].x, dy=d.y-dots[j].y, dist=Math.sqrt(dx*dx+dy*dy);
                if(dist<120){ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(dots[j].x,dots[j].y);ctx.strokeStyle=`rgba(0,229,255,${.12*(1-dist/120)})`;ctx.stroke();}
            }
        });
        requestAnimationFrame(draw);
    }
    draw();
})();

// ═══════════════════════════════════════
// Scroll Reveal
// ═══════════════════════════════════════
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const delay = parseInt(e.target.dataset.delay || 0);
            setTimeout(() => e.target.classList.add('active'), delay);
        }
    });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ═══════════════════════════════════════
// Navbar
// ═══════════════════════════════════════
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', scrollY > 60);
});

const hamburger = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
hamburger?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('open');
});

// ═══════════════════════════════════════
// Render Products
// ═══════════════════════════════════════
const grid = document.getElementById('products-grid');
const noProducts = document.getElementById('no-products');

function renderProducts(products) {
    grid.innerHTML = '';
    if (!products.length) { noProducts.style.display = 'block'; return; }
    noProducts.style.display = 'none';

    products.forEach((p, i) => {
        const discount = Math.round((1 - p.price / p.original) * 100);
        const starsHTML = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '½' : '');
        const inCart = cart.find(c => c.id === p.id);
        const isLiked = wishlist.includes(p.id);

        const card = document.createElement('div');
        card.className = 'product-card reveal';
        card.dataset.delay = i * 60;
        card.innerHTML = `
            <div class="pc-image" onclick="openQuickView('${p.id}')">
                <img src="${p.image}" alt="${p.name}" loading="lazy"
                     onerror="this.src='https://placehold.co/400x300/1a2332/00c853?text=${encodeURIComponent(p.name)}'">
                <span class="pc-badge ${p.category}">${p.category}</span>
                <div class="pc-quickview"><span><i class="fas fa-eye"></i> Quick View</span></div>
                <div class="pc-eco"><i class="fas fa-leaf"></i> ${p.eco[0]}</div>
            </div>
            <div class="pc-body">
                <h3 class="pc-title">${p.name}</h3>
                <p class="pc-desc">${p.desc.substring(0, 70)}...</p>
                <div class="pc-rating">
                    <span class="stars">${starsHTML}</span>
                    <span class="count">(${p.reviews})</span>
                </div>
                <div class="pc-price-row">
                    <span class="pc-price">₹${p.price}</span>
                    <span class="pc-original">₹${p.original}</span>
                    <span class="pc-discount">${discount}% OFF</span>
                </div>
                <div class="pc-actions">
                    <button class="pc-add-btn ${inCart ? 'added' : ''}" data-id="${p.id}"
                            onclick="addToCart('${p.id}')">
                        <i class="fas ${inCart ? 'fa-check' : 'fa-shopping-bag'}"></i>
                        ${inCart ? 'In Cart' : 'Add to Cart'}
                    </button>
                    <button class="pc-wish-btn ${isLiked ? 'liked' : ''}" onclick="toggleWish('${p.id}', this)">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Re-observe new reveals
    document.querySelectorAll('.product-card.reveal:not(.active)').forEach(el => observer.observe(el));
}

// ── Initial load ──
renderProducts(PRODUCTS);

// ═══════════════════════════════════════
// Search + Filter + Sort
// ═══════════════════════════════════════
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');

function applyFilters() {
    const q = searchInput.value.toLowerCase().trim();
    const cat = categoryFilter.value;
    const sort = sortFilter.value;

    let filtered = PRODUCTS.filter(p => {
        const matchCat = cat === 'all' || p.category === cat;
        const matchSearch = !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.category.includes(q);
        return matchCat && matchSearch;
    });

    switch (sort) {
        case 'low': filtered.sort((a,b) => a.price - b.price); break;
        case 'high': filtered.sort((a,b) => b.price - a.price); break;
        case 'popular': filtered.sort((a,b) => b.reviews - a.reviews); break;
        case 'newest': filtered.sort((a,b) => (b.new ? 1 : 0) - (a.new ? 1 : 0)); break;
    }

    renderProducts(filtered);
}

searchInput?.addEventListener('input', applyFilters);
categoryFilter?.addEventListener('change', applyFilters);
sortFilter?.addEventListener('change', applyFilters);

// ═══════════════════════════════════════
// Cart System
// ═══════════════════════════════════════
function saveCart() {
    localStorage.setItem('ecofi_cart', JSON.stringify(cart));
}

function addToCart(id, qty = 1) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;
    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ id, name: product.name, price: product.price, image: product.image, qty });
    }
    saveCart();
    updateCartUI();
    showToast(`${product.name} added to cart!`);

    // Update button on product card
    const btn = document.querySelector(`.pc-add-btn[data-id="${id}"]`);
    if (btn) {
        btn.classList.add('added');
        btn.innerHTML = '<i class="fas fa-check"></i> In Cart';
    }
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    saveCart();
    updateCartUI();
    applyFilters(); // refresh product card buttons
}

function changeQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) return removeFromCart(id);
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const itemsEl = document.getElementById('cart-items');
    const emptyEl = document.getElementById('cart-empty');
    const summaryEl = document.getElementById('cart-summary');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    const coinsEl = document.getElementById('cart-coins');

    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    countEl.textContent = totalItems;

    // bounce effect
    countEl.classList.remove('bounce');
    void countEl.offsetWidth;
    countEl.classList.add('bounce');

    if (!cart.length) {
        emptyEl.style.display = 'block';
        summaryEl.style.display = 'none';
        itemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());
        return;
    }

    emptyEl.style.display = 'none';
    summaryEl.style.display = 'block';

    // render cart items
    itemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img class="cart-item-img" src="${item.image}" alt="${item.name}"
                 onerror="this.src='https://placehold.co/60x60/1a2332/00c853?text=Eco'">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price * item.qty}</div>
            </div>
            <div class="cart-item-qty">
                <button onclick="changeQty('${item.id}', -1)">−</button>
                <span>${item.qty}</span>
                <button onclick="changeQty('${item.id}', 1)">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        itemsEl.insertBefore(div, emptyEl);
    });

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    subtotalEl.textContent = subtotal;
    totalEl.textContent = subtotal;
    coinsEl.textContent = Math.floor(subtotal / 10);
}

// init cart UI
updateCartUI();

// ── Cart sidebar open/close ──
const cartFab = document.getElementById('cart-fab');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartClose = document.getElementById('cart-close');

function openCart() { cartSidebar.classList.add('open'); cartOverlay.classList.add('open'); }
function closeCart() { cartSidebar.classList.remove('open'); cartOverlay.classList.remove('open'); }

cartFab?.addEventListener('click', openCart);
cartClose?.addEventListener('click', closeCart);
cartOverlay?.addEventListener('click', closeCart);

// ═══════════════════════════════════════
// Wishlist
// ═══════════════════════════════════════
function toggleWish(id, btn) {
    const idx = wishlist.indexOf(id);
    if (idx > -1) { wishlist.splice(idx, 1); btn.classList.remove('liked'); }
    else { wishlist.push(id); btn.classList.add('liked'); }
    localStorage.setItem('ecofi_wishlist', JSON.stringify(wishlist));
}

// ═══════════════════════════════════════
// Quick View
// ═══════════════════════════════════════
const qvModal = document.getElementById('quickview-modal');
const qvCloseBtn = document.getElementById('qv-close');

function openQuickView(id) {
    qvProduct = PRODUCTS.find(p => p.id === id);
    if (!qvProduct) return;
    qvQty = 1;

    document.getElementById('qv-visual').innerHTML = `<img src="${qvProduct.image}" alt="${qvProduct.name}" 
        onerror="this.src='https://placehold.co/400x380/1a2332/00c853?text=${encodeURIComponent(qvProduct.name)}'">`;
    document.getElementById('qv-badge').className = `qv-badge pc-badge ${qvProduct.category}`;
    document.getElementById('qv-badge').textContent = qvProduct.category;
    document.getElementById('qv-title').textContent = qvProduct.name;
    document.getElementById('qv-desc').textContent = qvProduct.desc;
    document.getElementById('qv-price').textContent = `₹${qvProduct.price}`;
    document.getElementById('qv-original').textContent = `₹${qvProduct.original}`;
    document.getElementById('qv-qty').textContent = qvQty;

    const impactDiv = document.getElementById('qv-impact');
    impactDiv.innerHTML = qvProduct.eco.map(e => `<span><i class="fas fa-leaf"></i> ${e}</span>`).join('');

    qvModal.classList.add('show');
}

qvCloseBtn?.addEventListener('click', () => qvModal.classList.remove('show'));
qvModal?.addEventListener('click', e => { if (e.target === qvModal) qvModal.classList.remove('show'); });

document.getElementById('qv-plus')?.addEventListener('click', () => {
    qvQty++;
    document.getElementById('qv-qty').textContent = qvQty;
});
document.getElementById('qv-minus')?.addEventListener('click', () => {
    if (qvQty > 1) { qvQty--; document.getElementById('qv-qty').textContent = qvQty; }
});
document.getElementById('qv-add')?.addEventListener('click', () => {
    if (qvProduct) { addToCart(qvProduct.id, qvQty); qvModal.classList.remove('show'); }
});

// ═══════════════════════════════════════
// Checkout
// ═══════════════════════════════════════
const checkoutModal = document.getElementById('checkout-modal');
const checkoutClose = document.getElementById('checkout-close');
const checkoutForm = document.getElementById('checkout-form');
const successModal = document.getElementById('success-modal');

document.getElementById('checkout-btn')?.addEventListener('click', () => {
    if (!cart.length) return;
    closeCart();

    // fill checkout summary
    const summaryDiv = document.getElementById('checkout-summary');
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const coins = Math.floor(subtotal / 10);
    summaryDiv.innerHTML = `
        <div class="cs-row"><span>Items (${cart.reduce((s,i)=>s+i.qty,0)})</span><span>₹${subtotal}</span></div>
        <div class="cs-row"><span>Delivery</span><span style="color:#00c853">FREE</span></div>
        <div class="cs-row"><span>Eco-Coins Earned</span><span style="color:#f59e0b"><i class="fas fa-coins"></i> ${coins}</span></div>
        <div class="cs-row total"><span>Total</span><span>₹${subtotal}</span></div>
    `;
    checkoutModal.classList.add('show');
});

checkoutClose?.addEventListener('click', () => checkoutModal.classList.remove('show'));
checkoutModal?.addEventListener('click', e => { if (e.target === checkoutModal) checkoutModal.classList.remove('show'); });

checkoutForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('place-order-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Placing Order...';
    btn.disabled = true;

    const orderData = {
        name: document.getElementById('co-name').value,
        email: document.getElementById('co-email').value,
        phone: document.getElementById('co-phone').value,
        payment: document.getElementById('co-payment').value,
        address: document.getElementById('co-address').value,
        items: cart.map(c => ({ id: c.id, name: c.name, price: c.price, qty: c.qty })),
        total: cart.reduce((s, i) => s + i.price * i.qty, 0),
        coins_earned: Math.floor(cart.reduce((s, i) => s + i.price * i.qty, 0) / 10),
    };

    try {
        const resp = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        const data = await resp.json();

        // close checkout, show success
        checkoutModal.classList.remove('show');
        checkoutForm.reset();

        document.getElementById('success-msg').textContent = `Your eco-friendly order has been confirmed!`;
        document.getElementById('order-details').innerHTML = `
            <div><span>Order ID</span><strong>${data.order_id || 'ORD-XXXX'}</strong></div>
            <div><span>Total Paid</span><strong>₹${orderData.total}</strong></div>
            <div><span>Eco-Coins Earned</span><strong style="color:#f59e0b">${orderData.coins_earned} coins</strong></div>
            <div><span>Items</span><strong>${cart.length} product(s)</strong></div>
            <div><span>Payment</span><strong>${orderData.payment.toUpperCase()}</strong></div>
        `;
        successModal.classList.add('show');

        // clear cart
        cart = [];
        saveCart();
        updateCartUI();
        applyFilters();
    } catch (err) {
        showToast('Order failed. Please try again.');
    }

    btn.innerHTML = '<i class="fas fa-check-circle"></i> Place Order';
    btn.disabled = false;
});

// ═══════════════════════════════════════
// Toast
// ═══════════════════════════════════════
function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2400);
}
