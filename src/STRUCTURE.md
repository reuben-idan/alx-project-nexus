# Everything Grocery - Source Code Structure

This document outlines the recommended folder structure for the Everything Grocery React application, following modern best practices for scalability and maintainability.

## 📂 Project Structure

```
src/
├── app/                    # Main application logic
│   ├── App.tsx            # Root app component
│   └── main.tsx           # Application entry point
│
├── components/            # Reusable UI components
│   ├── common/            # Generic, app-wide components
│   ├── layout/            # Layout-specific components (navbar, footer)
│   └── ui/                # Basic UI primitives (buttons, inputs)
│
├── features/              # Domain-specific feature components
│   ├── auth/              # Authentication components
│   ├── cart/              # Shopping cart functionality
│   ├── products/          # Product browsing and management
│   ├── orders/            # Order history and management
│   ├── checkout/          # Checkout and payment processing
│   └── profile/           # User profile and account settings
│
├── pages/                 # Page components (route-based)
│   ├── HomePage.tsx       # Landing/home page
│   ├── ProductsPage.tsx   # Products listing page
│   ├── ProductDetailPage.tsx # Individual product page
│   ├── CartPage.tsx       # Shopping cart page
│   ├── CheckoutPage.tsx   # Checkout process page
│   ├── ProfilePage.tsx    # User profile page
│   ├── OrdersPage.tsx     # Order history page
│   ├── AuthPage.tsx       # Authentication page
│   └── NotFoundPage.tsx   # 404 error page
│
├── context/               # React context providers
│   └── ThemeContext.tsx   # Global theme management
│
├── hooks/                 # Custom React hooks
│   └── useAuth.ts         # Authentication hook
│
├── lib/                   # Utility libraries and configurations
│   └── constants.ts       # Application constants
│
├── services/              # API services and external integrations
│   └── api.ts             # API service layer
│
├── store/                 # Redux store and state management
│   ├── slices/            # Redux slices
│   └── index.ts           # Store configuration
│
├── styles/                # Global styles and theme
│   └── globals.css        # Global CSS with Tailwind
│
├── types/                 # TypeScript type definitions
│   └── index.ts           # Central type exports
│
├── utils/                 # Utility functions
│   └── helpers.ts         # General helper functions
│
├── assets/                # Static assets
│   ├── images/            # Image files
│   └── icons/             # Icon files
│
└── tests/                 # Testing files
    └── README.md          # Testing documentation
```

## 🎯 Key Principles

### 1. **Feature-Based Architecture**
- Features are organized by business domain
- Each feature is self-contained and can be developed/tested independently
- Clear separation of concerns between different features

### 2. **Component Organization**
- **components/ui/** - Reusable UI primitives (buttons, inputs, modals)
- **components/layout/** - Layout-specific components (header, footer, sidebar)
- **components/common/** - Generic components used across features
- **features/** - Domain-specific components with business logic

### 3. **Separation of Concerns**
- **pages/** - Route-based page components (presentation)
- **components/** - Reusable UI components (presentation)
- **features/** - Feature-specific logic and components
- **services/** - External API calls and business logic
- **store/** - Global state management

### 4. **Developer Experience**
- Clear folder structure makes code easy to find
- Consistent naming conventions
- Proper TypeScript typing
- Well-documented components

## 🔄 Migration Status

✅ **Completed:**
- Products feature directory structure
- Basic directory structure created
- README documentation

🔄 **In Progress:**
- Moving remaining components to appropriate features
- Updating import statements
- Creating index files for clean exports

📋 **Planned:**
- Move auth components to features/auth
- Move cart components to features/cart
- Move order components to features/orders
- Move checkout components to features/checkout
- Move profile components to features/profile
- Update all import statements
- Create comprehensive documentation

## 🚀 Benefits of This Structure

1. **Scalability** - Easy to add new features
2. **Maintainability** - Clear organization makes code easier to maintain
3. **Developer Experience** - Faster navigation and understanding
4. **Testing** - Features can be tested independently
5. **Code Reuse** - Components are properly organized for reuse
6. **Team Collaboration** - Clear structure reduces conflicts

## 📝 Guidelines

### Adding New Features
1. Create a new directory in `src/features/`
2. Add feature-specific components
3. Include tests for the feature
4. Update this documentation

### Adding New Components
1. Determine if it's feature-specific or generic
2. Place in appropriate directory
3. Follow naming conventions
4. Add proper TypeScript types
5. Include component documentation

### File Naming Conventions
- Use PascalCase for React components
- Use camelCase for utility functions
- Use kebab-case for file names when appropriate
- Include `.test.tsx` for test files
- Include `.types.ts` for type definitions
