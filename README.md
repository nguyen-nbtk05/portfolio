# Portfolio

A modern, interactive personal portfolio website built to showcase projects, blog posts, and interactive 3D visual experiences.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **3D Graphics & Animations**: [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [Framer Motion](https://motion.dev/), [Lenis](https://lenis.darkroom.engineering/)
- **Content & Services**: MDX, EmailJS

## Usage

### Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Production

Build for production and launch the server:

```bash
npm run build
npm run start
```

### Available Scripts

- `npm run dev` - Start the development server.
- `npm run build` - Build the project for production.
- `npm run start` - Run the production build.
- `npm run lint` - Run ESLint code checks.
- `npm run test` - Execute tests.
- `npm run blog:new` - Create a new blog post.
- `npm run blog:check` - Validate blog posts.

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# EmailJS configuration for contact form
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Private Blog Vault configuration
BLOG_VAULT_PASSWORD=your_vault_password
BLOG_VAULT_SESSION_SECRET=your_32_character_random_session_secret
```

### Site & Profile Configuration

Update personal details, social links, resume URL, and site descriptions in `src/data/config.ts`:

```typescript
export const siteConfig = {
  name: "Nora",
  email: "your.email@example.com",
  resumeUrl: "/docs/resume.pdf",
  github: "https://github.com/yourusername",
  x: "https://x.com/yourusername",
  // ...
};
```

### Project Portfolio Configuration

Manage portfolio projects, tech stacks, links, metrics, and visual presentations in `src/data/projects.ts`:

- Define bilingual titles and descriptions (`en` / `vi`).
- Custom presentation types: `diagram`, `terminal`, `code`, `image`, `stats`, or `none`.
- External links (`demo`, `source`, `caseStudy`).

### Blog & Content Management

Blog articles are stored under `src/content/blog/<slug>/`. Each article directory contains:
- `meta.json` - Post metadata (status, access level, date, tags, bilingual title & excerpt).
- `en.mdx` - English article content.
- `vi.mdx` - Vietnamese article content.

#### Creating a New Blog Post

Generate a new blog directory structure automatically using the CLI helper:

```bash
# Public blog post
npm run blog:new -- "My New Article Title"

# Private / Vault-protected blog post
npm run blog:new -- --vault "Protected Article Title"
```

#### Validating Blog Content

Verify blog post metadata, structure, and required files before deployment:

```bash
npm run blog:check
```

## License

This project is open-source and available under the [MIT License](LICENSE).