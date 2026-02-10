# FinTrack - Personal Finance Mastered 🚀

![Project Banner](/public/image%20of%20get%20started.png)

**FinTrack** is a modern, full-stack personal finance application designed to bring clarity and control to your financial life. Built with a focus on **performance**, **security**, and **user experience**, it allows users to track income and expenses, manage budgets, and visualize their financial health through an elegant, glassmorphism-inspired interface.

🌐 **Live Demo:** [https://fintrack-rho-inky.vercel.app](https://fintrack-rho-inky.vercel.app)

---

## ✨ Key Features

### 📊 Comprehensive Dashboard
- **Real-time Analytics:** Visualizes net worth, monthly cash flow, and spending habits using interactive Recharts.
- **Data Visualization:** Users can view detailed breakdowns of expenses by category (Pie Charts) and income vs. expense trends (Bar Charts).

### 💰 Smart Budgeting
- **Monthly Limits:** Users can set a target monthly budget.
- **Visual Feedback:** A dynamic progress bar provides immediate visual cues (Green/Red) when spending approaches or exceeds the limit.

### 🔐 Secure & Seamless Authentication
- **Multi-method Sign-in:** Supports **Google OAuth** and secure **Email/Password** authentication via **Auth.js (NextAuth v5)**.
- **Session Management:** Secure session handling with HTTP-only cookies.

### 👤 Profile Management
- **Personalized Experience:** Users can update their display name, set financial goals (e.g., "Saving for a Tesla"), and manage their preferences.
- **Avatar Upload:** Integrated **UploadThing** to allow users to upload and crop profile pictures directly from their device.

### 🎨 Modern UI/UX
- **Glassmorphism Design:** A clean, aesthetic interface built with **Tailwind CSS 4** and **Radix UI** primitives.
- **Responsive:** Fully optimized for mobile, tablet, and desktop devices.
- **Dark/Light Mode:** Seamless theme switching with system preference detection.

---

## 🛠️ Technology Stack

This project leverages the latest web technologies to ensure scalability, type safety, and developer experience.

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) & [Tailwind Merge](https://github.com/dcastil/tailwind-merge) |
| **Components** | [Radix UI](https://www.radix-ui.com/) (Headless Accessibility) & [Lucide Icons](https://lucide.dev/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) (via [Supabase](https://supabase.com/)) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Authentication** | [Auth.js (NextAuth v5)](https://authjs.dev/) |
| **File Storage** | [UploadThing](https://uploadthing.com/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started (Local Development)

Follow these steps to run FinTrack locally on your machine.

### Prerequisites
- Node.js 18+ installed.
- A PostgreSQL database (e.g., a free Supabase instance).
- A Google Cloud Console project (for OAuth).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hoangvanpierre/fintrack.git
   cd fintrack
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following keys:
   ```env
   # Database (Supabase)
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."

   # Authentication (Auth.js)
   AUTH_SECRET="your_generated_secret"
   AUTH_URL="http://localhost:3000"

   # Google OAuth
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"

   # File Upload (UploadThing)
   UPLOADTHING_TOKEN="your_uploadthing_token"
   ```

4. **Initialize the Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) to see the app live.

---

## 📂 Project Structure

```bash
fintrack/
├── app/                  # Next.js App Router pages & layouts
│   ├── actions/          # Server Actions (Mutations)
│   ├── api/              # API Routes (Auth, Uploads)
│   └── dashboard/        # Protected Application Routes
├── components/           # Reusable UI Components
│   ├── features/         # Domain-specific components (Charts, Forms)
│   └── ui/               # Radix UI Primitives (Button, Card, Dialog)
├── lib/                  # Utilities & Configuration (Auth, Prisma)
├── prisma/               # Database Schema & Migrations
└── public/               # Static Assets
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve FinTrack, please feel free to fork the repository and submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by <b>Hoang Van</b>
</p>