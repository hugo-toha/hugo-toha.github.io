# Carlos' Hugo Portfolio Guide

🚀 **Workflow for Updating Your Site**  

### 1. **Edit Locally**
```bash
git checkout source                 # Always work in the 'source' branch
hugo server -D                     # Live preview at http://localhost:1313
```
- Keep the terminal running while editing—it auto-updates!

### 2. **Commit Changes**
```bash
git add .
git commit -m "Description of changes"  # Be specific!
git push origin source
```

### 3. **Deploy to Live Site (Production)**
- GitHub Actions will auto-build and deploy to gh-pages.
- Check progress:
  - `Repo` > `Actions` > `"Deploy to GitHub Pages"`.
- Live site updates in ~2 mins at:
  - `https://<your-github-username>.github.io`
