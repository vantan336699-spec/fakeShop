class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    checkPassword(password) {
        return this.password === password;
    }
}

class Product {
    constructor(id, title, price, description, image, category) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.image = image;
        this.category = category;
    }

    renderCard() {
        return `
            <article class="product-card">
                <div class="card-img-container">
                    <img src="${this.image}" alt="${this.title}" class="card-img" loading="lazy">
                </div>
                <div class="card-info">
                    <span class="card-cat">${this.category}</span>
                    <h3 class="card-name">${this.title}</h3>
                    <div class="card-price-row">$${this.price.toFixed(2)}</div>
                </div>
                <a href="product.html?id=${this.id}" class="btn btn-secondary">Приобрести</a>
            </article>
        `;
    }
}

class CartItem {
    constructor(product, quantity = 1) {
        this.product = product;
        this.quantity = quantity;
    }

    getTotalPrice() {
        return this.product.price * this.quantity;
    }
}

class Cart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
    }

    loadFromStorage() {
        const raw = localStorage.getItem('kz_cart_data');
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                this.items = parsed.map(item => new CartItem(item.product, item.quantity));
            } catch (e) {
                this.items = [];
            }
        }
    }

    saveToStorage() {
        localStorage.setItem('kz_cart_data', JSON.stringify(this.items));
        updateCartIcon();
    }

    addProduct(product) {
        const exist = this.items.find(i => i.product.id === product.id);
        if (exist) {
            exist.quantity++;
        } else {
            this.items.push(new CartItem(product, 1));
        }
        this.saveToStorage();
    }

    updateQuantity(productId, delta) {
        const item = this.items.find(i => i.product.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeProduct(productId);
                return;
            }
            this.saveToStorage();
        }
    }

    removeProduct(productId) {
        this.items = this.items.filter(i => i.product.id !== productId);
        this.saveToStorage();
    }

    getTotal() {
        return this.items.reduce((acc, item) => acc + item.getTotalPrice(), 0);
    }

    clear() {
        this.items = [];
        this.saveToStorage();
    }
}