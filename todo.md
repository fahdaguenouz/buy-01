global structure 

buy-01-ecosystem/
├── .env                        # Global environment variables
├── docker-compose.yml          # Spins up Kafka, MongoDB, Eureka, Services
├── setup.sh                    # Automation script to init databases/folders
├── README.md                   # Comprehensive documentation
│
├── frontend/                   # Angular 16+ Application
│   ├── src/
│   ├── package.json
│   └── angular.json
│
└── backend/                    # Spring Boot Microservices
    ├── discovery-server/       # Netflix Eureka
    ├── api-gateway/            # Spring Cloud Gateway
    ├── user-service/           # Port 8081: Auth, Roles, JWT
    ├── product-service/        # Port 8082: Products CRUD
    └── media-service/          # Port 8083: Image upload/validation


fron structure 
frontend/src/app/
├── core/                   # Singleton services, interceptors, guards
│   ├── guards/             # AuthGuard, RoleGuard (CLIENT vs SELLER)
│   ├── interceptors/       # JwtInterceptor, ErrorInterceptor
│   └── services/           # AuthService, TokenStorageService
│
├── shared/                 # Reusable UI components, pipes, Material modules
│   ├── components/         # e.g., Navbar, Footer, Snackbar wrappers
│   └── models/             # TypeScript interfaces (Product, User)
│
├── features/               # Lazy-loaded feature modules
│   ├── auth/               # Login & Register components
│   ├── public/             # Public product listing grid
│   └── seller/             # Seller dashboard
│       ├── product-manage/ # CRUD forms for products
│       └── media-manage/   # File upload UI (checking 2MB size locally)
│
├── app-routing.module.ts   # Main route definitions
└── app.component.ts        # Root component



| Event            | Producer        | Consumer(s)                                       | Why It Matters                                                |
| ---------------- | --------------- | ------------------------------------------------- | ------------------------------------------------------------- |
| `ProductCreated` | Product Service | Audit Service, Search Index, Notification Service | Core business event; enables audit trail and search indexing  |
| `ProductUpdated` | Product Service | Audit Service, Cache Invalidation                 | Tracks changes for compliance; clears stale cache             |
| `ImageUploaded`  | Media Service   | Thumbnail Generator, CDN Warmer, Audit            | Triggers async processing (resizing, CDN push)                |
| `UserRegistered` | User Service    | Welcome Email, Analytics                          | Onboarding flow; business metrics                             |
| `ProductDeleted` | Product Service | Media Service, Audit Service                      | **You have this** — cleanup + audit                           |


| Criterion                          | Your Current State      | What's Needed                                                           |
| ---------------------------------- | ----------------------- | ----------------------------------------------------------------------- |
| Kafka used for async communication | ✅ Barely (1 event)      | Add 2-3 more core events                                                |
| Audit trail                        | ❌ Missing               | Add `ProductCreated`, `ProductUpdated`, `ProductDeleted` to audit topic |
| Cache invalidation                 | ❌ Missing               | Add `ProductUpdated` consumer to clear Redis/cache                      |
| Thumbnail generation               | ❌ Missing               | Add `ImageUploaded` consumer                                            |
| Event schema design                | ❌ Basic (just filename) | Add metadata (eventId, timestamp, correlationId, source)                |
