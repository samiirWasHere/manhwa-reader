# Manhwa Reader Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

A high-performance, modern web platform for reading manhwa, featuring a responsive design, robust authentication, and an efficient scraping engine. Built with the latest web technologies to ensure scalability and a premium user experience.

## 🚀 Features

- **Modern Architecture**: Built on Next.js 14 (App Router) for server-side rendering and static site generation.
- **Type Safety**: End-to-end type safety with TypeScript and Zod.
- **Styling**: Responsive and performant UI with Tailwind CSS and Framer Motion.
- **Database**: Prisma ORM with flexible database support (PostgreSQL/MySQL ready).
- **Authentication**: Secure user authentication via NextAuth.js.
- **Content Aggregation**: Custom scraping engine built with Cheerio and optimized for speed.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/manhwa-reader.git
   cd manhwa-reader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy the example environment file to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Note: Update the `.env` file with your specific database credentials and NextAuth secrets.*

4. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📦 Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm start`: Start the production server.
- `npm run lint`: Run ESLint checks.
- `npm run db:studio`: Open Prisma Studio to manage database records.
- `npm run scrape`: Execute the scraping CLI.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feat/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feat/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
