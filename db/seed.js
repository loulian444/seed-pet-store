const client = require(`./db.js`);

const dropTables = async () => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS pets_products;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS pets;
      DROP TABLE IF EXISTS owners;
    `);

    console.log(`tables dropped`);
  } catch (error) {
    console.log(error);
  }
};

const createOwner = async (ownerName) => {
  try {
    await client.query(`
      INSERT INTO owners (Name)
      VALUES ('${ownerName}');
    `);

    console.log(`owner created`);
  } catch (error) {
    console.log(error);
  }
};

const createPet = async (petName, petType, ownerId) => {
  try {
    await client.query(`
      INSERT INTO pets (Name, Type, Owner_Id)
      VALUES ('${petName}', '${petType}', ${ownerId});
    `);

    console.log(`pet created`);
  } catch (error) {
    console.log(error);
  }
};

const createProduct = async (productName) => {
  try {
    await client.query(`
      INSERT INTO products (Name)
      VALUES ('${productName}');
    `);

    console.log(`product created`);
  } catch (error) {
    console.log(error);
  }
};

const linkPetsToProducts = async (petId, productId) => {
  try {
    await client.query(`
      INSERT INTO pets_products (Pets_Id, Products_Id)
      VALUES (${petId}, ${productId})
    `);

    console.log(`products linked`);
  } catch (error) {
    console.log(error);
  }
};

const createTables = async () => {
  try {
    await client.query(`
      CREATE TABLE owners (
        Id SERIAL PRIMARY KEY,
        Name VARCHAR(30) NOT NULL
      );

      CREATE TABLE pets (
        Id SERIAL PRIMARY KEY,
        Name VARCHAR(20) NOT NULL,
        Type VARCHAR(20) NOT NULL,
        Owner_Id INTEGER REFERENCES owners(id)
      );

      CREATE TABLE products (
        Id SERIAL PRIMARY KEY,
        Name VARCHAR(20) NOT NULL
      );

      CREATE TABLE pets_products (
        Pets_Id INTEGER REFERENCES pets(id),
        Products_Id INTEGER REFERENCES products(id)
      );
    `);

    console.log(`tables created`);
  } catch (error) {}
};

const syncAndSeed = async () => {
  try {
    await client.connect();
    console.log(`connected to the db`);

    await dropTables();
    await createTables();

    await createOwner(`Greg`);
    await createOwner(`Odysseus`);
    await createOwner(`Bill`);
    await createOwner(`Lou`);

    await createPet(`Ollie`, `Golden Retriever`, 2);
    await createPet(`Mustang`, `Horse`, 1);
    await createPet(`Alex`, `Lion`, 3);
    await createPet(`Tarzan`, `Gorilla`, 4);

    await createProduct(`Tooth Brush`);
    await createProduct(`Loofah`);
    await createProduct(`Soap`);
    await createProduct(`Ketoconazole`);

    await linkPetsToProducts(1, 1);
    await linkPetsToProducts(2, 1);
    await linkPetsToProducts(3, 1);
    await linkPetsToProducts(4, 1);
    await linkPetsToProducts(4, 2);
    await linkPetsToProducts(1, 3);
    await linkPetsToProducts(2, 3);
    await linkPetsToProducts(3, 3);
    await linkPetsToProducts(4, 3);
    await linkPetsToProducts(4, 4);
  } catch (error) {
    console.log(error);
  }
};

syncAndSeed();
