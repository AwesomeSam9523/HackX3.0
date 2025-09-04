# MUJ HackX 3.0- Official Website

Made with ❤️ by Team HackX

## Frontend Setup

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm** : Package manager
- **Git**: Version control system

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone https://github.com/AwesomeSam9523/HackX3.0
   cd HackX3.0
   ```

2. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

3. **Install dependencies**:
   ```bash
   npm install
   
   ```

### Development

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

### Technology Stack

- **Framework**: Next.js 15.3.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, GSAP
- **Icons**: Lucide React


### Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **lint-staged** for pre-commit checks

### Building for Production

```bash
npm run build
npm run start
```

### Docker (Optional)

If you prefer to use Docker:

```bash
docker build -t hackx-frontend .
docker run -p 3000:3000 hackx-frontend
```
