const fs = require('fs');
const path = require('path');

const newRecipes = `
  {
    nombre: 'Tortilla de patatas tradicional',
    descripcion: 'La clásica tortilla de patatas española, jugosa por dentro y con el toque perfecto de cebolla. Un básico que nunca falla.',
    foto_url: '/img/recetas/tortilla.png',
    tiempo_minutos: 45,
    raciones_base: 4,
    semana_activa: '2026-06-02',
    dificultad: 'Media',
    categoria: 'Principal',
    calorias_racion: 350,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Española',
    tags: ['VEGETARIANO', 'SIN_GLUTEN'],
    ingredientes: [
      { producto: 'Patatas Hacendado', cantidad_base: 800, unidad: 'g', nombre_display: 'Patatas', grupo: 'Base' },
      { producto: 'Cebolla Hacendado', cantidad_base: 200, unidad: 'g', nombre_display: 'Cebolla', grupo: 'Base' },
      { producto: 'Huevos Hacendado M', cantidad_base: 6, unidad: 'ud', nombre_display: 'Huevos', grupo: 'Base' },
      { producto: 'Aceite de oliva virgen extra Hacendado', cantidad_base: 200, unidad: 'ml', nombre_display: 'Aceite de oliva', grupo: 'Para freír' },
      { producto: 'Sal marina Hacendado', cantidad_base: 5, unidad: 'g', nombre_display: 'Sal', grupo: 'Condimento' }
    ],
    pasos: [
      { orden: 1, descripcion: 'Pelar las patatas y cortarlas en láminas finas e irregulares.' },
      { orden: 2, descripcion: 'Pelar la cebolla y picarla finamente.' },
      { orden: 3, descripcion: 'Poner el aceite a calentar en una sartén grande a fuego medio. Añadir la patata y la cebolla con un poco de sal.' },
      { orden: 4, descripcion: 'Freír lentamente durante 20-25 minutos hasta que la patata esté muy tierna y ligeramente dorada.' },
      { orden: 5, descripcion: 'Escurrir bien el aceite de la mezcla de patata y cebolla.' },
      { orden: 6, descripcion: 'Batir los huevos en un bol grande, añadir una pizca de sal y mezclar con la patata y cebolla.' },
      { orden: 7, descripcion: 'En una sartén antiadherente con unas gotas de aceite, verter la mezcla y cuajar a fuego medio-alto durante 3 minutos.' },
      { orden: 8, descripcion: 'Dar la vuelta a la tortilla con ayuda de un plato y cuajar por el otro lado 2 minutos más.' }
    ],
    tips: [
      { orden: 1, texto: 'Para una tortilla más jugosa, no batas los huevos en exceso, simplemente rómpelos.' },
      { orden: 2, texto: 'Deja reposar la mezcla de patata caliente con el huevo crudo unos 10 minutos antes de cuajarla en la sartén.' }
    ],
    faq: [
      { orden: 1, question: '¿Puedo hacerla sin cebolla?', answer: 'Por supuesto, es cuestión de gustos. Solo omite la cebolla de los ingredientes.' }
    ],
    reviews: []
  },
  {
    nombre: 'Lentejas estofadas con chorizo',
    descripcion: 'Un plato de cuchara reconfortante y lleno de hierro. Las lentejas de toda la vida, cocinadas a fuego lento.',
    foto_url: '/img/recetas/lentejas.png',
    tiempo_minutos: 60,
    raciones_base: 4,
    semana_activa: '2026-06-02',
    dificultad: 'Fácil',
    categoria: 'Principal',
    calorias_racion: 480,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Española',
    tags: ['SIN_GLUTEN'],
    ingredientes: [
      { producto: 'Lentejas pardinas Hacendado', cantidad_base: 350, unidad: 'g', nombre_display: 'Lentejas pardinas', grupo: 'Base' },
      { producto: 'Chorizo sarta Hacendado', cantidad_base: 150, unidad: 'g', nombre_display: 'Chorizo', grupo: 'Acompañamiento' },
      { producto: 'Cebolla Hacendado', cantidad_base: 150, unidad: 'g', nombre_display: 'Cebolla', grupo: 'Sofrito' },
      { producto: 'Zanahoria Hacendado', cantidad_base: 100, unidad: 'g', nombre_display: 'Zanahoria', grupo: 'Sofrito' },
      { producto: 'Ajos Hacendado', cantidad_base: 2, unidad: 'ud', nombre_display: 'Dientes de ajo', grupo: 'Sofrito' },
      { producto: 'Tomate frito Hacendado', cantidad_base: 50, unidad: 'g', nombre_display: 'Tomate frito', grupo: 'Sofrito' },
      { producto: 'Aceite de oliva virgen extra Hacendado', cantidad_base: 30, unidad: 'ml', nombre_display: 'Aceite de oliva', grupo: 'Base' },
      { producto: 'Sal marina Hacendado', cantidad_base: 4, unidad: 'g', nombre_display: 'Sal', grupo: 'Condimento' }
    ],
    pasos: [
      { orden: 1, descripcion: 'Picar la cebolla, los ajos y la zanahoria finamente.' },
      { orden: 2, descripcion: 'En una olla con un chorrito de aceite, sofreír la verdura a fuego medio durante 10 minutos.' },
      { orden: 3, descripcion: 'Cortar el chorizo en rodajas y añadirlo al sofrito junto con el tomate frito. Dar unas vueltas.' },
      { orden: 4, descripcion: 'Lavar las lentejas y añadirlas a la olla.' },
      { orden: 5, descripcion: 'Cubrir con agua fría (unos tres dedos por encima de las lentejas), añadir la sal y llevar a ebullición.' },
      { orden: 6, descripcion: 'Bajar el fuego y dejar cocer a fuego lento durante unos 45 minutos hasta que las lentejas estén tiernas.' }
    ],
    tips: [
      { orden: 1, texto: 'La lenteja pardina no necesita remojo previo, pero si la pones en remojo un par de horas cocerá más rápido.' }
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Pollo al curry con arroz basmati',
    descripcion: 'Un viaje aromático a la India. Trozos tiernos de pollo en una salsa cremosa de curry, acompañado de arroz aromático.',
    foto_url: '/img/recetas/pollo_curry.png',
    tiempo_minutos: 35,
    raciones_base: 2,
    semana_activa: '2026-06-02',
    dificultad: 'Fácil',
    categoria: 'Principal',
    calorias_racion: 550,
    autor_origen: 'Cocina Hacendado',
    cocina: 'India',
    tags: ['SIN_GLUTEN'],
    ingredientes: [
      { producto: 'Pechuga de pollo Hacendado', cantidad_base: 400, unidad: 'g', nombre_display: 'Pechuga de pollo', grupo: 'Carne' },
      { producto: 'Cebolla Hacendado', cantidad_base: 150, unidad: 'g', nombre_display: 'Cebolla', grupo: 'Salsa' },
      { producto: 'Nata para cocinar Hacendado', cantidad_base: 200, unidad: 'ml', nombre_display: 'Nata para cocinar', grupo: 'Salsa' },
      { producto: 'Arroz basmati Hacendado', cantidad_base: 150, unidad: 'g', nombre_display: 'Arroz basmati', grupo: 'Acompañamiento' },
      { producto: 'Aceite de oliva virgen extra Hacendado', cantidad_base: 20, unidad: 'ml', nombre_display: 'Aceite', grupo: 'Base' },
      { producto: 'Sal marina Hacendado', cantidad_base: 3, unidad: 'g', nombre_display: 'Sal', grupo: 'Condimentos' }
    ],
    pasos: [
      { orden: 1, descripcion: 'Cortar las pechugas de pollo en dados medianos y salar.' },
      { orden: 2, descripcion: 'Picar la cebolla finamente y sofreírla en una sartén grande con aceite hasta que esté dorada.' },
      { orden: 3, descripcion: 'Añadir el pollo a la sartén y cocinar hasta que esté sellado por todos lados.' },
      { orden: 4, descripcion: 'Espolvorear curry en polvo al gusto (aprox. 1-2 cucharadas) y remover bien un par de minutos.' },
      { orden: 5, descripcion: 'Verter la nata para cocinar, remover y dejar reducir a fuego suave unos 10 minutos.' },
      { orden: 6, descripcion: 'Mientras, hervir el arroz basmati en abundante agua con sal durante 12 minutos y escurrir.' },
      { orden: 7, descripcion: 'Servir el pollo al curry bien caliente acompañado del arroz.' }
    ],
    tips: [
      { orden: 1, texto: 'Si quieres un toque más fresco, añade un poco de cilantro picado justo antes de servir.' }
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Salmón al horno con verduras',
    descripcion: 'Cena rápida, saludable y deliciosa. El salmón queda jugoso y las verduras asadas le dan el contrapunto perfecto.',
    foto_url: '/img/recetas/salmon.png',
    tiempo_minutos: 30,
    raciones_base: 2,
    semana_activa: '2026-06-02',
    dificultad: 'Fácil',
    categoria: 'Principal',
    calorias_racion: 420,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Mediterránea',
    tags: ['SIN_GLUTEN'],
    ingredientes: [
      { producto: 'Lomos de salmón Hacendado', cantidad_base: 300, unidad: 'g', nombre_display: 'Lomos de salmón', grupo: 'Pescado' },
      { producto: 'Zanahoria Hacendado', cantidad_base: 150, unidad: 'g', nombre_display: 'Zanahorias', grupo: 'Verduras' },
      { producto: 'Cebolla Hacendado', cantidad_base: 150, unidad: 'g', nombre_display: 'Cebolla', grupo: 'Verduras' },
      { producto: 'Aceite de oliva virgen extra Hacendado', cantidad_base: 20, unidad: 'ml', nombre_display: 'Aceite de oliva', grupo: 'Aliño' },
      { producto: 'Sal marina Hacendado', cantidad_base: 3, unidad: 'g', nombre_display: 'Sal', grupo: 'Condimentos' },
      { producto: 'Pimienta negra molida Hacendado', cantidad_base: 1, unidad: 'g', nombre_display: 'Pimienta negra', grupo: 'Condimentos' }
    ],
    pasos: [
      { orden: 1, descripcion: 'Precalentar el horno a 200ºC.' },
      { orden: 2, descripcion: 'Cortar las zanahorias y la cebolla en tiras finas o bastones.' },
      { orden: 3, descripcion: 'Colocar las verduras en una bandeja de horno, añadir sal, pimienta y un chorrito de aceite. Hornear 15 minutos.' },
      { orden: 4, descripcion: 'Salpimentar los lomos de salmón.' },
      { orden: 5, descripcion: 'Sacar la bandeja, colocar el salmón sobre las verduras y hornear todo junto unos 12-15 minutos más, dependiendo del grosor del pescado.' },
      { orden: 6, descripcion: 'Servir caliente.' }
    ],
    tips: [
      { orden: 1, texto: 'Puedes exprimir un poco de limón sobre el salmón al sacarlo del horno.' }
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Macarrones con atún y tomate',
    descripcion: 'El plato salvavidas por excelencia. Rápido, con ingredientes de despensa y que gusta a todos los públicos.',
    foto_url: '/img/recetas/macarrones_atun.png',
    tiempo_minutos: 20,
    raciones_base: 4,
    semana_activa: '2026-06-02',
    dificultad: 'Muy fácil',
    categoria: 'Principal',
    calorias_racion: 450,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Española',
    tags: [],
    ingredientes: [
      { producto: 'Macarrones Hacendado', cantidad_base: 400, unidad: 'g', nombre_display: 'Macarrones', grupo: 'Pasta' },
      { producto: 'Atún claro en aceite de girasol Hacendado', cantidad_base: 160, unidad: 'g', nombre_display: 'Atún en conserva (escurrido)', grupo: 'Proteína' },
      { producto: 'Tomate frito Hacendado', cantidad_base: 400, unidad: 'g', nombre_display: 'Tomate frito', grupo: 'Salsa' },
      { producto: 'Cebolla Hacendado', cantidad_base: 100, unidad: 'g', nombre_display: 'Cebolla', grupo: 'Salsa' },
      { producto: 'Queso rallado Hacendado', cantidad_base: 100, unidad: 'g', nombre_display: 'Queso rallado', grupo: 'Acabado' },
      { producto: 'Sal marina Hacendado', cantidad_base: 4, unidad: 'g', nombre_display: 'Sal', grupo: 'Cocción' },
      { producto: 'Aceite de oliva virgen extra Hacendado', cantidad_base: 15, unidad: 'ml', nombre_display: 'Aceite de oliva', grupo: 'Salsa' }
    ],
    pasos: [
      { orden: 1, descripcion: 'Cocer los macarrones en abundante agua con sal siguiendo el tiempo del paquete. Escurrir y reservar.' },
      { orden: 2, descripcion: 'Picar la cebolla finamente y sofreírla en una sartén con un poco de aceite.' },
      { orden: 3, descripcion: 'Cuando la cebolla esté dorada, añadir el atún escurrido y remover un minuto.' },
      { orden: 4, descripcion: 'Añadir el tomate frito y dejar cocer a fuego lento un par de minutos para que se integren los sabores.' },
      { orden: 5, descripcion: 'Mezclar la salsa con los macarrones escurridos.' },
      { orden: 6, descripcion: 'Servir en platos y espolvorear queso rallado por encima. Opcional: gratinar 5 minutos en el horno.' }
    ],
    tips: [
      { orden: 1, texto: 'Para un toque crujiente, gratina el queso en el horno a máxima potencia durante 5 minutos.' }
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Ensalada de garbanzos refrescante',
    descripcion: 'Legumbres en verano. Una ensalada nutritiva, llena de color y muy fácil de preparar para llevar en tu tupper.',
    foto_url: '/img/recetas/ensalada_garbanzos.png',
    tiempo_minutos: 15,
    raciones_base: 2,
    semana_activa: '2026-06-02',
    dificultad: 'Muy fácil',
    categoria: 'Entrante',
    calorias_racion: 320,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Mediterránea',
    tags: ['VEGANO', 'SIN_GLUTEN', 'SIN_LACTOSA'],
    ingredientes: [
      { producto: 'Garbanzos cocidos Hacendado', cantidad_base: 400, unidad: 'g', nombre_display: 'Garbanzos cocidos', grupo: 'Base' },
      { producto: 'Tomate ensalada Hacendado', cantidad_base: 200, unidad: 'g', nombre_display: 'Tomates', grupo: 'Verduras' },
      { producto: 'Pimiento rojo Hacendado', cantidad_base: 100, unidad: 'g', nombre_display: 'Pimiento rojo', grupo: 'Verduras' },
      { producto: 'Cebolla Hacendado', cantidad_base: 50, unidad: 'g', nombre_display: 'Cebolla', grupo: 'Verduras' },
      { producto: 'Aceite de oliva virgen extra Hacendado', cantidad_base: 30, unidad: 'ml', nombre_display: 'Aceite de oliva', grupo: 'Aliño' },
      { producto: 'Sal marina Hacendado', cantidad_base: 2, unidad: 'g', nombre_display: 'Sal', grupo: 'Aliño' }
    ],
    pasos: [
      { orden: 1, descripcion: 'Enjuagar bien los garbanzos cocidos bajo el grifo hasta que deje de salir espuma y escurrirlos.' },
      { orden: 2, descripcion: 'Cortar los tomates, el pimiento rojo y la cebolla en dados muy pequeños (brunoise).' },
      { orden: 3, descripcion: 'Poner los garbanzos en una ensaladera y añadir todas las verduras picadas.' },
      { orden: 4, descripcion: 'Aliñar con la sal y el aceite de oliva. Remover todo muy bien.' },
      { orden: 5, descripcion: 'Dejar reposar en la nevera unos 15 minutos antes de servir para que los sabores se asienten.' }
    ],
    tips: [
      { orden: 1, texto: 'Puedes añadir un chorrito de vinagre o zumo de limón para darle más frescor.' }
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Sándwich mixto gratinado',
    descripcion: 'El clásico biquini llevado a otro nivel. Tostado por fuera, queso fundido por dentro y cubierto con una deliciosa capa gratinada.',
    foto_url: '/img/recetas/sandwich_mixto.png',
    tiempo_minutos: 15,
    raciones_base: 1,
    semana_activa: '2026-06-02',
    dificultad: 'Fácil',
    categoria: 'Principal',
    calorias_racion: 410,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Internacional',
    tags: [],
    ingredientes: [
      { producto: 'Pan de molde Hacendado', cantidad_base: 2, unidad: 'ud', nombre_display: 'Rebanadas de pan de molde', grupo: 'Base' },
      { producto: 'Jamón cocido extra Hacendado', cantidad_base: 40, unidad: 'g', nombre_display: 'Jamón cocido', grupo: 'Relleno' },
      { producto: 'Queso rallado Hacendado', cantidad_base: 60, unidad: 'g', nombre_display: 'Queso rallado (mitad para rellenar, mitad gratinar)', grupo: 'Quesos' },
      { producto: 'Nata para cocinar Hacendado', cantidad_base: 20, unidad: 'ml', nombre_display: 'Nata (o bechamel)', grupo: 'Cobertura' }
    ],
    pasos: [
      { orden: 1, descripcion: 'Precalentar el horno a 200ºC, o usar freidora de aire.' },
      { orden: 2, descripcion: 'Montar el sándwich: una rebanada de pan, una capa de queso rallado, el jamón cocido, otra de queso, y cerrar con pan.' },
      { orden: 3, descripcion: 'Extender una fina capa de nata sobre la parte superior del sándwich.' },
      { orden: 4, descripcion: 'Espolvorear el resto del queso rallado por encima.' },
      { orden: 5, descripcion: 'Hornear o meter en airfryer unos 5-8 minutos hasta que el queso superior esté fundido y dorado.' }
    ],
    tips: [
      { orden: 1, texto: 'Untar la nata por encima evita que el pan se reseque en el horno y hace que el queso gratine perfecto.' }
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Puré de calabacín cremoso',
    descripcion: 'Un entrante suave y reconfortante. Muy ligero e ideal para las cenas.',
    foto_url: '/img/recetas/pure_calabacin.png',
    tiempo_minutos: 30,
    raciones_base: 4,
    semana_activa: '2026-06-02',
    dificultad: 'Muy fácil',
    categoria: 'Entrante',
    calorias_racion: 120,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Española',
    tags: ['VEGETARIANO', 'SIN_GLUTEN'],
    ingredientes: [
      { producto: 'Calabacín Hacendado', cantidad_base: 800, unidad: 'g', nombre_display: 'Calabacines', grupo: 'Verduras' },
      { producto: 'Cebolla Hacendado', cantidad_base: 150, unidad: 'g', nombre_display: 'Cebolla', grupo: 'Verduras' },
      { producto: 'Patatas Hacendado', cantidad_base: 200, unidad: 'g', nombre_display: 'Patata', grupo: 'Verduras' },
      { producto: 'Queso rallado Hacendado', cantidad_base: 40, unidad: 'g', nombre_display: 'Queso rallado o quesitos', grupo: 'Textura' },
      { producto: 'Aceite de oliva virgen extra Hacendado', cantidad_base: 15, unidad: 'ml', nombre_display: 'Aceite', grupo: 'Base' },
      { producto: 'Sal marina Hacendado', cantidad_base: 4, unidad: 'g', nombre_display: 'Sal', grupo: 'Condimentos' }
    ],
    pasos: [
      { orden: 1, descripcion: 'Lavar y cortar los calabacines en dados (no hace falta pelarlos si quieres un color más verde).' },
      { orden: 2, descripcion: 'Pelar y trocear la patata y la cebolla.' },
      { orden: 3, descripcion: 'En una olla con el aceite, sofreír la cebolla un par de minutos. Añadir el calabacín y la patata y rehogar.' },
      { orden: 4, descripcion: 'Cubrir con agua justo hasta el nivel de las verduras (no te pases para que no quede líquido). Añadir sal.' },
      { orden: 5, descripcion: 'Hervir durante unos 20 minutos hasta que la patata y el calabacín estén tiernos.' },
      { orden: 6, descripcion: 'Añadir el queso y triturar todo con la batidora hasta obtener una crema fina.' }
    ],
    tips: [
      { orden: 1, texto: 'Sirve con unos picatostes o un chorrito de aceite de oliva en crudo por encima.' }
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Pollo al ajillo tradicional',
    descripcion: 'Una receta con sabor a hogar. Trozos de pollo fritos y confitados con mucho ajo y un toque de vino blanco.',
    foto_url: '/img/recetas/pollo_ajillo.png',
    tiempo_minutos: 40,
    raciones_base: 4,
    semana_activa: '2026-06-02',
    dificultad: 'Media',
    categoria: 'Principal',
    calorias_racion: 480,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Española',
    tags: ['SIN_GLUTEN', 'SIN_LACTOSA'],
    ingredientes: [
      { producto: 'Pollo entero troceado Hacendado', cantidad_base: 1000, unidad: 'g', nombre_display: 'Pollo troceado', grupo: 'Carne' },
      { producto: 'Ajos Hacendado', cantidad_base: 8, unidad: 'ud', nombre_display: 'Dientes de ajo', grupo: 'Aromas' },
      { producto: 'Vino blanco Hacendado', cantidad_base: 100, unidad: 'ml', nombre_display: 'Vino blanco', grupo: 'Salsa' },
      { producto: 'Aceite de oliva virgen extra Hacendado', cantidad_base: 80, unidad: 'ml', nombre_display: 'Aceite de oliva', grupo: 'Fritura' },
      { producto: 'Sal marina Hacendado', cantidad_base: 5, unidad: 'g', nombre_display: 'Sal', grupo: 'Condimentos' },
      { producto: 'Pimienta negra molida Hacendado', cantidad_base: 2, unidad: 'g', nombre_display: 'Pimienta', grupo: 'Condimentos' }
    ],
    pasos: [
      { orden: 1, descripcion: 'Salpimentar los trozos de pollo.' },
      { orden: 2, descripcion: 'Pelar los dientes de ajo, dejándolos enteros o dándoles un pequeño golpe.' },
      { orden: 3, descripcion: 'En una cazuela amplia, poner a calentar el aceite y freír los ajos a fuego medio hasta que se doren. Retirarlos y reservarlos.' },
      { orden: 4, descripcion: 'En ese mismo aceite, dorar el pollo a fuego fuerte por todos sus lados para sellarlo bien.' },
      { orden: 5, descripcion: 'Bajar el fuego a medio-bajo, añadir los ajos reservados y cocinar todo junto unos 20 minutos tapado.' },
      { orden: 6, descripcion: 'Subir el fuego, verter el vino blanco y dejar reducir destapado 5-8 minutos hasta que se evapore el alcohol.' }
    ],
    tips: [
      { orden: 1, texto: 'Acompaña este plato con unas patatas fritas o arroz blanco para aprovechar el jugo.' }
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Huevos fritos con patatas',
    descripcion: 'El plato más deseado. Patatas cortadas a mano, crujientes por fuera y tiernas por dentro, coronadas con huevos de yema líquida.',
    foto_url: '/img/recetas/huevos_patatas.png',
    tiempo_minutos: 25,
    raciones_base: 2,
    semana_activa: '2026-06-02',
    dificultad: 'Fácil',
    categoria: 'Principal',
    calorias_racion: 580,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Española',
    tags: ['VEGETARIANO', 'SIN_GLUTEN', 'SIN_LACTOSA'],
    ingredientes: [
      { producto: 'Patatas Hacendado', cantidad_base: 600, unidad: 'g', nombre_display: 'Patatas', grupo: 'Base' },
      { producto: 'Huevos Hacendado M', cantidad_base: 4, unidad: 'ud', nombre_display: 'Huevos', grupo: 'Proteína' },
      { producto: 'Aceite de oliva virgen extra Hacendado', cantidad_base: 300, unidad: 'ml', nombre_display: 'Aceite de oliva', grupo: 'Fritura' },
      { producto: 'Sal marina Hacendado', cantidad_base: 3, unidad: 'g', nombre_display: 'Sal', grupo: 'Condimentos' }
    ],
    pasos: [
      { orden: 1, descripcion: 'Pelar las patatas y cortarlas en bastones de grosor medio.' },
      { orden: 2, descripcion: 'Calentar abundante aceite de oliva en una sartén grande a fuego medio.' },
      { orden: 3, descripcion: 'Freír las patatas. Primero a fuego medio para que se hagan por dentro (unos 10 min) y luego a fuego fuerte para que se doren y queden crujientes (5 min más).' },
      { orden: 4, descripcion: 'Escurrir las patatas, pasarlas a una fuente con papel absorbente y salarlas.' },
      { orden: 5, descripcion: 'En el mismo aceite o en otra sartén, freír los huevos a fuego vivo, tirando aceite por encima con una espumadera hasta que la clara cuaje y los bordes queden crujientes (puntilla).' },
      { orden: 6, descripcion: 'Colocar los huevos sobre las patatas y echar una pizca de sal en la yema.' }
    ],
    tips: [
      { orden: 1, texto: 'El secreto está en el aceite muy caliente para freír el huevo y conseguir una buena puntilla sin resecar la yema.' }
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Guacamole casero',
    descripcion: 'El dip mexicano por excelencia. Fresco, sabroso y muy rápido de hacer con aguacates en su punto.',
    foto_url: '/img/recetas/guacamole.png',
    tiempo_minutos: 10,
    raciones_base: 4,
    semana_activa: '2026-06-02',
    dificultad: 'Muy fácil',
    categoria: 'Entrante',
    calorias_racion: 180,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Mexicana',
    tags: ['VEGANO', 'SIN_GLUTEN', 'SIN_LACTOSA'],
    ingredientes: [
      { producto: 'Aguacates Hacendado', cantidad_base: 400, unidad: 'g', nombre_display: 'Aguacates maduros', grupo: 'Base' },
      { producto: 'Cebolla Hacendado', cantidad_base: 50, unidad: 'g', nombre_display: 'Cebolla', grupo: 'Toques' },
      { producto: 'Tomate ensalada Hacendado', cantidad_base: 80, unidad: 'g', nombre_display: 'Tomate', grupo: 'Toques' },
      { producto: 'Limón Hacendado', cantidad_base: 1, unidad: 'ud', nombre_display: 'Limón (zumo)', grupo: 'Toques' },
      { producto: 'Sal marina Hacendado', cantidad_base: 2, unidad: 'g', nombre_display: 'Sal', grupo: 'Condimentos' }
    ],
    pasos: [
      { orden: 1, descripcion: 'Picar la cebolla y el tomate en daditos muy pequeños (sin las pepitas del tomate).' },
      { orden: 2, descripcion: 'Abrir los aguacates, sacar la pulpa y ponerla en un bol.' },
      { orden: 3, descripcion: 'Con ayuda de un tenedor, chafar el aguacate hasta obtener una pasta con algunos grumos.' },
      { orden: 4, descripcion: 'Añadir el zumo de medio limón, la sal, la cebolla y el tomate picados. Mezclar bien.' },
      { orden: 5, descripcion: 'Probar y rectificar de sal o limón si es necesario.' }
    ],
    tips: [
      { orden: 1, texto: 'Para que no se oxide, deja el hueso del aguacate dentro del bol y tapa con film transparente en contacto directo.' }
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Espirales con salsa pesto',
    descripcion: 'Un plato de pasta súper rápido. La salsa pesto genovesa le aporta un frescor y sabor a albahaca inconfundibles.',
    foto_url: '/img/recetas/pesto.png',
    tiempo_minutos: 15,
    raciones_base: 3,
    semana_activa: '2026-06-02',
    dificultad: 'Muy fácil',
    categoria: 'Principal',
    calorias_racion: 410,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Italiana',
    tags: ['VEGETARIANO'],
    ingredientes: [
      { producto: 'Espirales Hacendado', cantidad_base: 300, unidad: 'g', nombre_display: 'Pasta en espirales', grupo: 'Pasta' },
      { producto: 'Salsa Pesto Hacendado', cantidad_base: 150, unidad: 'g', nombre_display: 'Salsa pesto', grupo: 'Salsa' },
      { producto: 'Queso rallado Hacendado', cantidad_base: 50, unidad: 'g', nombre_display: 'Queso rallado (opcional)', grupo: 'Acabado' },
      { producto: 'Sal marina Hacendado', cantidad_base: 5, unidad: 'g', nombre_display: 'Sal', grupo: 'Cocción' }
    ],
    pasos: [
      { orden: 1, descripcion: 'Poner una olla grande con abundante agua a hervir.' },
      { orden: 2, descripcion: 'Cuando hierva a borbotones, echar la sal y la pasta.' },
      { orden: 3, descripcion: 'Cocer durante el tiempo indicado en el paquete (normalmente 9-11 minutos).' },
      { orden: 4, descripcion: 'Reservar medio vaso del agua de cocción y escurrir la pasta.' },
      { orden: 5, descripcion: 'Volver a poner la pasta en la olla (fuera del fuego), añadir el bote de pesto y mezclar. Si queda muy espeso, añadir un chorrito del agua de cocción reservada.' },
      { orden: 6, descripcion: 'Servir con un poco de queso rallado por encima.' }
    ],
    tips: [
      { orden: 1, texto: 'El agua de cocción de la pasta es oro: su almidón ayuda a que las salsas liguen perfectamente con la pasta.' }
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Tostada de aguacate y huevo poché',
    descripcion: 'El desayuno o brunch por excelencia. Cremoso aguacate sobre pan crujiente y una yema que se derrama maravillosamente.',
    foto_url: '/img/recetas/tostada_aguacate.png',
    tiempo_minutos: 15,
    raciones_base: 1,
    semana_activa: '2026-06-02',
    dificultad: 'Media',
    categoria: 'Desayuno',
    calorias_racion: 320,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Internacional',
    tags: ['VEGETARIANO', 'SIN_LACTOSA'],
    ingredientes: [
      { producto: 'Pan de molde rústico Hacendado', cantidad_base: 1, unidad: 'ud', nombre_display: 'Rebanada de pan grande', grupo: 'Base' },
      { producto: 'Aguacates Hacendado', cantidad_base: 100, unidad: 'g', nombre_display: 'Medio aguacate', grupo: 'Topping' },
      { producto: 'Huevos Hacendado M', cantidad_base: 1, unidad: 'ud', nombre_display: 'Huevo', grupo: 'Proteína' },
      { producto: 'Aceite de oliva virgen extra Hacendado', cantidad_base: 5, unidad: 'ml', nombre_display: 'Aceite de oliva', grupo: 'Toques' },
      { producto: 'Sal marina Hacendado', cantidad_base: 1, unidad: 'g', nombre_display: 'Sal', grupo: 'Toques' }
    ],
    pasos: [
      { orden: 1, descripcion: 'Tostar la rebanada de pan hasta que esté dorada y crujiente.' },
      { orden: 2, descripcion: 'Pelar el medio aguacate y cortarlo en rodajas, o chafarlo con un tenedor y colocarlo sobre la tostada.' },
      { orden: 3, descripcion: 'Para el huevo poché: poner agua a calentar en un cazo pequeño con un chorrito de vinagre. Cuando vaya a empezar a hervir (burbujitas), hacer un remolino con una cuchara y echar el huevo en el centro.' },
      { orden: 4, descripcion: 'Dejar cocer exactamente 3 minutos. Sacar con una espumadera.' },
      { orden: 5, descripcion: 'Colocar el huevo poché sobre el aguacate, añadir un chorrito de aceite de oliva y sal por encima.' }
    ],
    tips: [
      { orden: 1, texto: 'Si el huevo poché clásico te parece difícil, puedes envolver el huevo crudo en un paquetito de film transparente con unas gotas de aceite y cocerlo así 4 minutos.' }
    ],
    faq: [],
    reviews: []
  },
  {
    nombre: 'Macedonia de frutas frescas',
    descripcion: 'Un postre saludable, hidratante y perfecto para aprovechar la fruta. Un cóctel de vitaminas.',
    foto_url: '/img/recetas/macedonia.png',
    tiempo_minutos: 15,
    raciones_base: 4,
    semana_activa: '2026-06-02',
    dificultad: 'Muy fácil',
    categoria: 'Postre',
    calorias_racion: 110,
    autor_origen: 'Cocina Hacendado',
    cocina: 'Mediterránea',
    tags: ['VEGANO', 'SIN_GLUTEN', 'SIN_LACTOSA'],
    ingredientes: [
      { producto: 'Manzana Fuji Hacendado', cantidad_base: 2, unidad: 'ud', nombre_display: 'Manzanas', grupo: 'Frutas' },
      { producto: 'Plátano de Canarias Hacendado', cantidad_base: 2, unidad: 'ud', nombre_display: 'Plátanos', grupo: 'Frutas' },
      { producto: 'Naranja Hacendado', cantidad_base: 2, unidad: 'ud', nombre_display: 'Naranjas (1 troceada, 1 para zumo)', grupo: 'Frutas' },
      { producto: 'Limón Hacendado', cantidad_base: 1, unidad: 'ud', nombre_display: 'Medio limón', grupo: 'Toque' }
    ],
    pasos: [
      { orden: 1, descripcion: 'Exprimir una de las naranjas y el medio limón para hacer el jugo base. Ponerlo en un bol grande.' },
      { orden: 2, descripcion: 'Pelar y cortar las manzanas y plátanos en dados pequeños.' },
      { orden: 3, descripcion: 'Pelar a lo vivo la otra naranja y cortarla en dados.' },
      { orden: 4, descripcion: 'Mezclar todas las frutas cortadas en el bol con el zumo para evitar que se oxiden.' },
      { orden: 5, descripcion: 'Dejar macerar en la nevera al menos 30 minutos antes de servir para que la fruta suelte su jugo.' }
    ],
    tips: [
      { orden: 1, texto: 'Puedes añadir azúcar si la fruta está ácida, o unas hojas de menta para un toque gourmet.' }
    ],
    faq: [],
    reviews: []
  }
`;

const fileContent = fs.readFileSync(path.join(__dirname, 'src', 'database', 'seeds', '02_recetas.seed.js'), 'utf8');
const exportIndex = fileContent.lastIndexOf('];');
if (exportIndex !== -1) {
  const newContent = fileContent.substring(0, exportIndex) + ',' + newRecipes + fileContent.substring(exportIndex);
  fs.writeFileSync(path.join(__dirname, 'src', 'database', 'seeds', '02_recetas.seed.js'), newContent, 'utf8');
  console.log('Successfully appended 14 recipes to 02_recetas.seed.js');
} else {
  console.log('Could not find ]; to append recipes.');
}
