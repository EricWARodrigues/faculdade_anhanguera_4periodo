const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 🔹 Servir arquivos do frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// 🔹 Criar / conectar banco SQLite
const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco:", err.message);
  } else {
    console.log("Banco conectado com sucesso.");
  }
});

// 🔹 Criar tabelas automaticamente
db.serialize(() => {
  // db.run(`
  //   CREATE TABLE IF NOT EXISTS categories (
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //     name TEXT NOT NULL,
  //     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  //     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  //   )
  // `);

  // db.run(`
  //   CREATE TABLE IF NOT EXISTS cars (
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //     name TEXT NOT NULL,
  //     pricePerDay REAL NOT NULL,
  //     category_id INTEGER,
  //     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  //     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  //     FOREIGN KEY (category_id) REFERENCES categories(id)
  //   )
  // `);

  db.run(`
    CREATE TABLE IF NOT EXISTS specs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS car_specs (
      car_id INTEGER,
      spec_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (car_id, spec_id),
      FOREIGN KEY (car_id) REFERENCES cars(id),
      FOREIGN KEY (spec_id) REFERENCES specs(id)
    )
  `);
  // 🔹 Inserir categorias iniciais
// db.run(`
//   INSERT OR IGNORE INTO categories (id, name)
//   VALUES 
//     (1, 'economico'),
//     (2, 'suv'),
//     (3, 'luxo')
// `);

// 🔹 Inserir carros iniciais
// db.run(`
//   INSERT OR IGNORE INTO cars (id, name, pricePerDay, category_id)
//   VALUES
//     (1, 'Chevrolet Onix', 129, 1),
//     (2, 'Hyundai HB20', 139, 1),
//     (3, 'Jeep Renegade', 229, 2),
//     (4, 'Toyota Corolla', 299, 3)
// `);

// 🔹 Inserir specs
// db.run(`
//   INSERT OR IGNORE INTO specs (id, name)
//   VALUES
//     (1, 'Manual'),
//     (2, 'Automático'),
//     (3, 'Ar-cond.'),
//     (4, '4 portas'),
//     (5, 'SUV'),
//     (6, 'Multimídia'),
//     (7, 'Couro'),
//     (8, 'Assist. condução')
// `);

// 🔹 Relacionar carros e specs
// db.run(`
//   INSERT OR IGNORE INTO car_specs (car_id, spec_id)
//   VALUES
//     (1,1),(1,3),(1,4),
//     (2,2),(2,3),(2,4),
//     (3,2),(3,5),(3,6),
//     (4,2),(4,7),(4,8)
// `);
db.run(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    year INTEGER,
    transmission TEXT,
    fuel TEXT,
    pricePerDay REAL
  )
`);
});


db.get("SELECT COUNT(*) as count FROM cars", (err, row) => {
  if (row.count === 0) {
    console.log("Populando banco com carros iniciais...");

    const insertCategory = db.prepare("INSERT OR IGNORE INTO categories (name) VALUES (?)");

    const categories = [
      "economico",
      "hatch",
      "sedan",
      "suv",
      "pickup",
      "esportivo",
      "luxo",
      "eletrico"
    ];

    categories.forEach(cat => insertCategory.run(cat));
    insertCategory.finalize();

    const insertCar = db.prepare(`
      INSERT INTO cars (name, category, year, transmission, fuel, pricePerDay)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const cars = [
      // ECONÔMICOS
      ["Fiat Mobi", "economico", 2022, "Manual", "Flex", 89],
      ["Renault Kwid", "economico", 2023, "Manual", "Flex", 92],
      ["Chevrolet Onix Joy", "economico", 2022, "Manual", "Flex", 95],
      ["Hyundai HB20 Sense", "economico", 2023, "Manual", "Flex", 98],
      ["Volkswagen Gol", "economico", 2021, "Manual", "Flex", 85],

      // HATCH
      ["Toyota Yaris Hatch", "hatch", 2023, "Automático", "Flex", 130],
      ["Peugeot 208", "hatch", 2024, "Automático", "Flex", 145],
      ["Honda Fit", "hatch", 2022, "Automático", "Flex", 135],
      ["Citroen C3", "hatch", 2023, "Manual", "Flex", 110],
      ["Ford Fiesta", "hatch", 2021, "Manual", "Flex", 115],

      // SEDAN
      ["Toyota Corolla", "sedan", 2024, "Automático", "Flex", 210],
      ["Honda Civic", "sedan", 2023, "Automático", "Flex", 220],
      ["Chevrolet Cruze", "sedan", 2022, "Automático", "Flex", 190],
      ["Nissan Sentra", "sedan", 2024, "Automático", "Flex", 205],
      ["Volkswagen Virtus", "sedan", 2023, "Automático", "Flex", 175],
      ["Hyundai HB20S", "sedan", 2023, "Manual", "Flex", 150],

      // SUV
      ["Jeep Compass", "suv", 2024, "Automático", "Flex", 260],
      ["Hyundai Creta", "suv", 2023, "Automático", "Flex", 230],
      ["Toyota Corolla Cross", "suv", 2024, "Automático", "Híbrido", 280],
      ["Volkswagen T-Cross", "suv", 2023, "Automático", "Flex", 210],
      ["Chevrolet Tracker", "suv", 2024, "Automático", "Flex", 225],
      ["Nissan Kicks", "suv", 2023, "Automático", "Flex", 215],
      ["Renault Duster", "suv", 2022, "Manual", "Flex", 180],

      // PICKUP
      ["Toyota Hilux", "pickup", 2024, "Automático", "Diesel", 320],
      ["Ford Ranger", "pickup", 2023, "Automático", "Diesel", 310],
      ["Chevrolet S10", "pickup", 2023, "Automático", "Diesel", 300],
      ["Fiat Toro", "pickup", 2024, "Automático", "Flex", 250],
      ["Mitsubishi L200", "pickup", 2023, "Automático", "Diesel", 315],

      // ESPORTIVOS
      ["BMW 320i", "esportivo", 2024, "Automático", "Gasolina", 450],
      ["Audi A3 Sportback", "esportivo", 2023, "Automático", "Gasolina", 430],
      ["Mercedes CLA 250", "esportivo", 2024, "Automático", "Gasolina", 480],
      ["Ford Mustang GT", "esportivo", 2023, "Automático", "Gasolina", 650],
      ["Porsche 718 Cayman", "esportivo", 2024, "Automático", "Gasolina", 950],

      // LUXO
      ["BMW X5", "luxo", 2024, "Automático", "Diesel", 850],
      ["Audi Q7", "luxo", 2024, "Automático", "Gasolina", 880],
      ["Mercedes GLE 400", "luxo", 2023, "Automático", "Gasolina", 920],
      ["Range Rover Evoque", "luxo", 2024, "Automático", "Gasolina", 890],
      ["Volvo XC90", "luxo", 2024, "Automático", "Híbrido", 910],

      // ELÉTRICOS
      ["Tesla Model 3", "eletrico", 2024, "Automático", "Elétrico", 600],
      ["BYD Dolphin", "eletrico", 2024, "Automático", "Elétrico", 300],
      ["Volvo XC40 Recharge", "eletrico", 2024, "Automático", "Elétrico", 650],
      ["BMW iX", "eletrico", 2024, "Automático", "Elétrico", 980],
      ["Nissan Leaf", "eletrico", 2023, "Automático", "Elétrico", 340]
    ];

    cars.forEach(car => insertCar.run(car));
    insertCar.finalize();

    console.log("Banco populado com sucesso!");
  }
});

// 🔹 Rota de teste simples
app.get("/test", (req, res) => {
  res.json({ message: "Servidor funcionando corretamente 🚀" });
});

// 🔹 Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.get("/categories", (req, res) => {
  db.all("SELECT * FROM categories", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 🔹 Rota para buscar carros
app.get("/cars", (req, res) => {

  const query = `
    SELECT 
      id,
      name,
      category,
      year,
      transmission,
      fuel,
      pricePerDay
    FROM cars
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const formattedCars = rows.map(car => ({
      id: car.id,
      name: car.name,
      category: car.category,
      year: car.year,
      transmission: car.transmission,
      fuel: car.fuel,
      pricePerDay: car.pricePerDay,
      specs: [
        car.transmission,
        car.fuel,
        car.year
      ]
    }));

    res.json(formattedCars);
  });
});