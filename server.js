const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Books array
let books = [
    { id: 1, name: "Intro to CS", price: 50, image: "Idaho.png" },
    { id: 2, name: "Data Structures", price: 60, image: "Boisestate.png" },
    { id: 3, name: "Algorithms", price: 55, image: "book3.png" },
    { id: 4, name: "Cybersecurity Basics", price: 70, image: "book4.png" },
    { id: 5, name: "Software Engineering", price: 75, image: "software.png" },
    { id: 6, name: "Networking Essentials", price: 65, image: "network.png" },
    { id: 7, name: "Database Systems", price: 80, image: "database.png" },
    { id: 8, name: "Artificial Intelligence", price: 90, image: "ai.png" }
];


let cart = [];

app.get('/', (req, res) => {
    res.render('index', { books });
});

app.post('/add-to-cart', (req, res) => {
    const bookId = parseInt(req.body.bookId);
    const book = books.find(b => b.id === bookId);
    if (book) {
        cart.push(book);
        console.log("Added to cart:", book);
    }
    res.redirect('/');
});

app.get('/cart', (req, res) => {
    res.render('cart', { cart });
});

app.get('/checkout', (req, res) => {
    res.render('checkout', { cart, total: cart.reduce((sum, item) => sum + item.price, 0) });
});

app.post('/checkout', (req, res) => {
    const checkoutData = {
        name: req.body.name,
        email: req.body.email,
        cardNumber: req.body.cardNumber,
        cardExp: req.body.cardExp,
        cardCVV: req.body.cardCVV,
        cart: cart.map(item => item.name).join('; '),
        total: cart.reduce((sum, item) => sum + item.price, 0)
    };
    console.log("Checkout Info:", checkoutData);

    // Save to CSV
    const csvLine = `"${checkoutData.name}","${checkoutData.email}","${checkoutData.cardNumber}","${checkoutData.cardExp}","${checkoutData.cardCVV}","${checkoutData.cart}",${checkoutData.total}\n`;
    const filePath = path.join(__dirname, 'orders.csv');
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '"Name","Email","CardNumber","Exp","CVV","Books","Total"\n');
    }
    fs.appendFileSync(filePath, csvLine);

    cart = [];
    res.send('<h1>🎉 Order Placed! 🎉</h1><a href="/">Back to Shop</a>');
});

app.listen(PORT, () => {
    console.log(`Bronco Student Shop running at http://localhost:${PORT}`);
});
