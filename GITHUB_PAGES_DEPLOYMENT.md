# Wdrożenie na GitHub Pages

## Problemy, które zostały naprawione:

1. ✅ **Dodano plik `.nojekyll`** - GitHub Pages używa Jekyll, który może blokować pliki
2. ✅ **Poprawiono homepage w package.json** - zmieniono z `https://crypt.github.io/daily-addicts-checklist` na `.`
3. ✅ **Dodano ikonę PWA** - utworzono `icon.svg` i zaktualizowano manifest
4. ✅ **Poprawiono ścieżki w build** - teraz używają względnych ścieżek `./`

## Jak wdrożyć na GitHub Pages:

### Opcja 1: Automatyczne wdrożenie (ZALECANE)

1. **Utwórz GitHub Actions workflow:**
   - W repozytorium GitHub, przejdź do `Actions` → `New workflow`
   - Wybierz `Simple workflow` lub utwórz nowy plik `.github/workflows/deploy.yml`

2. **Dodaj ten kod do `.github/workflows/deploy.yml`:**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './build'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. **Włącz GitHub Pages:**
   - Przejdź do `Settings` → `Pages`
   - W sekcji `Source` wybierz `GitHub Actions`
   - Workflow automatycznie wdroży aplikację

### Opcja 2: Ręczne wdrożenie

1. **Sklonuj repozytorium:**
```bash
git clone https://github.com/crypt/daily-addicts-checklist.git
cd daily-addicts-checklist
```

2. **Zbuduj aplikację:**
```bash
npm install
npm run build
```

3. **Wdróż zawartość folderu `build`:**
   - Przejdź do `Settings` → `Pages`
   - W sekcji `Source` wybierz `Deploy from a branch`
   - Wybierz branch `main` i folder `/ (root)`
   - Skopiuj zawartość folderu `build` do root repozytorium
   - Commit i push zmiany

## Sprawdzenie czy działa:

Po wdrożeniu aplikacja powinna być dostępna pod adresem:
`https://crypt.github.io/daily-addicts-checklist`

## Dodatkowe uwagi:

- ✅ Aplikacja jest już PWA (Progressive Web App)
- ✅ Ma service worker dla offline functionality
- ✅ Jest responsywna (mobile-friendly)
- ✅ Używa nowoczesnych React 18 + TypeScript
- ✅ Ma animacje z Framer Motion

## Rozwiązywanie problemów:

Jeśli aplikacja nadal nie działa:

1. **Sprawdź Console w przeglądarce** (F12) - czy są błędy JavaScript
2. **Sprawdź Network tab** - czy wszystkie pliki się ładują
3. **Sprawdź czy plik `.nojekyll` istnieje** w root repozytorium
4. **Sprawdź czy ścieżki są względne** (zaczynają się od `./`)

## Test lokalny:

Możesz przetestować build lokalnie:
```bash
npx serve build
```

To uruchomi serwer lokalny z folderu build, symulując GitHub Pages.
