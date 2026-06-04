document.addEventListener('DOMContentLoaded', async () => {
    await initCategories();
    await renderCatalog('all');
});

async function initCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    const categories = await getCategories();
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'tag-btn';
        btn.textContent = cat;
        btn.setAttribute('data-category', cat);
        container.appendChild(btn);
    });

    // Делегирование событий на переключение табов
    container.addEventListener('click', async (e) => {
        if (!e.target.classList.contains('tag-btn')) return;
        
        document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const selectedCat = e.target.getAttribute('data-category');
        await renderCatalog(selectedCat);
    });
}

async function renderCatalog(category) {
    const container = document.getElementById('catalog-container');
    if (!container) return;

    container.innerHTML = `<div class="loader">Получение боезапаса...</div>`;

    const rawProducts = (category === 'all') 
        ? await getProducts() 
        : await getProductsByCategory(category);

    if (rawProducts.length === 0) {
        container.innerHTML = `<div class="loader">Товары не найдены.</div>`;
        return;
    }

    container.innerHTML = '';
    rawProducts.forEach(item => {
        // Создаем экземпляр модели на базе ООП и рендерим
        const productObj = new Product(item.id, item.title, item.price, item.description, item.image, item.category);
        container.innerHTML += productObj.renderCard();
    });
}