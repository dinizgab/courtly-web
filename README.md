# Courtly - A Sports Court Reservation Management

The project was built with **Next.js 15**, **React 19**, and **Tailwind CSS**, providing an online showcase and administrative tools for court owners.

## Features
- **Reservation Management**: Control bookings with automatic confirmations.  
- **Real-Time Availability**: Prevents conflicts by displaying only available time slots.  
- **Full Customization**: Configure prices, schedules, and rules for each court.  
- **Online Showcase**: Public page for customers to discover and book courts.

## Main Technologies
- **Next.js & React**  
- **TypeScript**  
- **Tailwind CSS**  
- **Radix UI** for accessible components  
- **React Query** for data fetching and caching  
- **Zod** for validation  

## Project Structure
The main organization follows the Next.js app directory pattern:

```
app/          # Application pages and routes
components/   # Reusable components
contexts/     # Context providers
hooks/        # Custom hooks
lib/          # API integrations and utilities
public/       # Static files
styles/       # Global styles
```

## Getting Started
Install dependencies:
```bash
npm install
# or
pnpm install
```

Start the development server:
```bash
npm run dev
```
The application will be available at **http://localhost:3000**.

## Useful Commands
- `npm run lint` – runs lint checks.  
- `npm run build` – generates the production build.  
