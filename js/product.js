document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        window.location.href = 'index.html';
        return;
    }

    const container = document.getElementById('product-container');
    const rawData = await getProductById(productId);

    if (!rawData) {
        container.innerHTML = `<div class="loader">Предмет временно отсутствует в системе генерации лута.</div>`;
        return;
    }

    const currentProduct = new Product(rawData.id, rawData.title, rawData.price, rawData.description, rawData.image, rawData.category);

    container.innerHTML = `
        <div class="detail-img-container">
            <img src="${currentProduct.image}" alt="${currentProduct.title}" class="detail-img">
        </div>
        <div class="detail-meta">
            <span class="product-category">${currentProduct.category}</span>
            <h1 class="product-title">${currentProduct.title}</h1>
            <div class="product-price">$${currentProduct.price.toFixed(2)}</div>
            <p class="product-desc">${currentProduct.description}</p>
            <button id="add-to-cart-action" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.1rem;">Добавить в корзину</button>
        </div>
    `;

    document.getElementById('add-to-cart-action').addEventListener('click', () => {
        const cart = new Cart();
        cart.addProduct(currentProduct);
        alert('Предмет успешно перемещен в корзину!');
    });
});