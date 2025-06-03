
# StampIt - Digital Loyalty Rewards Platform

## Overview

StampIt is a modern digital loyalty rewards platform that replaces traditional physical stamp cards with a seamless digital experience. Built for businesses of all sizes, it helps strengthen customer relationships through an intuitive stamp-based reward system.

## 🚀 Live Demo

**URL**: https://lovable.dev/projects/1d65f560-ac25-4ca6-acae-06a8e0811ef5

## ✨ Features

### For Customers
- **Digital Loyalty Cards**: Replace physical stamp cards with secure digital tracking
- **Real-time Stamp Collection**: Collect stamps instantly when visiting participating businesses
- **Reward Tracking**: View progress toward rewards and available points
- **Reward Redemption**: Redeem earned rewards directly through the app
- **Visit History**: Track all visits and rewards across multiple businesses
- **Profile Management**: Manage personal information and preferences

### For Businesses
- **Customer Management**: Track customer visits, stamps, and reward progress
- **Reward Creation**: Create and manage custom rewards and stamp requirements
- **Analytics Dashboard**: View customer insights, visit patterns, and business metrics
- **Stamp Issuance**: Easily add stamps to customer accounts
- **Business Profile**: Manage business information and settings
- **Customer Export**: Export customer data for marketing and analysis

### Security & Performance
- **Automatic Session Management**: 10-minute idle timeout for security
- **Auto-logout on Updates**: Fresh state testing with automatic logout on app updates
- **Row Level Security**: Secure data access with Supabase RLS policies
- **Real-time Updates**: Live data synchronization across all devices
- **Error Recovery**: Graceful error handling with automatic redirects

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Supabase (PostgreSQL database, authentication, real-time subscriptions)
- **State Management**: TanStack React Query
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: Sonner toasts

## 📱 User Roles

### Customer Account
- Sign up with email/password
- Collect stamps from participating businesses
- View loyalty progress and rewards
- Redeem available rewards
- Track visit history

### Business Account
- Register business with profile information
- Manage customer relationships
- Create and configure reward programs
- Issue stamps to customers
- Access analytics and insights
- Export customer data

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Environment Setup

The project is pre-configured with Supabase integration. No additional environment variables are required for basic functionality.

## 📊 Database Schema

### Core Tables
- **profiles**: User accounts and role management
- **customer_profiles**: Extended customer information
- **business_profiles**: Business details and settings
- **visits**: Customer visit tracking
- **stamps**: Digital stamp records
- **rewards**: Reward definitions and redemptions

### Security
- Row Level Security (RLS) enabled on all tables
- User-specific data access controls
- Secure authentication via Supabase Auth

## 🎯 Usage Examples

### Customer Workflow
1. Sign up for a customer account
2. Visit participating businesses
3. Receive stamps from business staff
4. Track progress toward rewards
5. Redeem rewards when available

### Business Workflow
1. Register as a business account
2. Set up business profile and reward structure
3. Issue stamps to visiting customers
4. Monitor customer analytics
5. Manage reward programs

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── auth/           # Authentication components
│   ├── business/       # Business dashboard components
│   └── customer/       # Customer dashboard components
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── integrations/       # External service integrations
└── lib/                # Utility functions
```

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Component-based architecture
- Custom hooks for business logic

## 🚀 Deployment

### Via Lovable Platform
1. Open project in Lovable editor
2. Click "Publish" button in top right
3. Your app will be deployed automatically

### Custom Domain
1. Navigate to Project > Settings > Domains in Lovable
2. Click "Connect Domain"
3. Follow the setup instructions
4. Requires a paid Lovable plan

## 🔒 Security Features

- **Authentication**: Email/password via Supabase Auth
- **Authorization**: Role-based access control
- **Data Security**: Row Level Security policies
- **Session Management**: Automatic timeout and cleanup
- **HTTPS**: All traffic encrypted in production

## 📈 Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Query Caching**: Efficient data fetching with React Query
- **Optimistic Updates**: Instant UI feedback
- **Error Boundaries**: Graceful error recovery

## 🤝 Contributing

This project is built with Lovable, an AI-powered development platform. Changes can be made through:

1. **Lovable Editor**: Direct prompting and visual editing
2. **GitHub Integration**: Traditional git workflow
3. **GitHub Codespaces**: Cloud-based development

### Making Changes via Lovable
1. Visit the [Lovable Project](https://lovable.dev/projects/1d65f560-ac25-4ca6-acae-06a8e0811ef5)
2. Use natural language prompts to request changes
3. Changes are committed automatically

### Making Changes via Git
1. Clone the repository
2. Make your changes
3. Push to GitHub
4. Changes will sync with Lovable

## 📞 Support

- **Documentation**: [Lovable Docs](https://docs.lovable.dev/)
- **Community**: [Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)
- **Tutorials**: [YouTube Playlist](https://www.youtube.com/watch?v=9KHLTZaJcR8&list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO)

## 📄 License

This project is open source and available under the MIT License.

## 🎨 Design System

Built with modern design principles:
- **Color Palette**: Purple and amber gradient theme
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent spacing scale
- **Components**: Accessible, reusable UI components
- **Responsive**: Mobile-first design approach

---

**Built with ❤️ using Lovable - The AI-powered web development platform**
