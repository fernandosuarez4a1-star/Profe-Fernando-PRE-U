/**
 * ============================================================================
 * PROFE FERNANDO PRE-U — BANCO DE PREGUNTAS Y MOTOR VECTORIAL SVG INLINE
 * ============================================================================
 * Estructura completa:
 * - 11 Temas Oficiales (Bloque 1: Temas 1-7; Bloque 2: Temas 8-11)
 * - Cada tema dividido en:
 *     * Nivel Básico: 5 preguntas
 *     * Nivel Medio: 10 preguntas
 *     * Nivel Difícil: 20 preguntas
 * - Desafío Final Integrador: 70 preguntas (~45 Bloque 1 + ~25 Bloque 2)
 * - Todos los gráficos geométricos, conjuntos, funciones, estadística y
 *   razonamiento abstracto generados mediante código SVG inline limpio.
 */

const SYLLABUS_TOPICS = [
  {
    id: "tema_01",
    number: 1,
    block: 1,
    blockName: "Matemáticas y Lógica",
    title: "Teoría de Conjuntos y Diagramas de Venn",
    description: "Operaciones (∪, ∩, −, △, Aᶜ), regiones sombreadas en diagramas de Venn y encuestas."
  },
  {
    id: "tema_02",
    number: 2,
    block: 1,
    blockName: "Matemáticas y Lógica",
    title: "Lógica Proposicional y Tablas de Verdad",
    description: "Conectores (¬, ∧, ∨, →, ↔), valores de verdad, tautologías, contradicciones y equivalencias."
  },
  {
    id: "tema_03",
    number: 3,
    block: 1,
    blockName: "Matemáticas y Lógica",
    title: "Ecuaciones, Despeje de Variables e Inecuaciones",
    description: "Despeje de x en ecuaciones lineales y cuadráticas, sistemas 2×2 e intervalos en recta numérica."
  },
  {
    id: "tema_04",
    number: 4,
    block: 1,
    blockName: "Matemáticas y Lógica",
    title: "Funciones y su Representación Gráfica",
    description: "Dominio, rango, evaluación e interpretación de gráficas lineal, cuadrática, exponencial y logarítmica."
  },
  {
    id: "tema_05",
    number: 5,
    block: 1,
    blockName: "Matemáticas y Lógica",
    title: "Razones, Proporciones y Porcentajes",
    description: "Regla de tres simple y compuesta, porcentajes, aumentos/descuentos sucesivos y repartos."
  },
  {
    id: "tema_06",
    number: 6,
    block: 1,
    blockName: "Matemáticas y Lógica",
    title: "Estadística Básica y Probabilidad",
    description: "Media, mediana, moda, lectura de gráficos estadísticos (barras y circulares) y probabilidad simple."
  },
  {
    id: "tema_07",
    number: 7,
    block: 1,
    blockName: "Matemáticas y Lógica",
    title: "Geometría: Áreas, Volúmenes y Circunferencia",
    description: "Áreas planas, círculos con radio/diámetro, áreas sombreadas y volúmenes de sólidos acotados."
  },
  {
    id: "tema_08",
    number: 8,
    block: 2,
    blockName: "Razonamiento Abstracto",
    title: "Secuencias Gráficas y Patrones de Giro",
    description: "Series visuales con rotaciones horarias/antihorarias, traslaciones y cambios de elementos."
  },
  {
    id: "tema_09",
    number: 9,
    block: 2,
    blockName: "Razonamiento Abstracto",
    title: "Matrices Gráficas (Cuadrículas 3×3)",
    description: "Tablas 3×3 con casilla vacía (?) para deducir reglas de superposición, resta de trazos o giros."
  },
  {
    id: "tema_10",
    number: 10,
    block: 2,
    blockName: "Razonamiento Abstracto",
    title: "Analogías y Exclusión de Figuras",
    description: "Relaciones visuales 'A es a B como C es a...' e identificación de la figura que no pertenece."
  },
  {
    id: "tema_11",
    number: 11,
    block: 2,
    blockName: "Razonamiento Abstracto",
    title: "Razonamiento Espacial y Vistas de Sólidos",
    description: "Redes desplegadas de cubos, conteo de bloques apilados en 3D y proyección de vistas."
  }
];

/* ============================================================================
   MOTOR DE GRÁFICOS VECTORIALES SVG INLINE
   ============================================================================ */
const SVG_GEN = {
  /**
   * Diagrama de Venn de 2 conjuntos con sombreado exacto por regiones mediante clipPath
   */
  venn2(mode, labels = ["A", "B"]) {
    const fillOnlyA = ["onlyA", "symDiff", "union", "compB"].includes(mode) ? "#1E4E79" : "#FFFFFF";
    const fillInter = ["inter", "union"].includes(mode) ? "#1E4E79" : "#FFFFFF";
    const fillOnlyB = ["onlyB", "symDiff", "union", "compA"].includes(mode) ? "#1E4E79" : "#FFFFFF";
    const fillOutside = ["outside", "compA", "compB"].includes(mode) ? "#BFD7ED" : "#F4F6F9";
    const uid = "v2_" + Math.random().toString(36).slice(2, 7);

    return `<svg viewBox="0 0 320 190" width="320" height="190" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="${uid}_cA"><circle cx="125" cy="98" r="62"/></clipPath>
        <clipPath id="${uid}_cB"><circle cx="195" cy="98" r="62"/></clipPath>
      </defs>
      <rect x="10" y="10" width="300" height="170" rx="6" fill="${fillOutside}" stroke="#0F2942" stroke-width="2"/>
      <text x="296" y="28" text-anchor="end" font-family="sans-serif" font-weight="bold" font-size="13" fill="#0F2942">U</text>
      <circle cx="125" cy="98" r="62" fill="${fillOnlyA}"/>
      <circle cx="195" cy="98" r="62" fill="${fillOnlyB}"/>
      <g clip-path="url(#${uid}_cA)">
        <circle cx="195" cy="98" r="62" fill="${fillInter}"/>
      </g>
      <circle cx="125" cy="98" r="62" fill="none" stroke="#0F2942" stroke-width="2.2"/>
      <circle cx="195" cy="98" r="62" fill="none" stroke="#0F2942" stroke-width="2.2"/>
      <text x="88" y="45" font-family="sans-serif" font-weight="bold" font-size="14" fill="#0F2942">${labels[0]}</text>
      <text x="225" y="45" font-family="sans-serif" font-weight="bold" font-size="14" fill="#0F2942">${labels[1]}</text>
    </svg>`;
  },

  /**
   * Diagrama de Venn de 3 conjuntos (A, B, C) con sombreado exacto de región
   */
  venn3(mode) {
    const uid = "v3_" + Math.random().toString(36).slice(2, 7);
    const cA = { x: 160, y: 74, r: 48 };
    const cB = { x: 132, y: 120, r: 48 };
    const cC = { x: 188, y: 120, r: 48 };
    let highlight = "";

    if (mode === "ABC") {
      highlight = `<g clip-path="url(#${uid}_A)"><g clip-path="url(#${uid}_B)"><circle cx="${cC.x}" cy="${cC.y}" r="${cC.r}" fill="#B48327"/></g></g>`;
    } else if (mode === "AB_not_C") {
      highlight = `<g clip-path="url(#${uid}_A)"><circle cx="${cB.x}" cy="${cB.y}" r="${cB.r}" fill="#1E4E79"/></g>
                   <g clip-path="url(#${uid}_A)"><g clip-path="url(#${uid}_B)"><circle cx="${cC.x}" cy="${cC.y}" r="${cC.r}" fill="#FFFFFF"/></g></g>`;
    } else if (mode === "onlyA") {
      highlight = `<circle cx="${cA.x}" cy="${cA.y}" r="${cA.r}" fill="#1E4E79"/>
                   <g clip-path="url(#${uid}_A)"><circle cx="${cB.x}" cy="${cB.y}" r="${cB.r}" fill="#FFFFFF"/></g>
                   <g clip-path="url(#${uid}_A)"><circle cx="${cC.x}" cy="${cC.y}" r="${cC.r}" fill="#FFFFFF"/></g>`;
    } else {
      highlight = `<circle cx="${cA.x}" cy="${cA.y}" r="${cA.r}" fill="#BFD7ED"/>
                   <circle cx="${cB.x}" cy="${cB.y}" r="${cB.r}" fill="#BFD7ED"/>
                   <circle cx="${cC.x}" cy="${cC.y}" r="${cC.r}" fill="#BFD7ED"/>`;
    }

    return `<svg viewBox="0 0 320 200" width="320" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="${uid}_A"><circle cx="${cA.x}" cy="${cA.y}" r="${cA.r}"/></clipPath>
        <clipPath id="${uid}_B"><circle cx="${cB.x}" cy="${cB.y}" r="${cB.r}"/></clipPath>
      </defs>
      <rect x="10" y="8" width="300" height="184" rx="6" fill="#F4F6F9" stroke="#0F2942" stroke-width="2"/>
      <text x="296" y="25" text-anchor="end" font-family="sans-serif" font-weight="bold" font-size="13" fill="#0F2942">U</text>
      <circle cx="${cA.x}" cy="${cA.y}" r="${cA.r}" fill="#FFFFFF"/>
      <circle cx="${cB.x}" cy="${cB.y}" r="${cB.r}" fill="#FFFFFF"/>
      <circle cx="${cC.x}" cy="${cC.y}" r="${cC.r}" fill="#FFFFFF"/>
      ${highlight}
      <circle cx="${cA.x}" cy="${cA.y}" r="${cA.r}" fill="none" stroke="#0F2942" stroke-width="2"/>
      <circle cx="${cB.x}" cy="${cB.y}" r="${cB.r}" fill="none" stroke="#0F2942" stroke-width="2"/>
      <circle cx="${cC.x}" cy="${cC.y}" r="${cC.r}" fill="none" stroke="#0F2942" stroke-width="2"/>
      <text x="160" y="22" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#0F2942">A</text>
      <text x="76" y="135" font-family="sans-serif" font-weight="bold" font-size="13" fill="#0F2942">B</text>
      <text x="236" y="135" font-family="sans-serif" font-weight="bold" font-size="13" fill="#0F2942">C</text>
    </svg>`;
  },

  /**
   * Recta numérica para inecuaciones e intervalos
   */
  numberLine({ min = -5, max = 5, left = -2, right = 3, leftClosed = true, rightClosed = false, ray = null }) {
    const width = 360;
    const pad = 34;
    const span = max - min;
    const toX = (v) => pad + ((v - min) / span) * (width - 2 * pad);
    let ticks = "";
    for (let v = min; v <= max; v++) {
      const x = toX(v);
      ticks += `<line x1="${x}" y1="48" x2="${x}" y2="58" stroke="#0F2942" stroke-width="1.5"/>
                <text x="${x}" y="74" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#0F2942">${v}</text>`;
    }

    let segment = "";
    if (ray === "right") {
      const x1 = toX(left);
      segment = `<line x1="${x1}" y1="53" x2="${width - 14}" y2="53" stroke="#1E4E79" stroke-width="5"/>
                 <polygon points="${width - 10},53 ${width - 20},47 ${width - 20},59" fill="#1E4E79"/>
                 <circle cx="${x1}" cy="53" r="6" fill="${leftClosed ? "#1E4E79" : "#FFFFFF"}" stroke="#1E4E79" stroke-width="2.5"/>`;
    } else if (ray === "left") {
      const x2 = toX(right);
      segment = `<line x1="14" y1="53" x2="${x2}" y2="53" stroke="#1E4E79" stroke-width="5"/>
                 <polygon points="10,53 20,47 20,59" fill="#1E4E79"/>
                 <circle cx="${x2}" cy="53" r="6" fill="${rightClosed ? "#1E4E79" : "#FFFFFF"}" stroke="#1E4E79" stroke-width="2.5"/>`;
    } else {
      const x1 = toX(left);
      const x2 = toX(right);
      segment = `<line x1="${x1}" y1="53" x2="${x2}" y2="53" stroke="#1E4E79" stroke-width="5"/>
                 <circle cx="${x1}" cy="53" r="6" fill="${leftClosed ? "#1E4E79" : "#FFFFFF"}" stroke="#1E4E79" stroke-width="2.5"/>
                 <circle cx="${x2}" cy="53" r="6" fill="${rightClosed ? "#1E4E79" : "#FFFFFF"}" stroke="#1E4E79" stroke-width="2.5"/>`;
    }

    return `<svg viewBox="0 0 ${width} 92" width="${width}" height="92" xmlns="http://www.w3.org/2000/svg">
      <line x1="14" y1="53" x2="${width - 14}" y2="53" stroke="#94A3B8" stroke-width="2"/>
      ${ticks}
      ${segment}
    </svg>`;
  },

  /**
   * Plano cartesiano con funciones (lineal, cuadrática, exponencial, logarítmica)
   */
  cartesian(type, params = {}) {
    const size = 240;
    const mid = 120;
    const scale = 20;
    let grid = "";
    for (let i = -5; i <= 5; i++) {
      const pos = mid + i * scale;
      grid += `<line x1="${pos}" y1="15" x2="${pos}" y2="225" stroke="#E2E8F0" stroke-width="1"/>
               <line x1="15" y1="${pos}" x2="225" y2="${pos}" stroke="#E2E8F0" stroke-width="1"/>`;
      if (i !== 0 && i % 2 === 0) {
        grid += `<text x="${pos}" y="${mid + 14}" text-anchor="middle" font-family="sans-serif" font-size="9.5" fill="#526071">${i}</text>
                 <text x="${mid - 10}" y="${mid - i * scale + 3}" text-anchor="end" font-family="sans-serif" font-size="9.5" fill="#526071">${i}</text>`;
      }
    }

    let pts = [];
    for (let x = -5; x <= 5; x += 0.2) {
      let y = null;
      if (type === "linear") {
        y = params.m * x + params.b;
      } else if (type === "quadratic") {
        y = params.a * Math.pow(x - params.h, 2) + params.k;
      } else if (type === "exponential") {
        y = Math.pow(params.base, x);
      } else if (type === "logarithmic") {
        if (x > 0.08) y = Math.log(x) / Math.log(params.base);
      }
      if (y !== null && y >= -5.2 && y <= 5.2) {
        pts.push(`${(mid + x * scale).toFixed(1)},${(mid - y * scale).toFixed(1)}`);
      }
    }

    const pathD = pts.length > 1 ? "M " + pts.join(" L ") : "";
    return `<svg viewBox="0 0 ${size} ${size}" width="240" height="240" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${size}" height="${size}" fill="#FFFFFF"/>
      ${grid}
      <line x1="12" y1="${mid}" x2="228" y2="${mid}" stroke="#0F2942" stroke-width="1.8"/>
      <line x1="${mid}" y1="228" x2="${mid}" y2="12" stroke="#0F2942" stroke-width="1.8"/>
      <text x="224" y="${mid - 6}" font-family="sans-serif" font-weight="bold" font-size="11" fill="#0F2942">x</text>
      <text x="${mid + 8}" y="20" font-family="sans-serif" font-weight="bold" font-size="11" fill="#0F2942">y</text>
      <path d="${pathD}" fill="none" stroke="#1E4E79" stroke-width="2.8"/>
    </svg>`;
  },

  /**
   * Gráfico estadístico de barras
   */
  barChart(title, labels, values) {
    const maxV = Math.max(...values, 10);
    const w = 340;
    const h = 195;
    const baseY = 155;
    const barW = Math.floor(220 / labels.length);
    let bars = "";
    labels.forEach((lbl, idx) => {
      const val = values[idx];
      const barH = Math.round((val / maxV) * 105);
      const x = 55 + idx * (barW + 14);
      const y = baseY - barH;
      bars += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="#1E4E79"/>
               <text x="${x + barW / 2}" y="${y - 5}" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="11" fill="#0F2942">${val}</text>
               <text x="${x + barW / 2}" y="${baseY + 16}" text-anchor="middle" font-family="sans-serif" font-size="10.5" fill="#0F2942">${lbl}</text>`;
    });

    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <text x="${w / 2}" y="20" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#0F2942">${title}</text>
      <line x1="40" y1="35" x2="40" y2="${baseY}" stroke="#0F2942" stroke-width="1.8"/>
      <line x1="40" y1="${baseY}" x2="320" y2="${baseY}" stroke="#0F2942" stroke-width="1.8"/>
      ${bars}
    </svg>`;
  },

  /**
   * Gráfico circular estadístico
   */
  pieChart(title, slices) {
    const colors = ["#0F2942", "#1E4E79", "#B48327", "#198754"];
    const total = slices.reduce((s, item) => s + item.value, 0);
    let angle = -Math.PI / 2;
    const cx = 100;
    const cy = 105;
    const r = 64;
    let paths = "";
    let legend = "";

    slices.forEach((sl, i) => {
      const sliceAngle = (sl.value / total) * Math.PI * 2;
      const x1 = cx + r * Math.cos(angle);
      const y1 = cy + r * Math.sin(angle);
      angle += sliceAngle;
      const x2 = cx + r * Math.cos(angle);
      const y2 = cy + r * Math.sin(angle);
      const largeArc = sliceAngle > Math.PI ? 1 : 0;
      const color = colors[i % colors.length];
      paths += `<path d="M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="${color}" stroke="#FFFFFF" stroke-width="2"/>`;
      const ly = 56 + i * 26;
      legend += `<rect x="190" y="${ly - 10}" width="12" height="12" fill="${color}"/>
                 <text x="208" y="${ly}" font-family="sans-serif" font-size="11" fill="#0F2942">${sl.label}: ${sl.value}%</text>`;
    });

    return `<svg viewBox="0 0 340 190" width="340" height="190" xmlns="http://www.w3.org/2000/svg">
      <text x="170" y="20" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#0F2942">${title}</text>
      ${paths}
      ${legend}
    </svg>`;
  },

  /**
   * Figuras geométricas acotadas (2D, áreas sombreadas y sólidos 3D)
   */
  geometry(kind, d = {}) {
    if (kind === "circle_r") {
      return `<svg viewBox="0 0 240 170" width="240" height="170" xmlns="http://www.w3.org/2000/svg">
        <circle cx="120" cy="85" r="58" fill="#EBF3FA" stroke="#0F2942" stroke-width="2.5"/>
        <circle cx="120" cy="85" r="3.5" fill="#0F2942"/>
        <line x1="120" y1="85" x2="178" y2="85" stroke="#DC3545" stroke-width="2.5"/>
        <text x="148" y="78" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#0F2942">r = ${d.r} cm</text>
      </svg>`;
    }
    if (kind === "circle_d") {
      return `<svg viewBox="0 0 240 170" width="240" height="170" xmlns="http://www.w3.org/2000/svg">
        <circle cx="120" cy="85" r="58" fill="#EBF3FA" stroke="#0F2942" stroke-width="2.5"/>
        <line x1="62" y1="85" x2="178" y2="85" stroke="#1E4E79" stroke-width="2.5"/>
        <text x="120" y="77" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#0F2942">d = ${d.d} cm</text>
      </svg>`;
    }
    if (kind === "shaded_square_circle") {
      return `<svg viewBox="0 0 220 180" width="220" height="180" xmlns="http://www.w3.org/2000/svg">
        <rect x="50" y="25" width="120" height="120" fill="#1E4E79" stroke="#0F2942" stroke-width="2.5"/>
        <circle cx="110" cy="85" r="60" fill="#FFFFFF" stroke="#0F2942" stroke-width="2"/>
        <text x="110" y="164" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#0F2942">Lado L = ${d.L} cm</text>
      </svg>`;
    }
    if (kind === "right_triangle") {
      return `<svg viewBox="0 0 260 175" width="260" height="175" xmlns="http://www.w3.org/2000/svg">
        <polygon points="60,135 200,135 60,35" fill="#EBF3FA" stroke="#0F2942" stroke-width="2.5"/>
        <rect x="60" y="121" width="14" height="14" fill="none" stroke="#0F2942" stroke-width="1.8"/>
        <text x="48" y="88" text-anchor="end" font-family="sans-serif" font-weight="bold" font-size="12" fill="#0F2942">a = ${d.a}</text>
        <text x="130" y="154" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#0F2942">b = ${d.b}</text>
        <text x="145" y="76" font-family="sans-serif" font-weight="bold" font-size="12" fill="#DC3545">c = ?</text>
      </svg>`;
    }
    if (kind === "cylinder") {
      return `<svg viewBox="0 0 240 190" width="240" height="190" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="115" cy="40" rx="52" ry="16" fill="#BFD7ED" stroke="#0F2942" stroke-width="2.2"/>
        <path d="M 63 40 L 63 145 A 52 16 0 0 0 167 145 L 167 40" fill="#EBF3FA" stroke="#0F2942" stroke-width="2.2"/>
        <ellipse cx="115" cy="40" rx="52" ry="16" fill="#BFD7ED" stroke="#0F2942" stroke-width="2.2"/>
        <line x1="115" y1="40" x2="167" y2="40" stroke="#DC3545" stroke-width="2"/>
        <text x="142" y="34" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="11" fill="#0F2942">r=${d.r}</text>
        <text x="182" y="96" font-family="sans-serif" font-weight="bold" font-size="12" fill="#0F2942">h=${d.h}</text>
      </svg>`;
    }
    if (kind === "cone") {
      return `<svg viewBox="0 0 240 190" width="240" height="190" xmlns="http://www.w3.org/2000/svg">
        <polygon points="115,28 63,145 167,145" fill="#EBF3FA" stroke="#0F2942" stroke-width="2.2"/>
        <ellipse cx="115" cy="145" rx="52" ry="15" fill="#BFD7ED" stroke="#0F2942" stroke-width="2.2"/>
        <line x1="115" y1="28" x2="115" y2="145" stroke="#1E4E79" stroke-width="1.8" stroke-dasharray="4 3"/>
        <line x1="115" y1="145" x2="167" y2="145" stroke="#DC3545" stroke-width="2"/>
        <text x="108" y="92" text-anchor="end" font-family="sans-serif" font-weight="bold" font-size="11" fill="#0F2942">h=${d.h}</text>
        <text x="141" y="139" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="11" fill="#0F2942">r=${d.r}</text>
      </svg>`;
    }
    return `<svg viewBox="0 0 240 185" width="240" height="185" xmlns="http://www.w3.org/2000/svg">
      <polygon points="65,65 145,65 145,145 65,145" fill="#EBF3FA" stroke="#0F2942" stroke-width="2.2"/>
      <polygon points="65,65 100,38 180,38 145,65" fill="#BFD7ED" stroke="#0F2942" stroke-width="2.2"/>
      <polygon points="145,65 180,38 180,118 145,145" fill="#94B8D8" stroke="#0F2942" stroke-width="2.2"/>
      <text x="105" y="163" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#0F2942">a = ${d.a || 5} cm</text>
      ${d.b ? `<text x="195" y="84" font-family="sans-serif" font-weight="bold" font-size="11" fill="#0F2942">h=${d.c}</text>` : ""}
    </svg>`;
  },

  /**
   * Secuencias gráficas de 4 pasos + incógnita (?)
   */
  sequence(angles, shape = "arrow", dotCorners = null) {
    let boxes = "";
    for (let i = 0; i < 5; i++) {
      const x = 10 + i * 74;
      const cx = x + 32;
      const cy = 44;
      let inner = "";
      if (i < 4) {
        const ang = angles[i];
        if (shape === "arrow") {
          inner = `<g transform="rotate(${ang} ${cx} ${cy})">
            <line x1="${cx}" y1="${cy + 18}" x2="${cx}" y2="${cy - 14}" stroke="#0F2942" stroke-width="3.2" stroke-linecap="round"/>
            <polygon points="${cx},${cy - 20} ${cx - 7},${cy - 9} ${cx + 7},${cy - 9}" fill="#1E4E79"/>
            <circle cx="${cx}" cy="${cy + 16}" r="4" fill="#B48327"/>
          </g>`;
        } else if (shape === "triangle") {
          inner = `<g transform="rotate(${ang} ${cx} ${cy})">
            <polygon points="${cx},${cy - 20} ${cx - 17},${cy + 14} ${cx + 17},${cy + 14}" fill="#1E4E79" stroke="#0F2942" stroke-width="2"/>
            <circle cx="${cx}" cy="${cy - 10}" r="3.5" fill="#FFFFFF"/>
          </g>`;
        } else {
          const posMap = [
            [x + 15, 25],
            [x + 49, 25],
            [x + 49, 63],
            [x + 15, 63]
          ];
          const [px, py] = posMap[dotCorners[i] % 4];
          inner = `<line x1="${x + 8}" y1="18" x2="${x + 56}" y2="70" stroke="#CBD5E1" stroke-width="1.5"/>
                   <line x1="${x + 56}" y1="18" x2="${x + 8}" y2="70" stroke="#CBD5E1" stroke-width="1.5"/>
                   <circle cx="${px}" cy="${py}" r="7" fill="#1E4E79" stroke="#0F2942" stroke-width="1.5"/>`;
        }
      } else {
        inner = `<text x="${cx}" y="${cy + 8}" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="24" fill="#DC3545">?</text>`;
      }

      boxes += `<rect x="${x}" y="10" width="64" height="68" rx="4" fill="${i === 4 ? "#FDF8EE" : "#FFFFFF"}" stroke="${i === 4 ? "#B48327" : "#0F2942"}" stroke-width="2"/>
                ${inner}
                <text x="${cx}" y="92" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#526071">${i < 4 ? "Fig. " + (i + 1) : "Fig. 5"}</text>`;
    }
    return `<svg viewBox="0 0 384 102" width="384" height="102" xmlns="http://www.w3.org/2000/svg">${boxes}</svg>`;
  },

  /**
   * Matriz gráfica 3x3 con casilla inferior derecha (?)
   */
  matrix3x3(masks) {
    let cells = "";
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const idx = r * 3 + c;
        const x = 14 + c * 68;
        const y = 14 + r * 68;
        const cx = x + 31;
        const cy = y + 31;
        let glyph = "";
        if (idx === 8) {
          glyph = `<text x="${cx}" y="${cy + 9}" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="26" fill="#DC3545">?</text>`;
        } else {
          const m = masks[idx];
          if (m & 1) glyph += `<line x1="${cx}" y1="${y + 10}" x2="${cx}" y2="${y + 52}" stroke="#0F2942" stroke-width="3"/>`;
          if (m & 2) glyph += `<line x1="${x + 10}" y1="${cy}" x2="${x + 52}" y2="${cy}" stroke="#1E4E79" stroke-width="3"/>`;
          if (m & 4) glyph += `<line x1="${x + 12}" y1="${y + 12}" x2="${x + 50}" y2="${y + 50}" stroke="#B48327" stroke-width="3"/>`;
          if (m & 8) glyph += `<line x1="${x + 50}" y1="${y + 12}" x2="${x + 12}" y2="${y + 50}" stroke="#198754" stroke-width="3"/>`;
          if (m === 0) glyph += `<circle cx="${cx}" cy="${cy}" r="5" fill="#94A3B8"/>`;
        }
        cells += `<rect x="${x}" y="${y}" width="62" height="62" fill="${idx === 8 ? "#FDF8EE" : "#FFFFFF"}" stroke="#0F2942" stroke-width="2"/>${glyph}`;
      }
    }
    return `<svg viewBox="0 0 226 226" width="226" height="226" xmlns="http://www.w3.org/2000/svg">${cells}</svg>`;
  },

  /**
   * Cubos apilados en vista isométrica 3D (algoritmo del pintor)
   */
  stackedBlocks3D(heightsGrid) {
    const dx = 22;
    const dy = 12;
    const dz = 22;
    const ox = 140;
    const oy = 95;
    let cubes = "";

    for (let r = 0; r < heightsGrid.length; r++) {
      for (let c = 0; c < heightsGrid[r].length; c++) {
        const h = heightsGrid[r][c];
        for (let z = 0; z < h; z++) {
          const px = ox + (c - r) * dx;
          const py = oy + (c + r) * dy - z * dz;
          const top = `${px},${py - dz} ${px + dx},${py - dz + dy} ${px},${py - dz + 2 * dy} ${px - dx},${py - dz + dy}`;
          const left = `${px - dx},${py - dz + dy} ${px},${py - dz + 2 * dy} ${px},${py + 2 * dy} ${px - dx},${py + dy}`;
          const right = `${px},${py - dz + 2 * dy} ${px + dx},${py - dz + dy} ${px + dx},${py + dy} ${px},${py + 2 * dy}`;
          cubes += `<polygon points="${left}" fill="#CBD5E1" stroke="#0F2942" stroke-width="1.4"/>
                    <polygon points="${right}" fill="#64748B" stroke="#0F2942" stroke-width="1.4"/>
                    <polygon points="${top}" fill="#FFFFFF" stroke="#0F2942" stroke-width="1.4"/>`;
        }
      }
    }
    return `<svg viewBox="0 0 280 205" width="280" height="205" xmlns="http://www.w3.org/2000/svg">${cubes}</svg>`;
  },

  /**
   * Plantilla desplegada de cubo (red en cruz de 6 caras con símbolos)
   */
  cubeNet(symbols) {
    const coords = [
      [85, 12],
      [35, 62],
      [85, 62],
      [135, 62],
      [85, 112],
      [85, 162]
    ];
    let squares = "";
    coords.forEach(([x, y], i) => {
      squares += `<rect x="${x}" y="${y}" width="50" height="50" fill="#FFFFFF" stroke="#0F2942" stroke-width="2"/>
                  <text x="${x + 25}" y="${y + 33}" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="22" fill="#1E4E79">${symbols[i]}</text>`;
    });
    return `<svg viewBox="0 0 220 224" width="220" height="224" xmlns="http://www.w3.org/2000/svg">${squares}</svg>`;
  },

  /**
   * Analogía gráfica A : B :: C : ?
   */
  analogy(figA, figB, figC) {
    const drawMini = (x, label, cfg) => {
      const cx = x + 36;
      const cy = 48;
      const fill = cfg.filled ? "#1E4E79" : "#FFFFFF";
      let shape = "";
      if (cfg.shape === "square") {
        shape = `<rect x="${cx - 18}" y="${cy - 18}" width="36" height="36" transform="rotate(${cfg.rot || 0} ${cx} ${cy})" fill="${fill}" stroke="#0F2942" stroke-width="2.5"/>`;
      } else if (cfg.shape === "triangle") {
        shape = `<polygon points="${cx},${cy - 20} ${cx - 19},${cy + 16} ${cx + 19},${cy + 16}" transform="rotate(${cfg.rot || 0} ${cx} ${cy})" fill="${fill}" stroke="#0F2942" stroke-width="2.5"/>`;
      } else {
        shape = `<circle cx="${cx}" cy="${cy}" r="18" fill="${fill}" stroke="#0F2942" stroke-width="2.5"/>`;
      }
      return `<rect x="${x}" y="12" width="72" height="72" rx="4" fill="#FFFFFF" stroke="#0F2942" stroke-width="2"/>
              ${shape}
              <text x="${cx}" y="100" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="11" fill="#0F2942">${label}</text>`;
    };

    return `<svg viewBox="0 0 380 110" width="380" height="110" xmlns="http://www.w3.org/2000/svg">
      ${drawMini(10, "Fig. A", figA)}
      <text x="93" y="54" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="18" fill="#0F2942">:</text>
      ${drawMini(106, "Fig. B", figB)}
      <text x="192" y="54" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="18" fill="#B48327">::</text>
      ${drawMini(208, "Fig. C", figC)}
      <text x="291" y="54" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="18" fill="#0F2942">:</text>
      <rect x="302" y="12" width="68" height="72" rx="4" fill="#FDF8EE" stroke="#B48327" stroke-width="2"/>
      <text x="336" y="56" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="24" fill="#DC3545">?</text>
      <text x="336" y="100" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="11" fill="#0F2942">Fig. D</text>
    </svg>`;
  }
};

/* ============================================================================
   CONSTRUCTOR DETERMINISTA DE REACTIVOS (SIN REPETICIONES NI ERRORES)
   ============================================================================ */
function makeQuestion({ id, topicId, level, prompt, svg = "", correct, distractors, explanation }) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  const correctIndex = hash % 4;
  const uniqueDistractors = [];
  for (const d of distractors) {
    if (d !== correct && !uniqueDistractors.includes(d)) {
      uniqueDistractors.push(d);
    }
  }
  while (uniqueDistractors.length < 3) {
    uniqueDistractors.push(`Opción alternativa ${uniqueDistractors.length + 1}`);
  }

  const options = [];
  let dPtr = 0;
  for (let i = 0; i < 4; i++) {
    if (i === correctIndex) {
      options.push(correct);
    } else {
      options.push(uniqueDistractors[dPtr++]);
    }
  }

  return {
    id,
    topicId,
    level,
    prompt,
    svg,
    options,
    correctIndex,
    explanation
  };
}

/**
 * Genera el conjunto de reactivos para cada uno de los 11 temas
 */
function generateTopicQuestions(topicId, level, count, offsetSeed = 0) {
  const list = [];

  for (let i = 0; i < count; i++) {
    const n = i + 1 + offsetSeed;
    const qId = `${topicId}_${level}_${String(i + 1).padStart(2, "0")}`;

    switch (topicId) {
      case "tema_01": {
        const mod = i % 5;
        if (mod === 0) {
          const modes = [
            { m: "onlyA", ans: "A − B (Solo elementos de A)", dist: ["A ∩ B", "A ∪ B", "B − A"], exp: "La región sombreada corresponde exclusivamente al conjunto A sin incluir la intersección con B, lo cual define la diferencia A − B." },
            { m: "inter", ans: "A ∩ B (Intersección de A y B)", dist: ["A ∪ B", "A △ B", "Aᶜ ∩ Bᶜ"], exp: "La zona central común a ambos círculos representa los elementos que pertenecen simultáneamente a A y a B: A ∩ B." },
            { m: "symDiff", ans: "A △ B (Diferencia simétrica)", dist: ["A ∩ B", "(A ∪ B)ᶜ", "A − B"], exp: "Están sombreados A − B y B − A, excluyendo la intersección. Esto corresponde a la diferencia simétrica A △ B = (A ∪ B) − (A ∩ B)." },
            { m: "outside", ans: "(A ∪ B)ᶜ (Complemento de la unión)", dist: ["A ∪ B", "A ∩ B", "A △ B"], exp: "La región sombreada está fuera de ambos conjuntos dentro del universo U, es decir, el complemento de la unión: (A ∪ B)ᶜ." },
            { m: "union", ans: "A ∪ B (Unión de A y B)", dist: ["A ∩ B", "A − B", "(A ∩ B)ᶜ"], exp: "Todo el interior de ambos conjuntos está sombreado, representando la unión A ∪ B." }
          ];
          const pick = modes[n % modes.length];
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Observa el siguiente diagrama de Venn. ¿Qué operación entre conjuntos representa la región sombreada en azul?`,
            svg: SVG_GEN.venn2(pick.m),
            correct: pick.ans,
            distractors: pick.dist,
            explanation: pick.exp
          }));
        } else if (mod === 1) {
          const total = 60 + (n % 5) * 10;
          const soloA = 18 + (n % 4) * 3;
          const ambos = 12 + (n % 3) * 2;
          const soloB = 15 + (n % 5) * 2;
          const ninguno = total - (soloA + ambos + soloB);
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `En una encuesta a ${total} postulantes universitarios, ${soloA + ambos} estudian Matemática, ${soloB + ambos} estudian Física y ${ambos} estudian ambas materias. ¿Cuántos postulantes NO estudian ninguna de estas dos materias?`,
            svg: SVG_GEN.venn2("outside", ["Mat", "Fís"]),
            correct: `${ninguno} postulantes`,
            distractors: [`${ninguno + ambos} postulantes`, `${total - soloA - soloB} postulantes`, `${Math.max(1, ninguno - 4)} postulantes`],
            explanation: `Solo Matemática = ${soloA + ambos} − ${ambos} = ${soloA}. Solo Física = ${soloB + ambos} − ${ambos} = ${soloB}. Total que estudia al menos una = ${soloA} + ${ambos} + ${soloB} = ${soloA + ambos + soloB}. Ninguna = ${total} − ${soloA + ambos + soloB} = ${ninguno}.`
          }));
        } else if (mod === 2) {
          const k = (n % 4) + 3;
          const potencia = Math.pow(2, k);
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Si el conjunto A posee ${k} elementos distintos, ¿cuántos subconjuntos en total tiene su conjunto potencia P(A)?`,
            correct: `${potencia} subconjuntos`,
            distractors: [`${potencia - 1} subconjuntos`, `${k * 2} subconjuntos`, `${Math.pow(2, k - 1)} subconjuntos`],
            explanation: `El número de subconjuntos de un conjunto de n elementos está dado por 2ⁿ. Para n = ${k}, P(A) tiene 2^${k} = ${potencia} subconjuntos.`
          }));
        } else if (mod === 3) {
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `En el diagrama de 3 conjuntos A, B y C mostrado, ¿qué expresión lógica representa la región central destacada en dorado?`,
            svg: SVG_GEN.venn3("ABC"),
            correct: "A ∩ B ∩ C",
            distractors: ["(A ∪ B) ∩ C", "A ∪ B ∪ C", "(A ∩ B) − C"],
            explanation: `La región dorada pertenece simultáneamente a los tres círculos A, B y C, lo que corresponde a la intersección triple A ∩ B ∩ C.`
          }));
        } else {
          const a1 = n % 3 + 1;
          const b1 = a1 + 4;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Dados los conjuntos U = {1, 2, 3, 4, 5, 6, 7, 8}, A = {${a1}, ${a1 + 1}, ${a1 + 2}, ${b1}} y B = {${a1 + 2}, ${b1}, 8}. Calcula los elementos de (A − B) ∪ (B − A).`,
            correct: `{${a1}, ${a1 + 1}, 8}`,
            distractors: [`{${a1 + 2}, ${b1}}`, `{${a1}, ${a1 + 1}, ${a1 + 2}, ${b1}, 8}`, `{1, 6, 7}`],
            explanation: `A − B = {${a1}, ${a1 + 1}} y B − A = {8}. Al unir ambos conjuntos obtenemos la diferencia simétrica: {${a1}, ${a1 + 1}, 8}.`
          }));
        }
        break;
      }

      case "tema_02": {
        const mod = i % 5;
        if (mod === 0) {
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Si la proposición compuesta (p ∧ ¬q) → r es FALSA, determina los valores de verdad respectivos de p, q y r.`,
            correct: "p = V, q = F, r = F",
            distractors: ["p = V, q = V, r = F", "p = F, q = F, r = V", "p = F, q = V, r = F"],
            explanation: `Una implicación (antecedente → consecuente) solo es Falsa cuando el antecedente es Verdadero y el consecuente es Falso. Así: r = F, y (p ∧ ¬q) = V, lo cual exige p = V y ¬q = V (es decir, q = F).`
          }));
        } else if (mod === 1) {
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Por las Leyes de De Morgan, ¿a qué expresión lógica equivale la negación ¬(p ∨ ¬q)?`,
            correct: "¬p ∧ q",
            distractors: ["¬p ∨ q", "p ∧ ¬q", "¬p ∧ ¬q"],
            explanation: `Al aplicar la Ley de De Morgan, la negación de una disyunción cambia ∨ por ∧ y niega cada componente: ¬(p ∨ ¬q) ≡ ¬p ∧ ¬(¬q) ≡ ¬p ∧ q.`
          }));
        } else if (mod === 2) {
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `¿Cómo se clasifica en su tabla de verdad la proposición compuesta: (p → q) ↔ (¬q → ¬p)?`,
            correct: "Tautología (siempre verdadera)",
            distractors: ["Contradicción (siempre falsa)", "Contingencia", "Falacia formal"],
            explanation: `La proposición ¬q → ¬p es la contrarrecíproca de p → q. Como toda condicional es lógicamente equivalente a su contrarrecíproca, la bicondicional es Verdadera en todos los casos (Tautología).`
          }));
        } else if (mod === 3) {
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Dada la proposición: "Si apruebo el examen de admisión, entonces ingresaré a la universidad". ¿Cuál es su proposición contrarrecíproca equivalente?`,
            correct: "Si no ingreso a la universidad, entonces no aprobé el examen de admisión.",
            distractors: [
              "Si ingreso a la universidad, entonces aprobé el examen de admisión.",
              "Si no apruebo el examen de admisión, entonces no ingresaré a la universidad.",
              "Apruebo el examen de admisión y no ingreso a la universidad."
            ],
            explanation: `La contrarrecíproca de p → q es ¬q → ¬p: negar el consecuente implica negar el antecedente.`
          }));
        } else {
          const rows = Math.pow(2, (n % 3) + 2);
          const vars = (n % 3) + 2;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `¿Cuántas filas de combinaciones de valores de verdad tiene la tabla de verdad de una proposición molecular formada por ${vars} variables proposicionales distintas?`,
            correct: `${rows} filas`,
            distractors: [`${vars * 2} filas`, `${rows + 2} filas`, `${Math.pow(2, vars - 1)} filas`],
            explanation: `Para n variables proposicionales independientes, existen 2ⁿ combinaciones posibles. Con n = ${vars}, se obtienen 2^${vars} = ${rows} filas.`
          }));
        }
        break;
      }

      case "tema_03": {
        const mod = i % 5;
        if (mod === 0) {
          const left = -3 + (n % 3);
          const right = 2 + (n % 4);
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Observa la representación gráfica del conjunto solución en la recta numérica. ¿A qué intervalo corresponde?`,
            svg: SVG_GEN.numberLine({ min: -5, max: 6, left, right, leftClosed: true, rightClosed: false }),
            correct: `[${left}, ${right})`,
            distractors: [`(${left}, ${right}]`, `[${left}, ${right}]`, `(${left}, ${right})`],
            explanation: `El punto relleno en ${left} indica extremo cerrado '[' (${left} incluido), mientras que el círculo sin rellenar en ${right} indica extremo abierto ')' (${right} excluido).`
          }));
        } else if (mod === 1) {
          const a = (n % 4) + 2;
          const xVal = (n % 5) + 3;
          const b = (n % 6) + 1;
          const c = a * xVal - b;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Resuelve la siguiente ecuación lineal para hallar el valor de x:\n${a}(x − 1) + ${a - b} = ${c}`,
            correct: `x = ${xVal}`,
            distractors: [`x = ${xVal + 2}`, `x = ${xVal - 1}`, `x = ${a + b}`],
            explanation: `Desarrollamos: ${a}x − ${a} + ${a - b} = ${c} ⇒ ${a}x − ${b} = ${c} ⇒ ${a}x = ${c + b} ⇒ x = ${c + b}/${a} = ${xVal}.`
          }));
        } else if (mod === 2) {
          const r1 = (n % 4) + 1;
          const r2 = r1 + 3;
          const sum = r1 + r2;
          const prod = r1 * r2;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Determina el conjunto solución de la ecuación cuadrática:\nx² − ${sum}x + ${prod} = 0`,
            correct: `x₁ = ${r1}, x₂ = ${r2}`,
            distractors: [`x₁ = −${r1}, x₂ = −${r2}`, `x₁ = ${r1}, x₂ = −${r2}`, `x₁ = ${sum}, x₂ = ${prod}`],
            explanation: `Factorizando buscamos dos números que sumen ${sum} y multipliquen ${prod}: (x − ${r1})(x − ${r2}) = 0. Por lo tanto, x₁ = ${r1} y x₂ = ${r2}.`
          }));
        } else if (mod === 3) {
          const x = (n % 4) + 2;
          const y = (n % 3) + 1;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Resuelve el sistema de ecuaciones 2×2 y halla el valor de (x + y):\n2x + y = ${2 * x + y}\nx − y = ${x - y}`,
            correct: `${x + y}`,
            distractors: [`${x + y + 2}`, `${Math.abs(x - y)}`, `${2 * x}`],
            explanation: `Sumando ambas ecuaciones se elimina y: 3x = ${3 * x} ⇒ x = ${x}. Sustituyendo en la segunda: ${x} − y = ${x - y} ⇒ y = ${y}. Luego x + y = ${x + y}.`
          }));
        } else {
          const lim = (n % 4) + 1;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Encuentra el intervalo solución de la inecuación lineal:\n3x − 4 > x + ${2 * lim - 4}`,
            svg: SVG_GEN.numberLine({ min: -3, max: 6, left: lim, leftClosed: false, ray: "right" }),
            correct: `(${lim}, +∞)`,
            distractors: [`[${lim}, +∞)`, `(−∞, ${lim})`, `(−∞, ${lim}]`],
            explanation: `Agrupando términos con x: 3x − x > ${2 * lim - 4} + 4 ⇒ 2x > ${2 * lim} ⇒ x > ${lim}. Como es desigualdad estricta (>), el intervalo es abierto: (${lim}, +∞).`
          }));
        }
        break;
      }

      case "tema_04": {
        const mod = i % 5;
        if (mod === 0) {
          const h = (n % 3) - 1;
          const k = (n % 3) - 2;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Observa la gráfica de la función cuadrática en el plano cartesiano. ¿Cuál es su vértice V(h, k) y su rango?`,
            svg: SVG_GEN.cartesian("quadratic", { a: 1, h, k }),
            correct: `Vértice (${h}, ${k}) y Rango [${k}, +∞)`,
            distractors: [
              `Vértice (${k}, ${h}) y Rango [${h}, +∞)`,
              `Vértice (${h}, ${k}) y Rango (−∞, ${k}]`,
              `Vértice (0, 0) y Rango [0, +∞)`
            ],
            explanation: `La parábola abre hacia arriba (a > 0) y su punto mínimo está ubicado en x = ${h}, y = ${k}. Por ello el vértice es (${h}, ${k}) y el rango es [${k}, +∞).`
          }));
        } else if (mod === 1) {
          const b = (n % 3) + 1;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Identifica la función que corresponde a la recta graficada en el siguiente plano cartesiano:`,
            svg: SVG_GEN.cartesian("linear", { m: 1, b }),
            correct: `f(x) = x + ${b}`,
            distractors: [`f(x) = −x + ${b}`, `f(x) = x − ${b}`, `f(x) = ${b}x + 1`],
            explanation: `La recta es creciente con pendiente m = 1 (avanza 1 en y por cada 1 en x) y corta al eje vertical y en (0, ${b}), por lo que f(x) = x + ${b}.`
          }));
        } else if (mod === 2) {
          const c = (n % 5) + 2;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Determina el dominio real de la función racional y radical:\nf(x) = √(x − ${c})`,
            correct: `[${c}, +∞)`,
            distractors: [`(${c}, +∞)`, `(−∞, ${c}]`, `ℝ − {${c}}`],
            explanation: `Para que la raíz cuadrada de índice par esté definida en los números reales, el radicando debe ser mayor o igual a cero: x − ${c} ≥ 0 ⇒ x ≥ ${c}, es decir, [${c}, +∞).`
          }));
        } else if (mod === 3) {
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Observa la curva creciente en el plano cartesiano que pasa por (0, 1) y tiene asíntota horizontal en y = 0. ¿Qué tipo de función representa?`,
            svg: SVG_GEN.cartesian("exponential", { base: 2 }),
            correct: "Función exponencial f(x) = 2ˣ",
            distractors: ["Función logarítmica f(x) = log₂(x)", "Función cuadrática f(x) = x² + 1", "Función lineal f(x) = 2x + 1"],
            explanation: `Toda función exponencial de la forma f(x) = bˣ (con b > 1) tiene dominio ℝ, rango (0, +∞), intercepto en (0, 1) y asíntota horizontal en y = 0.`
          }));
        } else {
          const x0 = (n % 4) + 2;
          const val = 3 * Math.pow(x0, 2) - 2 * x0 + 1;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Dada la función f(x) = 3x² − 2x + 1, calcula el valor numérico de f(${x0}).`,
            correct: `${val}`,
            distractors: [`${val + 4}`, `${val - 3}`, `${3 * x0 - 1}`],
            explanation: `Sustituimos x = ${x0}: f(${x0}) = 3(${x0})² − 2(${x0}) + 1 = 3(${x0 * x0}) − ${2 * x0} + 1 = ${3 * x0 * x0 - 2 * x0} + 1 = ${val}.`
          }));
        }
        break;
      }

      case "tema_05": {
        const mod = i % 5;
        if (mod === 0) {
          const d1 = 20;
          const d2 = 10 + (n % 3) * 5;
          const neto = 100 - Math.round((1 - d1 / 100) * (1 - d2 / 100) * 100);
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Una laptop universitaria recibe dos descuentos sucesivos del ${d1}% y del ${d2}%. ¿A qué descuento único equivalente corresponden ambos descuentos?`,
            correct: `${neto}%`,
            distractors: [`${d1 + d2}%`, `${d1 + d2 - 5}%`, `${100 - neto}%`],
            explanation: `Con precio base 100: tras el ${d1}% queda 80. Luego aplicamos el ${d2}% sobre 80: 80 × (1 − ${d2 / 100}) = ${100 - neto}. El descuento único es 100 − ${100 - neto} = ${neto}%.`
          }));
        } else if (mod === 1) {
          const ob1 = 6;
          const dias1 = 12 + (n % 3) * 4;
          const ob2 = 8;
          const dias2 = (ob1 * dias1) / ob2;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Si ${ob1} técnicos instalan una red de laboratorios en ${dias1} días, ¿cuántos días tardarán ${ob2} técnicos trabajando al mismo ritmo?`,
            correct: `${dias2} días`,
            distractors: [`${Math.round((ob2 * dias1) / ob1)} días`, `${dias2 + 3} días`, `${dias1 - 2} días`],
            explanation: `Es una regla de tres simple inversa (a más técnicos, menos días): ${ob1} × ${dias1} = ${ob2} × x ⇒ x = ${ob1 * dias1} / ${ob2} = ${dias2} días.`
          }));
        } else if (mod === 2) {
          const k = 40 + (n % 5) * 10;
          const total = (3 + 5 + 7) * k;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Se reparte una beca de $${total} de forma directamente proporcional a las edades 3, 5 y 7 (en índices de mérito). ¿Cuánto recibe la parte mayor?`,
            correct: `$${7 * k}`,
            distractors: [`$${5 * k}`, `$${3 * k}`, `$${Math.round(total / 3)}`],
            explanation: `Suma de partes = 3 + 5 + 7 = 15. Constante k = ${total} / 15 = ${k}. La parte mayor corresponde a 7k = 7 × ${k} = $${7 * k}.`
          }));
        } else if (mod === 3) {
          const precioBase = 120 + (n % 4) * 20;
          const finalConIva = Math.round(precioBase * 1.15);
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Un artículo tecnológico cuesta $${finalConIva} incluido el 15% de impuesto (IVA). ¿Cuál era su precio original antes del impuesto?`,
            correct: `$${precioBase}`,
            distractors: [`$${Math.round(finalConIva * 0.85)}`, `$${precioBase - 10}`, `$${precioBase + 15}`],
            explanation: `El precio final representa el 115% (1.15) del precio base: P = ${finalConIva} / 1.15 = $${precioBase}.`
          }));
        } else {
          const rA = 3;
          const rB = 4;
          const mult = 12 + (n % 4) * 3;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `La razón entre hombres y mujeres en un curso preuniversitario es de ${rA} : ${rB}. Si en total hay ${(rA + rB) * mult} estudiantes, ¿cuántas mujeres hay en el curso?`,
            correct: `${rB * mult} mujeres`,
            distractors: [`${rA * mult} mujeres`, `${(rA + rB) * mult - rB} mujeres`, `${rB * mult + 6} mujeres`],
            explanation: `Total de partes = ${rA} + ${rB} = ${rA + rB}. Cada parte equivale a ${(rA + rB) * mult} / ${rA + rB} = ${mult}. Mujeres = ${rB} × ${mult} = ${rB * mult}.`
          }));
        }
        break;
      }

      case "tema_06": {
        const mod = i % 5;
        if (mod === 0) {
          const vals = [15, 25, 20, 30];
          const avg = 22.5;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `El gráfico de barras muestra el número de ejercicios resueltos por 4 paralelos en una semana. ¿Cuál es la media aritmética de ejercicios resueltos?`,
            svg: SVG_GEN.barChart("Ejercicios Resueltos por Paralelo", ["Par. A", "Par. B", "Par. C", "Par. D"], vals),
            correct: `${avg} ejercicios`,
            distractors: ["20 ejercicios", "25 ejercicios", "30 ejercicios"],
            explanation: `La media aritmética es la suma dividida entre el total de datos: (15 + 25 + 20 + 30) / 4 = 90 / 4 = 22.5 ejercicios.`
          }));
        } else if (mod === 1) {
          const totalEnc = 200 + (n % 3) * 100;
          const ingPct = 40;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `El gráfico circular ilustra las preferencias de carrera de ${totalEnc} estudiantes. ¿Cuántos estudiantes eligieron Ingeniería?`,
            svg: SVG_GEN.pieChart("Preferencia de Carrera", [
              { label: "Ingeniería", value: 40 },
              { label: "Medicina", value: 30 },
              { label: "Derecho", value: 20 },
              { label: "Artes", value: 10 }
            ]),
            correct: `${(totalEnc * ingPct) / 100} estudiantes`,
            distractors: [`${(totalEnc * 30) / 100} estudiantes`, `${(totalEnc * 20) / 100} estudiantes`, `${totalEnc - 40} estudiantes`],
            explanation: `Ingeniería representa el 40% del total de ${totalEnc} estudiantes: 0.40 × ${totalEnc} = ${(totalEnc * ingPct) / 100} estudiantes.`
          }));
        } else if (mod === 2) {
          const rojas = 4 + (n % 3);
          const azules = 6 + (n % 2);
          const verdes = 2;
          const tot = rojas + azules + verdes;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `En una urna cerrada hay ${rojas} esferas rojas, ${azules} azules y ${verdes} verdes. Si se extrae una esfera al azar, ¿cuál es la probabilidad de que sea ROJA?`,
            correct: `${rojas}/${tot}`,
            distractors: [`${azules}/${tot}`, `${rojas}/${azules + verdes}`, `1/${rojas}`],
            explanation: `Por la regla de Laplace: P(Roja) = Casos favorables / Casos totales = ${rojas} / (${rojas} + ${azules} + ${verdes}) = ${rojas}/${tot}.`
          }));
        } else if (mod === 3) {
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Calcula la mediana del siguiente conjunto ordenado de calificaciones: {12, 14, 15, 17, 19, 20}.`,
            correct: "16",
            distractors: ["15", "17", "16.5"],
            explanation: `Al haber un número par de datos (6), la mediana es el promedio de los dos valores centrales (15 y 17): (15 + 17) / 2 = 16.`
          }));
        } else {
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Al lanzar dos dados equilibrados de 6 caras simultáneamente, ¿cuál es la probabilidad de que la suma de sus puntos sea igual a 7?`,
            correct: "1/6 (6/36)",
            distractors: ["1/12 (3/36)", "5/36", "7/36"],
            explanation: `Existen 36 resultados posibles. Las combinaciones que suman 7 son 6: (1,6), (2,5), (3,4), (4,3), (5,2) y (6,1). Por tanto, P = 6/36 = 1/6.`
          }));
        }
        break;
      }

      case "tema_07": {
        const mod = i % 5;
        if (mod === 0) {
          const r = 4 + (n % 5);
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Calcula el área del círculo mostrado en la figura si su radio mide r = ${r} cm.`,
            svg: SVG_GEN.geometry("circle_r", { r }),
            correct: `${r * r}π cm²`,
            distractors: [`${2 * r}π cm²`, `${r * r * 2}π cm²`, `${r}π cm²`],
            explanation: `El área del círculo es A = π · r². Sustituyendo r = ${r} cm: A = π · (${r})² = ${r * r}π cm².`
          }));
        } else if (mod === 1) {
          const d = 10 + (n % 4) * 2;
          const r = d / 2;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Conociendo que el diámetro de la circunferencia es d = ${d} cm, determina la longitud de su circunferencia (perímetro) y su área.`,
            svg: SVG_GEN.geometry("circle_d", { d }),
            correct: `Perímetro = ${d}π cm; Área = ${r * r}π cm²`,
            distractors: [
              `Perímetro = ${r}π cm; Área = ${d * d}π cm²`,
              `Perímetro = ${2 * d}π cm; Área = ${r * r}π cm²`,
              `Perímetro = ${d}π cm; Área = ${2 * r}π cm²`
            ],
            explanation: `Si d = ${d} cm, entonces el radio es r = d/2 = ${r} cm. Longitud = π·d = ${d}π cm, y Área = π·r² = ${r * r}π cm².`
          }));
        } else if (mod === 2) {
          const L = 6 + (n % 3) * 2;
          const r = L / 2;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Un círculo está inscrito dentro de un cuadrado de lado L = ${L} cm. Calcula el área de la región sombreada en azul.`,
            svg: SVG_GEN.geometry("shaded_square_circle", { L }),
            correct: `${L * L} − ${r * r}π cm²`,
            distractors: [`${L * L} − ${L * L}π cm²`, `${4 * L} − ${2 * r}π cm²`, `${r * r}π − ${L * L} cm²`],
            explanation: `Área del cuadrado = L² = ${L}² = ${L * L} cm². El diámetro del círculo inscrito es ${L} cm, luego r = ${r} cm y su área es ${r * r}π cm². Área sombreada = ${L * L} − ${r * r}π cm².`
          }));
        } else if (mod === 3) {
          const r = 3 + (n % 3);
          const h = 8 + (n % 4);
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Calcula el volumen exacto del cilindro circular recto de radio r = ${r} cm y altura h = ${h} cm.`,
            svg: SVG_GEN.geometry("cylinder", { r, h }),
            correct: `${r * r * h}π cm³`,
            distractors: [`${2 * r * h}π cm³`, `${Math.round((r * r * h) / 3)}π cm³`, `${r * h * h}π cm³`],
            explanation: `El volumen de un cilindro es V = π · r² · h = π · (${r})² · (${h}) = ${r * r * h}π cm³.`
          }));
        } else {
          const a = 4 + (n % 4);
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Determina el volumen total de un cubo cuya arista mide a = ${a} cm.`,
            svg: SVG_GEN.geometry("cube", { a }),
            correct: `${a * a * a} cm³`,
            distractors: [`${6 * a * a} cm³`, `${12 * a} cm³`, `${a * a} cm³`],
            explanation: `El volumen de un cubo es V = a³. Para a = ${a} cm: V = ${a}³ = ${a * a * a} cm³.`
          }));
        }
        break;
      }

      case "tema_08": {
        const mod = i % 3;
        if (mod === 0) {
          const step = [45, 90, 135][n % 3];
          const start = (n % 4) * 45;
          const angles = [0, 1, 2, 3].map((k) => (start + k * step) % 360);
          const nextAng = (start + 4 * step) % 360;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Analiza la secuencia gráfica de rotaciones. Cada figura gira ${step}° en sentido horario respecto a la anterior. ¿Qué orientación tiene la Figura 5 (?)?`,
            svg: SVG_GEN.sequence(angles, "arrow"),
            correct: `Flecha apuntando a ${nextAng}° (giro acumulado de +${step}°)`,
            distractors: [
              `Flecha apuntando a ${(nextAng + 90) % 360}°`,
              `Flecha apuntando a ${(nextAng + 180) % 360}°`,
              `Flecha apuntando a ${(nextAng + 45) % 360}°`
            ],
            explanation: `La flecha rota constantemente +${step}° en sentido horario en cada paso: ${angles.join("° → ")}° → ${nextAng}°.`
          }));
        } else if (mod === 1) {
          const corners = [0, 1, 2, 3].map((k) => (k + n) % 4);
          const labels = ["Superior Izquierda", "Superior Derecha", "Inferior Derecha", "Inferior Izquierda"];
          const nextIdx = (4 + n) % 4;
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Observa el desplazamiento del círculo azul por las esquinas del recuadro en cada paso. ¿En qué esquina se ubicará en la Figura 5 (?)?`,
            svg: SVG_GEN.sequence([], "corners", corners),
            correct: `Esquina ${labels[nextIdx]}`,
            distractors: [
              `Esquina ${labels[(nextIdx + 1) % 4]}`,
              `Esquina ${labels[(nextIdx + 2) % 4]}`,
              `Esquina ${labels[(nextIdx + 3) % 4]}`
            ],
            explanation: `El punto avanza una esquina en sentido horario en cada recuadro, completando el ciclo y regresando a la esquina ${labels[nextIdx]}.`
          }));
        } else {
          const angles = [0, 90, 180, 270];
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `El triángulo isósceles gira 90° en sentido horario en cada cuadro. ¿Cuál es la posición correcta de la Figura 5 (?)?`,
            svg: SVG_GEN.sequence(angles, "triangle"),
            correct: "Vértice apuntando hacia arriba (0° — posición inicial)",
            distractors: [
              "Vértice apuntando hacia la derecha (90°)",
              "Vértice apuntando hacia abajo (180°)",
              "Vértice apuntando hacia la izquierda (270°)"
            ],
            explanation: `Al rotar 90° horarios por paso (0° → 90° → 180° → 270°), en el quinto paso completa los 360° volviendo a 0° (apuntando hacia arriba).`
          }));
        }
        break;
      }

      case "tema_09": {
        const mod = i % 3;
        if (mod === 0) {
          const masks = [1, 2, 3, 4, 8, 12, 1, 4, 0];
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Observa la matriz gráfica 3×3. En cada fila, la tercera figura se forma superponiendo (uniendo) los trazos de las dos primeras. ¿Qué trazos debe contener la casilla (?)?`,
            svg: SVG_GEN.matrix3x3(masks),
            correct: "Línea vertical central + línea diagonal descendente (\\)",
            distractors: [
              "Línea horizontal central + línea vertical central (+)",
              "Solo un punto central sin líneas",
              "Ambas líneas diagonales cruzadas (×)"
            ],
            explanation: `En la fila 1: vertical + horizontal = cruz (+). En la fila 2: diagonal (\\) + diagonal (/) = aspa (×). En la fila 3: vertical + diagonal (\\) = unión de ambos trazos.`
          }));
        } else if (mod === 1) {
          const masks = [3, 2, 1, 12, 4, 8, 5, 1, 0];
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `En esta matriz 3×3 se aplica una regla de resta de trazos comunes (XOR): los segmentos que se repiten en las dos primeras celdas de cada fila desaparecen en la tercera. ¿Qué figura va en (?)?`,
            svg: SVG_GEN.matrix3x3(masks),
            correct: "Únicamente la diagonal descendente (\\)",
            distractors: [
              "Únicamente la línea vertical central (|)",
              "La cruz completa (+)",
              "La línea horizontal central (—)"
            ],
            explanation: `En la tercera fila, la primera celda tiene vertical + diagonal (\\) y la segunda tiene vertical. Al cancelar el trazo vertical común, queda solo la diagonal (\\).`
          }));
        } else {
          const masks = [1, 3, 7, 2, 6, 14, 8, 12, 0];
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Analiza la progresión de segmentos en cada fila de la matriz 3×3: en cada columna se añade un nuevo segmento siguiendo un patrón lógico. ¿Qué figura completa (?)?`,
            svg: SVG_GEN.matrix3x3(masks),
            correct: "Ambas diagonales (×) más la línea horizontal central",
            distractors: [
              "Únicamente la línea vertical central",
              "Solo la diagonal ascendente (/)",
              "Círculo vacío sin segmentos"
            ],
            explanation: `De izquierda a derecha en cada fila se agrega un segmento nuevo sin borrar los anteriores: fila 3 inicia con (/) [1 trazo], pasa a (×) [2 trazos] y culmina añadiendo el tercer segmento (horizontal).`
          }));
        }
        break;
      }

      case "tema_10": {
        const mod = i % 3;
        if (mod === 0) {
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Observa la analogía visual: "Figura A es a Figura B como Figura C es a Figura D (?)". Deduce la transformación aplicada y elige la Figura D correcta.`,
            svg: SVG_GEN.analogy(
              { shape: "square", filled: false, rot: 0 },
              { shape: "square", filled: true, rot: 45 },
              { shape: "triangle", filled: false, rot: 0 }
            ),
            correct: "Triángulo relleno de azul y rotado 45°",
            distractors: [
              "Triángulo sin relleno y sin rotación",
              "Cuadrado relleno de azul y sin rotación",
              "Círculo relleno de azul"
            ],
            explanation: `De A hacia B el polígono conserva su forma, adquiere relleno sólido azul y gira 45°. Aplicando la misma regla a C (triángulo vacío a 0°), obtenemos un triángulo relleno azul rotado 45°.`
          }));
        } else if (mod === 1) {
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `En la siguiente analogía gráfica, identifica la relación entre A y B para encontrar la figura que reemplaza a (?) en D:`,
            svg: SVG_GEN.analogy(
              { shape: "triangle", filled: true, rot: 0 },
              { shape: "triangle", filled: false, rot: 180 },
              { shape: "square", filled: true, rot: 0 }
            ),
            correct: "Cuadrado sin relleno (blanco) rotado 180°",
            distractors: [
              "Cuadrado relleno de azul sin rotación",
              "Triángulo vacío rotado 90°",
              "Círculo blanco sin relleno"
            ],
            explanation: `La transformación de A a B invierte el relleno (de sólido a blanco) y aplica un giro de 180°. Por tanto, el cuadrado sólido pasa a ser un cuadrado blanco rotado 180°.`
          }));
        } else {
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Ejercicio de exclusión de figuras: Si un grupo de figuras geométricas se clasifica por tener "número par de ejes de simetría y lados rectos", ¿cuál de las siguientes figuras NO pertenece al grupo?`,
            svg: SVG_GEN.analogy(
              { shape: "square", filled: false, rot: 0 },
              { shape: "square", filled: false, rot: 45 },
              { shape: "triangle", filled: false, rot: 0 }
            ),
            correct: "El triángulo equilátero (tiene 3 lados y 3 ejes de simetría — impar)",
            distractors: [
              "El cuadrado (tiene 4 lados y 4 ejes de simetría)",
              "El rombo (tiene 4 lados y 2 ejes de simetría)",
              "El rectángulo (tiene 4 lados y 2 ejes de simetría)"
            ],
            explanation: `El cuadrado, el rombo y el rectángulo son cuadriláteros con número par de lados y ejes de simetría, mientras que el triángulo equilátero posee 3 lados (impar).`
          }));
        }
        break;
      }

      case "tema_11": {
        const mod = i % 3;
        if (mod === 0) {
          const configs = [
            { grid: [[3, 2, 1], [2, 1, 0], [1, 0, 0]], total: 10 },
            { grid: [[3, 3, 1], [2, 1, 1], [1, 0, 0]], total: 12 },
            { grid: [[4, 2, 1], [2, 2, 0], [1, 1, 0]], total: 13 }
          ];
          const cfg = configs[n % configs.length];
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Observa el sólido apilado en perspectiva isométrica. Contando tanto los cubos visibles como los ocultos que sostienen la estructura, ¿cuántos cubos unitarios hay en total?`,
            svg: SVG_GEN.stackedBlocks3D(cfg.grid),
            correct: `${cfg.total} cubos unitarios`,
            distractors: [
              `${cfg.total - 2} cubos unitarios`,
              `${cfg.total + 2} cubos unitarios`,
              `${cfg.total - 3} cubos unitarios`
            ],
            explanation: `Sumando por columnas verticales desde la esquina posterior hasta el frente obtenemos exactamente ${cfg.total} cubos unitarios en toda la estructura.`
          }));
        } else if (mod === 1) {
          const syms = ["★", "●", "▲", "■", "✚", "◆"];
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Observa la plantilla desplegada de un cubo con 6 símbolos. Al doblar las caras hacia adentro para armar el cubo, ¿qué símbolo queda en la cara OPUESTA a la estrella (★)?`,
            svg: SVG_GEN.cubeNet(syms),
            correct: "El cuadrado sólido (■)",
            distractors: [
              "El triángulo (▲)",
              "El círculo (●)",
              "El rombo (◆)"
            ],
            explanation: `En una red en cruz, las caras separadas por un cuadro en línea recta quedan opuestas al plegarse: ★ (arriba) es opuesto a ■ (abajo), ● es opuesto a ✚, y ▲ es opuesto a ◆.`
          }));
        } else {
          const grid = [[2, 2, 1], [1, 1, 0], [1, 0, 0]];
          list.push(makeQuestion({
            id: qId, topicId, level,
            prompt: `Analiza el sólido formado por bloques unitarios. Si observas la estructura directamente desde arriba (Vista Superior / Planta), ¿cuántos cuadrados forman su proyección plana?`,
            svg: SVG_GEN.stackedBlocks3D(grid),
            correct: "6 cuadrados (la huella base ocupada por las columnas)",
            distractors: [
              "8 cuadrados (total de cubos apilados)",
              "4 cuadrados",
              "9 cuadrados (cuadrícula completa 3×3)"
            ],
            explanation: `La vista superior proyecta una sola casilla por cada columna que tenga altura ≥ 1. En el sólido hay 3 columnas en la fila posterior, 2 en la central y 1 en la frontal: 3 + 2 + 1 = 6 cuadrados.`
          }));
        }
        break;
      }
    }
  }

  return list;
}

/**
 * Construye el banco inicial completo de Profe Fernando PRE-U:
 * - 11 temas × (5 Básico + 10 Medio + 20 Difícil) = 385 preguntas
 * - Desafío Final Integrador = 70 preguntas (45 Bloque 1 + 25 Bloque 2)
 */
function buildInitialQuestionBank() {
  const topics = {};

  SYLLABUS_TOPICS.forEach((topic) => {
    topics[topic.id] = {
      ...topic,
      levels: {
        basico: generateTopicQuestions(topic.id, "basico", 5, 0),
        medio: generateTopicQuestions(topic.id, "medio", 10, 5),
        dificil: generateTopicQuestions(topic.id, "dificil", 20, 15)
      }
    };
  });

  const finalDistribution = [
    { topicId: "tema_01", count: 7 },
    { topicId: "tema_02", count: 6 },
    { topicId: "tema_03", count: 7 },
    { topicId: "tema_04", count: 7 },
    { topicId: "tema_05", count: 6 },
    { topicId: "tema_06", count: 6 },
    { topicId: "tema_07", count: 6 },
    { topicId: "tema_08", count: 7 },
    { topicId: "tema_09", count: 6 },
    { topicId: "tema_10", count: 6 },
    { topicId: "tema_11", count: 6 }
  ];

  const desafio_final = [];
  let seq = 1;
  finalDistribution.forEach(({ topicId, count }) => {
    const generated = generateTopicQuestions(topicId, "desafio_final", count, 40 + seq);
    generated.forEach((q) => {
      q.id = `final_${String(seq).padStart(2, "0")}_${topicId}`;
      desafio_final.push(q);
      seq++;
    });
  });

  return {
    version: "1.0.0",
    institution: "Profe Fernando PRE-U",
    topics,
    desafio_final
  };
}