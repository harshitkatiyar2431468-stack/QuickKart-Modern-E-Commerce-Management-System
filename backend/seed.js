require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const sampleProducts = [
  // --- MOBILES ---
  {
    name: "Apple iPhone 15 Pro Max (256 GB) - Titanium",
    description: "Forged in titanium with industry-leading A17 Pro chip, 48MP main camera with 5x optical zoom, Action button, and USB-C.",
    price: 148900,
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
    stock: 12,
  },
  {
    name: "Samsung Galaxy S24 Ultra 5G (AI Edition)",
    description: "Galaxy AI features, built-in S Pen, 200MP camera with Quad Telephoto system, and Snapdragon 8 Gen 3 for Galaxy.",
    price: 129999,
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop",
    stock: 15,
  },
  {
    name: "OnePlus 12 5G (Flowy Emerald, 16GB RAM)",
    description: "Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera system, 5400mAh battery with 100W SUPERVOOC charging.",
    price: 64999,
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop",
    stock: 8,
  },

  // --- LAPTOPS ---
  {
    name: "Apple MacBook Pro 16\" (M3 Pro, 18GB Unified RAM)",
    description: "Liquid Retina XDR display, up to 22 hours battery life, pro ports including HDMI, MagSafe 3 and SDXC slot.",
    price: 249900,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    stock: 6,
  },
  {
    name: "Dell XPS 15 9530 (OLED Touch, i9 13th Gen)",
    description: "3.5K OLED InfinityEdge touch display, NVIDIA GeForce RTX 4070, CNC machined aluminum and carbon fiber palm rest.",
    price: 189990,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop",
    stock: 9,
  },
  {
    name: "ASUS ROG Zephyrus G16 (RTX 4080 Gaming Laptop)",
    description: "Ultra-slim OLED gaming laptop with Intel Core Ultra 9, ROG Nebula Display, 240Hz refresh rate, 32GB RAM.",
    price: 219990,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800&auto=format&fit=crop",
    stock: 5,
  },

  // --- FASHION ---
  {
    name: "Nike Air Jordan 1 Retro High OG 'Chicago'",
    description: "Iconic streetwear sneaker crafted with premium genuine leather, encapsulated Air-Sole unit, and vintage rubber outsole.",
    price: 16995,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop",
    stock: 20,
  },
  {
    name: "Urban Classic Biker Leather Jacket",
    description: "100% genuine full-grain lambskin leather with heavy-duty YKK zippers, quilted inner lining, and modern slim cut.",
    price: 8999,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=800&auto=format&fit=crop",
    stock: 14,
  },
  {
    name: "Premium Heavyweight Oversized Hoodie (Onyx Black)",
    description: "480 GSM French Terry cotton hoodie with custom metal aglets, kangaroo pocket, and double-layered hood.",
    price: 3499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    stock: 30,
  },

  // --- ELECTRONICS ---
  {
    name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    description: "Industry-leading dual processor noise cancellation, 8 microphones, 30-hour battery life with quick charging, Hi-Res Audio.",
    price: 29990,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    stock: 22,
  },
  {
    name: "LG 55\" OLED evo 4K Cinema Smart TV (120Hz, Dolby Vision)",
    description: "Self-lit OLED pixels with infinite contrast, α9 AI Processor Gen6, G-Sync & FreeSync support for pro gaming.",
    price: 114990,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop",
    stock: 7,
  },
  {
    name: "Bose SoundLink Max Portable Bluetooth Speaker",
    description: "Epic deep stereo bass, IP67 waterproof & dustproof, silicone rope handle, and up to 20 hours battery life.",
    price: 39900,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop",
    stock: 16,
  },

  // --- FURNITURE ---
  {
    name: "Ergonomic Mesh Executive Chair with Lumbar Support",
    description: "Breathable Korean mesh, 3D adjustable armrests, dynamic lumbar support, and heavy-duty chrome aluminum wheelbase.",
    price: 14999,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1580481077195-c2f82d13470f?q=80&w=800&auto=format&fit=crop",
    stock: 10,
  },
  {
    name: "Scandinavian 3-Seater Velvet Sofa (Emerald Green)",
    description: "High-density foam cushions, solid kiln-dried hardwood frame, plush stain-resistant velvet fabric and brass legs.",
    price: 38990,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
    stock: 4,
  },
  {
    name: "Minimalist Solid Teak Wood Coffee Table",
    description: "Natural organic wood grain with matte polyurethane finish and industrial powder-coated metal geometric base.",
    price: 9499,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=80&w=800&auto=format&fit=crop",
    stock: 8,
  },

  // --- WATCHES ---
  {
    name: "Apple Watch Ultra 2 (GPS + Cellular, 49mm Titanium)",
    description: "Rugged aerospace-grade titanium case, precision dual-frequency GPS, up to 36 hours normal battery life, 100m water resistant.",
    price: 89900,
    category: "Watches",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    stock: 11,
  },
  {
    name: "Fossil Gen 6 Smartwatch with Stainless Steel Strap",
    description: "Snapdragon Wear 4100+, Alexa built-in, SpO2 sensor, continuous heart rate tracking, rapid charging (80% in 30 mins).",
    price: 23995,
    category: "Watches",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop",
    stock: 18,
  },
  {
    name: "Classic Chronograph Automatic Watch (Sapphire Crystal)",
    description: "Japanese Miyota automatic movement, scratch-resistant sapphire crystal glass, 5 ATM water resistance, genuine leather band.",
    price: 18499,
    category: "Watches",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop",
    stock: 14,
  },
];

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommercedb";
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB for Seeding 🌱");

    // Clear existing or upsert
    await Product.deleteMany({});
    console.log("Cleared old products...");

    const inserted = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${inserted.length} high-quality products across all categories! 🎉`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedDB();
