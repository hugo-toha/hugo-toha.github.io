# hugo-toha.github.io

[![Netlify Status](https://api.netlify.com/api/v1/badges/b1b93b02-f278-440b-ae1b-304e9f4c4ab5/deploy-status)](https://app.netlify.com/sites/toha/deploys) [![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fhugo-toha%2Fhugo-toha.github.io%2Fbadge%3Fref%3Dmain&style=flat)](https://actions-badge.atrox.dev/hugo-toha/hugo-toha.github.io/goto?ref=main) ![Repository Size](https://img.shields.io/github/repo-size/hugo-toha/hugo-toha.github.io) ![Contributor](https://img.shields.io/github/contributors/hugo-toha/hugo-toha.github.io) ![Last Commit](https://img.shields.io/github/last-commit/hugo-toha/hugo-toha.github.io) ![License](https://img.shields.io/github/license/hugo-toha/hugo-toha.github.io) ![Open Issues](https://img.shields.io/github/issues/hugo-toha/hugo-toha.github.io?color=important) ![Open Pull Requests](https://img.shields.io/github/issues-pr/hugo-toha/hugo-toha.github.io?color=yellowgreen) ![Security Headers](https://img.shields.io/security-headers?url=https%3A%2F%2Fhugo-toha.github.io%2F) [![This project is using Percy.io for visual regression testing.](https://percy.io/static/images/percy-badge.svg)](https://percy.io/b7cb60ab/hugo-toha.github.io)

An example hugo static site with Toha theme.

Attributions:
- <a href='https://www.freepik.com/vectors/business'>Business vector created by studiogstock - www.freepik.com</a>


## Requirements

We use [jdx/mise](https://github.com/jdx/mise) to manage dependencies. Mise takes care of installing `hugo`, `go`, `nodes` and other tools to appropriate versions. Please, install it following the instruction from [here](https://mise.jdx.dev/getting-started.html).

## Running Locally
- Install dependencies
```
mise install
```
- Run hugo server
```
mise run server
```

## Updating theme
- To update theme to latest release, run:
```
mise run update
```
- To update theme to latest commit from `main` brnach, run:
```
mise run update-to-main
```
