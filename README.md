# Library Management System

A modern, full-featured library management web application built with Angular 18 and Angular Material. This system provides separate interfaces for librarians and students to manage books, track borrowing, and handle library operations efficiently.

## 🚀 Features

### For Librarians
- **Dashboard**: Overview of library statistics and recent activities
- **Book Management**: Add, edit, and manage book inventory
- **Student Management**: Register and manage student accounts
- **Book Issuance**: Issue books to students with due date tracking
- **Book Returns**: Process book returns and manage overdue items
- **Notifications**: Send and manage notifications to students
- **Settings**: Configure system settings and user preferences

### For Students
- **Dashboard**: Personal library overview and recent activities
- **Book Search**: Search and browse available books
- **Issued Books**: View currently borrowed books and due dates
- **Profile Management**: Update personal information
- **Notifications**: Receive and view library notifications

### Authentication & Security
- **JWT-based Authentication**: Secure login/logout functionality
- **Role-based Access Control**: Separate interfaces for librarians and students
- **Password Management**: Forgot password and reset functionality
- **Route Guards**: Protected routes based on user roles

## 🛠️ Technology Stack

- **Frontend Framework**: Angular 18
- **UI Components**: Angular Material
- **Authentication**: JWT (JSON Web Tokens)
- **Routing**: Angular Router with Guards
- **State Management**: RxJS Observables
- **Styling**: SCSS
- **Testing**: Jasmine & Karma

## 📁 Project Structure

```
LibraryManagement.WEB/
├── src/
│   ├── app/
│   │   ├── auth/                          # Authentication Module
│   │   │   ├── auth.guard.ts             # Route protection guard
│   │   │   ├── auth.service.ts           # Authentication service
│   │   │   ├── login/                    # Login component
│   │   │   ├── register/                 # Registration component
│   │   │   ├── forgot-password/          # Password recovery
│   │   │   └── reset-password/           # Password reset
│   │   │
│   │   ├── librarian/                    # Librarian Module
│   │   │   ├── dashboard/                # Librarian dashboard
│   │   │   ├── manage-books/             # Book management interface
│   │   │   ├── add-book/                 # Add new books
│   │   │   ├── edit-book/                # Edit existing books
│   │   │   ├── manage-students/          # Student management
│   │   │   ├── add-student/              # Add new students
│   │   │   ├── issue-book/               # Book issuance
│   │   │   ├── return-book/              # Book returns
│   │   │   ├── notifications/            # Notification management
│   │   │   └── settings/                 # System settings
│   │   │
│   │   ├── student/                      # Student Module
│   │   │   ├── dashboard/                # Student dashboard
│   │   │   ├── search-books/             # Book search interface
│   │   │   ├── issued-books/             # View borrowed books
│   │   │   ├── profile/                  # Profile management
│   │   │   └── notifications/            # Student notifications
│   │   │
│   │   ├── shared/                       # Shared Resources
│   │   │   ├── components/               # Reusable UI components
│   │   │   ├── models/                   # TypeScript interfaces
│   │   │   │   ├── book.model.ts         # Book data structure
│   │   │   │   ├── student.model.ts      # Student data structure
│   │   │   │   ├── book-issue.model.ts   # Book issue tracking
│   │   │   │   ├── notification.model.ts # Notification structure
│   │   │   │   └── index.ts              # Model exports
│   │   │   └── services/                 # Shared services
│   │   │       ├── auth.service.ts       # Authentication logic
│   │   │       └── library.service.ts    # Library operations
│   │   │
│   │   ├── app.component.*               # Main app component
│   │   ├── app.module.ts                 # Root module
│   │   ├── app-routing.module.ts         # Application routing
│   │   └── app.routes.ts                 # Route definitions
│   │
│   ├── assets/                           # Static assets
│   ├── environments/                     # Environment configuration
│   ├── index.html                        # Main HTML file
│   └── main.ts                           # Application entry point
│
├── public/                               # Public assets
├── angular.json                          # Angular CLI configuration
├── package.json                          # Dependencies and scripts
├── tsconfig.json                         # TypeScript configuration
└── README.md                             # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LibraryManagement.WEB
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run watch` - Build and watch for changes

## 🔐 Authentication

The application uses JWT-based authentication with role-based access control:

- **Librarian Role**: Full access to all library management features
- **Student Role**: Access to book search, borrowing history, and profile management

### Login Flow
1. Users access the login page
2. Authentication is handled via JWT tokens
3. Route guards ensure proper access control
4. Users are redirected to role-specific dashboards

## 📚 Data Models

### Book Model
```typescript
interface Book {
  id: number;
  title: string;
  author: string;
  publication: string;
  stock: number;
  pdfUrl?: string;
  isActive: boolean;
}
```

### Student Model
```typescript
interface Student {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  isVerified: boolean;
}
```

### Book Issue Model
Tracks book borrowing with due dates and return status.

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Material Design**: Modern, accessible UI components
- **Intuitive Navigation**: Clear navigation structure for both user types
- **Real-time Updates**: Dynamic content updates using RxJS
- **Form Validation**: Comprehensive input validation and error handling

## 🔧 Configuration

### Environment Setup
Configure environment variables in `src/environments/environment.ts`:
- API endpoints
- Authentication settings
- Feature flags

### Angular Material Theme
The application uses Angular Material's theming system for consistent styling.

## 🧪 Testing

Run the test suite:
```bash
npm test
```

The project includes:
- Unit tests for components and services
- Integration tests for routing
- E2E testing setup (if configured)

## 📦 Build and Deployment

### Production Build
```bash
npm run build
```

### Deployment
The built application can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3
- Azure Static Web Apps

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using Angular 18 and Angular Material**
