# Catalyst

> **A modern Canvas LMS client that expedites the learning experience**

## 🏛️ Congressional App Challenge

This is the first git push after submission of the Congressional App Challenge, as this app is actively used by students, upgrades are needed to ensure that the students are getting the best experience, with more features at their hands. Due to this, Catalyst will still be maintained after submission, and will continue to receive updates.

Catalyst is an enhanced Canvas LMS (Learning Management System) client built with Next.js that provides students with a modern, feature-rich interface for managing their coursework. Originally submitted to the Congressional App Challenge, Catalyst continues active development to serve students who rely on it daily.

🔗 **Live Demo**: [https://catalyst.bluefla.me/](https://catalyst.bluefla.me/)

> ⚠️ **Note**: This repository is for source code reference and contributions only. The application should not be distributed or self-hosted without permission.

---

## ✨ Features

Catalyst enhances the Canvas LMS experience with powerful features designed for modern students:

### 🎨 **Customizable Appearance**

- **Dark Mode**: Easy on the eyes for late-night study sessions
- **Color Themes**: Multiple color schemes to personalize your experience
- **Modern UI**: Clean, intuitive interface built with Radix UI and Tailwind CSS

### 📅 **Smart Scheduling**

- **Class Schedule Management**: View and manage your class timetable
- **Period Tracking**: See your current period and upcoming classes
- **Schedule Now**: Quick access to current schedule information

### 🔔 **Enhanced Notifications**

- **Real-time Alerts**: Stay updated on assignments, grades, and deadlines
- **Email Digests**: Customizable email notifications for important updates
- **Grade Change Notifications**: Get notified when grades are updated
- **Due Date Reminders**: Never miss an assignment deadline

### 📝 **Better Submissions**

- **Rich Text Editor**: Enhanced assignment submission with TipTap editor
- **File Attachments**: Easy drag-and-drop file upload
- **PDF Viewer**: Built-in PDF viewing for assignments and resources
- **Submission Tracking**: Monitor your submission status at a glance

### 🤝 **Social Features**

- **Messaging System**: Communicate with classmates and teachers
- **Group Creation**: Create and manage study groups
- **Activity Feed**: Stay connected with class updates

### 📊 **Advanced Analytics**

- **Grade Analytics**: Visualize your grades with charts and graphs
- **Progress Tracking**: Monitor your academic progress across courses
- **Performance Insights**: Understand your strengths and areas for improvement

### 🚀 **Additional Features**

- **Cross-platform**: Works seamlessly on desktop and mobile devices
- **Fast & Reliable**: Built with Next.js 15 for optimal performance
- **Secure Authentication**: OAuth integration with Canvas LMS
- **Offline Support**: Progressive Web App (PWA) capabilities
- **Command Menu**: Quick navigation with keyboard shortcuts (⌘K)
- **Picture-in-Picture Mode**: Multi-task while viewing course content

---

## 🛠️ Tech Stack

Catalyst is built with modern web technologies:

### **Frontend**

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Motion](https://motion.dev/)** - Animation library

### **Backend & Database**

- **[NextAuth.js](https://next-auth.js.org/)** - Authentication
- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe database toolkit
- **[PostgreSQL](https://www.postgresql.org/)** - Primary database

### **Key Libraries**

- **[TipTap](https://tiptap.dev/)** - Rich text editor
- **[Recharts](https://recharts.org/)** - Data visualization
- **[React PDF](https://react-pdf.org/)** - PDF rendering
- **[Pusher](https://pusher.com/)** - Real-time features
- **[PostHog](https://posthog.com/)** - Analytics & feature flags
- **[Stripe](https://stripe.com/)** - Payment processing (Pro features)
- **[React Email](https://react.email/)** - Email templates

### **Development Tools**

- **[Bun](https://bun.sh/)** - Fast JavaScript runtime
- **[Turbopack](https://turbo.build/pack)** - Fast bundler
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting

---

## 🚦 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- PostgreSQL database
- Canvas LMS account and API credentials

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/FortyGazelle700/catalyst-next.git
   cd catalyst-next
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/catalyst

   # Authentication
   AUTH_SECRET=your-secret-key
   AUTH_URL=http://localhost:3000

   # Canvas LMS
   CANVAS_CLIENT_ID=your-canvas-client-id
   CANVAS_CLIENT_SECRET=your-canvas-client-secret
   CANVAS_DOMAIN=your-institution.instructure.com

   # Optional: Real-time features
   PUSHER_APP_ID=
   PUSHER_KEY=
   PUSHER_SECRET=
   PUSHER_CLUSTER=

   # Optional: Analytics
   NEXT_PUBLIC_POSTHOG_KEY=
   NEXT_PUBLIC_POSTHOG_HOST=

   # Optional: Payments
   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=
   ```

4. **Initialize the database**

   ```bash
   bun run db:push
   ```

5. **Run the development server**

   ```bash
   bun run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Development with HTTPS (Optional)

For local HTTPS development:

```bash
bun run dev:https
```

---

## 📁 Project Structure

```
catalyst-next/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (landing)/    # Public landing pages
│   │   ├── (onboarding)/ # User onboarding flow
│   │   ├── api/          # API routes
│   │   ├── app/          # Main application
│   │   └── pip/          # Picture-in-Picture mode
│   ├── components/       # React components
│   │   ├── catalyst/     # Custom Catalyst components
│   │   ├── editor/       # Rich text editor
│   │   ├── magicui/      # Animated UI components
│   │   ├── ui/           # Base UI components
│   │   └── util/         # Utility components
│   ├── emails/           # Email templates
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── server/           # Server-side code
│       ├── api/          # API handlers
│       ├── auth.ts       # Authentication logic
│       └── db/           # Database schema & queries
├── public/               # Static assets
├── certificates/         # SSL certificates (local dev)
├── drizzle.config.ts    # Database configuration
├── next.config.mjs      # Next.js configuration
└── package.json         # Dependencies
```

---

## 🤝 Contributing

Catalyst is in active development, and contributions are welcome! Since students rely on this platform daily, we maintain high standards for code quality and user experience.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write type-safe TypeScript code
- Follow the existing code style (enforced by ESLint/Prettier)
- Test your changes thoroughly
- Update documentation as needed
- Ensure all builds pass before submitting PR

---

## 🎯 Roadmap

- [ ] Mobile app (iOS & Android)
- [ ] Offline mode enhancements
- [ ] AI-powered study recommendations
- [ ] Advanced grade predictions
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Enhanced accessibility features
- [ ] Multi-language support
- [ ] Custom widgets and extensions API
- [ ] Improved social collaboration tools

---

## 📊 Status

**Current Status**: Active Development

This project was initially submitted to the Congressional App Challenge and has since grown into a platform that students rely on daily. Development continues with regular updates and new features.

---

## 📝 License

**Source Available - Not for Distribution**

This source code is made available for:

- ✅ Viewing and learning
- ✅ Contributing improvements
- ✅ Suggesting features
- ❌ Self-hosting or redistribution
- ❌ Commercial use

For licensing inquiries, please contact the maintainers.

---

## 🙏 Acknowledgments

- Built by students, for students
- Submitted to the Congressional App Challenge
- Powered by the open-source community
- Inspired by the need for a better Canvas experience

---

## 📧 Contact

- **Website**: [https://catalyst.bluefla.me/](https://catalyst.bluefla.me/)
- **Issues**: [GitHub Issues](https://github.com/FortyGazelle700/catalyst-next/issues)
- **Discussion**: [GitHub Discussions](https://github.com/FortyGazelle700/catalyst-next/discussions)

---

## ⚡ Performance

Catalyst is built with performance in mind:

- Server-side rendering for fast initial loads
- Optimized bundle sizes with code splitting
- Image optimization with Next.js Image
- Efficient caching strategies
- Progressive Web App capabilities

---

## 🔒 Security

Security is a top priority:

- Secure OAuth authentication with Canvas
- HTTPS enforcement in production
- Environment variable protection
- Regular dependency updates
- No sensitive data in client-side code
