function toggleMenu() {
    const menu = document.getElementById("responsive");
    const icon = document.getElementById("list");

    // If menu is closed → OPEN it
    if (!menu.classList.contains("show")) {
        menu.classList.remove("fade-out");
        menu.classList.add("show", "fade-in");

        icon.classList.remove("fa-list");
        icon.classList.add("fa-xmark");
    }

    // If menu is open → CLOSE it
    else {
        // Remove fade-in, add fade-out
        menu.classList.remove("fade-in");
        menu.classList.add("fade-out");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-list");

        // After fade-out animation ends → hide menu
        menu.addEventListener("animationend", function hide() {
            if (menu.classList.contains("fade-out")) {
                menu.classList.remove("show"); 
            }
            menu.removeEventListener("animationend", hide);
        });
    }
}

// Start Quantity here 

const plusBtn = document.getElementById("plus");
const minusBtn = document.getElementById("minus");
const quantityInput = document.getElementById("product-quantityI");
const StorageKey = "quantity"

let storedValue = localStorage.getItem(StorageKey);
let quantity = parseInt(storedValue) || 1;

const min = 1;
const max = 10;

function updateDisplay() {
    quantityInput.value= quantity;
}

updateDisplay();

if (plusBtn && minusBtn && quantityInput) {
    plusBtn.addEventListener("click", () => {
        if (quantity < max) {
            quantity++;
            quantityInput.value = quantity;
            localStorage.setItem("quantity",quantity);
        }
    });
    
    minusBtn.addEventListener("click", () => {
        if (quantity > min) {
            quantity--;
            quantityInput.value = quantity;
            localStorage.setItem("quantity",quantity);
        }
    });
}


