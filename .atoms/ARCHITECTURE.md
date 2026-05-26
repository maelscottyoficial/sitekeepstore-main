# Architecture Design

## System Overview
Single-page React application rebuilding keepstore.com.br with modern tech stack for improved performance and visual elegance.

## Tech Stack
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- shadcn/ui (component library)
- Lucide React (icons)

## Module Design
| Module | Responsibility | Key Files |
|--------|---------------|-----------|
| Pages | Main page layout | src/pages/Index.tsx |
| Components | Reusable UI sections | src/components/Header.tsx, Hero.tsx, Categories.tsx, Products.tsx, PromoBanners.tsx, Benefits.tsx, Footer.tsx |
| Data | Product/category data | src/data/products.ts |

## Tech Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Routing | Single page | Original site is one-page, simpler |
| State | No state management | Static content, no complex state |
| Styling | Tailwind + shadcn | Fast, consistent, responsive |

## File Tree Plan
```
src/
├── pages/
│   └── Index.tsx
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Categories.tsx
│   ├── ProductGrid.tsx
│   ├── PromoBanners.tsx
│   ├── Benefits.tsx
│   └── Footer.tsx
├── data/
│   └── products.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Implementation Guide
1. Create data file with products, categories
2. Build components from top to bottom (Header → Footer)
3. Assemble in Index.tsx
4. Style with dark theme, gradients, smooth animations