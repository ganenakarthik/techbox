# TechBox — Engineering & Student Project Infrastructure Platform

> **Everything for your project.**  
> Components, project kits, prototypes and documentation — delivered to your campus.

TechBox is a full-stack, production-grade ecommerce and project-building platform specifically designed for engineering and college students. Students can purchase electronic components, upload their project synopses/BOMs, auto-detect hardware requirements, configure turnkey working prototypes, order custom PCB manufacturing, 3D print custom enclosures, and receive direct campus gate and hostel delivery.

---

## Architecture Highlights

1. **Project-First Conversion Funnel**:
   - Hero Hook: *"Building a college project? Upload your project PDF, BOM or component list. We'll figure out what you need."*
   - 6-Step Value Chain: `Components → Project Kits → PCB Manufacturing → Working Prototype → Documentation → Campus Delivery`.
   - Transparent Multi-Stage BOM Analyzer: `Upload → Extract text/data → Detect BOM → Normalize component names → Match catalog → Human review → Quote` with explicit development preview badges.
2. **Campus Operational Delivery Model**:
   - Integrated university hierarchy: `College → Campus → Pickup Location → Delivery Slot`.
   - Pre-configured with major universities: SRM Institute of Science & Technology, VIT Vellore, BITS Pilani, IIT Madras, DTU Delhi.
3. **Turnkey 4-Level Build Configurator**:
   - **Level 1**: Components Only
   - **Level 2**: Project Kit + Source Code & Schematics
   - **Level 3**: Working Prototype (Assembled, soldered, flashed & bench-tested)
   - **Level 4**: Complete Turnkey Build (Prototype + Custom 2-Layer PCB + 3D Enclosure + Report & PPT)
4. **Engineering Services Hub**:
   - **PCB Manufacturing**: Gerber file upload, layer selection (1, 2, 4, 6), FR-4 parameters, and instant pricing calculation.
   - **3D Printing**: STL/STEP 3D model uploader with material (PLA, PETG, ABS, Resin) and infill density cost estimation.
   - **Working Prototypes**: 6-stage milestone tracker and consultation quotation form.
   - **Academic Documentation**: IEEE-standard project reports, viva presentation slide decks, block diagrams, and viva-voce defense packs.
5. **Admin Operations Console (`/admin`)**:
   - Real-time revenue & orders metrics
   - Product & SKU inventory management
   - Campus order dispatch & fulfillment status
   - Versioned Quotation Studio (Quote v1, v2) with itemized breakdown (components, PCB, labor, 3D printing, discount)
   - Real-time inventory ledger (Available, Reserved, Sold) with overselling protection
   - Immutable audit log trail.
6. **Canonical PostgreSQL Database Schema (`prisma/schema.prisma`)**:
   - Enums for Role, OrderStatus, PaymentGateway, PaymentStatus, ProjectStatus, QuoteStatus, BuildLevel.
   - Normalized relations: `Project` → `ProjectFile[]`, `Project` → `ProjectQuote[]`, `Order` → `OrderItem[]` with immutable point-in-time snapshots, `Order` → `PaymentTransaction[]`, and `AuditLog[]`.
7. **Abstracted Services**:
   - Payment Service with UPI, Credit/Debit Cards, NetBanking, COD, and a fully functional interactive Test Mode Sandbox.
   - Storage service abstraction for PDFs, CAD models, and Gerber archives.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Dark High-Tech Startup Theme (`#080808`, `#111111`, `#171717`, `#262626`, `#FF6A00`)
- **Icons**: Lucide React
- **Animations**: Framer Motion & Canvas Confetti
- **ORM / Database**: Prisma ORM with canonical PostgreSQL schema
- **State Management**: Centralized React Context (`AppContext`) with `localStorage` persistence.

---

## Route Sitemap

| Route | Description |
|---|---|
| `/` | Flagship Homepage with Hero Hook, Value Chain, Dropzone, and Kits |
| `/shop` | Electronic Components Catalog with category/brand/price filters |
| `/products/[slug]` | Product Detail Page with specs table, pinout tab, and delivery checker |
| `/projects` | Engineering Project Kits Catalog |
| `/projects/[slug]` | Project Kit Detail Page with interactive add-ons configurator |
| `/build` | Flagship 4-Tier "Build My Project" Configurator |
| `/services/pcb` | Rapid PCB Manufacturing Quoter (Gerber upload) |
| `/services/3d-printing` | 3D-Printed Enclosures & Brackets (STL/STEP upload) |
| `/services/prototypes` | Working Prototype Consultation & Milestones |
| `/services/documents` | College Reports, PPT Presentation Decks & Viva Prep |
| `/cart` | Full Cart Page with Free Delivery Tracker and Coupon field |
| `/checkout` | 5-Step Campus Checkout (Contact, Campus, Slot, Payment, Review) |
| `/orders/[id]` | Real-time Milestone Order Tracking & Item Snapshot |
| `/account` | Student Profile & Campus Address Management |
| `/account/orders` | Student Order History |
| `/account/wishlist` | Project Hardware Wishlist |
| `/account/support` | Student Helpdesk & Runner Coordination Tickets |
| `/admin` | Operations Hub Dashboard & KPI Overview |
| `/admin/products` | Catalog & SKU Inventory Manager |
| `/admin/orders` | Campus Order Fulfillment & Runner Dispatch |
| `/admin/projects` | Quotation Studio for Student BOM Review & Quote v1/v2 |
| `/admin/inventory` | Real-time Stock Ledger & Immutable Audit Log |
