const activeCart = new Cart();

document.addEventListener('DOMContentLoaded', () => {
    renderCartView();

    // Обработка клика "Оформить заказ"
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (activeCart.items.length === 0) {
            alert("Ваша корзина пуста!");
            return;
        }
        alert("Заказ оформлен! Наш игровой менеджер свяжется с вами.");
        activeCart.clear();
        renderCartView();
    });
});

function renderCartView() {
    const listContainer = document.getElementById('cart-items-container');
    const totalLabel = document.getElementById('summary-total');
    
    if (!listContainer) return;

    if (activeCart.items.length === 0) {
        listContainer.innerHTML = `<div class="loader">Корзина пуста. Отправляйтесь в каталог за лутом!</div>`;
        totalLabel.textContent = "$0.00";
        return;
    }

    listContainer.innerHTML = '';
    activeCart.items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <img src="${item.product.image}" alt="${item.product.title}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.product.title}</h4>
                <div class="cart-item-price">$${item.product.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="modifyQty(${item.product.id}, -1)">-</button>
                    <span class="qty-val">${item.quantity}</span>
                    <button class="qty-btn" onclick="modifyQty(${item.product.id}, 1)">+</button>
                </div>
                <button class="btn btn-secondary" onclick="deleteItem(${item.product.id})" style="color: var(--error-color); border-color: transparent;">Удалить</button>
            </div>
        `;
        listContainer.appendChild(row);
    });

    totalLabel.textContent = `$${activeCart.getTotal().toFixed(2)}`;
}

window.modifyQty = (id, delta) => {
    activeCart.updateQuantity(id, delta);
    renderCartView();
};

window.deleteItem = (id) => {
    activeCart.removeProduct(id);
    renderCartView();
};