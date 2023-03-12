const products = [];

class Product {
  constructor(title) {
    this.title = title;
    //  deliberately ignoring id, or update for this demo.
  }

  save() {
    products.push(this); // `this` refers to the Product instance
  }

  static fetchAll() {
    return products;
  }
}

// for initial population
// this runs only once, since file import are cached in Node.js
const firstProduct = new Product('An awesome book')
firstProduct.save();

module.exports = Product;
