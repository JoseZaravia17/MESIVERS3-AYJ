// ✏️ Todo lo personalizable de la página vive aquí.

// Prefijo del repo en GitHub Pages (vacío en local); no hace falta tocarlo
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const config = {
  de: "José",
  para: "Ale",
  // Iniciales que aparecen en los corazones
  inicialPara: "A",
  inicialDe: "J",
  // Fecha que aparece en la etiqueta y en los recibos
  fecha: "28.09.26",
  fechaLarga: "28/09/2026",

  // 📸 Reemplaza estos archivos en /public/fotos (mismo nombre) o cambia la ruta
  fotos: {
    relicarioIzquierda: `${base}/fotos/foto-1.jpeg`,
    relicarioDerecha: `${base}/fotos/foto-2.jpeg`,
    fondo: `${base}/fotos/fondo.jpg`,
  },
};

export const razones: string[] = [
  "Tu sonrisa, que convierte cualquier día gris en uno lleno de colores.",
  "La forma en que me escuchas, incluso cuando ni yo mismo me entiendo.",
  "Tu paciencia infinita, por quedarte a mi lado con calma incluso en mis días de tormenta.",
  "Cómo haces que lo cotidiano se sienta como una aventura nueva.",
  "Tus abrazos, que son mi lugar favorito en todo el mundo.",
  "Porque me inspiras a ser una mejor versión de mí cada día.",
  "Tu risa: mi canción favorita, y la escucharía en repeat para siempre.",
  "Por creer en mí incluso en los momentos en que yo dudo.",
  "Porque contigo hasta el silencio se siente como estar en casa.",
  "Porque eres tú, simplemente tú, y eso siempre será más que suficiente.",
];
