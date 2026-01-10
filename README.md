# Rezepte

Eine moderne Rezepte-App, gebaut mit TanStack Start, Cloudflare D1, R2 und better-auth.

## Features

- Rezepte erstellen, bearbeiten und teilen
- Benutzerauthentifizierung mit Email/Passwort
- Kategorien und Tags für Rezepte
- Favoriten-Funktion
- Mehrsprachig (Deutsch/Englisch)
- Responsives Design
- Serverloses Deployment auf Cloudflare

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Datenbank**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **Speicher**: [Cloudflare R2](https://developers.cloudflare.com/r2/) für Bilder
- **Auth**: [better-auth](https://www.better-auth.com)
- **i18n**: [i18next](https://www.i18next.com)
- **Icons**: [Lucide React](https://lucide.dev)

## Entwicklung

### Voraussetzungen

- Node.js 18+
- npm oder pnpm
- Cloudflare Account (für Deployment)

### Installation

```bash
npm install
```

### Lokale Entwicklung

```bash
npm run dev
```

Die App läuft auf http://localhost:3000

### Datenbank

#### D1 Datenbank erstellen

```bash
wrangler d1 create rezepte-db
```

Kopiere die `database_id` in die `wrangler.toml`.

#### Migrationen generieren

```bash
npm run db:generate
```

#### Migrationen ausführen (lokal)

```bash
npm run db:migrate:local
```

#### Migrationen ausführen (Produktion)

```bash
npm run db:migrate
```

### R2 Bucket erstellen

```bash
wrangler r2 bucket create rezepte-assets
```

## Deployment

### Cloudflare Pages

```bash
npm run deploy
```

### Secrets konfigurieren

```bash
wrangler secret put BETTER_AUTH_SECRET
```

## Projektstruktur

```
src/
├── components/     # React-Komponenten
├── db/            # Datenbank-Schema
├── i18n/          # Übersetzungen
├── lib/           # Hilfsfunktionen (auth, db, r2)
├── routes/        # TanStack Router Seiten
├── server/        # Server-Funktionen
└── styles.css     # Globale Styles
```

## Routen

- `/` - Startseite
- `/rezepte` - Alle Rezepte
- `/rezept/:slug` - Rezept-Details
- `/kategorien` - Alle Kategorien
- `/kategorien/:slug` - Rezepte einer Kategorie
- `/suche` - Rezepte suchen
- `/anmelden` - Login
- `/registrieren` - Registrierung
- `/meine-rezepte` - Eigene Rezepte (auth)
- `/favoriten` - Favoriten (auth)
- `/rezept/neu` - Neues Rezept erstellen (auth)

## Lizenz

MIT
