# Planificación: Tienda Online de Electrónica

> **⚠️ IMPORTANTE:** Usar **pnpm** como gestor de paquetes en todos los módulos (frontend, backend). No usar npm.

Basado en la estructura visual de buenosairesit.com

> Se copia la *estructura visual, patrón de componentes y esquema de datos*, no los textos ni imágenes.

---

## 1. Estructura Visual General (compartida por todos los módulos)

### 1.1 Layout Global

```
+-------------------------------------------+
|  Announcement Bar                         |
+-------------------------------------------+
|  Header (Logo + Nav + Buscador + Carrito) |
+-------------------------------------------+
|  Contenido principal                      |
+-------------------------------------------+
|  Footer (Redes, Links, Newsletter, Pagos) |
+-------------------------------------------+
```

### 1.2 Mapeo buenosairesit.com → Tienda Electrónica

| buenosairesit.com | Tienda Electrónica |
|---|---|
| Hero "Agencia #1 en BA" | Hero "TechStore — líder en electrónica" |
| Servicios (Web, Marketing, Apps) | Categorías (Celulares, Computación, Audio, TV, Gaming) |
| "Para vos hacemos" (3 cards) | "Categorías destacadas" (grid de categorías) |
| "¿Por qué elegirnos?" (5 bullets) | "¿Por qué comprar en TechStore?" (beneficios) |
| "Proceso en 4 pasos" | "Cómo comprar" (elegir → carrito → pago → recibir) |
| "Metodología 5 pasos" c/imágenes | Secciones calidad, garantía, envío |
| Clientes / LogoCloud | Marcas (Samsung, Sony, LG, etc.) |
| Instagram Feed | Testimonios de clientes / Reviews |
| FAQ acordeón | FAQ sobre envíos, garantías, cambios |
| CTA "Comunicate ahora" | CTA "Comprar ahora" / Newsletter |
| Footer: ubicación, +info, certif. | Footer: redes, links, newsletter, pagos |

### 1.3 Patrón visual por página

Cada página sigue este patrón:
1. **Hero** con contador de oferta (ej. "quedan 2hs") + mini carrusel de productos destacados
2. **Cards horizontales apilables en móvil** con imagen que cambia según scroll (parallax suave)
3. **Sección de features/beneficios** con grid de íconos
4. **FAQ solo en /faq** (en otras páginas: tooltips o enlaces contextuales)
5. **CTA final** antes del footer

---

## 2. Arquitectura de Carpetas

```
techstore-ecommerce/
│
├── frontend/                          # Astro + TypeScript + Tailwind
│   ├── public/
│   │   ├── favicon.ico
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/                # Atomic design (Astro components)
│   │   │   ├── atoms/                 # Button, Input, Badge, Spinner, Icon
│   │   │   ├── molecules/             # SearchBar, ProductCard, Accordion
│   │   │   ├── organisms/             # Header, Footer, HeroSection, ProductGrid
│   │   │   └── templates/             # Layout, AuthLayout
│   │   ├── layouts/                   # Layouts Astro (.astro)
│   │   │   ├── MainLayout.astro
│   │   │   ├── AuthLayout.astro
│   │   │   └── AdminLayout.astro
│   │   ├── pages/                     # File-based routing (.astro)
│   │   │   ├── index.astro            # Home
│   │   │   ├── productos/
│   │   │   │   ├── index.astro        # Catálogo general
│   │   │   │   └── [categoria].astro  # Por categoría
│   │   │   ├── producto/
│   │   │   │   └── [slug].astro       # Detalle producto
│   │   │   ├── carrito.astro
│   │   │   ├── checkout.astro
│   │   │   ├── auth/
│   │   │   │   ├── login.astro
│   │   │   │   └── register.astro
│   │   │   ├── perfil/
│   │   │   │   ├── index.astro
│   │   │   │   ├── direcciones.astro
│   │   │   │   └── pedidos.astro
│   │   │   ├── admin/
│   │   │   │   ├── index.astro        # Dashboard
│   │   │   │   ├── productos.astro    # ABM
│   │   │   │   └── pedidos.astro      # Gestión
│   │   │   ├── nosotros.astro
│   │   │   ├── contacto.astro
│   │   │   ├── faq.astro
│   │   │   └── ofertas.astro
│   │   ├── islands/                   # Interactive components (React/Preact/Svelte)
│   │   │   ├── CartIcon.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── ProductCarousel.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── FilterSidebar.tsx
│   │   │   ├── CheckoutForm.tsx
│   │   │   └── AdminDataTable.tsx
│   │   ├── services/                  # api.ts (axios instance), authService, productService
│   │   ├── stores/                    # Nanostores: cartStore, authStore, uiStore
│   │   ├── types/                     # product.ts, user.ts, order.ts, api.ts
│   │   ├── utils/                     # formatters, validators, constants
│   │   ├── shared/                    # Shared code across islands
│   │   │   └── hooks/                 # Custom React hooks: useCart, useMediaQuery, etc.
│   │   ├── db/                        # Astro DB / Prisma client
│   │   ├── middleware.ts              # Auth, rate limiting
│   │   └── env.d.ts                   # Env types
│   ├── astro.config.mjs
│   ├── tailwind.config.mjs
│   ├── tsconfig.json
│   ├── .env.example
│   └── package.json
│
├── backend/                           # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── routes/                    # auth.routes, product.routes, cart.routes
│   │   ├── controllers/               # auth.controller, product.controller
│   │   ├── services/                  # auth.service, product.service, payment.service
│   │   ├── middlewares/               # auth.middleware, errorHandler, validate
│   │   ├── validators/                # auth.validation, product.validation (Zod)
│   │   ├── utils/                     # jwt, hash, email, logger
│   │   ├── types/                     # express.d.ts, env.d.ts
│   │   ├── config/                    # database.ts, env.ts
│   │   ├── jobs/                      # Tareas programadas (cron): limpieza carritos, stocks, notificaciones
│   │   └── app.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── tests/
│   │   ├── integration/
│   │   └── setup.ts
│   ├── tsconfig.json
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── database/                          # PostgreSQL
│   ├── scripts/
│   │   ├── init.sql                   # Creación de DB, roles, permisos
│   │   ├── seed.sql                   # Datos de prueba
│   │   └── reset.sql                  # Reset completo
│   ├── migrations/                    # SQL migrations versionadas
│   │   └── V001__initial_schema.sql
│   └── README.md
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 3. FRONTEND

### 3.1 Stack

| Herramienta | Versión |
|---|---|---|
| Astro | 6+ |
| TypeScript | 5+ |
| Tailwind CSS | 4+ |
| pnpm | 11+ |
| TanStack Query (React Query) | 5+ |
| Zod | 3+ |
| Axios | 1+ |
| Vitest + Testing Library | latest |
| Storybook | 8+ (Astro integration) |
| @astrojs/vercel | 7+ (deploy) |

### 3.2 Rutas

| Ruta | Página | Componentes clave |
|---|---|---|
| `/` | Home | HeroSection, CategoryGrid, ProductCarousel, LogoCloud, ProcessSteps, CTASection |
| `/productos` | Catálogo general | FilterSidebar, ProductGrid, Pagination, Breadcrumb |
| `/productos/:categoria` | Por categoría | FilterSidebar, ProductGrid, Pagination, Breadcrumb |
| `/producto/:slug` | Detalle producto | ImageGallery, ProductInfo, Accordion, RelatedProducts |
| `/carrito` | Carrito | CartItemList, CartSummary, CouponInput, CheckoutButton |
| `/checkout` | Checkout | AddressForm, PaymentForm, OrderSummary, ShippingSelector |
| `/pedido/:id` | Confirmación | OrderDetails, Timeline, CTA volver |
| `/auth/login` | Login | LoginForm, SocialLoginButtons, RegisterLink |
| `/auth/register` | Registro | RegisterForm |
| `/auth/recuperar-password` | Recuperar contraseña | EmailForm, ResetForm |
| `/auth/verificar-email` | Verificar email | VerificationStatus, ResendButton |
| `/buscar` | Resultados búsqueda | SearchResults, FilterSidebar, ProductGrid, Pagination |
| `/perfil` | Mi cuenta | TabMenu: Datos / Direcciones / Pedidos |
| `/perfil/pedidos` | Historial | OrderTable, OrderStatusBadge |
| `/admin` | Admin dashboard | StatsCards, RecentOrders, Charts |
| `/admin/productos` | ABM productos | DataTable, ProductForm |
| `/admin/pedidos` | Gestionar pedidos | DataTable, OrderDetailModal |
| `/nosotros` | Nosotros | HeroSection, TeamGrid, FeatureList |
| `/contacto` | Contacto | ContactForm, MapEmbed, InfoCards |
| `/faq` | FAQ | AccordionGroup |
| `/ofertas` | Ofertas | ProductGrid con descuento, CountdownBanner |

> **Nota:** `/api/webhooks/mp` (MercadoPago) es exclusivamente backend — ver sección 4 (B-14). El frontend no expone rutas de webhook.

### 3.3 Componentes Compartidos

| Componente | Tipo | Descripción |
|---|---|---|
| `Button` | atom (.astro) | Variantes: primary, secondary, outline, ghost, danger |
| `Input` | atom (.astro) | Con label, error, icono izquierdo/derecho |
| `Badge` | atom (.astro) | Para etiquetas de descuento, stock, estado |
| `Spinner` | atom (.astro) | Loader animado |
| `Skeleton` | atom (.astro) | Skeleton loader base para cards, listas |
| `SkeletonProductGrid` | atom (.astro) | Skeleton específico para grid de productos |
| `SkeletonFilterSidebar` | atom (.astro) | Skeleton específico para filtros laterales |
| `ToastNotification` | atom (.tsx) | Notificaciones efímeras (éxito, error, info) — React island |
| `Modal` | molecule (.astro) | Modal genérico con header, body, footer |
| `SearchBar` | island (.tsx) | Input + autocomplete dropdown (interactive) |
| `ProductCard` | atom (.astro) | Imagen, nombre, precio, rating, botón comprar |
| `CategoryCard` | atom (.astro) | Imagen de categoría + nombre |
| `CartItemRow` | molecule (.astro) | Item individual en carrito |
| `Accordion` | molecule (.astro) | Item colapsable |
| `DataTable` | island (.tsx) | Tabla con sort, filtro, paginación (interactive) |
| `Pagination` | molecule (.astro) | Paginación numérica |
| `Breadcrumb` | molecule (.astro) | Migas de pan |
| `RatingStars` | island (.tsx) | Estrellas interactivas/solo lectura |
| `Header` | organism (.astro) | Logo, MegaMenu, SearchBar, CartIcon, UserMenu |
| `Footer` | organism (.astro) | 4 columnas + copyright + medios de pago |
| `MegaMenu` | island (.tsx) | Menú columnas con subcategorías, lazy loading, navegación teclado/touch |
| `HeroSection` | organism (.astro) | Título, subtítulo, CTA, fondo |
| `ProductGrid` | organism (.astro) | Grid responsivo de ProductCard |
| `FilterSidebar` | island (.tsx) | Filtros: precio, marca, rating, categoría (interactive) |
| `ImageGallery` | island (.tsx) | Galería con thumbnail selector + zoom (interactive) |
| `CheckoutForm` | island (.tsx) | Formulario multi-paso (interactive) |
| `OrderTimeline` | organism (.astro) | Timeline vertical de estados del pedido |
| `MainLayout` | layout (.astro) | Header + main + Footer |
| `AuthLayout` | layout (.astro) | Layout para auth pages |
| `AdminLayout` | layout (.astro) | Sidebar + header admin + content |

### 3.4 Stores (Nanostores)

| Store | Estado | Acciones |
|---|---|---|
| `authStore` | user, token, isAuthenticated | login, logout, register, refreshToken, updateProfile |
| `cartStore` | items, totalItems, totalPrice | addItem, removeItem, updateQuantity, clearCart, syncWithServer |
| `wishlistStore` | items, totalItems | addItem, removeItem, toggleItem, clearWishlist, syncWithServer |
| `uiStore` | isMenuOpen, isCartOpen, theme, toasts[], isLoading | toggleMenu, toggleCart, toggleTheme, addToast, removeToast, setLoading |

### 3.5 API Contract (Frontend → Backend)

| Método | Endpoint | Body / Params | Respuesta |
|---|---|---|---|
| POST | `/api/auth/register` | `{email, password, nombre, apellido}` | `{user, token}` |
| POST | `/api/auth/login` | `{email, password}` | `{user, token}` |
| POST | `/api/auth/refresh` | `{refreshToken}` | `{token}` |
| GET | `/api/productos` | `?categoria&marca&precio_min&precio_max&search&page&limit` | `{data[], total, page, totalPages}` |
| GET | `/api/productos/:slug` | - | `{product}` |
| GET | `/api/categorias` | - | `{data[]}` (árbol anidado) |
| GET | `/api/carrito` | - | `{items[], total}` |
| POST | `/api/carrito/items` | `{productoId, cantidad}` | `{cart}` |
| DELETE | `/api/carrito/items/:id` | - | `{cart}` |
| POST | `/api/pedidos` | `{direccionId, metodoPago, metodoEnvio}` | `{pedido}` |
| GET | `/api/pedidos` | - | `{data[]}` |
| GET | `/api/pedidos/:id` | - | `{pedido, items[], historial[]}` |
| GET | `/api/usuarios/perfil` | - | `{user}` |
| PUT | `/api/usuarios/perfil` | `{nombre, telefono}` | `{user}` |
| GET | `/api/usuarios/direcciones` | - | `{data[]}` |
| POST | `/api/usuarios/direcciones` | `{direccion, ciudad, ...}` | `{direccion}` |
| GET | `/api/productos/:id/resenas` | `?page&limit` | `{data[], avgRating, total}` |
| POST | `/api/productos/:id/resenas` | `{calificacion, comentario}` | `{resena}` |
| GET | `/api/favoritos` | - | `{items[], total}` |
| POST | `/api/favoritos/:productoId` | - | `{wishlist}` |
| DELETE | `/api/favoritos/:productoId` | - | `{wishlist}` |
| GET | `/api/cupones/validar` | `?codigo=` | `{valido, descuento, tipo, valor}` |
| POST | `/api/pedidos/:id/cupon` | `{codigo}` | `{pedido, descuentoAplicado}` |

### 3.6 Variables de Entorno (Frontend)

```env
PUBLIC_API_URL=http://localhost:3001/api
PUBLIC_MP_PUBLIC_KEY=TEST-xxxxx
PUBLIC_CLOUDINARY_CLOUD_NAME=xxxxx
PUBLIC_GA_MEASUREMENT_ID=G-xxxxx
```

### 3.7 Tareas del Frontend (orden de ejecución)

| # | Tarea | Depende de | Descripción |
|---|---|---|---|
| F-01 | Inicializar proyecto con Astro + TS | — | `npm create astro@latest`, configurar TypeScript estricto |
| F-02 | Configurar Tailwind CSS + tema | F-01 | `tailwind.config.mjs` con colores, fonts, dark mode, @astrojs/tailwind |
| F-03 | Configurar Layouts + Routing file-based | F-01 | Layouts .astro, páginas en src/pages/ |
| F-04 | Crear atoms: Button, Input, Badge, Spinner, Skeleton (.astro) | F-02 | Componentes base reutilizables |
| F-05 | Crear molecules: Modal, Accordion, Pagination, Breadcrumb (.astro) | F-04 | Componentes compuestos |
| F-06 | Crear Header + Logo + MegaMenu (.astro) | F-05 | Menú responsivo con categorías anidadas |
| F-07 | Crear SearchBar island (React/Preact) | F-05 | Búsqueda con debounce + dropdown (client:visible) |
| F-08 | Crear CartIcon island + UserMenu (.astro) | F-05 | Iconos de navegación con estado |
| F-09 | Crear Footer (4 columnas + pagos) (.astro) | F-05 | Links, redes, newsletter, medios de pago |
| F-10 | Crear HeroSection + CTASection + ProcessSteps (.astro) | F-04 | Secciones home reutilizables |
| F-11 | Crear CategoryCard + ProductCard + ProductGrid (.astro) | F-05 | Cards de productos y categorías |
| F-12 | Crear FilterSidebar island (React/Preact) | F-05 | Filtros: precio (range), marca (checkboxes), rating (client:visible) |
| F-13 | Crear ImageGallery island (React/Preact) | F-04 | Galería con thumbnail selector + zoom (client:visible) |
| F-14 | Crear página Home (index.astro) | F-10, F-11 | Hero + categorías + destacados + marcas + FAQ |
| F-15 | Crear página Catálogo (productos/index.astro) | F-11, F-12 | FilterSidebar + ProductGrid + Pagination |
| F-16 | Crear página Detalle Producto (producto/[slug].astro) | F-13 | Gallery + info + specs + reseñas + relacionados |
| F-17 | Configurar Nanostores: uiStore | F-03 | Tema, menú, toasts (persistente) |
| F-18 | Configurar Nanostores: cartStore | F-03 | Items, totales, persistencia localStorage |
| F-19 | Crear página Carrito (carrito.astro) | F-18, F-08 | Lista items + resumen + cupón |
| F-20 | Crear página Checkout (checkout.astro) | F-19 | Dirección → Envío → Pago → Confirmar (islands) |
| F-21 | Configurar Axios + api service | F-03 | Cliente HTTP, interceptors, tipos |
| F-22 | Configurar Nanostores: authStore | F-03 | Login/logout, token management |
| F-23 | Crear páginas Login + Register (auth/*.astro) | F-22 | Formularios con Zod validation (islands para interactividad) |
| F-24 | Conectar authStore con API | F-21, F-22 | Login real, persistencia token |
| F-25 | Conectar cartStore con API | F-21, F-18 | Sincronizar carrito local con servidor |
| F-26 | Crear páginas Perfil + Direcciones (perfil/*.astro) | F-24 | Tabs: datos personales, direcciones, pedidos |
| F-27 | Crear página Confirmación Pedido (pedido/[id].astro) | F-20 | Detalle + timeline + CTA |
| F-28 | Crear AdminLayout + DataTable island | F-06 | Sidebar admin + tabla reutilizable (client:visible) |
| F-29 | Crear panel Admin: dashboard (admin/index.astro) | F-28 | Stats + gráficos + últimos pedidos |
| F-30 | Crear panel Admin: ABM productos (admin/productos.astro) | F-28 | CRUD con formulario y tabla |
| F-31 | Crear panel Admin: gestión pedidos (admin/pedidos.astro) | F-28 | Tabla + modal detalle + cambio estado |
| F-32 | Crear página Nosotros (nosotros.astro) | F-10 | Hero + equipo + valores |
| F-33 | Crear página Contacto (contacto.astro) | F-04 | Formulario + Google Maps embed |
| F-34 | Crear página FAQ (faq.astro) | F-05 | Acordeón con preguntas frecuentes |
| F-35 | Crear página Ofertas (ofertas.astro) | F-15 | Productos con descuento + CountdownBanner |
| F-36 | Agregar estados vacío, carga y error | F-14..F-35 | Skeleton loaders, mensajes |
| F-37 | Responsive design completo | F-06, F-09, F-15 | Menú hamburguesa, grid adaptativo |
| F-38 | Modo oscuro | F-17 | Toggle + persistencia + Tailwind dark mode |
| F-39 | SEO: meta tags + Open Graph en cada página | F-14..F-35 | Astro head management, JSON-LD |
| F-40 | Storybook: documentar componentes | F-04..F-13 | Catálogo visual (Astro + React islands) |
| F-41 | Tests unitarios de componentes | F-04..F-13 | Vitest + Testing Library (Astro components) |
| F-42 | Code splitting + lazy loading islands | F-07, F-08, F-12, F-13, F-20, F-28 | client:visible, client:idle, client:media para islands |
| F-43 | Optimización de imágenes (WebP/AVIF) | F-11, F-13 | Picture element, srcset, Cloudinary/Astro assets transformaciones |
| F-44 | Native lazy loading (loading="lazy") | F-11, F-13 | Imágenes below-the-fold, LCP optimization |
| F-45 | Core Web Vitals monitoring | F-42..F-44 | web-vitals library, LCP/FID/CLS tracking |
| F-46 | Bundle analysis + tree shaking | F-01 | @astrojs/bundle-analyzer, eliminar código muerto |
| F-47 | Configurar PWA (service worker + manifest) | F-35 | Instalable como app en móvil, mejora retención |
| F-48 | Implementar MercadoPago Checkout Pro (redirección) | F-20 | Alternativa a SDK modal, flexibilidad y menor riesgo |
| F-49 | Accesibilidad transversal (aria-labels, keyboard nav, focus visible) | F-04..F-13 | Requisito legal/ético, mejora SEO y usabilidad |
| F-50 | Dashboard admin con gráficos interactivos (Chart.js / Recharts) | F-29 | Gráficos interactivos reales, no solo estáticos |
| F-51 | Crear AnnouncementBar (.astro) | F-05 | Barra promocional superior (molecule) |
| F-52 | Crear ProductCarousel island (React/Preact) | F-11 | Carrusel de productos destacados (client:visible) |
| F-53 | Crear ContactForm (.astro) | F-04 | Formulario de contacto (molecule) |
| F-54 | Crear SocialLoginButtons (.astro) | F-23 | Botones de login con redes sociales (molecule) |
| F-55 | Crear CountdownBanner (.astro) | F-11 | Banner con contador regresivo para ofertas (atom) |
| F-56 | Crear OrderTimeline (.astro) | F-27 | Timeline vertical de estados del pedido (organism) |

---

## 4. BACKEND

### 4.1 Stack

| Herramienta | Versión |
|---|---|
| Node.js | 20 LTS |
| Express | 4+ |
| TypeScript | 5+ |
| Prisma | 5+ |
| PostgreSQL | 16 |
| Redis | 7+ |
| Zod | 3+ |
| JWT (jsonwebtoken) | 9+ |
| bcrypt | 5+ |
| MercadoPago SDK | latest |
| BullMQ | 5+ |
| Jest + Supertest | latest |
| Pino (logger) | 8+ |
| cors, helmet, express-rate-limit | latest |

### 4.2 Variables de Entorno (Backend)

```env
# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/techstore

# JWT
JWT_SECRET=super-secret-key
JWT_REFRESH_SECRET=super-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# MercadoPago
MP_ACCESS_TOKEN=TEST-xxxxx
MP_PUBLIC_KEY=TEST-xxxxx
MP_WEBHOOK_SECRET=xxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=user@gmail.com
SMTP_PASS=xxxxx

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# BullMQ
BULLMQ_REDIS_URL=redis://localhost:6379
```

### 4.3 Estructura de Archivos (Backend)

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Prisma client singleton
│   │   └── env.ts               # Validación de env con Zod
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # Verify JWT, attach user to req
│   │   ├── admin.middleware.ts   # Check admin role
│   │   ├── errorHandler.ts      # Global error handler
│   │   └── validate.ts          # Zod validation middleware
│   ├── validators/
│   │   ├── auth.validation.ts   # Register, Login schemas
│   │   ├── product.validation.ts
│   │   ├── cart.validation.ts
│   │   ├── order.validation.ts
│   │   └── user.validation.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── category.service.ts
│   │   ├── cart.service.ts
│   │   ├── order.service.ts
│   │   ├── user.service.ts
│   │   ├── review.service.ts
│   │   ├── mercadopago.service.ts   # Checkout Pro, preferencias, SDK
│   │   └── webhook.service.ts       # Procesamiento webhooks MP, eventos
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── product.controller.ts
│   │   ├── category.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── order.controller.ts
│   │   ├── user.controller.ts
│   │   ├── review.controller.ts
│   │   ├── mercadopago.controller.ts
│   │   └── webhook.controller.ts
│   ├── routes/
│   │   ├── index.ts             # Route aggregator
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   ├── category.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── order.routes.ts
│   │   ├── user.routes.ts
│   │   ├── review.routes.ts
│   │   ├── mercadopago.routes.ts
│   │   └── webhook.routes.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── hash.ts
│   │   ├── logger.ts
│   │   ├── pagination.ts
│   │   └── errors.ts           # Custom error classes
│   ├── types/
│   │   ├── express.d.ts        # Extend Request with user
│   │   └── index.ts
│   └── app.ts                  # Express app setup
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── tests/
│   ├── setup.ts
│   ├── integration/
│   │   ├── auth.test.ts
│   │   ├── product.test.ts
│   │   └── order.test.ts
│   └── helpers.ts
├── Dockerfile
├── .env.example
├── tsconfig.json
├── package.json
└── jest.config.ts
```

### 4.4 Modelo de Datos (Prisma)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Rol {
  cliente
  admin
}

enum EstadoPedido {
  pendiente
  confirmado
  pagado
  en_preparacion
  enviado
  entregado
  cancelado
  reembolsado
}

model Usuario {
  id             String       @id @default(uuid()) @db.Uuid
  email          String       @unique
  passwordHash   String       @map("password_hash")
  nombre         String
  apellido       String
  telefono       String?
  avatarUrl      String?      @map("avatar_url")
  rol            Rol          @default(cliente)
  creadoEn       DateTime     @default(now()) @map("creado_en")
  actualizadoEn  DateTime     @updatedAt @map("actualizado_en")

  direcciones    Direccion[]
  pedidos        Pedido[]
  resenas        Resena[]
  carrito        Carrito?

  @@map("usuarios")
}

model Direccion {
  id            String   @id @default(uuid()) @db.Uuid
  usuarioId     String   @map("usuario_id") @db.Uuid
  alias         String   @default("Principal")
  direccion     String
  ciudad        String
  provincia     String
  codigoPostal  String   @map("codigo_postal")
  pais          String   @default("Argentina")
  esPrincipal   Boolean  @default(false) @map("es_principal")
  creadoEn      DateTime @default(now()) @map("creado_en")

  usuario       Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)

  @@map("direcciones")
}

model Categoria {
  id            String      @id @default(uuid()) @db.Uuid
  nombre        String
  slug          String      @unique
  descripcion   String?
  imagenUrl     String?     @map("imagen_url")
  padreId       String?     @map("padre_id") @db.Uuid
  activo        Boolean     @default(true)
  orden         Int         @default(0)
  creadoEn      DateTime    @default(now()) @map("creado_en")

  padre         Categoria?  @relation("CategoriaHija", fields: [padreId], references: [id], onDelete: SetNull)
  hijas         Categoria[] @relation("CategoriaHija")
  productos     Producto[]

  @@map("categorias")
}

model Producto {
  id              String         @id @default(uuid()) @db.Uuid
  categoriaId     String         @map("categoria_id") @db.Uuid
  nombre          String
  slug            String         @unique
  descripcion     String?
  precio          Decimal        @db.Decimal(12, 2)
  precioAnterior  Decimal?       @map("precio_anterior") @db.Decimal(12, 2)
  stock           Int            @default(0)
  sku             String?        @unique
  marca           String?
  pesoKg          Decimal?       @map("peso_kg") @db.Decimal(6, 2)
  activo          Boolean        @default(true)
  destacado       Boolean        @default(false)
  enOferta        Boolean        @default(false) @map("en_oferta")
  descuento       Int            @default(0)
  rating          Decimal        @default(0.0) @db.Decimal(2, 1)
  imagenes        String[]
  creadoEn        DateTime       @default(now()) @map("created_at")
  actualizadoEn   DateTime       @updatedAt @map("updated_at")

  categoria       Categoria      @relation(fields: [categoriaId], references: [id])
  especificaciones EspecificacionProducto[]
  resenas         Resena[]
  carritoItems    CarritoItem[]
  pedidoItems     PedidoItem[]

  @@map("productos")
}

model EspecificacionProducto {
  id          String   @id @default(uuid()) @db.Uuid
  productoId  String   @map("producto_id") @db.Uuid
  atributo    String
  valor       String

  producto    Producto @relation(fields: [productoId], references: [id], onDelete: Cascade)

  @@map("especificaciones_producto")
}

model Carrito {
  id             String        @id @default(uuid()) @db.Uuid
  usuarioId      String?       @unique @map("usuario_id") @db.Uuid
  tokenSesion    String?       @map("token_session")
  creadoEn       DateTime      @default(now()) @map("creado_en")
  actualizadoEn  DateTime      @updatedAt @map("actualizado_en")

  usuario        Usuario?      @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  items          CarritoItem[]

  @@map("carrito")
}

model CarritoItem {
  id              String    @id @default(uuid()) @db.Uuid
  carritoId       String    @map("carrito_id") @db.Uuid
  productoId      String    @map("producto_id") @db.Uuid
  cantidad        Int       @default(1)
  precioUnitario  Decimal   @map("precio_unitario") @db.Decimal(12, 2)

  carrito         Carrito   @relation(fields: [carritoId], references: [id], onDelete: Cascade)
  producto        Producto  @relation(fields: [productoId], references: [id])

  @@map("carrito_items")
}

model Pedido {
  id                String        @id @default(uuid()) @db.Uuid
  usuarioId         String        @map("usuario_id") @db.Uuid
  numeroPedido      String        @unique @map("numero_pedido")
  estado            EstadoPedido  @default(pendiente)
  subtotal          Decimal       @db.Decimal(12, 2)
  envioCosto        Decimal       @default(0) @map("envio_costo") @db.Decimal(10, 2)
  descuento         Decimal       @default(0) @db.Decimal(10, 2)
  total             Decimal       @db.Decimal(12, 2)
  metodoPago        String?       @map("metodo_pago")
  metodoEnvio       String?       @map("metodo_envio")
  direccionEnvioId  String?       @map("direccion_envio_id") @db.Uuid
  nota              String?
  trackingNumber    String?       @map("tracking_number")
  pagadoEn          DateTime?     @map("pagado_en")
  creadoEn          DateTime      @default(now()) @map("creado_en")
  actualizadoEn     DateTime      @updatedAt @map("actualizado_en")

  usuario           Usuario       @relation(fields: [usuarioId], references: [id])
  direccionEnvio    Direccion?    @relation(fields: [direccionEnvioId], references: [id])
  items             PedidoItem[]
  historial         PedidoHistorial[]

  @@map("pedidos")
}

model PedidoItem {
  id              String    @id @default(uuid()) @db.Uuid
  pedidoId        String    @map("pedido_id") @db.Uuid
  productoId      String    @map("producto_id") @db.Uuid
  nombreProducto  String    @map("nombre_producto")
  precioUnitario  Decimal   @map("precio_unitario") @db.Decimal(12, 2)
  cantidad        Int
  subtotal        Decimal   @db.Decimal(12, 2)

  pedido          Pedido    @relation(fields: [pedidoId], references: [id], onDelete: Cascade)
  producto        Producto  @relation(fields: [productoId], references: [id])

  @@map("pedido_items")
}

model PedidoHistorial {
  id         String        @id @default(uuid()) @db.Uuid
  pedidoId   String        @map("pedido_id") @db.Uuid
  estado     EstadoPedido
  comentario String?
  creadoEn   DateTime      @default(now()) @map("creado_en")

  pedido     Pedido        @relation(fields: [pedidoId], references: [id], onDelete: Cascade)

  @@map("pedido_historial")
}

model Resena {
  id           String   @id @default(uuid()) @db.Uuid
  productoId   String   @map("producto_id") @db.Uuid
  usuarioId    String   @map("usuario_id") @db.Uuid
  calificacion Int
  comentario   String?
  creadoEn     DateTime @default(now()) @map("creado_en")

  producto     Producto @relation(fields: [productoId], references: [id], onDelete: Cascade)
  usuario      Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)

  @@unique([productoId, usuarioId])
  @@map("resenas")
}
```

### 4.5 Tareas del Backend (orden de ejecución)

| # | Tarea | Depende de | Descripción |
|---|---|---|---|
| B-01 | Inicializar proyecto Express + TS | — | `npm init`, TypeScript, ESLint, ts-node-dev |
| B-02 | Configurar Prisma schema completo | B-01 | Modelos, relaciones, enums, índices |
| B-03 | Ejecutar migración inicial + seed | B-02 | `prisma migrate dev`, datos de prueba |
| B-04 | Configurar env.ts con Zod validation | B-01 | Validar variables de entorno al arrancar |
| B-05 | Crear utils: jwt.ts, hash.ts, errors.ts, logger.ts | B-01 | Funciones auxiliares |
| B-06 | Crear middlewares: auth, admin, errorHandler, validate | B-05 | Pipeline de middleware |
| B-07 | Crear auth.routes + auth.controller + auth.service | B-06 | Register, login, refresh, logout |
| B-08 | Crear user.routes + user.controller + user.service | B-06 | Perfil, direcciones CRUD |
| B-09 | Crear category.routes + category.controller + category.service | B-06 | CRUD + árbol anidado con CTE |
| B-10 | Crear product.routes + product.controller + product.service | B-06 | CRUD + filtros + paginación + búsqueda |
| B-11 | Crear cart.routes + cart.controller + cart.service | B-06 | CRUD items, merge carrito anónimo→usuario |
| B-12 | Crear order.routes + order.controller + order.service | B-06, B-08 | Crear pedido, historial, tracking |
| B-13 | Crear review.routes + review.controller + review.service | B-06 | Reseñas, calcular rating promedio |
| B-14 | Crear mercadopago.routes + mercadopago.controller + mercadopago.service | B-06 | Checkout Pro, preferencias, SDK |
| B-15 | Crear webhook.routes + webhook.controller + webhook.service | B-06 | Procesamiento webhooks MP, eventos |
| B-16 | Configurar Redis (sesiones, rate limiting, caché productos) | B-01 | Conexión, cliente, helpers de caché |
| B-17 | Configurar BullMQ (colas: emails, stocks, webhooks, limpieza) | B-16 | Workers, jobs, reintentos, dashboard |
| B-18 | Implementar refresh token rotation en auth.service | B-07 | Nuevo refresh token en cada uso, revocación antigua |
| B-19 | Validación de stock con optimistic locking (Prisma $transaction) | B-11 | Previene sobreventa en alta concurrencia |
| B-20 | Integrar logger (Pino) en todas las rutas | B-05 | Logging estructurado |
| B-21 | Rate limiting distribuido con Redis + CORS + helmet + compression | B-16 | Seguridad y rendimiento escalable |
| B-22 | Crear rutas admin: productos ABM, pedidos gestión | B-10, B-12 | Protegidas con admin middleware (logger y helmet ya activos) |
| B-23 | Tests de integración (auth, productos, pedidos, pagos, webhooks) | B-07..B-20 | Jest + Supertest |

---

## 5. BASE DE DATOS

### 5.1 Stack

| Herramienta | Versión |
|---|---|
| PostgreSQL | 16 |
| pgAdmin | latest (opcional) |
| Docker | 24+ |
| Flyway (opcional) | 9+ |
| Prisma Migrate | 5+ |

### 5.2 Scripts SQL

#### `database/scripts/init.sql`

```sql
-- Crear base de datos
CREATE DATABASE techstore;
CREATE USER techstore_user WITH PASSWORD 'techstore_pass';
GRANT ALL PRIVILEGES ON DATABASE techstore TO techstore_user;
```

#### `database/scripts/seed.sql`

```sql
-- Insertar categorías principales
INSERT INTO categorias (id, nombre, slug, orden) VALUES
  ('c001', 'Celulares', 'celulares', 1),
  ('c002', 'Computación', 'computacion', 2),
  ('c003', 'Audio', 'audio', 3),
  ('c004', 'TV y Video', 'tv-y-video', 4),
  ('c005', 'Gaming', 'gaming', 5);

-- Insertar subcategorías
INSERT INTO categorias (id, nombre, slug, padre_id, orden) VALUES
  ('c006', 'Smartphones', 'smartphones', 'c001', 1),
  ('c007', 'Accesorios Celulares', 'accesorios-celulares', 'c001', 2),
  ('c008', 'Notebooks', 'notebooks', 'c002', 1),
  ('c009', 'PC Escritorio', 'pc-escritorio', 'c002', 2),
  ('c010', 'Periféricos', 'perifericos', 'c002', 3),
  ('c011', 'Auriculares', 'auriculares', 'c003', 1),
  ('c012', 'Parlantes', 'parlantes', 'c003', 2),
  ('c013', 'Smart TV', 'smart-tv', 'c004', 1),
  ('c014', 'Proyectores', 'proyectores', 'c004', 2),
  ('c015', 'Consolas', 'consolas', 'c005', 1),
  ('c016', 'Accesorios Gaming', 'accesorios-gaming', 'c005', 2);
```

### 5.3 Migraciones

**Formato:** `V001__initial_schema.sql`

Contenido: todas las sentencias CREATE TABLE del modelo de datos (equivalente a lo generado por Prisma).

Migraciones adicionales planificadas:

| Archivo | Descripción |
|---|---|
| `V001__initial_schema.sql` | Creación de todas las tablas, enums, índices + índice parcial `WHERE activo = true` en productos |
| `V002__add_cupon_descuento.sql` | Tabla `cupones`: código, tipo_descuento (porcentaje/fijo), valor, usos_por_usuario, fecha_inicio, fecha_fin, activo |
| `V003__add_wishlist.sql` | Tabla `productos_favoritos` (usuario_id, producto_id, creado_en) — eficiente, sin metadatos extra |
| `V004__add_fulltext_search.sql` | Índice GIN para búsqueda full-text en productos |
| `V005__add_audit_log.sql` | Tabla `auditoria` + particionamiento de `pedidos` por rango de fechas (mensual) |

### 5.4 Tareas de Base de Datos (orden de ejecución)

| # | Tarea | Depende de | Descripción |
|---|---|---|---|
| D-01 | Instalar PostgreSQL 16 (local o Docker) | — | `docker-compose.yml` con postgres:16 |
| D-02 | Crear base de datos + usuario + permisos | D-01 | Ejecutar `database/scripts/init.sql` |
| D-03 | Ejecutar migración V001 (esquema inicial) | D-02 | Crear todas las tablas, enums, índices + índice parcial `WHERE activo = true` en productos |
| D-04 | Crear índices adicionales | D-03 | `idx_productos_categoria`, `idx_productos_precio`, `idx_pedidos_usuario`, índices GIN para full-text |
| D-05 | Poblar datos de prueba | D-03 | Ejecutar `database/scripts/seed.sql` |
| D-06 | Crear script reset.sql | D-03 | `DROP SCHEMA public CASCADE; CREATE SCHEMA public;` |
| D-07 | Configurar Prisma para apuntar a esta DB | D-01 | `DATABASE_URL` en backend/.env |
| D-08 | Verificar conectividad backend → DB | D-07 | Prisma `db push` o `db migrate` |
| D-09 | Migración V002: tabla cupones (con usos_por_usuario, fechas, tipo) | D-03 | Sistema de descuentos y promociones completo |
| D-10 | Migración V003: tabla productos_favoritos | D-03 | Wishlist eficiente (usuario_id, producto_id, creado_en) |
| D-11 | Migración V004: full-text search | D-03 | Índice GIN + triggers |
| D-12 | Migración V005: auditoría + particionamiento pedidos por fecha | D-03 | Log de cambios + partición mensual de tabla pedidos |

---

## 6. Orden Global de Ejecución

El proyecto se construye en este orden estricto:

```
FASE 1 — SETUP COMPARTIDO (Base de Datos)
  D-01   Instalar PostgreSQL (Docker)
  D-02   Crear DB + usuario + permisos
  D-03   Migración V001 (tablas + enums + índices)
  D-04   Índices adicionales (GIN, compuestos)
  D-05   Seed de datos de prueba
  D-06   Script reset.sql
  D-07   Configurar Prisma (DATABASE_URL)
  D-08   Verificar conectividad backend → DB
  D-09   Migración V002: tabla cupones
  D-10   Migración V003: tabla productos_favoritos (wishlist)
  D-11   Migración V004: full-text search (Índice GIN)
  D-12   Migración V005: auditoría + particionamiento pedidos por fecha
  D-13   Verificación migraciones en producción (rollback plan, backups, PITR)

FASE 2 — FRONTEND (Astro + Islands)
  F-01   Inicializar Astro + TS
  F-02   Configurar Tailwind + tema
  F-03   Layouts + Routing file-based
  F-04   Atoms (Button, Input, Badge, Spinner, Skeleton) .astro
  F-05   Molecules (Modal, Accordion, Pagination, Breadcrumb) .astro
  F-06   Header + Logo + MegaMenu .astro
  F-07   SearchBar island (React/Preact) client:visible
  F-08   CartIcon island + UserMenu .astro
  F-09   Footer .astro
  F-10   HeroSection + CTASection + ProcessSteps .astro
  F-11   CategoryCard + ProductCard + ProductGrid .astro
  F-12   FilterSidebar island client:visible
  F-13   ImageGallery island client:visible
  F-14   Página Home (index.astro)
  F-15   Página Catálogo (productos/index.astro)
  F-16   Página Detalle Producto (producto/[slug].astro)
  F-17   Nanostores: uiStore
  F-18   Nanostores: cartStore
  F-19   Página Carrito (carrito.astro)
  F-20   Página Checkout (checkout.astro) islands
  F-21   Axios + api service
  F-22   Nanostores: authStore
  F-23   Páginas Login + Register (auth/*.astro) islands
  F-24   Conectar authStore con API
  F-25   Conectar cartStore con API
  F-26   Páginas Perfil + Direcciones (perfil/*.astro)
  F-27   Página Confirmación Pedido (pedido/[id].astro)
  F-28   AdminLayout + DataTable island client:visible
  F-29   Admin Dashboard (admin/index.astro)
  F-30   Admin ABM Productos (admin/productos.astro)
  F-31   Admin Gestión Pedidos (admin/pedidos.astro)
  F-32   Página Nosotros (nosotros.astro)
  F-33   Página Contacto (contacto.astro)
  F-34   Página FAQ (faq.astro)
  F-35   Página Ofertas (ofertas.astro)
  F-36   Estados carga/vacío/error
  F-37   Responsive design
  F-38   Modo oscuro
  F-39   SEO (meta tags + Open Graph + JSON-LD)
  F-40   Storybook (Astro + React islands)
  F-41   Tests unitarios frontend
  F-42   Code splitting + lazy loading islands (client:visible/idle/media)
  F-43   Optimización imágenes WebP/AVIF
  F-44   Native lazy loading (loading="lazy")
  F-45   Core Web Vitals monitoring
  F-46   Bundle analysis + tree shaking
  F-47   Configurar PWA (service worker + manifest)
  F-48   Implementar MercadoPago Checkout Pro (redirección)
  F-49   Accesibilidad transversal (aria-labels, keyboard nav, focus visible, WCAG 2.1 AA)
  F-50   Dashboard admin con gráficos interactivos (Chart.js / Recharts)
  F-51   Crear AnnouncementBar .astro
  F-52   Crear ProductCarousel island client:visible
  F-53   Crear ContactForm .astro
  F-54   Crear SocialLoginButtons .astro
  F-55   Crear CountdownBanner .astro
  F-56   Crear OrderTimeline .astro

FASE 3 — BACKEND (requiere DB lista, independiente del frontend)
  B-01   Inicializar Express + TS
  B-02   Configurar Prisma schema
  B-03   Migración Prisma + seed
  B-04   Configurar env.ts (Zod)
  B-05   Utils (jwt, hash, errors, logger)
  B-06   Middlewares (auth, admin, errorHandler, validate)
  B-07   Auth routes + controller + service
  B-08   User routes + controller + service
  B-09   Category routes + controller + service
  B-10   Product routes + controller + service
  B-11   Cart routes + controller + service
  B-12   Order routes + controller + service
  B-13   Review routes + controller + service
  B-14   Payment routes + controller + service (MercadoPago)
  B-15   Webhook routes + controller + service (MercadoPago)
  B-16   Configurar Redis (sesiones, rate limiting, caché productos)
  B-17   Configurar BullMQ (colas: emails, stocks, webhooks, limpieza, notificaciones)
  B-18   Implementar refresh token rotation en auth.service
  B-19   Validación de stock con optimistic locking (Prisma $transaction)
  B-20   Integrar logger (Pino) en todas las rutas
  B-21   Rate limiting distribuido con Redis + CORS + helmet + compression
  B-22   Crear rutas admin: productos ABM, pedidos gestión
  B-23   Tests de integración (auth, productos, pedidos, pagos, webhooks)

FASE 4 — INTEGRACIÓN FINAL
  -      Prueba E2E completa (registro → catálogo → carrito → checkout → pago)
  -      Seguridad: Helmet CSP, Zod sanitization, OWASP ZAP pentest CI/CD

> ⚠️ **Deploy (manual):** Dockerfile, docker-compose, CI/CD, dominio+SSL, monitoreo — lo harás manualmente cuando el proyecto esté listo.
```

Las flechas indican dependencias fuertes. Tareas sin dependencias entre sí pueden ejecutarse en paralelo. Por ejemplo:
- `F-04` (atoms), `F-17` (uiStore) y `D-01` (PostgreSQL) son paralelizables
- `F-15` (catálogo) necesita `F-11` (cards) y `F-12` (filtros)
- `B-10` (productos) necesita `B-09` (categorías) y `B-06` (middlewares)
- `D-05` (seed) necesita `D-03` (migración)

---

## 7. Checklist Consolidado

### Base de Datos
- [ ] D-01: Instalar PostgreSQL con Docker
- [ ] D-02: Crear DB + usuario + permisos
- [ ] D-03: Migración V001 (tablas + enums + índices)
- [ ] D-04: Índices adicionales (GIN, compuestos)
- [ ] D-05: Seed de datos de prueba
- [ ] D-06: Script reset.sql
- [ ] D-07: Configurar Prisma
- [ ] D-08: Verificar conectividad
- [ ] D-09: Migración V002 (cupones)
- [ ] D-10: Migración V003 (favoritos)
- [ ] D-11: Migración V004 (full-text search)
- [ ] D-12: Migración V005 (auditoría)
- [ ] D-13: Verificación migraciones en producción (rollback plan, backups automáticos, point-in-time recovery)

### Frontend
- [ ] F-01: Inicializar proyecto Astro + TS
- [ ] F-02: Configurar Tailwind + tema (@astrojs/tailwind)
- [ ] F-03: Layouts + Routing file-based (src/pages/)
- [ ] F-04: Atoms: Button, Input, Badge, Spinner, Skeleton (.astro)
- [ ] F-05: Molecules: Modal, Accordion, Pagination, Breadcrumb (.astro)
- [ ] F-06: Header + Logo + MegaMenu (.astro)
- [ ] F-07: SearchBar island (React/Preact) client:visible
- [ ] F-08: CartIcon island + UserMenu (.astro)
- [ ] F-09: Footer (.astro)
- [ ] F-10: HeroSection + CTASection + ProcessSteps (.astro)
- [ ] F-11: CategoryCard + ProductCard + ProductGrid (.astro)
- [ ] F-12: FilterSidebar island client:visible
- [ ] F-13: ImageGallery island client:visible
- [ ] F-14: Página Home (index.astro)
- [ ] F-15: Página Catálogo (productos/index.astro)
- [ ] F-16: Página Detalle Producto (producto/[slug].astro)
- [ ] F-17: Nanostores: uiStore
- [ ] F-18: Nanostores: cartStore
- [ ] F-19: Página Carrito (carrito.astro)
- [ ] F-20: Página Checkout (checkout.astro) islands
- [ ] F-21: Axios + api service
- [ ] F-22: Nanostores: authStore
- [ ] F-23: Páginas Login + Register (auth/*.astro) islands
- [ ] F-24: Conectar authStore con API
- [ ] F-25: Conectar cartStore con API
- [ ] F-26: Páginas Perfil + Direcciones (perfil/*.astro)
- [ ] F-27: Página Confirmación Pedido (pedido/[id].astro)
- [ ] F-28: AdminLayout + DataTable island client:visible
- [ ] F-29: Admin Dashboard (admin/index.astro)
- [ ] F-30: Admin ABM Productos (admin/productos.astro)
- [ ] F-31: Admin Gestión Pedidos (admin/pedidos.astro)
- [ ] F-32: Página Nosotros (nosotros.astro)
- [ ] F-33: Página Contacto (contacto.astro)
- [ ] F-34: Página FAQ (faq.astro)
- [ ] F-35: Página Ofertas (ofertas.astro)
- [ ] F-36: Estados vacío/carga/error
- [ ] F-37: Responsive design
- [ ] F-38: Modo oscuro
- [ ] F-39: SEO (meta tags + Open Graph + JSON-LD)
- [ ] F-40: Storybook (Astro + React islands)
- [ ] F-41: Tests unitarios (Vitest)
- [ ] F-42: Code splitting + lazy loading islands (client:visible/idle/media)
- [ ] F-43: Optimización imágenes WebP/AVIF (Astro assets / Cloudinary)
- [ ] F-44: Native lazy loading (loading="lazy")
- [ ] F-45: Core Web Vitals monitoring
- [ ] F-46: Bundle analysis + tree shaking (@astrojs/bundle-analyzer)
- [ ] F-47: PWA (service worker + manifest) — instalable, offline, push
- [ ] F-48: Implementar MercadoPago Checkout Pro (redirección)
- [ ] F-49: Accesibilidad transversal (aria-labels, keyboard nav, focus visible, WCAG 2.1 AA)
- [ ] F-50: Dashboard admin con gráficos interactivos (Chart.js / Recharts)
- [ ] F-51: AnnouncementBar (barra promocional superior)
- [ ] F-52: ProductCarousel island (carrusel destacados)
- [ ] F-53: ContactForm (formulario de contacto)
- [x] F-54: SocialLoginButtons (login con redes sociales)
- [ ] F-55: CountdownBanner (banner contador ofertas)
- [ ] F-56: OrderTimeline (timeline estados pedido)

### Backend
- [ ] B-01: Inicializar Express + TS
- [ ] B-02: Configurar Prisma schema
- [ ] B-03: Migración + seed
- [ ] B-04: Configurar env.ts (Zod)
- [ ] B-05: Utils (jwt, hash, errors, logger)
- [ ] B-06: Middlewares (auth, admin, errorHandler, validate)
- [ ] B-07: Auth routes
- [ ] B-08: User routes
- [ ] B-09: Category routes
- [ ] B-10: Product routes
- [ ] B-11: Cart routes
- [ ] B-12: Order routes
- [ ] B-13: Review routes
- [ ] B-14: Payment routes (MercadoPago)
- [ ] B-15: Webhook routes (MercadoPago)
- [ ] B-16: Configurar Redis (sesiones, rate limiting, caché productos)
- [ ] B-17: Configurar BullMQ (colas: emails, stocks, webhooks, limpieza, notificaciones)
- [ ] B-18: Implementar refresh token rotation en auth.service
- [ ] B-19: Validación de stock con optimistic locking (Prisma $transaction)
- [ ] B-20: Integrar logger (Pino) en todas las rutas
- [ ] B-21: Rate limiting distribuido con Redis + CORS + helmet + compression
- [ ] B-22: Crear rutas admin: productos ABM, pedidos gestión (con logger y helmet activos)
- [ ] B-23: Tests de integración (auth, productos, pedidos, pagos, webhooks)

### Integración
- [ ] Prueba E2E: registro → catálogo → carrito → checkout → pago

> ⚠️ **Deploy (manual):** Dockerfile, docker-compose, CI/CD, dominio+SSL, monitoreo (Sentry) — pendiente, lo harás manualmente.

### Seguridad
- [ ] Helmet con CSP (Content Security Policy) configurado
- [ ] Sanitización de entradas (Zod validation en todas las rutas)
- [ ] Test de penetración automático con OWASP ZAP (CI/CD)
- [ ] Rate limiting distribuido con Redis
- [ ] Refresh token rotation + revocación
- [ ] Validación de stock con optimistic locking (previene sobreventa)
- [ ] CORS restrictivo (solo dominios permitidos)
- [ ] Headers de seguridad (HSTS, X-Frame-Options, X-Content-Type-Options)
