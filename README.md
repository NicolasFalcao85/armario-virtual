# Armario Virtual

Tu placard digital con estilista con IA (MVP, sin try-on visual todavía).

Sacás foto a cada prenda, la tageás (categoría, color, clima, ocasión, precio
opcional) y después le pedís un look según el contexto — te propone
combinaciones armadas con reglas a partir de lo que cargaste. Guardás tus
looks favoritos y trackeás cuánto usás cada prenda.

Diseño hecho después de un benchmark de apps líderes del rubro (Whering,
Acloset, Indyx, Stylebook, Cladwell, Nouva) y de tendencias UI 2026
(glassmorphism, bento grids, tipografía editorial) — ver el detalle al final.

## Stack

- React + TypeScript + Vite
- Firebase: Auth (Google), Firestore (prendas + looks guardados), Storage (fotos)
- React Router
- lucide-react (íconos)
- Google Fonts: Fraunces (display) + Plus Jakarta Sans (texto)

## Funcionalidades

- **Catálogo por foto**: alta en wizard de 2 pasos, categoría por ícono, color
  por paleta de swatches, clima/ocasión por chips, precio opcional.
- **Estilista con IA** (reglas, listo para enchufar un modelo después): pedís
  un look por clima + ocasión y te arma combinaciones con lo que tenés.
- **Contador de usos**: botón "Usé esto" en cada prenda — trackea cuántas
  veces la usaste y calcula el **costo por uso** si cargaste el precio.
- **Nudge de prendas olvidadas**: si algo no se usa hace 30+ días, aparece un
  aviso en el home invitando a rescatarlo.
- **Looks guardados**: guardás combinaciones que te gustaron (❤️) para
  volver a verlas después, sin tener que regenerarlas.

## UI / UX

- Identidad visual propia: gradiente de marca "sunset silk" (terracota →
  coral → dorado), tipografía editorial (Fraunces + Plus Jakarta Sans),
  fondo con gradient mesh + textura de grano sutil.
- Glassmorphism en header, nav y modales (`backdrop-filter: blur`).
- Layout tipo bento en el home (hero + stat tiles asimétricos).
- Navegación mobile con barra flotante tipo pill + botón flotante (FAB)
  central para agregar prenda — nav de pills arriba en desktop.
- Cards de prenda con estilo "flatlay" (leve rotación tipo polaroid) en los
  looks generados.
- Modo oscuro con toggle, persiste en `localStorage` y respeta la
  preferencia del sistema la primera vez.
- Toasts, modal de confirmación para borrar, skeleton loaders.
- Microinteracciones (hover lift, botones con glow, animación de entrada) —
  respeta `prefers-reduced-motion`.

## Setup

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Crear un proyecto en [Firebase console](https://console.firebase.google.com/):
   - Habilitar **Authentication** → método Google.
   - Habilitar **Firestore Database** (modo producción).
   - Habilitar **Storage**.
   - Copiar la config del SDK web.

3. Copiar `.env.example` a `.env.local` y completar con los datos de tu proyecto:

   ```bash
   cp .env.example .env.local
   ```

4. Deployar las reglas de seguridad (necesitás el [Firebase CLI](https://firebase.google.com/docs/cli)):

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add   # elegir tu proyecto
   firebase deploy --only firestore:rules,storage
   ```

5. Correr en local:

   ```bash
   npm run dev
   ```

## Deploy

**GitHub Pages** (requiere que el repo se llame igual que `base` en `vite.config.ts`,
o ajustar ese valor):

```bash
npm run deploy
```

**Netlify**: conectar el repo directo, usa `netlify.toml` (acordate de cambiar
`base: '/'` en `vite.config.ts` si vas por acá en vez de GitHub Pages).

## Cómo está armado

- `src/types.ts` — modelo de datos (`Prenda` con `usos`/`precio`, `LookGuardado`).
- `src/hooks/useWardrobe.ts` — alta/baja de prendas + `marcarUso`.
- `src/hooks/useLooks.ts` — guardar/listar/borrar looks favoritos en Firestore.
- `src/lib/recommend.ts` — generador de looks por reglas (clima + ocasión).
  Pensado para que más adelante se pueda enchufar ahí una llamada a un modelo
  de IA que elija/rankee mejor las combinaciones, sin tocar el resto de la app.
- `src/pages/` — armario, agregar prenda, estilista (proponer + guardados).
- `src/components/` — `Layout` (nav responsive + FAB + dark mode),
  `AddGarmentForm` (wizard), `CategoryPicker` / `ColorPicker`, `Toast`,
  `ConfirmDialog`, `Skeleton`, `GarmentCard` (badge de usos + costo por uso).
- `src/hooks/useDarkMode.ts` — tema persistente.
- `src/index.css` — design system completo (tokens, gradientes, glass, bento).

## Benchmark que definió el rediseño

**Funcionalidades** (de Whering, Acloset, Indyx, Stylebook, Cladwell, Nouva,
Wardrowbe): wear tracking / cost-per-wear, nudge de prendas sin usar, guardar
looks favoritos, clima como input del generador, catalogación rápida por
foto. Quedó afuera por ahora (posible fase 2): virtual try-on, integración de
calendario, feed social, escaneo corporal.

**Diseño** (tendencias UI 2026): glassmorphism evolucionado (blur variable,
absorción de color del fondo), bento grids asimétricos con radios grandes,
dark mode "no opcional" con grises cálidos en vez de negro puro,
microinteracciones de 150–300ms, tipografía editorial de gran tamaño en
hero/headlines.

## Qué falta (roadmap)

- [ ] Auto-tag de categoría/color al sacar la foto (con un modelo de visión).
- [ ] Virtual try-on: probar el look sobre una foto tuya (evaluar proveedores
      antes de comprometerse — la calidad varía mucho según la prenda y la pose).
- [ ] Integración con tu agenda para sugerir looks día por día.
- [ ] Reemplazar/complementar la selección por reglas de `recommend.ts` con
      un modelo que tenga en cuenta combinación de colores, estilo, etc.
