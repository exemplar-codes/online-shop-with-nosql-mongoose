```
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
```

Words
- User has a Cart
- Cart belongs to a user
- User has a Product
- Product belongs to a user

Product may belong to many carts (Ok)
Cart contains many products (with associated quantity)
- Reaction 1: weird (N-M is fine, but can't store quantity!), go below the level of abstraction of ORM, need a table with (cartid, productid, quantity). Let's name this table 'CartItem'. Tables are like models, go back to ORM abstraction. Talk about CartItem now:
    - Cart has many cartitems. A Cartitem belongs to one cart.
    - A cartitem is associated with one product. A product may be associated with many cart items (since quantity may differ).
    All done w.r.t cart, product and cartItem (the incidental model).
    Let's revise all possible assoications with the junction
    - Cart, caritem - type of relation understood. Will need *items magic methods for rendering cart page.
    - Product, cartItem - typeof relation understood. But both Product hasOne cartItem and Product.belongsToMany.cartItem seem weird --> go down a level of abstraction.
        - Table wise, CartItemTable.root + add productId FK seems fine.
        - So CartItem.belongsTo(Product) and Product.hasMany(CartItems)
        - Doing both ways since I may wish to find all cartitems a product is present, too, for analytics/recommendations.

    The code works (tables with desired FKs are generated):
    ```js
    User.hasMany(Product);
    Product.belongsTo(User, { onDelete: "CASCADE" }); // ignore the onDelete, it's contextual to the project

    User.hasOne(Cart);
    Cart.belongsTo(User);

    Cart.hasMany(CartItem);
    CartItem.belongsTo(Cart);

    // using both sides (as is usual) since I wish to have analytics about Product and User who may buy them
    Product.hasMany(CartItem);
    CartItem.belongsTo(Product);
    ```

    This would work, but there's a problem here. The same cartItem interfaces Cart, Product. It's not as if a cartItem exists just in association with a Cart only, or a Product only - all 3 exist. In other words, we are not specifying the junction at all - it's just a table with all columns. The code is wrong. Fix: use the `through` construct.

    Placing FKs by the rule, we get:
    ```js
    Cart.belongsTo(Product, { through: CartItem });
    Product.hasMany(Cart, { through: CartItem });
    ```

    There's still a problem. Junction model magic methods are not provided in Sequelize. To do, we'll need to write more code. This code will not change the relation, FKs or anything, since we are already correct, but, it will add magic methods.

    ```js
    Cart.hasMany(CartItems); // for items magic methods
    CartItem.belongsTo(Cart); // for cart magic methods
    ```

    Feels weird, yes, but it was like so on first observation too. Lesson: it's relatively eaiser to write ORM assoications, but reading can be very hard.
- Reaction2, it's a many many relation, and we can store the quantity in junction table. Simple many-to-many with 'through' model.
    - Code:
        ```js
        CartItem = sequelizeModel{ id, quantity: INTEGER };
        Cart.belongsToMany(Product, through: { CartItem });
        Product.belongsToMany(Cart, through: { CartItem });
        ```
    - The junction table is usually OK to be hidden, but we have useful data in it (quantity). Also, we will need the cart items individually to show items list. To access CartItem from the Cart, we'll need to get magic methods (getItems, setItems etc), we may also need magic method to get the cart of a cartitem instance, code:
        ```js
        Cart.hasMany(CartItems); // for items magic methods
        CartItem.belongsTo(Cart); // for cart magic methods

        // the code here does not change the relations, since it's redundant essentially. We add it just for the magic methods.
        ```
    - We don't add similar code with Products, since products will generally ask for cart it's present in, and not otheriwse/
---

The following are rules I derived from the "thinking" above.
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
