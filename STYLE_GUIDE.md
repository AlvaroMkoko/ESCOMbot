# 🎨 Guía de Estilos - ESCOMBOT

## Paleta de Colores

### Colores Primarios

```
Azul Oscuro (Primary):
  Hex: #0b6696
  RGB: 11, 102, 150
  Uso: Botones, chat del usuario, accents
  
Azul Oscuro Hover:
  Hex: #0a5680
  Uso: Hover states de botones

Gris Claro (Background):
  Hex: #f3f4f6
  RGB: 243, 244, 246
  Uso: Fondo de página
  
Blanco (Card):
  Hex: #ffffff
  RGB: 255, 255, 255
  Uso: Cards, inputs, área de mensajes
  
Gris Oscuro (Sidebar):
  Hex: #111827
  RGB: 17, 24, 39
  Uso: Sidebar, header secundario
```

### Colores Secundarios

```
Gris Medio (Border):
  Hex: #d1d5db
  RGB: 209, 213, 219
  Uso: Bordes, separadores
  
Gris Claro (Hover):
  Hex: #f9fafb
  RGB: 249, 250, 251
  Uso: Hover backgrounds
  
Verde (Success):
  Hex: #10b981
  Uso: Mensajes de éxito
  
Rojo (Error):
  Hex: #ef4444
  Uso: Mensajes de error
  
Amarillo (Warning):
  Hex: #f59e0b
  Uso: Advertencias
  
Azul (Info):
  Hex: #3b82f6
  Uso: Información
```

---

## Tipografía

### Fuentes

**Headings (Logo, Títulos):**
```
Font Family: Geist
Weight: Bold (700)
Sizes:
  - h1: 2xl (24px)
  - h2: xl (20px)
  - h3: lg (18px)
```

**Body Text (Párrafos, Mensajes):**
```
Font Family: Geist
Weight: Regular (400)
Size: 14-16px
Line Height: 1.5
```

**Code:**
```
Font Family: Geist Mono
Weight: Regular (400)
Size: 12-14px
```

---

## Componentes UI

### Header

```
Altura: 64px
Background: Blanco (#ffffff)
Border: Gris claro inferior
Logo: 40x40px
Padding: 16px horizontal
Sticky: Top
Z-index: 20
```

**Logo:**
- Tamaño: 40x40px
- Ubicación: Top-left
- Margen derecho: 12px

**Título:**
- Font: 20px Bold
- Color: Gris oscuro (#111827)

**Subtítulo:**
- Font: 12px Regular
- Color: Gris medio (#6b7280)

**Botones:**
- Login: Azul oscuro, 32px alto
- User icon: Gris, hover gris claro

---

### Sidebar

```
Ancho: 256px (desktop)
Altura: calc(100vh - 64px)
Background: Gris oscuro (#111827)
Color texto: Blanco
Border: Ninguno
Z-index: 40 (overlay: 30)
Posición: Fixed (móvil), Relative (desktop)
```

**Botón "Nuevo Chat":**
- Background: Gris muy oscuro (#1f2937)
- Hover: Gris (#374151)
- Height: 44px
- Padding: 12px 16px
- Border radius: 8px

**Items de Chat:**
```
Normal:
  Background: Transparent
  Color: Gris claro (#d1d5db)
  Hover: Gris oscuro (#1f2937)
  
Active:
  Background: Gris (#374151)
  Color: Blanco
```

**Padding:** 16px todo

---

### Chat Interface

```
Background: Gris claro (#f3f4f6)
Border radius: 12px (sm), 16px (md)
Shadow: sm (sm), xl (md)
Altura: 500px (sm), full (lg)
Max-width: 56rem (4xl)
```

**Área de Mensajes:**
```
Background: Blanco (#ffffff)
Height: flex-1 (variable)
Overflow: Auto vertical
Padding: 12px (sm), 16px (sm+)
Gap entre mensajes: 16px
```

**Mensaje Usuario:**
```
Background: Azul oscuro (#0b6696)
Color: Blanco
Border radius: 16px
Border-top-right: 0 (punta)
Max-width: 80%
Padding: 10px 16px
Align: Derecha
```

**Mensaje Bot:**
```
Background: Gris claro (#f3f4f6)
Color: Gris oscuro (#111827)
Border radius: 16px
Border-top-left: 0 (punta)
Max-width: 80%
Padding: 10px 16px
Align: Izquierda
```

**Timestamp:**
```
Font size: 10px
Color: Gris medio (#9ca3af)
Margin top: 4px
```

**Input Area:**
```
Background: Blanco (#ffffff)
Border-top: 1px gris claro
Padding: 12px (sm), 16px (sm+)
Display: Flex
Gap: 8px
```

**Input Field:**
```
Background: Gris claro (#f3f4f6)
Border: 1px gris medio (#d1d5db)
Border radius: 12px
Padding: 12px 16px
Font size: 14px
Focus: Ring azul claro, border azul
Placeholder color: Gris medio (#9ca3af)
```

**Botón Enviar:**
```
Background: Azul oscuro (#0b6696)
Hover: Azul oscuro más claro (#0a5680)
Disabled: Gris claro (#d1d5db)
Color: Blanco
Size: 44px (32px icon)
Border radius: 12px
```

---

### LoginModal

```
Background: Blanco (#ffffff)
Border radius: 12px
Shadow: xl
Max-width: 384px (w-96)
Z-index: 50
Overlay: Negro 50% opacity
```

**Header:**
```
Padding: 24px
Border-bottom: 1px gris claro
Display: Flex justify-between
```

**Título:**
```
Font: 20px bold
Color: Gris oscuro (#111827)
Flex: 1
```

**Close Button:**
```
Padding: 4px
Hover: Gris claro (#f3f4f6)
Border radius: 8px
```

**Form:**
```
Padding: 24px
Space between: 16px
```

**Labels:**
```
Font: 14px bold
Color: Gris oscuro (#374151)
Margin bottom: 4px
```

**Inputs:**
```
Width: 100%
Padding: 10px 16px
Border: 1px gris medio
Border radius: 8px
Focus: Ring azul, border azul
Disabled: Cursor disabled, opacity
```

**Error Message:**
```
Background: Rojo claro (#fee2e2)
Border: 1px rojo (#fca5a5)
Color: Rojo oscuro (#991b1b)
Padding: 12px 16px
Border radius: 8px
Font: 14px
```

**Botón Entrar:**
```
Width: 100%
Padding: 10px 16px
Background: Azul oscuro (#0b6696)
Hover: Azul oscuro más claro (#0a5680)
Disabled: Gris (#d1d5db)
Color: Blanco
Border radius: 8px
Font: 14px bold
```

---

## Responsive Design

### Breakpoints (Tailwind)

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Layout Changes

**Móvil (< 768px):**
- Header completo con logo
- Sidebar oculto (toggle button en header)
- Chat fullscreen
- Padding: 12px
- Font: 14px

**Tablet (768px - 1024px):**
- Header con logo y título completo
- Sidebar visible
- Chat área responsiva
- Padding: 16px
- Font: 14px

**Desktop (> 1024px):**
- Header completo
- Sidebar visible siempre
- Chat área optimizada
- Padding: 24px
- Font: 16px
- Hover effects completos

---

## Iconos

**Librería:** Lucide Icons (www.lucide.dev)

```
Tamaño estándar: 20-24px
Tamaño pequeño: 16px
Tamaño grande: 32px

Color: Heredado del elemento padre
Hover: Cambio de opacidad
```

**Iconos usados:**
- `Send` - Enviar mensaje
- `User` - Ícono de usuario
- `Bot` - Ícono de bot
- `Menu` - Menú móvil
- `X` - Cerrar
- `Plus` - Agregar
- `MessageSquare` - Chat
- `LogOut` - Logout
- `LogIn` - Login
- `Loader2` - Loading spinner

---

## Animaciones

```
Transitions:
  - all: 150ms ease-in-out
  - colors: 200ms ease
  
Transforms:
  - translate-x: -full a 0 (sidebar)
  - opacity: 0 a 1 (fade in)
  
Spinners:
  - Loader2 animate-spin
  - Velocidad: 1s
```

---

## Espaciado (Tailwind Scale)

```
Padding/Margin:
  - xs: 4px
  - sm: 8px
  - md: 12px
  - lg: 16px
  - xl: 24px
  - 2xl: 32px
```

---

## Ejemplos de Uso

### Botón Primario (Login)
```tsx
<button className="px-4 py-3 bg-blue-900 hover:bg-blue-800 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors">
  Iniciar sesión
</button>
```

### Mensaje de Usuario
```tsx
<div className="bg-[#0b6696] text-white rounded-2xl rounded-tr-none px-4 py-2.5">
  Mi mensaje
</div>
```

### Mensaje de Bot
```tsx
<div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none px-4 py-2.5">
  Respuesta del bot
</div>
```

---

## Accesibilidad

```
- Contraste: WCAG AA mínimo
- Focus states: Visible en todos los elementos
- Colors: No solo color para diferenciar
- Icons: Siempre con labels accesibles
- Font sizes: Mínimo 14px en móvil
- Touch targets: Mínimo 44px en móvil
```

---

## Brand Guide

**Logo:**
- Tamaño mínimo: 32x32px
- Margin mínimo: 12px
- Versiones: Color, blanco, gris oscuro

**Nombre:**
- Siempre "ESCOMBOT"
- Font: Geist Bold
- Color: Gris oscuro (#111827)

**Tagline:**
- "Asistente Virtual Escolar"
- Font: Geist Regular, 12px
- Color: Gris medio (#6b7280)

---

**Última actualización:** Enero 2024
**Versión:** 1.0
