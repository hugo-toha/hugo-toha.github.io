# Copilot Instructions for hugo-portfolio

## Project Overview
- Hugo static site using the [Toha theme](https://github.com/hugo-toha/toha) as a Hugo module (not a local theme folder).
- Content lives in `content/`, configuration in `hugo.yaml`, and custom data in `data/` (e.g., `data/en/sections/about.yaml`, `data/en/sections/skills.yaml`).
- Static assets (images, files, diplomas, etc.) are placed in `static/` and referenced with paths relative to this directory (e.g., `files/certificates/analiza.jpg`).
- Custom styles are in `assets/styles/override.scss`.

## Key Patterns & Conventions
- **Section Rendering:**
  - Each section (e.g., About, Skills, Experiences) is defined by a YAML file in `data/en/sections/` and rendered using a template (e.g., `sections/about.html`).
  - The template is resolved from the Toha theme module cache unless overridden in your local `layouts/sections/` directory.
- **Theme Customization:**
  - To override a Toha template, copy it from the Hugo module cache (see error logs for the path) to your local `layouts/` directory, preserving the path.
  - Custom SCSS in `assets/styles/override.scss` is used for site-specific styling.
- **Configuration:**
  - Main config is in `hugo.yaml`. Site parameters (background, logos, etc.) are set under `params:`.
  - Image paths in config and data files must be relative to the `static/` directory and should not start with a leading slash (e.g., use `files/certificates/analiza.jpg`, not `/files/certificates/analiza.jpg`).
- **Data-driven Sections:**
  - Section content (e.g., About, Skills, Experiences) is managed in `data/en/sections/*.yaml`.
  - Author info is in `data/en/author.yaml`.
- **Resource Links:**
  - Files referenced in config/data (e.g., resumes, badges, diploma images) must exist in the `static/` directory.

## Developer Workflows
- **Local Development:**
  - Start the server with `hugo server`.
  - Site is served at `http://localhost:1313` by default.
- **Build:**
  - Run `hugo` to generate the static site in the `public/` directory.
- **Deployment:**
  - The site is configured for Netlify deployment (see `netlify.toml`).
- **Image/Asset Debugging:**
  - If you see errors about `nil pointer evaluating resource.Resource.MediaType` or `RelPermalink`, check that the referenced image exists in `static/` and the path in YAML is correct and relative (no leading slash).

## Troubleshooting
- If you see errors like `nil pointer evaluating resource.Resource.RelPermalink`, `Resize`, or `MediaType`, check that image paths are correct, files exist in `static/`, and paths are relative (no leading slash).
- For blurry or cropped backgrounds, adjust `background-size` in `assets/styles/override.scss` and use high-resolution images.
- Deprecated shortcodes (e.g., `twitter`) should be replaced with the `x` shortcode as per Hugo warnings.
- To debug template issues, check the error log for the path to the failing template in the Hugo module cache, then copy and override it in your local `layouts/` directory if needed.

## Examples
- To add a new section, create a YAML file in `data/en/sections/` and reference it in the config if needed.
- To add a diploma or certificate image, place it in `static/files/certificates/` and reference it in your YAML as `files/certificates/your-image.jpg`.
- To override a theme partial, copy it from the Hugo module cache (see error logs for the path) to `layouts/partials/` and edit as needed.


For further details, see the [Toha theme documentation](https://toha-guides.netlify.app/posts/getting-started/).
