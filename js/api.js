const API_URL = "https://fakestoreapi.com";

// Словарь для трансформации категорий
const CATEGORY_MAP = {
    "men's clothing": "Скины и Ножи (CS2 / Dota 2)",
    "jewelery": "Внутриигровая валюта и Кейсы",
    "electronics": "Геймерские девайсы и Железо",
    "women's clothing": "Игры и Цифровые ключи"
};

// Функция трансформации товаров
function transformProduct(item) {
    let title = item.title;
    let description = item.description;
    let image = item.image; 
    
    // Используем только проверенные домены Akamai и Unsplash без ошибок
    const gamingItems = {
        1: { 
            title: "Нож-бабочка | Гамма-волны (Прямо с завода)", 
            desc: "Редчайший внутриигровой предмет в CS2 с уникальной анимацией осмотра и ярким изумрудным паттерном волн.",
            img: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg"
        },
        2: { 
            title: "Перчатки спецназа | Кровавая паутина (Немного поношенное)", 
            desc: "Стильные тактические перчатки из CS2, украшенные фирменным агрессивным паттерном паутины.",
            img: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg"
        },
        3: { 
            title: "M4A4 | Вой (Поношенное)", 
            desc: "Запрещенный коллекционный скин в CS2. Настоящий статус-символ и легенда среди штурмовых винтовок.",
            img: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg"
        },
        4: { 
            title: "Коллекционный набор: Arcana на Phantom Assassin (Dota 2)", 
            desc: "Эксклюзивный предмет качества Arcana со встроенным счетчиком фрагментов, меняющий эффекты способностей.",
            img: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570/header.jpg"
        },
        5: { 
            title: "Лицензионный ключ Cyberpunk 2077: Phantom Liberty (PC / Steam)", 
            desc: "Официальный цифровой ключ активации масштабного сюжетного дополнения.",
            img: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2138330/header.jpg"
        },
        6: { 
            title: "Карта пополнения: 5000 В-Баксов (Fortnite)", 
            desc: "Цифровой код активации для мгновенного зачисления 5,000 V-Bucks на ваш аккаунт Epic Games.",
            img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60"
        },
        7: { 
            title: "Набор доната: 2000 Примогемов (Genshin Impact)", 
            desc: "Пакет Кристаллов сотворения для обмена на Камни Истока. Безопасное начисление по вашему игровому UID.",
            img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=60"
        },
        8: { 
            title: "Лицензионный ключ Elden Ring: Shadow of the Erdtree (Steam Global)", 
            desc: "Цифровой код активации глобальной версии масштабного дополнения.",
            img: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2778580/header.jpg"
        }
    };

    if (gamingItems[item.id]) {
        title = gamingItems[item.id].title;
        description = gamingItems[item.id].desc;
        image = gamingItems[item.id].img;
    } else if (item.category === 'electronics') {
        title = item.title.includes("WD") || item.title.includes("SSD") 
            ? `Игровой накопитель: ${item.title}` 
            : `Геймерский монитор: ${item.title}`;
        image = item.image;
    } else {
        title = `Эксклюзивный игровой набор контента #${item.id}`;
        image = "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg";
    }

    return {
        id: item.id,
        title: title,
        price: item.price,
        description: description,
        image: image,
        category: CATEGORY_MAP[item.category] || "Игровые товары"
    };
}

async function getProducts() {
    try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        return data.map(item => transformProduct(item));
    } catch (err) {
        console.error("Ошибка получения каталога:", err);
        return [];
    }
}

async function getProductById(id) {
    try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) return null;
        const item = await res.json();
        return transformProduct(item);
    } catch (err) {
        console.error(`Ошибка связи по ID ${id}:`, err);
        return null;
    }
}

async function getCategories() {
    try {
        const res = await fetch(`${API_URL}/products/categories`);
        const data = await res.json();
        return data.map(cat => CATEGORY_MAP[cat] || cat);
    } catch (err) {
        console.error("Ошибка категорий:", err);
        return [];
    }
}

async function getProductsByCategory(translatedCategory) {
    try {
        const originalCategory = Object.keys(CATEGORY_MAP).find(key => CATEGORY_MAP[key] === translatedCategory);
        const url = originalCategory 
            ? `${API_URL}/products/category/${encodeURIComponent(originalCategory)}`
            : `${API_URL}/products`;
            
        const res = await fetch(url);
        const data = await res.json();
        return data.map(item => transformProduct(item));
    } catch (err) {
        console.error("Ошибка фильтрации:", err);
        return [];
    }
}