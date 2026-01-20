# Leave X – Protect Democracy (Website)

This repository contains the source code for **[leavex.eu](https://leavex.eu)**, the website of the *Leave X – Protect Democracy* initiative.

The website hosts:
- the public-facing campaign website
- the open letter, translated into multiple European languages
- articles and updates related to the campaign
- statistics derived from public data

The petition itself is hosted separately at  
- https://openpetition.eu/leavex

---

## Tech stack

- **Hugo** (static site generator, extended version)
- **Congo** theme (customized, included as a Git submodule)
- **Tailwind CSS** (compiled inside the theme)
- **GitHub Pages** for deployment

---

## Repository structure (important)

```text
.
├── content/                # Hugo content (posts, letter translations, pages)
├── layouts/                # Custom Hugo templates and overrides
├── themes/
│   └── congo/               # Congo theme (Git submodule, with local modifications)
├── static/                 # Static assets
├── .github/workflows/      # GitHub Actions deployment workflow
└── README.md
```

**Important:**  
The Congo theme is included as a **Git submodule** and contains local customizations (notably Tailwind configuration).  
It must be initialized and built before running the site locally.

---

## Running the site locally

### Prerequisites

- Git
- Hugo **extended**  
  https://gohugo.io/installation/
- Node.js (required to build Tailwind CSS inside the theme)

---

### 1. Clone the repository (with submodules)

```bash
git clone --recurse-submodules https://github.com/everton137/leavex.eu.git
cd leavex.eu
```

If you already cloned the repository without submodules:

```bash
git submodule update --init --recursive
```

### 2. Build the theme assets (required)

Tailwind CSS is built inside the Congo theme directory.

```bash
cd themes/congo
npm install
npm run build
cd ../..
```

This step is required:
- once per machine
- whenever Tailwind-related files change

If you already cloned the repository without submodules:

```bash
cd themes/congo
npm install
npm run build
cd ../..
```

### 3. Start the local development server

```bash
3. Start the local development server
```

The site will be available at:
- http://localhost:1313

## Deployment

The site is automatically built and deployed to GitHub Pages via GitHub Actions on every push to the main branch.

See the workflow configuration in:

```bash
.github/workflows/deploy.yml
```

## Related repositories

This repository contains only the website.

The data collection and processing logic (e.g. scraping public information about politicians) lives in a separate repository:
- https://github.com/everton137/leavex-tools

That repository includes:
- scraping scripts
- data processing utilities
- tooling used to generate statistics displayed on this site

## Contributing

Contributions are welcome.

You can contribute by:
- improving content or translations
- fixing bugs or accessibility issues
- refining layouts or styles

Please open an issue or a pull request.

Working with the Congo theme
- The Congo theme lives in themes/congo and is included as a Git submodule.

If your change affects the theme:
1. commit your changes inside themes/congo first
1. push them to the theme repository
1. then commit the updated submodule pointer in this repository

If you are not familiar with Git submodules, feel free to ask for help in an issue or pull request.


