# Copilot Instructions for hugo-portfolio

## Project Overview
- This is a Hugo static site using the [Toha theme](https://github.com/hugo-toha/toha) as a Hugo module.
- Content is organized under `content/`, configuration in `hugo.yaml`, and custom data in `data/` (e.g., `data/en/sections/about.yaml`).
- Static assets (images, files) are placed in `static/`.
- Custom styles are in `assets/styles/override.scss`.

## Key Patterns & Conventions
- **Theme Customization:**
  - To override Toha theme templates, copy the relevant file from the Hugo module cache to your local `layouts/` directory, preserving the path.
  - Custom SCSS in `assets/styles/override.scss` is used for site-specific styling.
- **Configuration:**
  - Main config is in `hugo.yaml`. Site parameters (background, logos, etc.) are set under `params:`.
  - Image paths in config and data files should be relative to the `static/` directory and usually do not start with a leading slash.
- **Data-driven Sections:**
  - Section content (e.g., About, social links, badges) is managed in `data/en/sections/*.yaml`.
  - Author info is in `data/en/author.yaml`.
- **Resource Links:**
  - Files referenced in config/data (e.g., resumes, badges) must exist in the `static/` directory.

## Developer Workflows
- **Local Development:**
  - Start the server with `hugo server`.
  - Site is served at `http://localhost:1313` by default.
- **Build:**
  - Run `hugo` to generate the static site in the `public/` directory.
- **Deployment:**
  - The site is configured for Netlify deployment (see `netlify.toml`).

## Troubleshooting
- If you see errors like `nil pointer evaluating resource.Resource.RelPermalink` or `Resize`, check that image paths are correct and files exist in `static/`.
- For blurry or cropped backgrounds, adjust `background-size` in `assets/styles/override.scss` and use high-resolution images.
- Deprecated shortcodes (e.g., `twitter`) should be replaced with the `x` shortcode as per Hugo warnings.

## Examples
- To add a new section, create a YAML file in `data/en/sections/` and reference it in the config if needed.
- To override a theme partial, copy it from the Hugo module cache (see error logs for the path) to `layouts/partials/` and edit as needed.

---

For further details, see the [Toha theme documentation](https://toha-guides.netlify.app/posts/getting-started/).
