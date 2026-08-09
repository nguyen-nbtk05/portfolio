# Portfolio

Source code for my personal website. A bilingual, interactive portfolio for showcasing projects, technical skills, and long-form writing.

## Features

- English and Vietnamese content with persistent language selection
- Responsive project showcase and interactive portfolio terminal
- MDX blog with tags, reading time, table of contents, and pagination
- Public, draft, coming-soon, and password-protected blog posts
- Light and dark themes, smooth scrolling, and reduced-motion support
- EmailJS-powered contact form

## Tech stack

- [Next.js 16](https://nextjs.org/) and [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Motion](https://motion.dev/) and [Lenis](https://lenis.darkroom.engineering/)
- [MDX](https://mdxjs.com/) with GitHub Flavored Markdown
- [EmailJS](https://www.emailjs.com/)

## Getting started

### Prerequisites

- Node.js 20 or newer
- npm

### Installation

```bash
git clone https://github.com/nguyen-nbtk05/portfolio.git
cd portfolio
npm ci
```

Create `.env.local` in the project root:

```env
# Contact form
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Private blog vault
BLOG_VAULT_PASSWORD=your_vault_password
BLOG_VAULT_SESSION_SECRET=your_random_secret_with_at_least_32_characters
```

Keep vault credentials server-side and never commit real secrets.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run blog:new -- "Article title"` | Create a public draft article |
| `npm run blog:new -- --vault "Article title"` | Create a vault-protected draft article |
| `npm run blog:check` | Validate all blog metadata and content |

## Project structure

```text
src/
├── app/                 # App Router pages and API routes
├── components/          # Layout, section, UI, project, and blog components
├── content/blog/        # Bilingual MDX articles and metadata
├── data/                # Site, project, and skill configuration
├── hooks/               # Shared React hooks
├── lib/                 # Navigation, animation, and blog utilities
└── providers/           # Language and theme providers
scripts/                 # Blog creation and validation tools
public/                  # Fonts, images, cursors, and résumé
```

## Customization

### Site profile

Edit `src/data/config.ts` to update the name, description, email address, résumé path, and social links.

### Projects and skills

- Add or update portfolio projects in `src/data/projects.ts`.
- Manage the skills catalog in `src/data/skills.ts`.
- Project presentations support diagram, terminal, code, image, stats, and empty states.

### Blog content

Each article lives in `src/content/blog/<slug>/`:

```text
<slug>/
├── meta.json
├── en.mdx
└── vi.mdx
```

`meta.json` defines localized titles and excerpts, publication date, tags, featured state, visibility status, and access level:

```json
{
  "title": {
    "en": "Article title",
    "vi": "Tiêu đề bài viết"
  },
  "excerpt": {
    "en": "Short English summary.",
    "vi": "Mô tả ngắn bằng tiếng Việt."
  },
  "publishedAt": "2026-08-09",
  "tags": ["networking", "security"],
  "featured": false,
  "status": "draft",
  "access": "public"
}
```

Valid `status` values are `published`, `draft`, and `comingSoon`. Valid `access` values are `public` and `vault`.

Before publishing or deploying, validate the content and create a production build:

```bash
npm run blog:check
npm run lint
npm run build
```

## License

Licensed under the [MIT License](LICENSE).
