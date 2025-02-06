# 🐾 Pawfect Match

A sophisticated web application designed to streamline pet adoption through modern web technologies and intuitive user experience.

## Overview

Pawfect Match is a React-based single-page application (SPA) that facilitates pet discovery and adoption matching. The application implements a feature-first architecture following [Bulletproof React](https://github.com/alan2207/bulletproof-react) principles for scalability and maintainability.

## Key Features

- Advanced search system with dynamic filtering and sorting
- State-managed favorite system with persistent storage
- Intelligent matching algorithm for pet recommendations
- Theme system with system preference detection
- Modern, responsive UI with fluid animations
- Secure authentication implementation
- Virtualized infinite scrolling
- Interactive matching system with animation sequences

## Tech Stack

- **Core**: React 18 with TypeScript
- **Routing**: React Router v6 with client-side navigation
- **State Management**:
  - Zustand for global application state
  - React Query for server state management
- **UI/UX**:
  - Tailwind CSS for utility-first styling
  - shadcn/ui for component architecture
- **Performance**: Canvas-based animations
- **Build System**: Vite

## Dependencies

- `@tanstack/react-query`: Advanced server state management
- `zustand`: Atomic state management system
- `react-router-dom`: Client-side routing
- `tailwindcss`: CSS utility framework
- `shadcn/ui`: Component system with Radix UI primitives
- `lucide-react`: Vector icon system
- `zod`: TypeScript-first schema validation
- `canvas-confetti`: Performance-optimized animations

## Project Structure

```
src/
├── components/     # Reusable UI components
├── features/       # Feature-based modules
├── hooks/          # Custom React hooks
├── providers/      # Context providers
├── stores/         # State management
├── types/          # TypeScript definitions
├── lib/            # Utility functions
├── routes/         # Route configurations
└── config/         # Application constants
```

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pawfect-match.git
```

2. Navigate to project directory:

```bash
cd pawfect-match
```

3. Install dependencies:

```bash
npm install
```

4. Start development server:

```bash
npm run dev
```

## Technical Architecture

### Component Architecture

- **Atomic Design Implementation**:
  - Shared UI components built on shadcn/ui primitives
  - Feature-specific components with isolated logic
  - Composable layout system (MainLayout, AuthLayout)
  - Context-aware Floating Action Button
  - Responsive grid system with dynamic columns

### State Management

- **Zustand Store Design**:
  - Authentication state with persistence
  - Favorites management with local storage
  - Optimistic updates for UI interactions
- **React Query Implementation**:
  - Configurable retry logic (max 2 retries)
  - Automatic background refetching
  - Infinite scrolling query optimization
  - Request deduplication and caching
  - Stale-while-revalidate strategy

### Animation System

- **Performance-Optimized Animations**:
  - Custom match animation sequence using React's useEffect
  - Canvas-based confetti celebrations
  - Component-level animation isolation
  - Optimized re-rendering strategies
  - Smooth transitions between states

### Route Protection

- **Security Implementation**:
  - Authentication-based route guards
  - Type-safe route parameters
  - State preservation through navigation
  - Deep linking support
  - Protected route redirection

### Location Services

- **Geolocation Features**:
  - Radius-based pet search
  - ZIP code proximity calculation
  - Dynamic location suggestions
  - Bounding box calculations
  - Nearby pets functionality

## Core Features

### Search System

- Advanced filtering with multiple parameters
- Dynamic breed selection
- Age-based filtering (puppy, adult, senior)
- Location-based search with radius support
- Sort options with persistence

### Matching System

- Favorite-based matching algorithm
- Interactive animation sequence
- Match history tracking
- Celebration animations
- State-preserved navigation

### Theme System

- System preference detection
- Runtime theme switching
- Persistent theme selection
- CSS variable-based styling
- Consistent dark/light modes

## Architecture Decisions

- **Feature-First Architecture**: Modular organization following domain-driven design principles
- **Component Architecture**: Composition-based design with atomic components
- **State Management Strategy**:
  - Zustand for lightweight, atomic global state
  - React Query for robust server state caching
- **Type Safety**: Comprehensive TypeScript implementation
- **Performance Optimizations**:
  - Route-based code splitting
  - Virtualized list rendering
  - Optimistic UI updates

## API Integration

Integration with the Fetch API (frontend-take-home.fetch.com) implements:

- RESTful pet resource management
- Favorite state synchronization
- Match generation algorithms

Implementation features:

- Configurable retry logic
- Intelligent request caching
- Type-safe response handling
- Comprehensive error management

## Enhanced Features

- Sophisticated matching animation system
- Responsive design implementation
- ARIA-compliant accessibility
- Comprehensive loading state management
- Location-based search functionality
- Smart filtering system (age-based, proximity)
- Dynamic sort implementations
- Persistent user preferences
- State-preserved navigation

## Personal Investment

As an active shelter volunteer and foster dog parent, this project merges technical expertise with real-world adoption experience. The user experience - from the playful matching animations to the thoughtful filtering system - was shaped by understanding what matters most in the adoption journey.

Every feature was built with one goal in mind: helping more furry friends find their furever homes. 🐾

## Requirements Implementation

Based on the [Fetch Frontend Take-home Exercise](https://frontend-take-home.fetch.com/):

- Secure authentication system
- Advanced search functionality with filtering
- Favorite management system
- Match generation algorithm
- Responsive design architecture
- Error handling system
- Loading state management
- TypeScript implementation
