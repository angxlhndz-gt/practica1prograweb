import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categoryData = [
    { name: "Computación", description: "Computadoras, componentes y periféricos" },
    { name: "Accesorios", description: "Accesorios y conectividad" },
    { name: "Audio", description: "Audífonos, micrófonos y dispositivos de audio" }
  ];

  for (const category of categoryData) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { description: category.description, isActive: true },
      create: category
    });
  }

  const categories = await prisma.category.findMany();
  const categoryByName = new Map(categories.map((category) => [category.name, category.id]));

  // Catálogo base: se generan 100 productos determinísticos con SKU estables.
  // El upsert permite volver a ejecutar el seed sin duplicar los registros.
  const catalog = [
    { name: "Laptop empresarial", category: "Computación" },
    { name: "Laptop para estudiantes", category: "Computación" },
    { name: "Laptop gaming", category: "Computación" },
    { name: "Computadora de escritorio", category: "Computación" },
    { name: "Mini PC", category: "Computación" },
    { name: "Tablet", category: "Computación" },
    { name: "Monitor Full HD", category: "Computación" },
    { name: "Monitor 4K", category: "Computación" },
    { name: "Unidad SSD NVMe", category: "Computación" },
    { name: "Disco externo", category: "Computación" },
    { name: "Memoria RAM", category: "Computación" },
    { name: "Procesador de escritorio", category: "Computación" },
    { name: "Tarjeta gráfica", category: "Computación" },
    { name: "Tarjeta madre", category: "Computación" },
    { name: "Router inalámbrico", category: "Computación" },
    { name: "Switch de red", category: "Computación" },
    { name: "Impresora multifuncional", category: "Computación" },
    { name: "Escáner de documentos", category: "Computación" },
    { name: "Proyector portátil", category: "Computación" },
    { name: "Servidor compacto", category: "Computación" },
    { name: "Teclado inalámbrico", category: "Accesorios" },
    { name: "Teclado ergonómico", category: "Accesorios" },
    { name: "Mouse óptico USB", category: "Accesorios" },
    { name: "Mouse gamer RGB", category: "Accesorios" },
    { name: "Alfombrilla para mouse", category: "Accesorios" },
    { name: "Webcam Full HD", category: "Accesorios" },
    { name: "Hub USB-C", category: "Accesorios" },
    { name: "Adaptador USB-C a HDMI", category: "Accesorios" },
    { name: "Memoria USB", category: "Accesorios" },
    { name: "Cable HDMI", category: "Accesorios" },
    { name: "Cable USB-C", category: "Accesorios" },
    { name: "Cable de red Cat 6", category: "Accesorios" },
    { name: "Cargador USB-C", category: "Accesorios" },
    { name: "Regleta con protección", category: "Accesorios" },
    { name: "UPS", category: "Accesorios" },
    { name: "Mochila para laptop", category: "Accesorios" },
    { name: "Soporte ajustable para laptop", category: "Accesorios" },
    { name: "Docking station USB-C", category: "Accesorios" },
    { name: "Adaptador Ethernet USB", category: "Accesorios" },
    { name: "Lector de tarjetas", category: "Accesorios" },
    { name: "Audífonos Bluetooth", category: "Audio" },
    { name: "Audífonos con cable", category: "Audio" },
    { name: "Audífonos con cancelación de ruido", category: "Audio" },
    { name: "Micrófono USB", category: "Audio" },
    { name: "Bocina Bluetooth portátil", category: "Audio" },
    { name: "Bocinas estéreo para escritorio", category: "Audio" },
    { name: "Barra de sonido", category: "Audio" },
    { name: "Adaptador Bluetooth USB", category: "Audio" },
    { name: "Micrófono inalámbrico", category: "Audio" },
    { name: "Amplificador compacto", category: "Audio" },
  ];

  const products = Array.from({ length: 100 }, (_, index) => {
    const item = catalog[index % catalog.length];
    const model = Math.floor(index / catalog.length) + 1;
    const sequence = index + 1;
    const stockOptions = [0, 4, 7, 12, 18, 25, 32];
    const minStockOptions = [3, 5, 8, 10];
    return {
      sku: `DEM-${String(sequence).padStart(3, "0")}`,
      name: `${item.name} modelo ${String(model).padStart(2, "0")}`,
      description: `Producto de demostración ${item.name.toLowerCase()} modelo ${String(model).padStart(2, "0")}. Útil para practicar búsquedas, filtros y paginación.`,
      price: Number((99.99 + ((sequence * 137.25) % 6500)).toFixed(2)),
      stock: stockOptions[index % stockOptions.length],
      minStock: minStockOptions[index % minStockOptions.length],
      category: item.category
    };
  });

  // Incluimos algunos nombres familiares para las primeras pruebas.
  products[0] = { ...products[0], sku: "TEC-001", name: "Teclado mecánico", description: "Teclado USB para escritorio", price: 450, stock: 25, minStock: 5, category: "Accesorios" };
  products[1] = { ...products[1], sku: "MOU-001", name: "Mouse inalámbrico", description: "Mouse óptico inalámbrico", price: 175, stock: 30, minStock: 8, category: "Accesorios" };
  products[2] = { ...products[2], sku: "LAP-001", name: "Laptop de prueba", description: "Equipo de demostración", price: 6250, stock: 8, minStock: 3, category: "Computación" };
  products[3] = { ...products[3], sku: "AUD-001", name: "Audífonos Bluetooth", description: "Audífonos inalámbricos", price: 325, stock: 4, minStock: 5, category: "Audio" };
  products[4] = { ...products[4], sku: "MON-001", name: "Monitor 24 pulgadas", description: "Monitor Full HD", price: 1150, stock: 12, minStock: 3, category: "Computación" };

  for (const product of products) {
    const categoryId = categoryByName.get(product.category);
    if (!categoryId) throw new Error(`No se encontró la categoría: ${product.category}`);
    const { category, ...data } = product;
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        ...data,
        price: new Prisma.Decimal(product.price),
        categoryId,
        isActive: true
      },
      create: {
        ...data,
        price: new Prisma.Decimal(product.price),
        categoryId
      }
    });
  }

  const totalProducts = await prisma.product.count();
  console.log(`Seed completado: ${products.length} productos de demostración procesados; la tabla contiene ${totalProducts} productos en total.`);
  console.log("Las credenciales de Basic Auth se configuran en BASIC_AUTH_USERNAME y BASIC_AUTH_PASSWORD dentro de .env.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
