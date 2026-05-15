// Seed de recetas con ingredientes mapeados a productos Hacendado reales
// Los nombres de producto en 'ingredientes' deben coincidir EXACTAMENTE
// con el campo 'nombre' del seed de productos.

const recetas = [
  {
    nombre: 'Tajín de Pollo al Limón con Olivas',
    descripcion: 'Un clásico de la cocina marroquí. Pollo jugoso cocinado a fuego lento con limón encurtido, olivas y especias exóticas.',
    foto_url: '/img/recetas/tajin.png',
    tiempo_minutos: 60,
    raciones_base: 4,
    semana_activa: '2026-06-02',
    dificultad: 'Media',
    categoria: 'Principal',
    calorias_racion: 450,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Marroquí',
    tags: ['SIN_GLUTEN', 'SIN_LACTOSA'],
    ingredientes: [
      { producto: 'Pollo entero troceado Hacendado', cantidad_base: 1000, unidad: 'g', nombre_display: 'Pollo troceado', grupo: 'Base' },
      { producto: 'Limón Hacendado', cantidad_base: 2, unidad: 'ud', nombre_display: 'Limones', grupo: 'Base' },
      { producto: 'Aceitunas verdes deshuesadas Hacendado', cantidad_base: 100, unidad: 'g', nombre_display: 'Aceitunas', grupo: 'Toques' },
      { producto: 'Cebolla Hacendado', cantidad_base: 200, unidad: 'g', nombre_display: 'Cebollas', grupo: 'Base' },
      { producto: 'Ajos Hacendado', cantidad_base: 3, unidad: 'ud', nombre_display: 'Ajos', grupo: 'Especias' },
      { producto: 'Aceite de oliva virgen extra Hacendado', cantidad_base: 40, unidad: 'ml', nombre_display: 'Aceite', grupo: 'Base' },
      { producto: 'Sal marina Hacendado', cantidad_base: 5, unidad: 'g', nombre_display: 'Sal', grupo: 'Condimentos' },
      { producto: 'Cilantro fresco Hacendado', cantidad_base: 1, unidad: 'ud', nombre_display: 'Cilantro', grupo: 'Toques' }
    ],
    pasos: [
      'Picar finamente la cebolla y los ajos.',
      'En un tajín (o cazuela baja), calentar el aceite y sofreír la cebolla y el ajo hasta que estén dorados.',
      'Añadir el pollo salpimentado y dorarlo por todas partes.',
      'Añadir un poco de agua, tapar y cocinar a fuego lento durante 40 minutos.',
      'Cortar un limón en cuartos y añadirlo junto a las aceitunas al tajín. Cocinar 10 minutos más.',
      'Espolvorear con cilantro fresco antes de servir.'
    ],
    consejos: [
      'Si no tienes tajín, puedes usar cualquier olla de fondo grueso que retenga bien el calor.',
      'Acompaña con cuscús o un buen pan para mojar en la salsa.'
    ],
    faq: [
      { pregunta: '¿Puedo usar pechuga en vez de pollo troceado?', respuesta: 'Sí, pero el pollo con hueso aporta mucho más sabor y melosidad a la salsa.' }
    ],
    reviews: []
  },
  {
    nombre: 'Cuscús con Verduras y Pasas',
    descripcion: 'Un entrante o acompañamiento dulce y salado. Sémola esponjosa, verduras tiernas y el toque dulce de las uvas pasas.',
    foto_url: '/img/recetas/cuscus.png',
    tiempo_minutos: 25,
    raciones_base: 4,
    semana_activa: '2026-06-02',
    dificultad: 'Fácil',
    categoria: 'Entrante',
    calorias_racion: 320,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Marroquí',
    tags: ['VEGETARIANO', 'SIN_LACTOSA'],
    ingredientes: [
      { producto: 'Cuscús Hacendado', cantidad_base: 250, unidad: 'g', nombre_display: 'Cuscús', grupo: 'Base' },
      { producto: 'Zanahoria Hacendado', cantidad_base: 150, unidad: 'g', nombre_display: 'Zanahorias', grupo: 'Verduras' },
      { producto: 'Calabacín Hacendado', cantidad_base: 150, unidad: 'g', nombre_display: 'Calabacín', grupo: 'Verduras' },
      { producto: 'Uvas pasas sultanas Hacendado', cantidad_base: 50, unidad: 'g', nombre_display: 'Pasas sultanas', grupo: 'Toques' },
      { producto: 'Aceite de oliva virgen extra Hacendado', cantidad_base: 30, unidad: 'ml', nombre_display: 'Aceite de oliva', grupo: 'Aliño' },
      { producto: 'Sal marina Hacendado', cantidad_base: 3, unidad: 'g', nombre_display: 'Sal', grupo: 'Condimentos' }
    ],
    pasos: [
      'Cortar la zanahoria y el calabacín en dados muy pequeños y saltearlos en una sartén con aceite hasta que estén tiernos.',
      'En un cazo, poner a hervir 250 ml de agua con una pizca de sal y un chorrito de aceite.',
      'Cuando el agua hierva, apartar del fuego, añadir el cuscús y las pasas, tapar y dejar reposar 5 minutos.',
      'Añadir un chorrito de aceite de oliva crudo al cuscús y separar los granos con un tenedor.',
      'Mezclar el cuscús con las verduras salteadas y servir.'
    ],
    consejos: [
      'Si quieres un extra de sabor, hidrata el cuscús con caldo de verduras o pollo en lugar de agua.'
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Lasaña de Carne Clásica',
    descripcion: 'Capas de pasta intercaladas con una rica salsa boloñesa, bechamel cremosa y queso fundido. El plato italiano más familiar.',
    foto_url: '/img/recetas/lasana.png',
    tiempo_minutos: 90,
    raciones_base: 6,
    semana_activa: '2026-06-02',
    dificultad: 'Difícil',
    categoria: 'Principal',
    calorias_racion: 650,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Italiana',
    tags: [],
    ingredientes: [
      { producto: 'Placas de lasaña Hacendado', cantidad_base: 12, unidad: 'ud', nombre_display: 'Placas de lasaña', grupo: 'Base' },
      { producto: 'Carne picada mixta Hacendado', cantidad_base: 600, unidad: 'g', nombre_display: 'Carne picada mixta', grupo: 'Relleno' },
      { producto: 'Tomate triturado Hacendado', cantidad_base: 400, unidad: 'g', nombre_display: 'Tomate triturado', grupo: 'Salsa' },
      { producto: 'Cebolla Hacendado', cantidad_base: 150, unidad: 'g', nombre_display: 'Cebolla', grupo: 'Salsa' },
      { producto: 'Queso rallado Hacendado', cantidad_base: 150, unidad: 'g', nombre_display: 'Queso rallado', grupo: 'Acabado' },
      { producto: 'Leche entera Hacendado', cantidad_base: 500, unidad: 'ml', nombre_display: 'Leche entera', grupo: 'Bechamel' },
      { producto: 'Mantequilla sin sal Hacendado', cantidad_base: 50, unidad: 'g', nombre_display: 'Mantequilla', grupo: 'Bechamel' },
      { producto: 'Aceite de oliva virgen extra Hacendado', cantidad_base: 30, unidad: 'ml', nombre_display: 'Aceite de oliva', grupo: 'Base' },
      { producto: 'Sal marina Hacendado', cantidad_base: 5, unidad: 'g', nombre_display: 'Sal', grupo: 'Condimentos' }
    ],
    pasos: [
      'Picar la cebolla y sofreírla en una sartén. Añadir la carne picada y cocinar hasta que pierda el color crudo.',
      'Añadir el tomate triturado, sal, y dejar cocer a fuego lento durante 30 minutos.',
      'Para la bechamel: Derretir la mantequilla, añadir harina (misma cantidad que mantequilla) y tostar un minuto. Añadir la leche poco a poco sin dejar de remover hasta que espese.',
      'Hidratar las placas de lasaña según las instrucciones del fabricante.',
      'En una fuente de horno, poner un poco de bechamel. Alternar capas de pasta, carne, y bechamel hasta terminar los ingredientes.',
      'Terminar con bechamel, espolvorear queso rallado y hornear a 200ºC durante 20 minutos hasta que gratine.'
    ],
    consejos: [
      'Prepara la salsa boloñesa el día anterior; reposada tiene mucho más sabor.'
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Tiramisú Auténtico',
    descripcion: 'El postre italiano más universal. Bizcochos empapados en café espresso y capas de crema de mascarpone suave.',
    foto_url: '/img/recetas/tiramisu.png',
    tiempo_minutos: 30,
    raciones_base: 6,
    semana_activa: '2026-06-02',
    dificultad: 'Media',
    categoria: 'Postre',
    calorias_racion: 480,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Italiana',
    tags: ['VEGETARIANO'],
    ingredientes: [
      { producto: 'Bizcochos de soletilla Hacendado', cantidad_base: 200, unidad: 'g', nombre_display: 'Bizcochos', grupo: 'Base' },
      { producto: 'Mascarpone Hacendado', cantidad_base: 500, unidad: 'g', nombre_display: 'Queso mascarpone', grupo: 'Crema' },
      { producto: 'Huevos Hacendado M', cantidad_base: 4, unidad: 'ud', nombre_display: 'Huevos', grupo: 'Crema' },
      { producto: 'Azúcar blanco Hacendado', cantidad_base: 100, unidad: 'g', nombre_display: 'Azúcar', grupo: 'Crema' },
      { producto: 'Café molido Hacendado', cantidad_base: 300, unidad: 'ml', nombre_display: 'Café (preparado y frío)', grupo: 'Baño' },
      { producto: 'Cacao puro en polvo Hacendado', cantidad_base: 20, unidad: 'g', nombre_display: 'Cacao puro', grupo: 'Decoración' }
    ],
    pasos: [
      'Preparar el café y dejarlo enfriar completamente en un plato hondo.',
      'Separar las yemas de las claras.',
      'Batir las yemas con la mitad del azúcar hasta que blanqueen. Añadir el mascarpone y mezclar suavemente.',
      'Montar las claras a punto de nieve con el resto del azúcar e incorporarlas a la crema de mascarpone con movimientos envolventes.',
      'Mojar los bizcochos ligeramente en el café frío y colocarlos en el fondo de una fuente rectangular.',
      'Cubrir con una capa de crema. Repetir otra capa de bizcochos y terminar con otra de crema.',
      'Dejar enfriar en la nevera mínimo 4 horas (mejor toda la noche). Espolvorear con cacao antes de servir.'
    ],
    consejos: [
      'No empapes demasiado los bizcochos en el café o el tiramisú soltará líquido y perderá consistencia.'
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Paella Mixta Tradicional',
    descripcion: 'El domingo en familia hecho plato. Arroz con pollo, marisco y verduras con un toque de azafrán inconfundible.',
    foto_url: '/img/recetas/paella.png',
    tiempo_minutos: 60,
    raciones_base: 4,
    semana_activa: '2026-06-02',
    dificultad: 'Difícil',
    categoria: 'Principal',
    calorias_racion: 510,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Española',
    tags: ['SIN_GLUTEN', 'SIN_LACTOSA'],
    ingredientes: [
      { producto: 'Arroz redondo Hacendado', cantidad_base: 400, unidad: 'g', nombre_display: 'Arroz redondo', grupo: 'Base' },
      { producto: 'Pollo entero troceado Hacendado', cantidad_base: 400, unidad: 'g', nombre_display: 'Pollo', grupo: 'Carne' },
      { producto: 'Gambón crudo Hacendado', cantidad_base: 200, unidad: 'g', nombre_display: 'Gambones', grupo: 'Marisco' },
      { producto: 'Mejillón de Chile Hacendado', cantidad_base: 200, unidad: 'g', nombre_display: 'Mejillones', grupo: 'Marisco' },
      { producto: 'Guisantes finos Hacendado', cantidad_base: 50, unidad: 'g', nombre_display: 'Guisantes', grupo: 'Verduras' },
      { producto: 'Pimiento rojo Hacendado', cantidad_base: 100, unidad: 'g', nombre_display: 'Pimiento rojo', grupo: 'Sofrito' },
      { producto: 'Tomate frito Hacendado', cantidad_base: 100, unidad: 'g', nombre_display: 'Tomate frito', grupo: 'Sofrito' },
      { producto: 'Aceite de oliva virgen extra Hacendado', cantidad_base: 40, unidad: 'ml', nombre_display: 'Aceite', grupo: 'Base' },
      { producto: 'Sal marina Hacendado', cantidad_base: 6, unidad: 'g', nombre_display: 'Sal', grupo: 'Condimentos' }
    ],
    pasos: [
      'En una paellera con aceite, marcar los gambones y retirarlos. En ese mismo aceite, dorar el pollo salpimentado.',
      'Añadir el pimiento rojo cortado a tiras y sofreír.',
      'Incorporar el tomate frito y el arroz. Rehogar todo junto un minuto.',
      'Añadir el doble de agua (o caldo) hirviendo que de arroz (aprox. 800ml), junto con azafrán o colorante y sal.',
      'Añadir los guisantes y dejar hervir a fuego fuerte 5 minutos. Bajar el fuego a medio.',
      'Cuando queden 5 minutos, colocar los gambones y mejillones por encima. Tras 15-18 mins totales, apagar y dejar reposar 5 min.'
    ],
    consejos: [
      'El secreto de la paella es el reposo. Cúbrela con un trapo de algodón limpio durante 5 minutos para que el arroz acabe de abrirse.'
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Gazpacho Andaluz Suave',
    descripcion: 'La sopa fría más famosa del mundo. Repleta de vitaminas, tomates maduros y un toque de buen aceite.',
    foto_url: '/img/recetas/gazpacho.png',
    tiempo_minutos: 15,
    raciones_base: 4,
    semana_activa: '2026-06-02',
    dificultad: 'Fácil',
    categoria: 'Entrante',
    calorias_racion: 150,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Española',
    tags: ['VEGANO', 'SIN_LACTOSA'],
    ingredientes: [
      { producto: 'Tomate pera Hacendado', cantidad_base: 1000, unidad: 'g', nombre_display: 'Tomates muy maduros', grupo: 'Verduras' },
      { producto: 'Pimiento verde Hacendado', cantidad_base: 50, unidad: 'g', nombre_display: 'Pimiento verde', grupo: 'Verduras' },
      { producto: 'Pepino Hacendado', cantidad_base: 50, unidad: 'g', nombre_display: 'Pepino', grupo: 'Verduras' },
      { producto: 'Ajos Hacendado', cantidad_base: 1, unidad: 'ud', nombre_display: 'Ajo (sin el germen)', grupo: 'Toque' },
      { producto: 'Aceite de oliva virgen extra Hacendado', cantidad_base: 50, unidad: 'ml', nombre_display: 'Aceite de oliva', grupo: 'Emulsión' },
      { producto: 'Sal marina Hacendado', cantidad_base: 4, unidad: 'g', nombre_display: 'Sal', grupo: 'Condimentos' },
      { producto: 'Picatostes Hacendado', cantidad_base: 20, unidad: 'g', nombre_display: 'Picatostes (opcional)', grupo: 'Guarnición' }
    ],
    pasos: [
      'Lavar bien los tomates, el pimiento y el pepino.',
      'Cortar las verduras en trozos, retirar las semillas del pimiento y pelar el pepino.',
      'En el vaso de la batidora, triturar los tomates, pimiento, pepino y ajo.',
      'Pasar la mezcla por un colador chino o pasapurés para quitar pieles y semillas y lograr una textura suave.',
      'Volver a poner el líquido en la batidora, añadir la sal, un chorrito de vinagre al gusto y el aceite.',
      'Batir de nuevo un minuto para emulsionar. Enfriar muy bien en nevera antes de servir.'
    ],
    consejos: [
      'Para que el ajo no repita, ábrelo por la mitad y retira el germen (la parte verde del centro).'
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Tacos al Pastor',
    descripcion: 'Puro México. Tacos de carne de cerdo adobada, con toques cítricos, piña asada, cebolla fresca y cilantro.',
    foto_url: '/img/recetas/tacos.png',
    tiempo_minutos: 40,
    raciones_base: 4,
    semana_activa: '2026-06-02',
    dificultad: 'Media',
    categoria: 'Principal',
    calorias_racion: 450,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Mexicana',
    tags: ['SIN_LACTOSA'],
    ingredientes: [
      { producto: 'Carne picada mixta Hacendado', cantidad_base: 600, unidad: 'g', nombre_display: 'Carne de cerdo (o mixta)', grupo: 'Carne' },
      { producto: 'Tortillas de maíz Hacendado', cantidad_base: 12, unidad: 'ud', nombre_display: 'Tortillas', grupo: 'Base' },
      { producto: 'Sazonador para Fajitas Hacendado', cantidad_base: 30, unidad: 'g', nombre_display: 'Sazonador fajitas/tacos', grupo: 'Especias' },
      { producto: 'Piña en su jugo Hacendado', cantidad_base: 150, unidad: 'g', nombre_display: 'Piña', grupo: 'Toques' },
      { producto: 'Cebolla Hacendado', cantidad_base: 100, unidad: 'g', nombre_display: 'Cebolla', grupo: 'Toques frescos' },
      { producto: 'Cilantro fresco Hacendado', cantidad_base: 1, unidad: 'ud', nombre_display: 'Cilantro fresco', grupo: 'Toques frescos' },
      { producto: 'Limón Hacendado', cantidad_base: 1, unidad: 'ud', nombre_display: 'Lima/Limón', grupo: 'Acabado' }
    ],
    pasos: [
      'Macerar la carne picada (o tiras finas de cerdo) con el sazonador y un chorrito de agua o zumo de piña durante 15 minutos.',
      'Picar la cebolla y el cilantro muy finos. Cortar la piña en dados pequeños.',
      'En una sartén bien caliente, dorar los dados de piña hasta que caramelicen un poco y retirar.',
      'En la misma sartén con un poco de aceite, cocinar la carne a fuego fuerte hasta que esté dorada y crujiente.',
      'Calentar las tortillas de maíz vuelta y vuelta en otra sartén sin aceite.',
      'Montar los tacos: tortilla, carne, piña asada, cebolla picada y cilantro. Servir con gajos de limón.'
    ],
    consejos: [
      'Las tortillas de maíz deben calentarse bien para que no se rompan al doblarlas.'
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Guacamole Casero Auténtico',
    descripcion: 'El dip por excelencia para compartir. Crema de aguacates frescos con un toque de lima y crujientes nachos.',
    foto_url: '/img/recetas/guacamole_autentico.png',
    tiempo_minutos: 15,
    raciones_base: 4,
    semana_activa: '2026-06-02',
    dificultad: 'Fácil',
    categoria: 'Entrante',
    calorias_racion: 250,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Mexicana',
    tags: ['VEGANO', 'SIN_GLUTEN', 'SIN_LACTOSA'],
    ingredientes: [
      { producto: 'Aguacates Hacendado', cantidad_base: 500, unidad: 'g', nombre_display: 'Aguacates maduros', grupo: 'Base' },
      { producto: 'Cebolla Hacendado', cantidad_base: 50, unidad: 'g', nombre_display: 'Cebolla dulce', grupo: 'Frescor' },
      { producto: 'Tomate ensalada Hacendado', cantidad_base: 80, unidad: 'g', nombre_display: 'Tomate', grupo: 'Frescor' },
      { producto: 'Cilantro fresco Hacendado', cantidad_base: 1, unidad: 'ud', nombre_display: 'Cilantro', grupo: 'Hierbas' },
      { producto: 'Limón Hacendado', cantidad_base: 1, unidad: 'ud', nombre_display: 'Zumo de limón', grupo: 'Acidez' },
      { producto: 'Sal marina Hacendado', cantidad_base: 3, unidad: 'g', nombre_display: 'Sal', grupo: 'Condimentos' },
      { producto: 'Tortillas chips nachos Hacendado', cantidad_base: 150, unidad: 'g', nombre_display: 'Nachos para acompañar', grupo: 'Acompañamiento' }
    ],
    pasos: [
      'Picar muy fina la cebolla, el cilantro y el tomate (descartando semillas y jugo del tomate).',
      'Cortar los aguacates por la mitad, retirar el hueso y extraer la pulpa.',
      'En un bol, chafar los aguacates con un tenedor. No debe quedar un puré perfecto, está bien dejar grumos.',
      'Inmediatamente, exprimir medio limón sobre el aguacate para evitar que se oxide y añadir sal.',
      'Incorporar la verdura picada y mezclar todo de forma envolvente.',
      'Servir en un bol rodeado de los nachos.'
    ],
    consejos: [
      'El hueso del aguacate dentro del guacamole no retrasa la oxidación significativamente; lo mejor es el jugo cítrico y taparlo al ras con film plástico.'
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Maki Sushi de Salmón y Aguacate',
    descripcion: 'Rollitos japoneses elegantes y frescos. Una vez que aprendes la técnica, harás sushi todas las semanas.',
    foto_url: '/img/recetas/sushi.png',
    tiempo_minutos: 50,
    raciones_base: 2,
    semana_activa: '2026-06-02',
    dificultad: 'Difícil',
    categoria: 'Entrante',
    calorias_racion: 380,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Japonesa',
    tags: ['SIN_LACTOSA'],
    ingredientes: [
      { producto: 'Arroz para sushi Hacendado', cantidad_base: 250, unidad: 'g', nombre_display: 'Arroz para sushi', grupo: 'Base' },
      { producto: 'Algas Nori Hacendado', cantidad_base: 3, unidad: 'ud', nombre_display: 'Algas Nori', grupo: 'Base' },
      { producto: 'Vinagre de arroz Hacendado', cantidad_base: 30, unidad: 'ml', nombre_display: 'Vinagre de arroz', grupo: 'Aliño arroz' },
      { producto: 'Lomos de salmón Hacendado', cantidad_base: 150, unidad: 'g', nombre_display: 'Salmón fresco (previamente congelado)', grupo: 'Relleno' },
      { producto: 'Aguacates Hacendado', cantidad_base: 100, unidad: 'g', nombre_display: 'Aguacate', grupo: 'Relleno' },
      { producto: 'Azúcar blanco Hacendado', cantidad_base: 15, unidad: 'g', nombre_display: 'Azúcar', grupo: 'Aliño arroz' },
      { producto: 'Sal marina Hacendado', cantidad_base: 5, unidad: 'g', nombre_display: 'Sal', grupo: 'Aliño arroz' }
    ],
    pasos: [
      'Lavar el arroz con agua fría varias veces hasta que el agua salga transparente. Dejar escurrir 15 min.',
      'Cocer el arroz tapado con misma cantidad de agua durante 15 minutos a fuego lento. Retirar y reposar tapado 10 min.',
      'En un cazo, disolver el azúcar y la sal en el vinagre de arroz a fuego muy bajo.',
      'Poner el arroz en un recipiente amplio, verter el aliño y mezclar suavemente cortando el arroz mientras se abanica para enfriarlo.',
      'Cortar el salmón y el aguacate en tiras alargadas.',
      'Sobre una esterilla, colocar el alga nori, extender una capa fina de arroz dejando 2 cm arriba libres.',
      'Poner el relleno en el centro y enrollar presionando firmemente. Cortar el rollo en 6 u 8 piezas con un cuchillo húmedo.'
    ],
    consejos: [
      'Humedece ligeramente tus manos con agua para manipular el arroz y evitar que se pegue.'
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Pollo Teriyaki con Arroz',
    descripcion: 'Pechugas glaseadas con la famosa salsa dulce y salada japonesa, coronadas con sésamo.',
    foto_url: '/img/recetas/teriyaki.png',
    tiempo_minutos: 25,
    raciones_base: 2,
    semana_activa: '2026-06-02',
    dificultad: 'Media',
    categoria: 'Principal',
    calorias_racion: 480,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Japonesa',
    tags: ['SIN_LACTOSA'],
    ingredientes: [
      { producto: 'Pechuga de pollo Hacendado', cantidad_base: 400, unidad: 'g', nombre_display: 'Pechugas de pollo', grupo: 'Carne' },
      { producto: 'Salsa Teriyaki Hacendado', cantidad_base: 100, unidad: 'ml', nombre_display: 'Salsa Teriyaki', grupo: 'Salsa' },
      { producto: 'Arroz basmati Hacendado', cantidad_base: 150, unidad: 'g', nombre_display: 'Arroz basmati', grupo: 'Acompañamiento' },
      { producto: 'Sésamo tostado Hacendado', cantidad_base: 5, unidad: 'g', nombre_display: 'Sésamo tostado', grupo: 'Toque final' },
      { producto: 'Brócoli Hacendado', cantidad_base: 150, unidad: 'g', nombre_display: 'Brócoli (opcional)', grupo: 'Verduras' },
      { producto: 'Aceite de oliva virgen extra Hacendado', cantidad_base: 15, unidad: 'ml', nombre_display: 'Aceite', grupo: 'Cocción' }
    ],
    pasos: [
      'Poner a cocer el arroz en abundante agua salada hirviendo unos 12 minutos. Escurrir.',
      'Cortar la pechuga de pollo en dados del tamaño de un bocado.',
      'Calentar aceite en una sartén grande y dorar el pollo a fuego fuerte por todos lados.',
      'Si se usa, cocer el brócoli al vapor o hervido 5 minutos hasta que esté al dente.',
      'Bajar el fuego de la sartén del pollo, verter la salsa teriyaki y dejar reducir 5 minutos hasta que la salsa espese y caramelice bañando la carne.',
      'Servir el pollo sobre el arroz, añadir el brócoli al lado y espolvorear sésamo tostado por encima.'
    ],
    consejos: [
      'Vigila el pollo cuando eches la salsa, ya que los azúcares que contiene pueden quemarse rápidamente.'
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Tikka Masala de Pollo',
    descripcion: 'El curry indio más famoso. Suave, cremoso, aromático e intensamente naranja.',
    foto_url: '/img/recetas/tikka.png',
    tiempo_minutos: 40,
    raciones_base: 4,
    semana_activa: '2026-06-02',
    dificultad: 'Media',
    categoria: 'Principal',
    calorias_racion: 550,
    autor_origen: 'Cocina Hacendado',
    cocina: 'India',
    tags: ['SIN_GLUTEN'],
    ingredientes: [
      { producto: 'Pechuga de pollo Hacendado', cantidad_base: 600, unidad: 'g', nombre_display: 'Pollo', grupo: 'Carne' },
      { producto: 'Salsa Tikka Masala Hacendado', cantidad_base: 300, unidad: 'g', nombre_display: 'Salsa base Tikka Masala', grupo: 'Salsa' },
      { producto: 'Yogur griego natural Hacendado', cantidad_base: 1, unidad: 'ud', nombre_display: 'Yogur griego', grupo: 'Macerado' },
      { producto: 'Leche de coco Hacendado', cantidad_base: 150, unidad: 'ml', nombre_display: 'Leche de coco (o nata)', grupo: 'Cremosidad' },
      { producto: 'Pan de pita Hacendado', cantidad_base: 4, unidad: 'ud', nombre_display: 'Pan de pita/Naan', grupo: 'Acompañamiento' },
      { producto: 'Cebolla Hacendado', cantidad_base: 150, unidad: 'g', nombre_display: 'Cebolla', grupo: 'Sofrito' },
      { producto: 'Aceite de oliva virgen extra Hacendado', cantidad_base: 20, unidad: 'ml', nombre_display: 'Aceite', grupo: 'Base' }
    ],
    pasos: [
      'Cortar el pollo en tacos gruesos y mezclar en un bol con el yogur griego y un par de cucharadas de la salsa tikka masala. Macerar 20 min.',
      'Picar la cebolla finamente y pocharla en una olla o cazuela profunda con aceite.',
      'Añadir el pollo macerado a la olla y sellarlo a fuego medio-alto.',
      'Verter el resto del bote de salsa Tikka Masala y llevar a ebullición suave.',
      'Añadir la leche de coco, remover bien y dejar cocinar tapado a fuego lento durante 15 minutos.',
      'Calentar los panes de pita en la tostadora o sartén y servir caliente con cilantro picado.'
    ],
    consejos: [
      'El yogur del macerado ablanda las fibras de la carne, dejando el pollo espectacularmente jugoso.'
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Falafel con Salsa de Yogur',
    descripcion: 'Croquetas vegetales crujientes por fuera y tiernas por dentro, rebosantes de cilantro, comino y sabor a Medio Oriente.',
    foto_url: '/img/recetas/falafel.png',
    tiempo_minutos: 45,
    raciones_base: 3,
    semana_activa: '2026-06-02',
    dificultad: 'Media',
    categoria: 'Entrante',
    calorias_racion: 410,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Árabe',
    tags: ['VEGETARIANO', 'SIN_GLUTEN'],
    ingredientes: [
      { producto: 'Garbanzos cocidos Hacendado', cantidad_base: 400, unidad: 'g', nombre_display: 'Garbanzos cocidos y bien secos', grupo: 'Masa' },
      { producto: 'Cebolla Hacendado', cantidad_base: 50, unidad: 'g', nombre_display: 'Cebolla', grupo: 'Aromas' },
      { producto: 'Ajos Hacendado', cantidad_base: 1, unidad: 'ud', nombre_display: 'Ajo', grupo: 'Aromas' },
      { producto: 'Cilantro fresco Hacendado', cantidad_base: 1, unidad: 'ud', nombre_display: 'Manojo de cilantro', grupo: 'Aromas' },
      { producto: 'Pan de pita Hacendado', cantidad_base: 3, unidad: 'ud', nombre_display: 'Pan pita', grupo: 'Guarnición' },
      { producto: 'Yogur griego natural Hacendado', cantidad_base: 1, unidad: 'ud', nombre_display: 'Yogur natural', grupo: 'Salsa' },
      { producto: 'Limón Hacendado', cantidad_base: 1, unidad: 'ud', nombre_display: 'Limón (zumo)', grupo: 'Salsa' },
      { producto: 'Aceite de oliva virgen extra Hacendado', cantidad_base: 200, unidad: 'ml', nombre_display: 'Aceite', grupo: 'Fritura' },
      { producto: 'Sal marina Hacendado', cantidad_base: 4, unidad: 'g', nombre_display: 'Sal', grupo: 'Condimentos' }
    ],
    pasos: [
      'Lavar y secar muy bien los garbanzos con papel absorbente. (Esto es clave para que no se deshagan).',
      'En un procesador de alimentos o picadora, triturar los garbanzos, la cebolla, el ajo, el cilantro y la sal, hasta obtener una masa manejable con pequeños trocitos (no un puré).',
      'Formar bolas del tamaño de una nuez y aplastarlas ligeramente. Reservar en nevera 20 minutos.',
      'Preparar la salsa mezclando el yogur, un chorrito de zumo de limón, sal, aceite crudo y, si sobra, un poco de cilantro picado.',
      'Calentar abundante aceite en una sartén y freír los falafel a fuego medio-fuerte hasta dorarlos por ambos lados. Escurrir en papel absorbente.',
      'Servir acompañados del pan de pita caliente y la salsa de yogur.'
    ],
    consejos: [
      'Puedes rebozarlos en un poco de harina de garbanzo o de trigo antes de freír para asegurar que la costra quede intacta.'
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Ensalada César con Crujientes',
    descripcion: 'La ensalada reina de los restaurantes en tu casa. Fresca, con un rico pollo a la plancha y un aliño sedoso irresistible.',
    foto_url: '/img/recetas/cesar.png',
    tiempo_minutos: 15,
    raciones_base: 2,
    semana_activa: '2026-06-02',
    dificultad: 'Fácil',
    categoria: 'Entrante',
    calorias_racion: 350,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Americana',
    tags: [],
    ingredientes: [
      { producto: 'Corazones de lechuga romana Hacendado', cantidad_base: 2, unidad: 'ud', nombre_display: 'Lechuga romana', grupo: 'Base' },
      { producto: 'Pechuga de pollo Hacendado', cantidad_base: 200, unidad: 'g', nombre_display: 'Filetes de pollo', grupo: 'Proteína' },
      { producto: 'Salsa César Hacendado', cantidad_base: 50, unidad: 'ml', nombre_display: 'Salsa César', grupo: 'Aliño' },
      { producto: 'Picatostes Hacendado', cantidad_base: 40, unidad: 'g', nombre_display: 'Picatostes o croutons', grupo: 'Toque crujiente' },
      { producto: 'Queso Parmesano Hacendado', cantidad_base: 40, unidad: 'g', nombre_display: 'Queso en lascas', grupo: 'Acabado' },
      { producto: 'Aceite de oliva virgen extra Hacendado', cantidad_base: 15, unidad: 'ml', nombre_display: 'Aceite', grupo: 'Plancha' },
      { producto: 'Sal marina Hacendado', cantidad_base: 2, unidad: 'g', nombre_display: 'Sal', grupo: 'Condimentos' }
    ],
    pasos: [
      'Lavar bien la lechuga, secarla perfectamente (escurridora) y cortarla en trozos medianos.',
      'Salpimentar los filetes de pollo.',
      'En una sartén bien caliente con un poco de aceite, cocinar el pollo hasta dorarlo bien por ambos lados. Retirar y cortar en tiras.',
      'Colocar la lechuga en una ensaladera o platos llanos.',
      'Añadir las tiras de pollo templado por encima.',
      'Repartir los picatostes y las lascas de queso.',
      'Añadir la salsa César al gusto justo antes de servir y remover bien.'
    ],
    consejos: [
      'Añade la salsa justo antes de empezar a comer para que la lechuga y los picatostes mantengan todo su crujiente.'
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Brownie de Chocolate y Nueces',
    descripcion: 'Puro placer de chocolate. Textura densa, centro jugoso, costra exterior crujiente y nueces tostadas.',
    foto_url: '/img/recetas/brownie.png',
    tiempo_minutos: 45,
    raciones_base: 8,
    semana_activa: '2026-06-02',
    dificultad: 'Fácil',
    categoria: 'Postre',
    calorias_racion: 400,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Americana',
    tags: ['VEGETARIANO'],
    ingredientes: [
      { producto: 'Chocolate fondant postres Hacendado', cantidad_base: 200, unidad: 'g', nombre_display: 'Chocolate para fundir', grupo: 'Masa' },
      { producto: 'Mantequilla sin sal Hacendado', cantidad_base: 100, unidad: 'g', nombre_display: 'Mantequilla', grupo: 'Masa' },
      { producto: 'Azúcar blanco Hacendado', cantidad_base: 150, unidad: 'g', nombre_display: 'Azúcar', grupo: 'Masa' },
      { producto: 'Huevos Hacendado M', cantidad_base: 3, unidad: 'ud', nombre_display: 'Huevos', grupo: 'Masa' },
      { producto: 'Harina de trigo Hacendado', cantidad_base: 80, unidad: 'g', nombre_display: 'Harina', grupo: 'Masa' },
      { producto: 'Nueces peladas Hacendado', cantidad_base: 80, unidad: 'g', nombre_display: 'Nueces', grupo: 'Toque crujiente' }
    ],
    pasos: [
      'Precalentar el horno a 180ºC. Forrar un molde cuadrado (de unos 20x20 cm) con papel de hornear.',
      'Trocear el chocolate y fundirlo al baño maría o en microondas (en tandas de 30 seg) junto con la mantequilla.',
      'En un bol aparte, batir los huevos con el azúcar enérgicamente hasta que espumen y blanqueen un poco.',
      'Verter lentamente la mezcla de chocolate tibio sobre los huevos, sin dejar de remover con varillas.',
      'Añadir la harina tamizada y mezclar con una espátula haciendo movimientos envolventes.',
      'Incorporar las nueces ligeramente troceadas a la masa.',
      'Verter en el molde y hornear durante 25-30 minutos. El centro debe quedar algo húmedo al pinchar. Dejar enfriar antes de cortar.'
    ],
    consejos: [
      'Sirve un trozo de brownie caliente con una bola de helado de vainilla encima. El contraste de temperaturas es mágico.'
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Crema Catalana Caramelizada',
    descripcion: 'Delicada crema pastelera enriquecida con canela y limón, terminada con la mítica capa superior de azúcar quemado.',
    foto_url: '/img/recetas/crema_catalana.png',
    tiempo_minutos: 30,
    raciones_base: 4,
    semana_activa: '2026-06-02',
    dificultad: 'Media',
    categoria: 'Postre',
    calorias_racion: 320,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Española',
    tags: ['VEGETARIANO', 'SIN_GLUTEN'],
    ingredientes: [
      { producto: 'Leche entera Hacendado', cantidad_base: 500, unidad: 'ml', nombre_display: 'Leche', grupo: 'Base' },
      { producto: 'Huevos Hacendado M', cantidad_base: 4, unidad: 'ud', nombre_display: 'Yemas de huevo', grupo: 'Crema' },
      { producto: 'Azúcar blanco Hacendado', cantidad_base: 100, unidad: 'g', nombre_display: 'Azúcar (+ extra quemar)', grupo: 'Dulzura' },
      { producto: 'Maicena Hacendado', cantidad_base: 25, unidad: 'g', nombre_display: 'Almidón de maíz', grupo: 'Espesante' },
      { producto: 'Limón Hacendado', cantidad_base: 1, unidad: 'ud', nombre_display: 'Piel de limón (sin lo blanco)', grupo: 'Aromas' },
      { producto: 'Canela molida Hacendado', cantidad_base: 1, unidad: 'g', nombre_display: 'Rama de canela (o molida)', grupo: 'Aromas' }
    ],
    pasos: [
      'Separar las claras y conservar solo las 4 yemas.',
      'En un cazo, poner a hervir 400ml de la leche junto a la canela y las pieles amarillas del limón. Cuando hierva, apartar y dejar infusionar 15 min.',
      'Disolver la maicena en los 100ml de leche fría restantes.',
      'En un bol, batir las yemas con el azúcar hasta que queden cremosas. Añadir la leche con maicena.',
      'Retirar la piel de limón y canela de la leche infusionada. Verter poco a poco sobre las yemas sin dejar de remover.',
      'Devolver toda la mezcla al cazo a fuego lento. Remover constantemente con varillas hasta que espese (sin que llegue a hervir para no cortar las yemas).',
      'Repartir en cazuelas de barro y enfriar en la nevera al menos 4 horas.',
      'Justo antes de servir, espolvorear azúcar por encima y quemarlo con un soplete de cocina o un quemador caliente.'
    ],
    consejos: [
      'Corta la piel del limón con un pelador procurando no llevarte la parte blanca (albedo), que amargaría la crema.'
    ],
    faq: [],
    reviews: []
  }
];

module.exports = recetas;
