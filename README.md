# Virtual Front Desk - Frontend

Frontend application for Virtual Front Desk Programming Practice Project built with React, TypeScript, and Tailwind CSS.

## Features

- Clean, modern UI with reusable React components
- Session token management using sessionStorage
- Interactive task display with hover and selected states
- Real-time answer feedback with animations
- Responsive design

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Axios

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (optional, defaults to proxy):
```env
VITE_API_URL=http://localhost:3001/api
```

4. Start the development server:
```bash
npm run dev
```

The application will start on `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

Or connect your GitHub repository to Vercel dashboard and deploy automatically.

### Environment Variables

Set `VITE_API_URL` to your backend API URL in Vercel dashboard:
- Settings → Environment Variables
- Add `VITE_API_URL` = `https://your-backend-url.com/api`

### Render/Netlify Deployment

Similar process - connect your GitHub repository and set the environment variable `VITE_API_URL` to your backend API URL.

## Project Structure

```
src/
  components/
    Header.tsx       # Header component with menu bar
    TaskCard.tsx     # Task display component with options
  services/
    api.ts          # API service functions
  types/
    index.ts        # TypeScript type definitions
  App.tsx           # Main application component
  main.tsx          # Application entry point
  index.css         # Global styles
```

## Color Scheme

- Primary: `#50c878`
- Primary Light: `#99e999`
