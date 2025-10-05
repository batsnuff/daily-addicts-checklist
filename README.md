# Daily Addicts' Checklist

A Progressive Web App (PWA) for tracking daily routines and creative activities with an integrated point system.

## Features

### 🏃 Running Tracker
- Distance input with animated progress
- Real-time distance tracking
- Bonus points for extra kilometers
- "Did it!" completion animation

### 💊 Bats'nack Point System
- **Positive Points:**
  - +1BS for extra running km
  - +2BS for creative work (unrelated to Miloverse)
  - +3BS for Miloverse-related creative work
  - +4BS for starting new projects
  - +7BS for completing/uploading projects

- **Penalty Points:**
  - -1BS for missing reflection/mantra/activity/reading
  - -2BS for missing Passions Pills
  - -0.5BS for mundane tasks (breakfast, hygiene, light reading)

### 📝 Two-Section System
1. **Morning Routines** (Section 1): Sok, jedzenie, bieganie, mantry, granie, czytanie
2. **Passions Pills** (Section 2): Hobby, malowanie, kodowanie, muzyka, studio

### 📊 Advanced Features
- **Notes System**: 300-character notes for tasks, 666-character for evening reflection, 1410-character daily general notes
- **Statistics**: Daily, weekly, monthly, and overall progress tracking
- **PWA Support**: Installable web app with offline functionality
- **Data Export**: Weekly JSON export with email functionality
- **Casino Animation**: Random Passions Pills selection after weekly export

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Deployment

### GitHub Pages (Automatic)

The app is automatically deployed to GitHub Pages using GitHub Actions:

1. **Enable GitHub Pages**: Go to repository Settings → Pages → Source: "GitHub Actions"
2. **Push to main branch**: Any push to `main` or `master` branch triggers automatic deployment
3. **Access your app**: Available at `https://yourusername.github.io/daily-addicts'checklist`

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to your hosting service

### GitHub Actions Workflow

The `.github/workflows/deploy.yml` file contains the deployment configuration:
- Builds the React app
- Deploys to GitHub Pages on push to main/master
- Uses `peaceiris/actions-gh-pages` for deployment

## Usage

### Daily Workflow
1. **Morning**: Complete morning routines and collect Bats'nack points
2. **Creative Time**: Work on Passions Pills activities
3. **Evening**: Add reflection notes and review progress
4. **Weekly**: Export data and get new random Passions Pills

### Point Management
- Points accumulate throughout the week
- Use points to skip tasks with a clear conscience
- Track your progress in the Statistics tab

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: CSS3 with custom animations
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion
- **Storage**: LocalStorage for data persistence
- **PWA**: Service Worker + Web App Manifest

## Philosophy

> "Dyscyplina zaczyna się tam gdzie kończy się przyjemność która udawała motywację"

This app implements a warehouse-style system for life management, treating daily routines as inventory operations with point-based rewards and penalties.

## License

Private project for personal use.
