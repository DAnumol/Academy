# Academy Admin Dashboard

A production-ready React admin dashboard with enterprise-grade security, animations, and modern architecture featuring advanced HOCs, comprehensive state management, and performance optimizations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd enterprise-admin-dashboard

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start development server
npm run dev
```

### Default Login Credentials
- **Email**: Any valid email format
- **Password**: Any password (minimum 6 characters)

## 📁 Project Architecture

```
src/
├── components/
│   ├── animations/          # GSAP & Framer Motion components
│   │   ├── FloatingElements.jsx
│   │   ├── PageTransition.jsx
│   │   └── ParticleBackground.jsx
│   ├── charts/             # Recharts components
│   │   ├── AreaChart.jsx
│   │   ├── BarChart.jsx
│   │   └── PieChart.jsx
│   ├── common/             # Shared utilities
│   │   ├── EnterpriseWrapper.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── LoadingSpinner.jsx
│   ├── hoc/               # Higher-Order Components
│   │   ├── withAnalytics.jsx
│   │   ├── withAuth.jsx
│   │   ├── withCache.jsx
│   │   ├── withCompliance.jsx
│   │   ├── withEnterpriseFeatures.jsx
│   │   ├── withErrorBoundary.jsx
│   │   ├── withFeatureFlag.jsx
│   │   ├── withGlobalErrorHandler.jsx
│   │   ├── withInternationalization.jsx
│   │   ├── withLoading.jsx
│   │   ├── withPerformanceMonitor.jsx
│   │   ├── withPermissions.jsx
│   │   ├── withRetry.jsx
│   │   ├── withTheme.jsx
│   │   └── withValidation.jsx
│   ├── layout/            # Layout components
│   │   ├── Breadcrumbs.jsx
│   │   ├── DashboardLayout.jsx
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   └── ui/               # Reusable UI components
│       ├── AdvancedFilter.jsx
│       ├── BottomSheet.jsx
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── GenericDataTable.jsx
│       ├── GenericFormModal.jsx
│       ├── ResponsiveFormModal.jsx
│       ├── VirtualScrollList.jsx
│       └── VirtualTable.jsx
├── config/               # Configuration files
│   ├── app.js           # Main app configuration
│   ├── enterprise.js    # Enterprise settings
│   ├── formConfigs.js   # Form configurations
│   ├── performance.js   # Performance settings
│   └── tableConfigs.js  # Table configurations
├── context/             # React Context providers
│   ├── AccessibilityProvider.jsx
│   ├── AnalyticsProvider.jsx
│   ├── ErrorReportingProvider.jsx
│   ├── LoadingContext.jsx
│   └── NotificationProvider.jsx
├── features/            # Feature modules
│   ├── analytics/       # Analytics dashboard
│   ├── auth/           # Authentication
│   ├── dashboard/      # Main dashboard
│   ├── profile/        # User profile
│   ├── settings/       # Application settings
│   ├── tasks/          # Task management
│   └── users/          # User management
├── hooks/              # Custom React hooks
│   ├── useAnimations.js
│   ├── useApi.js
│   ├── useAuth.js
│   ├── useCompliance.js
│   ├── useEnterprise.js
│   ├── useFeatureFlags.js
│   ├── useGenericCRUD.js
│   ├── useSecureAuth.js
│   └── useTheme.js
├── middleware/         # Application middleware
│   ├── authMiddleware.js
│   └── securityMiddleware.js
├── services/          # API and external services
│   ├── apiClient.js
│   ├── apmService.js
│   ├── authService.js
│   ├── complianceService.js
│   ├── errorService.js
│   ├── loggerService.js
│   ├── securityService.js
│   └── userService.js
├── store/            # Zustand state management
│   ├── authStore.js
│   ├── cacheStore.js
│   ├── themeStore.js
│   └── uiStore.js
├── styles/           # Global styles
│   ├── accessibility.css
│   └── index.css
└── utils/           # Utility functions
    ├── cn.js
    ├── constants.js
    ├── csrfProtection.js
    ├── enterpriseOptimizations.js
    ├── sanitization.js
    ├── security.js
    └── toast.js
```

## 🛠 Technology Stack

### Core Technologies
- **React 18** - Latest React with concurrent features
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **TanStack Query** - Server state management
- **Zustand** - Client state management

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **GSAP** - Advanced animations
- **Lucide React** - Icon library

### Development Tools
- **ESLint** - Code linting with security rules
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Vitest** - Testing framework
- **TypeScript Support** - Type definitions included

## ⚙️ Configuration

### Environment Variables

```env
# Application
VITE_APP_NAME=Academy Admin Dashboard
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development

# API Configuration
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_API_TIMEOUT=30000
VITE_API_RETRY_ATTEMPTS=3

# Security
VITE_ENABLE_CSRF=true
VITE_SESSION_TIMEOUT=1800000
VITE_MAX_LOGIN_ATTEMPTS=5

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false
VITE_ENABLE_PERFORMANCE_MONITORING=false
VITE_ENABLE_DARK_MODE=true

# UI Configuration
VITE_DEFAULT_THEME=system
VITE_ENABLE_ANIMATIONS=true
VITE_SIDEBAR_COLLAPSED=false

# Performance
VITE_ENABLE_LAZY_LOADING=true
VITE_ENABLE_CODE_SPLITTING=true
VITE_CACHE_TIMEOUT=300000
```

### Vite Configuration

The project uses advanced Vite configuration with:
- Path aliases for clean imports
- Manual chunk splitting for optimal loading
- Terser minification with console removal
- Development server on port 3000

### Tailwind Configuration

Custom theme with:
- Extended color palette (primary, secondary, accent, dark)
- Custom animations and keyframes
- Inter font family
- Dark mode support

## 🎨 Features

### Authentication System
- Mock authentication with any email/password
- Social login simulation
- JWT token management
- Protected routes with HOC
- Role-based permissions

### Advanced UI Components
- **GenericDataTable** - Virtualized tables with sorting/filtering
- **ResponsiveFormModal** - Adaptive desktop/mobile modals
- **BottomSheet** - Mobile-native modal experience
- **VirtualScrollList** - Performance-optimized lists
- **AdvancedFilter** - Complex filtering interface

### Animation System
- **PageTransition** - Smooth page transitions
- **FloatingElements** - Ambient UI animations
- **ParticleBackground** - Interactive particle system
- **GSAP Integration** - Advanced animation capabilities

### State Management
- **Auth Store** - User authentication state
- **UI Store** - Application UI state
- **Theme Store** - Theme and appearance
- **Cache Store** - Data caching layer

### Enterprise Features
- **HOC Pattern** - 14 different higher-order components
- **Error Boundaries** - Comprehensive error handling
- **Performance Monitoring** - Core Web Vitals tracking
- **Security Middleware** - CSRF protection and sanitization
- **Compliance Tools** - Enterprise compliance features

## 🔒 Security Features

### Built-in Security
- CSRF protection
- Input sanitization with DOMPurify
- XSS prevention
- Secure authentication flow
- Session timeout management
- Rate limiting simulation

### Security Services
- `securityService.js` - Core security utilities
- `csrfProtection.js` - CSRF token management
- `sanitization.js` - Input sanitization
- Security-focused ESLint rules

## 📱 Responsive Design

### Mobile Optimization
- Touch-optimized components
- Responsive modals (desktop/mobile variants)
- Mobile-first design approach
- Gesture support with Framer Motion

### Accessibility
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- High contrast mode
- Reduced motion support

## 🚀 Development Workflow

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format with Prettier
npm run format:check    # Check formatting

# Testing
npm test               # Run tests
npm run test:ui        # Run tests with UI
npm run test:coverage  # Generate coverage report

# Analysis
npm run analyze        # Bundle analysis
npm run security:audit # Security audit
npm run security:fix   # Fix security issues
```

### Git Hooks
- Pre-commit: Runs linting and formatting
- Husky integration for consistent code quality

## 🎯 Customization Guide

### Adding New Pages

1. **Create page component**:
```jsx
// src/features/[feature]/pages/NewPage.jsx
import { motion } from 'framer-motion'

const NewPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1>New Page</h1>
    </motion.div>
  )
}

export default NewPage
```

2. **Add route in App.jsx**:
```jsx
const NewPage = lazy(() => import('@features/[feature]/pages/NewPage'))

// Add to routes
<Route path="/new-page" element={<PageTransition><NewPage /></PageTransition>} />
```

3. **Update navigation in Sidebar.jsx**

### Creating Custom HOCs

```jsx
// src/components/hoc/withCustomFeature.jsx
import { useEffect } from 'react'

const withCustomFeature = (WrappedComponent) => {
  return function WithCustomFeatureComponent(props) {
    useEffect(() => {
      // Custom logic here
    }, [])

    return <WrappedComponent {...props} />
  }
}

export default withCustomFeature
```

### Adding New Services

```jsx
// src/services/customService.js
import { apiClient } from './apiClient'

export const customService = {
  getData: async () => {
    const response = await apiClient.get('/custom-endpoint')
    return response.data
  },
  
  postData: async (data) => {
    const response = await apiClient.post('/custom-endpoint', data)
    return response.data
  }
}
```

## 🧪 Testing

### Test Structure
```
src/test/
├── integration/        # Integration tests
│   └── auth.test.jsx
├── setup.js           # Test setup
└── __tests__/         # Component tests
    └── Button.test.jsx
```

### Running Tests
```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm run test:coverage

# UI mode
npm run test:ui
```

## 📊 Performance Optimization

### Built-in Optimizations
- Lazy loading with React.lazy()
- Code splitting by feature
- Virtual scrolling for large lists
- Image optimization utilities
- Bundle analysis tools
- Core Web Vitals monitoring

### Performance Monitoring
```jsx
// Automatic performance tracking
import { enterpriseOptimizations } from '@utils/enterpriseOptimizations'

// Measure Core Web Vitals
enterpriseOptimizations.performance.measureCoreWebVitals()

// Memory pressure detection
enterpriseOptimizations.performance.detectMemoryPressure()
```

## 🌐 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options

#### Vercel
```bash
npm i -g vercel
vercel --prod
```

#### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔧 API Integration

### Replace Mock Data

1. **Update API client**:
```jsx
// src/services/apiClient.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})
```

2. **Update auth store**:
```jsx
// src/store/authStore.js
login: async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials)
  return response.data
}
```

3. **Configure environment**:
```env
VITE_API_BASE_URL=https://your-production-api.com
VITE_ENABLE_MOCK_DATA=false
```

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Import Path Issues**
- Check Vite path aliases in `vite.config.js`
- Verify file extensions (.jsx vs .js)

**Animation Issues**
- Ensure Framer Motion and GSAP versions are compatible
- Check for conflicting CSS animations

**Performance Issues**
```bash
# Analyze bundle size
npm run analyze

# Check for memory leaks
npm run test:coverage
```

## 📚 Learning Resources

### Key Concepts Used
- **HOC Pattern** - Higher-order components for cross-cutting concerns
- **Compound Components** - Complex UI component patterns
- **Custom Hooks** - Reusable stateful logic
- **Context Providers** - Global state management
- **Error Boundaries** - Error handling and recovery
- **Lazy Loading** - Performance optimization
- **Virtual Scrolling** - Large dataset handling

### Documentation Links
- [React 18 Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TanStack Query](https://tanstack.com/query/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes following the established patterns
4. Run tests: `npm test`
5. Commit with conventional commits
6. Push and create Pull Request

### Code Standards
- Follow ESLint configuration
- Use Prettier for formatting
- Write tests for new features
- Update documentation
- Follow HOC patterns for cross-cutting concerns

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

### Getting Help
1. Check this comprehensive README
2. Review component documentation in code
3. Check browser console for errors
4. Review test files for usage examples
5. Create GitHub issue with detailed description

### Key Commands Reference
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build
npm test             # Run tests
npm run lint         # Code quality check
npm run format       # Code formatting
npm run analyze      # Bundle analysis
```

---

**🎉 Ready to build enterprise-grade React applications!**

*This template provides a complete foundation for modern React applications with enterprise-level architecture, security, performance, and developer experience.*