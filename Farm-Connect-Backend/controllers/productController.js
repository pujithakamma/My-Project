let products = [
    {
        id: 101,
        productName: "Tomato",
        farmerName: "Ramesh",
        category: "Vegetables",
        quantity: 100,
        price: 40,
        location: "Vijayawada"
    },
    {
        id: 102,
        productName: "Carrot",
        farmerName: "Suresh",
        category: "Vegetables",
        quantity: 150,
        price: 30,
        location: "Guntur"
    },
    {
        id: 103,
        productName: "Red Chilli",
        farmerName: "Mahesh",
        category: "Spices",
        quantity: 80,
        price: 120,
        location: "Chittoor"
    }
];

export function getProducts(req, res) {
    res.status(200).json(products);
}

export function getProductById(req, res) {
    const id = Number(req.params.id);

    const product = products.find(
        (product) => product.id === id
    );
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }
    res.status(200).json({
        success: true,
        product
    });
}

export function addProduct(req, res) {
    const product = req.body;
    const existingProduct = products.find(
        (p) => p.id === product.id
    );
    if (existingProduct) {
        return res.status(400).json({
            success: false,
            message: "Product ID already exists"
        });
    }
    products.push(product);
    res.status(201).json({
        success: true,
        message: "Product added successfully",
        product
    });
}

export function updateProduct(req, res) {
    const id = Number(req.params.id);
    const updatedProduct = req.body;
    let productFound = false;
    products = products.map((product) => {
        if (product.id === id) {
            productFound = true;
            return { ...product, ...updatedProduct };
        }
        return product;
    });
    if (!productFound) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }
    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct
    });
}

export function deleteProduct(req, res) {
    const id = Number(req.params.id);
    const product = products.find(
        (product) => product.id === id
    );
    products = products.filter(
        (product) => product.id !== id
    );
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
}