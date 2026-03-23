const ALL_PRODUCTS = [
  { id: 1, name: "Luxury Grey Sectional Sofa", category: "Sofas & Loungers", price: 68999, image: "photos/sofa2.jpg", isNew: true },
  { id: 17, name: "Galaxy Premium Black & White Sofa", category: "Sofas & Loungers", price: 54999, image: "photos/sofa1.jpg", isSale: true, oldPrice: 62000 },
  { id: 2, name: "Oak Dining Table (6 Seater)", category: "Dining Tables & Chairs", price: 34999, image: "photos/shop(dining).webp", isSale: true, oldPrice: 42000 },
  { id: 3, name: "Ergonomic Office Chair", category: "Office Furniture", price: 8599, image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800" },
  { id: 4, name: "Minimalist Coffee Table", category: "Coffee & Side Tables", price: 12899, image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=800" },
  { id: 5, name: "King Size Platform Bed", category: "Beds & Mattresses", price: 52999, image: "photos/shop(bedmatress).webp", isNew: true },
  { id: 6, name: "Mid-Century TV Console", category: "TV Units & Consoles", price: 18799, image: "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&w=800" },
  { id: 7, name: "Modern Leather Recliner", category: "Sofas & Loungers", price: 24999, image: "photos/sofa2.jpg" },
  { id: 8, name: "Geometric Bookshelf", category: "Bookshelves & Display", price: 15599, image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800" },
  { id: 9, name: "Premium Wooden Wardrobe", category: "Almirahs & Wardrobes", price: 38899, image: "photos/shop(almirah1).webp" },
  { id: 10, name: "Modern Steel Almirah", category: "Almirahs & Wardrobes", price: 21999, image: "photos/shop(almirah2).webp", isSale: true, oldPrice: 28000 },
  { id: 11, name: "Sliding Glass Closet", category: "Almirahs & Wardrobes", price: 45999, image: "photos/shop(almirah3).webp", isNew: true },
  { id: 12, name: "Abstract Canvas Wall Art", category: "Wall Decor & Art", price: 5499, image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800", isNew: true },
  { id: 13, name: "Modern Minimalist Kitchen", category: "Modular Kitchens", price: 145000, image: "photos/KITCHEN1.jpeg" },
  { id: 14, name: "Colorful Modular Kitchen", category: "Modular Kitchens", price: 189000, image: "photos/KITCHEN3.jpeg", isSale: true, oldPrice: 210000 },
  { id: 15, name: "Contemporary Island Kitchen", category: "Modular Kitchens", price: 245000, image: "photos/KITCHEN2.jpeg" },
  { id: 16, name: "Gold Sunburst Metal Decor", category: "Wall Decor & Art", price: 3299, image: "photos/WALLDECOROR.jpeg" }
];

let cartState = [
  { id: 1, name: "Luxury Grey Sectional Sofa", price: 68999, qty: 1, image: "photos/sofa2.jpg" }
];

function generateProductHTML(product) {
  return `
    <div class="product-card" data-category="${product.category}" data-price="${product.price}" data-new="${product.isNew ? 'true' : 'false'}">
      <div class="product-image-container">
        <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" class="product-image" />
        </a>
        <button class="wishlist-btn" aria-label="Add to Wishlist">
          <i data-lucide="heart"></i>
        </button>
        ${product.isNew ? '<span class="product-badge new">New</span>' : ''}
        ${product.isSale ? '<span class="product-badge sale">Sale</span>' : ''}
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <a href="product.html?id=${product.id}" class="product-name">
          <h3>${product.name}</h3>
        </a>
        <div class="product-price">
          <span class="current-price">₹${product.price}</span>
          ${product.oldPrice ? `<span class="old-price">₹${product.oldPrice}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

// Ensure icon initializes properly
function safeCreateIcons(container = document) {
    try {
        lucide.createIcons({ root: container });
    } catch(e) {}
}

document.addEventListener('DOMContentLoaded', () => {
    safeCreateIcons();

    // -- Mobile Menu Toggle --
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isActive = navLinks.classList.contains('active');
            const iconElement = mobileBtn.querySelector('i');
            if (iconElement) {
                iconElement.setAttribute('data-lucide', isActive ? 'x' : 'menu');
                safeCreateIcons(mobileBtn);
            }
        });
    }

    // -- Update Cart Badge Globally --
    const cartBadge = document.getElementById('cart-badge-count');
    if (cartBadge) {
        cartBadge.textContent = cartState.reduce((acc, i) => acc + i.qty, 0) || '0';
    }

    // =============================
    // PAGE SPECIFIC LOGIC
    // =============================

    // 1. Shop Page Logic
    const shopGrid = document.getElementById('shop-grid-container');
    if (shopGrid) {
        // Shop specific variables & initialization
        let currentProducts = [...ALL_PRODUCTS];
        const categoryBtns = document.querySelectorAll('.filter-btn');
        const sortSelects = document.querySelectorAll('.sort-select');
        const resultsCountStr = document.getElementById('results-count-str');
        const sidebar = document.getElementById('shop-sidebar');
        const mobileFilterBtn = document.getElementById('mobile-filter-btn');
        const sidebarCloseBtn = document.getElementById('sidebar-close-btn');

        // Parse URL params for category
        const params = new URLSearchParams(window.location.search);
        let activeCategory = "All";
        const catParam = params.get('category');
        if(catParam) {
            const matched = Array.from(categoryBtns).find(btn => btn.dataset.cat.toLowerCase().includes(catParam.toLowerCase()));
            if (matched) activeCategory = matched.dataset.cat;
            else activeCategory = catParam;
        }

        function renderProducts() {
            shopGrid.innerHTML = '';
            const filtered = activeCategory === "All" 
                ? currentProducts 
                : currentProducts.filter(p => p.category === activeCategory);
            
            // Sort
            const sortBy = sortSelects.length ? sortSelects[0].value : 'newest';
            if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
            else if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price);
            else if (sortBy === "newest") filtered.sort((a, b) => (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1);

            filtered.forEach(p => { shopGrid.innerHTML += generateProductHTML(p); });
            safeCreateIcons(shopGrid);

            if (resultsCountStr) resultsCountStr.textContent = `Showing ${filtered.length} results for "${activeCategory}"`;

            categoryBtns.forEach(btn => {
                if (btn.dataset.cat === activeCategory) btn.classList.add('active');
                else btn.classList.remove('active');
            });
        }

        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                activeCategory = e.target.dataset.cat;
                if(sidebar) sidebar.classList.remove('open');
                renderProducts();
                window.history.pushState({}, '', `?category=${encodeURIComponent(activeCategory)}`);
            });
        });

        sortSelects.forEach(select => {
            select.addEventListener('change', (e) => {
                sortSelects.forEach(s => s.value = e.target.value);
                renderProducts();
            });
        });

        if (mobileFilterBtn && sidebar) mobileFilterBtn.addEventListener('click', () => sidebar.classList.add('open'));
        if (sidebarCloseBtn && sidebar) sidebarCloseBtn.addEventListener('click', () => sidebar.classList.remove('open'));

        renderProducts();
    }

    // 2. Product Detail Logic
    const productDetailContainer = document.getElementById('product-detail-container');
    if (productDetailContainer) {
        const params = new URLSearchParams(window.location.search);
        const productId = parseInt(params.get('id'));
        let product = ALL_PRODUCTS.find(p => p.id === productId);

        if (!product) {
            // Default product if none found
            product = {
                id: 99, name: "Oak Dining Table", category: "Dining Tables & Chairs", price: 34999,
                image: "photos/DINNING2.png", isSale: true, oldPrice: 42000
            };
        }

        // Add dummy extended properties since ALL_PRODUCTS lacks them
        product.images = [product.image, "https://images.unsplash.com/photo-1551298370-9d3d53740c72"];
        product.description = "A gorgeous piece crafted with premium materials. Features a beautiful finish that highlights the stunning design.";
        product.dimensions = "Standard Dimensions";
        product.material = "Premium Material";
        product.care = "Wipe with a damp cloth. Maintain regularly for best results.";

        let activeImage = product.images[0];
        let quantity = 1;

        const renderProductDetail = () => {
            productDetailContainer.innerHTML = `
            <div class="container">
                <div class="breadcrumb">
                    <a href="index.html">Home</a> <i data-lucide="chevron-right" style="width: 14px;"></i>
                    <a href="shop.html">Shop</a> <i data-lucide="chevron-right" style="width: 14px;"></i>
                    <span>${product.name}</span>
                </div>
                <div class="product-layout">
                    <!-- Gallery -->
                    <div class="product-gallery">
                        <div class="main-image">
                            <img src="${activeImage}" alt="${product.name}" id="main-product-img" />
                        </div>
                        <div class="thumbnail-list">
                            ${product.images.map((img, idx) => `
                                <div class="thumbnail ${activeImage === img ? 'active' : ''}" data-img="${img}">
                                    <img src="${img}" alt="${product.name} outline ${idx}" />
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <!-- Details -->
                    <div class="product-info-panel">
                        <span class="product-cat">${product.category}</span>
                        <h1 class="product-title">${product.name}</h1>
                        <div class="product-price-large">₹${product.price}</div>
                        <p class="product-desc">${product.description}</p>
                        <div class="product-meta">
                            <div class="meta-item"><span class="meta-label">Dimensions:</span> ${product.dimensions}</div>
                            <div class="meta-item"><span class="meta-label">Material:</span> ${product.material}</div>
                        </div>
                        <div class="add-to-cart-section">
                            <div class="quantity-selector">
                                <button id="qty-minus">-</button>
                                <input type="number" id="qty-input" value="${quantity}" readonly />
                                <button id="qty-plus">+</button>
                            </div>
                            <button class="btn btn-primary add-btn" id="add-to-cart-btn">
                                <i data-lucide="shopping-cart" style="margin-right: 10px;"></i> Add to Cart
                            </button>
                            <button class="icon-btn wishlist-icon-btn">
                                <i data-lucide="heart"></i>
                            </button>
                        </div>
                        <div class="product-trust">
                            <div class="trust-item"><i data-lucide="truck"></i> <span>Free shipping on orders over ₹1999</span></div>
                            <div class="trust-item"><i data-lucide="shield-check"></i> <span>7-day easy returns</span></div>
                        </div>
                        <div class="accordion">
                            <div class="accordion-item">
                                <h4>Care Instructions</h4>
                                <p>${product.care}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
            safeCreateIcons(productDetailContainer);

            // Thumbnail Clicks
            document.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.addEventListener('click', () => {
                    activeImage = thumb.dataset.img;
                    renderProductDetail();
                });
            });

            // Quantity Control
            document.getElementById('qty-minus').addEventListener('click', () => {
                if (quantity > 1) { quantity--; renderProductDetail(); }
            });
            document.getElementById('qty-plus').addEventListener('click', () => {
                quantity++; renderProductDetail();
            });

            // Add specifically to cart
            document.getElementById('add-to-cart-btn').addEventListener('click', () => {
                alert(`Added ${quantity} x ${product.name} to cart.`);
            });
        };
        renderProductDetail();
    }

    // 3. Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('contact-submit-btn');
            btn.innerHTML = '<span>Sent Successfully!</span>';
            setTimeout(() => {
                btn.innerHTML = '<i data-lucide="send" style="margin-right: 8px;"></i> Send Message';
                safeCreateIcons(btn);
                contactForm.reset();
            }, 3000);
        });
    }

    // 4. Order Tracking Logic
    const trackingForm = document.getElementById('tracking-form');
    if (trackingForm) {
        trackingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const orderId = document.getElementById('order-id-input').value;
            const btn = document.getElementById('tracking-btn');
            const resContainer = document.getElementById('tracking-results-container');
            if(!orderId) return;

            btn.textContent = "Searching...";
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = "Track Order";
                btn.disabled = false;
                resContainer.innerHTML = `
                    <div class="tracking-results animate-fade-in">
                        <div class="order-summary-card">
                            <div class="order-summary-header">
                                <div>
                                    <h3>Order #${orderId}</h3>
                                    <span class="order-date">Placed on Oct 12, 2023</span>
                                </div>
                                <div class="expected-delivery">
                                    <span>Expected Delivery</span>
                                    <strong>Oct 16, 2023</strong>
                                </div>
                            </div>
                            <div class="tracking-timeline">
                                <div class="timeline-step completed">
                                    <div class="step-icon"><i data-lucide="check-circle"></i></div>
                                    <div class="step-text"><h4>Order Confirmed</h4><p>Oct 12, 10:30 AM</p></div>
                                </div>
                                <div class="timeline-line completed"></div>
                                <div class="timeline-step completed">
                                    <div class="step-icon"><i data-lucide="clock"></i></div>
                                    <div class="step-text"><h4>Processing</h4><p>Oct 13, 09:15 AM</p></div>
                                </div>
                                <div class="timeline-line completed"></div>
                                <div class="timeline-step active">
                                    <div class="step-icon"><i data-lucide="truck"></i></div>
                                    <div class="step-text"><h4>Shipped</h4><p>Oct 14, 02:40 PM</p></div>
                                </div>
                                <div class="timeline-line"></div>
                                <div class="timeline-step">
                                    <div class="step-icon"><i data-lucide="package"></i></div>
                                    <div class="step-text"><h4>Delivered</h4><p>Pending</p></div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                safeCreateIcons(resContainer);
            }, 1200);
        });
    }

    // 5. Cart Checkout Logic
    const checkoutContainer = document.getElementById('checkout-view-container');
    if (checkoutContainer) {
        let step = 1;
        let discount = 0;

        const renderCart = () => {
            const checkoutTitle = document.getElementById('checkout-title');
            if (step === 1) checkoutTitle.textContent = 'Your Cart';
            else if (step === 2) checkoutTitle.textContent = 'Checkout';
            else checkoutTitle.textContent = 'Order Complete';

            if (step === 3) {
                checkoutContainer.innerHTML = `
                    <div class="success-message text-center animate-fade-in">
                        <i data-lucide="check-circle" style="width: 64px; height: 64px; margin: 0 auto 20px auto; color: #2e7d32;"></i>
                        <h2>Thank You For Your Order!</h2>
                        <p>Your order ID is <strong>GALAXY-${Math.floor(Math.random() * 100000)}</strong>.</p>
                        <p>We've sent a confirmation email to you.</p>
                        <a href="tracking.html" class="btn btn-primary" style="margin-top: 20px;">Track Your Order</a>
                    </div>`;
                safeCreateIcons(checkoutContainer);
                return;
            }

            const subtotal = cartState.reduce((acc, item) => acc + (item.price * item.qty), 0);
            const total = subtotal - discount;

            let mainContent = '';
            if (step === 1) {
                mainContent = `
                    <div class="cart-list">
                        ${cartState.length === 0 ? `
                            <div class="empty-cart">
                                <p>Your cart is empty.</p>
                                <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
                            </div>
                        ` : cartState.map(item => `
                            <div class="cart-item">
                                <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
                                <div class="cart-item-details">
                                    <a href="product.html?id=${item.id}" class="cart-item-name">${item.name}</a>
                                    <div class="cart-item-price">₹${item.price}</div>
                                </div>
                                <div class="cart-item-actions">
                                    <div class="qty-control">
                                        <button class="qty-dec" data-id="${item.id}">-</button>
                                        <span>${item.qty}</span>
                                        <button class="qty-inc" data-id="${item.id}">+</button>
                                    </div>
                                    <button class="remove-btn" aria-label="Remove item" data-id="${item.id}">
                                        <i data-lucide="trash-2"></i>
                                    </button>
                                </div>
                                <div class="cart-item-total">₹${item.price * item.qty}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                mainContent = `
                    <div class="checkout-form-container">
                        <form id="checkout-form-action">
                            <div class="form-section">
                                <h3>Contact Information</h3>
                                <div class="form-row">
                                    <div class="form-group half"><label>First Name</label><input type="text" required /></div>
                                    <div class="form-group half"><label>Last Name</label><input type="text" required /></div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group half"><label>Email Address</label><input type="email" required /></div>
                                    <div class="form-group half"><label>Phone Number</label><input type="tel" required /></div>
                                </div>
                            </div>
                            <!-- Snipped Address and Payment for brevity in demo -->
                            <div class="form-section">
                                <h3>Shipping Address</h3>
                                <div class="form-group"><label>Street Address</label><input type="text" required /></div>
                            </div>
                        </form>
                    </div>
                `;
            }

            checkoutContainer.innerHTML = `
                <div class="checkout-layout">
                    <div class="checkout-main">${mainContent}</div>
                    <div class="checkout-sidebar">
                        <div class="summary-card">
                            <h3>Order Summary</h3>
                            <div class="summary-items">
                                ${cartState.map(item => `
                                    <div class="summary-item">
                                        <span class="summary-name">${item.qty}x ${item.name}</span>
                                        <span class="summary-price">₹${item.price * item.qty}</span>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="summary-totals">
                                <div class="totals-row"><span>Subtotal</span><span>₹${subtotal}</span></div>
                                ${discount > 0 ? `<div class="totals-row discount text-green"><span>Discount</span><span>-₹${discount.toFixed(0)}</span></div>` : ''}
                                <div class="totals-row"><span>Shipping</span><span>${(subtotal > 1999 || cartState.length === 0) ? 'Free' : '₹150'}</span></div>
                                <div class="totals-row grand-total"><span>Total</span><span>₹${(subtotal > 1999 || cartState.length === 0) ? total : total + 150}</span></div>
                            </div>
                            ${step === 1 ? `
                                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                                    <input type="text" id="coupon-val" placeholder="try GALAXY10" style="padding: 10px; border: 1px solid #ddd; width: 100%;" />
                                    <button class="btn btn-outline" id="apply-cpn" ${cartState.length === 0 ? 'disabled' : ''}>Apply</button>
                                </div>
                                <button class="btn btn-primary checkout-btn" id="go-checkout" ${cartState.length === 0 ? 'disabled' : ''}>Proceed to Checkout</button>
                            ` : `
                                <button type="submit" form="checkout-form-action" class="btn btn-primary checkout-btn"><i data-lucide="shield-check" style="margin-right: 8px;"></i> Pay Securely</button>
                                <button class="btn btn-text back-btn" id="back-cart" style="width: 100%; margin-top: 10px;">&larr; Back to Cart</button>
                            `}
                        </div>
                    </div>
                </div>
            `;
            safeCreateIcons(checkoutContainer);

            // Bind Events
            if (step === 1) {
                document.querySelectorAll('.qty-inc').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = parseInt(e.currentTarget.dataset.id);
                        const item = cartState.find(i => i.id === id);
                        if(item) { item.qty++; discount = 0; renderCart(); }
                    });
                });
                document.querySelectorAll('.qty-dec').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = parseInt(e.currentTarget.dataset.id);
                        const item = cartState.find(i => i.id === id);
                        if(item && item.qty > 1) { item.qty--; discount = 0; renderCart(); }
                    });
                });
                document.querySelectorAll('.remove-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = parseInt(e.currentTarget.dataset.id);
                        cartState = cartState.filter(i => i.id !== id);
                        discount = 0;
                        renderCart();
                        const b = document.getElementById('cart-badge-count');
                        if(b) b.textContent = cartState.reduce((acc, i) => acc + i.qty, 0) || '0';
                    });
                });
                document.getElementById('apply-cpn').addEventListener('click', () => {
                    const val = document.getElementById('coupon-val').value;
                    if(val.toUpperCase() === 'GALAXY10') { discount = subtotal * 0.1; renderCart(); }
                    else alert("Invalid Coupon Code");
                });
                const goChk = document.getElementById('go-checkout');
                if(goChk) goChk.addEventListener('click', () => { step++; renderCart(); });
            } else if (step === 2) {
                document.getElementById('back-cart').addEventListener('click', () => { step--; renderCart(); });
                const formAction = document.getElementById('checkout-form-action');
                if(formAction) formAction.addEventListener('submit', (e) => {
                    e.preventDefault();
                    step++; renderCart();
                    cartState = [];
                    const b = document.getElementById('cart-badge-count');
                    if(b) b.textContent = '0';
                });
            }
        };
        renderCart();
    }
});
