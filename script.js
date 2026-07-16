// Products Data
const products = [
    {
        id: 1,
        name: "سيارة ريموت كنترول سبورت",
        price: 350,
        icon: "fa-car"
    },
    {
        id: 2,
        name: "مسدس مائي للأطفال",
        price: 120,
        icon: "fa-water"
    },
    {
        id: 3,
        name: "عروسة الأميرة",
        price: 180,
        icon: "fa-female"
    },
    {
        id: 4,
        name: "مطبخ أطفال كامل",
        price: 450,
        icon: "fa-utensils"
    },
    {
        id: 5,
        name: "كرة قدم احترافية",
        price: 150,
        icon: "fa-futbol"
    },
    {
        id: 6,
        name: "بوكس هدايا منسق",
        price: 280,
        icon: "fa-gift"
    }
];

// Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Load Products
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-image">
                <i class="fas ${p.icon}"></i>
            </div>
            <div class="product-info">
                <h3 class="product-title">${p.name}</h3>
                <div class="product-price">${p.price} جنيه</div>
                <button class="product-btn add-to-cart" onclick="addToCart(${p.id})">
                    <i class="fas fa-cart-plus"></i> أضف للسلة
                </button>
            </div>
        </div>
    `).join('');
}

// Add to Cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const item = cart.find(i => i.id === id);
    
    if (item) {
        item.qty++;
    } else {
        cart.push({...product, qty: 1});
    }
    
    saveCart();
    updateCart();
    showNotification('تمت الإضافة للسلة ✓');
}

// Update Cart
function updateCart() {
    const items = document.getElementById('cartItems');
    const footer = document.getElementById('cartFooter');
    const count = document.getElementById('cartCount');
    const total = document.getElementById('cartTotal');
    
    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    
    count.textContent = totalQty;
    total.textContent = totalPrice;
    
    if (cart.length === 0) {
        items.innerHTML = '<div class="loading"><i class="fas fa-shopping-cart"></i><p>السلة فارغة</p></div>';
        footer.style.display = 'none';
    } else {
        items.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas ${item.icon}"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price * item.qty} جنيه</div>
                </div>
                <div class="cart-item-actions">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join('');
        footer.style.display = 'block';
        
        // Update WhatsApp Link
        const message = encodeURIComponent(`أريد الطلب:
${cart.map(i => `${i.name} x${i.qty}`).join('
')}
الإجمالي: ${totalPrice} جنيه`);
        document.getElementById('checkoutBtn').href = `https://wa.me/201000000000?text=${message}`;
    }
}

// Update Quantity
function updateQty(id, change) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        saveCart();
        updateCart();
    }
}

// Toggle Cart
function toggleCart() {
    document.getElementById('cart').classList.toggle('active');
}

// Save Cart
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Notification
function showNotification(msg) {
    const div = document.createElement('div');
    div.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #00F5D4;
        color: #0b0f17;
        padding: 12px 24px;
        border-radius: 50px;
        font-weight: 700;
        z-index: 3000;
        animation: fadeIn 0.3s ease;
    `;
    div.textContent = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2000);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCart();
});