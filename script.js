const buyItems = {
        "black-market": {
        "IED": 3500,
        "M79": 2500,
        "Frag Grenades": 500,
        "Flash Grenade": 100,
        },
        "atomic-bazaar": {
        "IED": 3400,
        "M79": 2400,
        "Frag Grenades": 480,
        "Flash Grenade": 90,
        },
    };
    
    const sellItems = {
        "black-market": {
        "Vaiga": 500,
        "DMR": 500,
        "BK133": 250,
        "VSD": 1500,
        },
        "atomic-bazaar": {
        "Vaiga": 480,
        "DMR": 480,
        "BK133": 240,
        "VSD": 1450,
        },
    };
    
    // Overall totals
    let totalItemsBought = 0;
    let totalItemsSold = 0;
    let overallTotalPrice = 0;
    
    // Populate dropdown menus
    function populateMenu(type, trader, menuId) {
        const menu = document.getElementById(menuId);
        const items = type === "buy" ? buyItems[trader] : sellItems[trader];
        Object.entries(items).forEach(([itemName, price]) => {
        const option = document.createElement("option");
        option.value = `${itemName},${price}`;
        option.textContent = `${itemName} - ${price}©`;
        menu.appendChild(option);
        });
    }
    
    // Add item to receipt
    function addItem(trader, type) {
        const select = document.getElementById(`${trader}-${type}-items`);
        const quantityInput = document.getElementById(`${trader}-${type}-quantity`);
        const receipt = document.getElementById(`${trader}-${type}-receipt`);
        const countSpan = document.getElementById(`${trader}-${type}-count`);
        const totalSpan = document.getElementById(`${trader}-${type}-total`);
    
        const [itemName, itemPrice] = select.value.split(",");
        const quantity = parseInt(quantityInput.value, 10);
        if (quantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
        }
    
        const price = parseInt(itemPrice, 10) * quantity;
    
        // Check for existing item in receipt
        const existingItem = Array.from(receipt.children).find(
        (li) => li.dataset.name === itemName
        );
    
        if (existingItem) {
        const currentQuantity = parseInt(existingItem.dataset.quantity, 10);
        const newQuantity = currentQuantity + quantity;
        const newPrice = parseInt(itemPrice, 10) * newQuantity;
    
        existingItem.dataset.quantity = newQuantity;
        existingItem.dataset.price = newPrice;
        existingItem.querySelector(".item-details").textContent = `${newQuantity} x ${itemName} - ${newPrice}©`;
        } else {
        const li = document.createElement("li");
        li.dataset.name = itemName;
        li.dataset.quantity = quantity;
        li.dataset.price = price;
    
        li.innerHTML = `<span class="item-details">${quantity} x ${itemName} - ${price}©</span>
            <button class="remove-item" onclick="removeItem('${trader}', '${type}', '${itemName}')">Remove</button>`;
        receipt.appendChild(li);
        }
    
        if (type === "buy") {
        totalItemsBought += quantity;
        overallTotalPrice += price;
        } else {
        totalItemsSold += quantity;
        overallTotalPrice -= price;
        }
    
        countSpan.textContent = receipt.children.length;
        totalSpan.textContent =
        type === "buy" ? `${overallTotalPrice}©` : `${overallTotalPrice}©`;
    
        updateOverallTotals();
    }
    
    // Remove individual item
    function removeItem(trader, type, itemName) {
        const receipt = document.getElementById(`${trader}-${type}-receipt`);
        const item = Array.from(receipt.children).find((li) => li.dataset.name === itemName);
    
        if (item) {
        const itemPrice = parseInt(item.dataset.price, 10);
        const itemQuantity = parseInt(item.dataset.quantity, 10);
    
        if (type === "buy") {
            totalItemsBought -= itemQuantity;
            overallTotalPrice -= itemPrice;
        } else {
            totalItemsSold -= itemQuantity;
            overallTotalPrice += itemPrice;
        }
    
        receipt.removeChild(item);
        document.getElementById(`${trader}-${type}-count`).textContent =
            receipt.children.length;
        document.getElementById(`${trader}-${type}-total`).textContent =
            type === "buy" ? `${overallTotalPrice}©` : `${overallTotalPrice}©`;
    
        updateOverallTotals();
        }
    }
    
    // Update overall totals
    function updateOverallTotals() {
        document.getElementById("total-items-bought").textContent = totalItemsBought;
        document.getElementById("total-items-sold").textContent = totalItemsSold;
        document.getElementById("overall-total-price").textContent = `${overallTotalPrice}©`;
    }
    
    // Clear receipt
    function clearReceipt(trader) {
        const buyReceipt = document.getElementById(`${trader}-buy-receipt`);
        const sellReceipt = document.getElementById(`${trader}-sell-receipt`);
    
        // Update overall totals before clearing
        Array.from(buyReceipt.children).forEach((item) => {
        totalItemsBought -= parseInt(item.dataset.quantity, 10);
        overallTotalPrice -= parseInt(item.dataset.price, 10);
        });
    
        Array.from(sellReceipt.children).forEach((item) => {
        totalItemsSold -= parseInt(item.dataset.quantity, 10);
        overallTotalPrice += parseInt(item.dataset.price, 10);
        });
    
        buyReceipt.innerHTML = "";
        sellReceipt.innerHTML = "";
    
        document.getElementById(`${trader}-buy-count`).textContent = 0;
        document.getElementById(`${trader}-sell-count`).textContent = 0;
        document.getElementById(`${trader}-buy-total`).textContent = "0©";
        document.getElementById(`${trader}-sell-total`).textContent = "0©";
    
        updateOverallTotals();
    }
    
    // Toggle dark mode
    document.getElementById("darkModeToggle").addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        document.getElementById("darkModeToggle").textContent =
        document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    });
    
    // Populate dropdown menus
    populateMenu("buy", "black-market", "black-market-buy-items");
    populateMenu("sell", "black-market", "black-market-sell-items");
    populateMenu("buy", "atomic-bazaar", "atomic-bazaar-buy-items");
    populateMenu("sell", "atomic-bazaar", "atomic-bazaar-sell-items");
    
    // Add event listeners for ADD buttons
    document.getElementById("black-market-buy-add").addEventListener("click", () => {
        addItem("black-market", "buy");
    });
    document.getElementById("black-market-sell-add").addEventListener("click", () => {
        addItem("black-market", "sell");
    });
    document.getElementById("atomic-bazaar-buy-add").addEventListener("click", () => {
        addItem("atomic-bazaar", "buy");
    });
    document.getElementById("atomic-bazaar-sell-add").addEventListener("click", () => {
        addItem("atomic-bazaar", "sell");
    });
    