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
- **Congo** theme (unmodified upstream, included as a Git submodule)
- **Tailwind CSS** (compiled from the site root)
- **GitHub Pages** for deployment

---

## Repository structure (important)

```text
.
├── content/                # Hugo content (posts, letter translations, pages)
├── layouts/                # Custom Hugo templates and overrides
├── assets/                 # Custom CSS, JS and icons
├── themes/
│   └── congo/              # Congo theme (Git submodule, do not edit)
├── static/                 # Static assets
├── .github/workflows/      # GitHub Actions deployment workflow
└── README.md
```

**Important:**  
The Congo theme is included as a **Git submodule**, pinned to an unmodified upstream release. All customizations live in this repository.  
The submodule must be initialized and the CSS built before running the site locally, otherwise some styles will be missing.

---

## Running the site locally

### Prerequisites

- Git
- Hugo **extended** (deployment uses the version set in `.github/workflows/deploy.yml`)  
  https://gohugo.io/installation/
- Node.js 20.19 or later (required to build Tailwind CSS; deployment uses Node 26)

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

### 2. Install the build dependencies

Run this from the repository root, once after cloning and again whenever the theme is updated:

```bash
npm ci --prefix themes/congo
```

### 3. Start the local development server

```bash
npm run dev
```

This builds the CSS and then starts Hugo. If you add Tailwind classes while the server is running, run `npm run build:css` to regenerate the CSS.

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

## Working with the Congo theme

Do not edit files inside `themes/congo`. Customize the theme from this repository instead:
- templates: copy the file to the same path under `layouts/` and edit the copy
- styles: edit `assets/css/custom.css`
- Tailwind classes: use them in `layouts/` or `content/`, they are picked up by `npm run build:css`

To update Congo to a new release (replace `vX.Y.Z` with its tag):

```bash
git -C themes/congo fetch --tags origin
git -C themes/congo checkout vX.Y.Z
npm ci --prefix themes/congo
npm run dev   # check the site, including your overridden templates
git add themes/congo
git commit -m "Update Congo to vX.Y.Z"
```

If you are not familiar with Git submodules, feel free to ask for help in an issue or pull request.
