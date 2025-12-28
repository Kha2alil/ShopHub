const productContainer = document.getElementById('grid-products');
const productDetailsPage = document.getElementById('product-details');
const isCartPage = document.getElementsByClassName('cart-items-list').length > 0;

if (productContainer) {
    displayProducts();
}else if(productDetailsPage ){
    displayProductDeatils();
}else if(isCartPage){
    displayCartItems();
    updateCartCounter();
}

function displayProducts() {
    productContainer.innerHTML = "";

    productsData.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <i class="fa-solid fa-heart favorite"></i>
            <img src="${product.image}" alt="${product.name}">
            <div class="card-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="bottom-info">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <i class="fa-solid fa-cart-shopping cart"></i>
                </div>
            </div>
        `;

        card.addEventListener("click", () => {
            sessionStorage.setItem("selectedProduct", JSON.stringify(product));
            console.log(product);
            window.location.href = "product-details.html";
        });

        productContainer.appendChild(card);
    });
}

function displayProductDeatils() {
    const selectedProduct = JSON.parse(sessionStorage.getItem("selectedProduct"));
    
    if (!selectedProduct) {
        console.error("No product selected");
        window.location.href = "products.html"; // Redirect if empty
        return;
    }
    
    // 1. Get Elements
    const title = document.getElementById("product-title");
    const price = document.getElementById("product-price");
    const description = document.getElementById("product-description");
    const mainImg = document.getElementById("MainImg");
    const thumbnailContainer = document.querySelector(".thumbnail-img");
    const productInfo = document.querySelector(".product-info");
    const addToCartBtn = document.getElementById("add-to-cart-btn");

    // 2. Set Basic Info
    title.textContent = selectedProduct.name;
    price.textContent = `$${selectedProduct.price.toFixed(2)}`;
    description.textContent = selectedProduct.description;
    mainImg.src = selectedProduct.image;

    // 3. Handle the "Best Seller" Badge (Matches your .best-sales CSS)
    // Remove old badge if it exists to prevent duplicates
    const oldBadge = document.querySelector(".best-sales");
    if (oldBadge) oldBadge.remove();

    if (selectedProduct.bestSeller) {
        const badge = document.createElement("span");
        badge.className = "best-sales";
        badge.textContent = "Best Seller";
        productInfo.prepend(badge); // Puts it at the top of the info section
    }

    // 4. Rebuild Thumbnails (Matches your .small-img-col CSS)
    const images = [
        selectedProduct.image,
        selectedProduct.image2 || selectedProduct.image,
        selectedProduct.image3 || selectedProduct.image,
        selectedProduct.image4 || selectedProduct.image
    ];

    thumbnailContainer.innerHTML = images.map(imgSrc => `
        <div class="small-img-col">
            <img src="${imgSrc}" class="small-image" width="100%" alt="Thumbnail">
        </div>
    `).join('');

    // 5. Re-attach Click Listeners for the Gallery
    const smallImgs = document.querySelectorAll(".small-image");
    smallImgs.forEach(img => {
        img.addEventListener("click", () => {
            mainImg.src = img.src;
        });
    });

    // 6. Add to Cart Button Functionality
    addToCartBtn.addEventListener("click", () => {
        addToCart(selectedProduct);
    });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    // Check if index is NOT -1 (which means it exists)
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Optional: Alert the user or update a counter immediately
    alert("Product added to cart!");
    updateCartCounter(); 
}

function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsList = document.querySelector('.cart-list');
    const orderSummaryContainer = document.querySelector('.order-summary'); // Select the container
    
    cartItemsList.innerHTML = "";
    
    // Handle Empty Cart
    if (cart.length === 0) {
        cartItemsList.innerHTML = "<p>Your cart is empty.</p>";
        // Hide summary or set to 0
        if(orderSummaryContainer) orderSummaryContainer.style.display = 'none';
        return;
    }

    if(orderSummaryContainer) orderSummaryContainer.style.display = 'block';

    let subtotal = 0;

    // Loop ONLY generates the item rows
    cart.forEach((item, index) => {
        // Handle price if it was stored as string "$99" or number 99
        let priceValue = typeof item.price === 'string' 
            ? parseFloat(item.price.replace('$','')) 
            : item.price;

        const itemTotal = priceValue * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="Product Image">
            </div>

            <div class="cart-item-details">
                <h3>${item.name || item.title}</h3> 
                <p>${item.description}</p>
                <div class="bottom-details">
                    <p>Color: <span class="product-color">${item.color || 'Standard'}</span></p>
                </div>
            </div>

            <div class="product-cart-actions">
                <div class="cart-item-remove">
                    <button onclick="removeCartItem(${index})" title="Remove Item" class="remove-item"><i class="fa-solid fa-trash"></i></button>
                </div>

                <div class="product-quantity">
                    <button onclick="changeQuantity(${index}, -1)" title="minus" class="minus-btn">
                        <i class="fa-solid fa-minus"></i>
                    </button>

                    <input type="number" class="product-quantity-input" value="${item.quantity}" readonly>

                    <button onclick="changeQuantity(${index}, 1)" title="plus" class="plus-btn">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>

                <div class="product-price">
                    <span>$${priceValue.toFixed(2)}</span>
                </div>
            </div>
        `;
        cartItemsList.appendChild(cartItem);
    });

    // Render Order Summary ONCE, OUTSIDE the loop
    const tax = 67.99; // Or calculate based on subtotal
    const grandTotal = subtotal + tax; // Assuming free shipping

    orderSummaryContainer.innerHTML = `
        <h2>Order Summary</h2>
        <div class="summary-details">
            <div class="summary-item">
                <p id="cart-subtotal"> Subtotal <span>$${subtotal.toFixed(2)}</span></p>
                <p> Shipping <span>Free</span></p>
            </div>

            <div class="summary-item">
                <p>Tax <span>$${tax}</span></p>
                <input type="text" placeholder="Enter promo code" />
                <button class="apply-promo">Apply</button>
            </div>
            
            <div class="summary-item total">
                <p id="cart-grandtotal">Total <span>$${grandTotal.toFixed(2)}</span></p>
                <a href="checkout.html"><button title="proceed To Checkout" class="checkout-btn">Proceed To Checkout</button></a>
                <a href="home.html"><button title="Continue Shopping" class="shopping-btn">Continue Shopping</button></a>
            </div>

            <div class="summary-item">
                <p>We Accept:</p>
                <div class="payment-methods">
                    <i class="fa-brands fa-cc-visa visa"></i>
                    <i class="fa-brands fa-cc-mastercard mastercard"></i>
                    <i class="fa-brands fa-cc-amex amex"></i>
                    <i class="fa-brands fa-cc-paypal paypal"></i>
                </div>
            </div>
        </div>
        <div class="secure-payement">
            <i class="fa-solid fa-lock"></i>
            <p>Secure Payement</p>
        </div>
    `;
}

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const counterDisplay = document.querySelector('.counter');
    if (counterDisplay) counterDisplay.textContent = count;
}

// Global remove function for the cart page
window.removeCartItem = function(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCartItems();
    updateCartCounter();
}

// Global change quantity function for the cart page
// Function to handle the math
window.changeQuantity = function(index, delta) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Adjust the quantity
    cart[index].quantity += delta;

    // Prevent quantity from going below 1
    if (cart[index].quantity < 1) {
        cart[index].quantity = 1;
    } 
    // Optional: limit max quantity
    else if (cart[index].quantity > 10) {
        cart[index].quantity = 10;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Refresh the UI
    displayCartItems();
    updateCartCounter();
}