# Team 22 · Radio Guide (ELEG103)

A single-page guide to building a medium-wave AM radio, one section per milestone. Milestone 1 (tuned tank + diode detector) is written; M2 (RF amplifier) and M3 (soldering the board) show as locked.

React + Vite, plain CSS, no backend. The only library besides React is three.js, which is loaded on demand for the two 3D scenes (the radio in the hero and the coil in the Build section).

## Run it

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Where things live

| What | File |
|---|---|
| Team, course, milestones | `src/data/team.js` |
| Measured numbers (Tables 5 and 6, charts, Q, percent errors) | `src/data/measurements.js` — the Table 6 readings are still `null` and show as `___` until you fill them |
| Design numbers and every prediction | `src/lib/physics.js` |
| Photos | `public/images/img-01.jpg` … `img-15.jpg` (see `public/images/README.md`) |
| 3D radio (model and resized textures) | `public/models/` |
| Sections, in page order | `src/sections/` |
| Diagrams, part drawings, interactive tuner and Q explorer | `src/components/` |

The original model folder `radio 3d/` (33 MB of 4K textures) is not used by the site; `public/models/` holds a trimmed copy (about 1.4 MB). You can leave `radio 3d/` out of the repository.

## Publish on GitHub Pages

1. Push this folder to the `main` branch of a GitHub repository.
2. In the repository open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it at `https://<user>.github.io/<repo>/`.

`vite.config.js` uses `base: './'`, so the build works under any repository name or a custom domain. To use an absolute base instead:

```bash
VITE_BASE=/your-repo-name/ npm run build
```
