One one relation
- Directionless
- Each record in table A is related to atmost one record in table B, and vice-versa
- SQL implementation - one table gets a column of PK of the other (again, any table may be chosen for this - it does not matter)
- ORM implementation

One many relation
- Direction does matter (in the sense the opposite would change the meaning drastically)
- Each record in Person table can be related to any number of items in table Clothes, but every entity in Clothes can be related to atmost one record in Person. mAID - clothes are never shared after use.
- SQL implementation
    - Since storing an array in a column is not scalable, the table with the many side (Clothes here) adds a column for the other table's PK.
    - Doing manyRecord.whichOne is easy, since it's in the same row, but the opposite operation requires a whole scan of the many (Clothes) table. This can be solved by creating an index on the newly added column. If this kind of operation is less frequent, a full scan may be tolerable, and therefore the index is not needed.
- ORM implementation
    person.hasMany(clothes)
    cloth.belongsTo(person) - this part is optional, but usually kept for consistency's sake.

Many-many relation
- Directionless from a definition perspective (since  direction since many-many is a qualitative word), direction matters in reality
- Each record in one table can be related to any number of items in the other, and vice versa. e.g. Person table and watched Movie.
- SQL implementation
    - Since storing array in column is not scalable, and since both tables have multiple related records in the other, a column addition to either table won't help. Here, a third (junction) table is created which has just two columns, both for PKs of the tables. The max rows in this table can be m * n.
    - Doing somePerson.moviesSeen needs a full scan of the junction table. And the same holds for someMovie.peopleWhoSaw. This can be optimized by having a record over both columns of the junction table. In case one table has less queries to the other side, index regarding it may be ommitted (since indexes affect write speed).
- ORM implementation
    person.hasMany(movies) // simple, no mention of junction table
    movie.belongToMany(person)
