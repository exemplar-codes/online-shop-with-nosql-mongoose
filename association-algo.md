// table, yes
User =  {
    products: [<Product>],
    cart: <Cart>
    ...
}

// tables, yes
Product = {
    user: <User>
}

// cart, corresponds to use (1-1)
Cart = {
    items: [{<Product>, quantity: Integer}]
}

// no other choice but
CartItem:
cartId (imp), productId (~imp), quantity (ok)

Words
- User has a Cart
- Cart belongs to a user
- User has a Product
- Product belongs to a user

Product may belong to many carts (Ok)
Cart contains many products (with associated quantity) - weird, go below the level of abstraction of ORM, need a table with (cartid, productid, quantity). Let's name this table 'CartItem'. Tables are like models, go back to ORM abstraction. Talk about CartItem now:
- Cart has many cartitems. Cartitem belongs to one cart.
- A cartitem is associated with one product. A product may be associated with many cart items (since quantity may differ).
All done w.r.t cart, product and cartItem (the incidental model).
Let's revise all possible assoications
Cart, caritem - done
Cart, product - cannot be done directly, so this whole process, ignore.
Product, cartItem - ?

CartItem *<----> Product
CartItemTable.root + add productId, so CartItem.belongsTo(Product) and Product.hasMany(CartItems)


Notes:
1. First write down in words, simply use 'associated' and specify type of relation (1-1, 1-N, N-M). If there's extra data needed in addition to the association, note this down (we'll need a junction model here).
2. For the ones where association is simple (no data needed), use the Sequelize defaults.
3. For the ones where extra data was needed, create junction models. Then consider all possible associations of the junction model(s) with the actual (generally two) models that we were trying to associate. Repeat from #1. Until step 3 is empty.
4. If at any point, the Sequelize relation wording seems weird/wrong (example: products belonging to or having many cart items), go down a level of abtraction and see in which model table the FKs would be added for each of the possible Sequelize relation. Place the FKs in the correct tables, and choose the Sequelize relation that will ensure this (using the source-target-FK placement rule). Now that we have tables, move back up and create models for the tables. Continue.

Jargon:
1. Sequelize relation - hasOne, belongsTo, hasMany, belongsToMany
2. source-target-FK - the "needy" one stores the FK

Note:
1. It is implied that table-level data for all models is added appropriately. After then only, do we start thinking about associations.
