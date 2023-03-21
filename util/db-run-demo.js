const db = require("./database");

// db.execute('SQL query here')
// db.query('SQL query here') - is the safer one
// db.end() - shut down the connection pool

(async () => {
  try {
    const response = await db.execute("SELECT * FROM products");

    const resultRows = response[0];
    console.log(resultRows); // array, with each element as object form of the row.
  } catch (error) {
    console.log(error);
  }
})();
