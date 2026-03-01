# Mit GitHub verbinden (GEKO-Lab/geko)

Repository: **https://github.com/GEKO-Lab/geko**

Führe diese Befehle in einem Terminal aus, in dem Git verfügbar ist (z. B. **Git Bash**, **CMD** mit Git im PATH oder das integrierte Terminal in Cursor/VS Code, nachdem Git installiert ist).

## 1. In den Projektordner wechseln

```bash
cd "c:\Users\junes\OneDrive\Documents\Portfolio"
```

## 2. Git initialisieren (falls noch nicht geschehen)

```bash
git init
```

## 3. Remote mit GitHub verbinden

```bash
git remote add origin https://github.com/GEKO-Lab/geko.git
```

Falls `origin` schon existiert und du es ersetzen willst:

```bash
git remote set-url origin https://github.com/GEKO-Lab/geko.git
```

## 4. Ersten Commit erstellen und pushen

```bash
git add .
git commit -m "Portfolio mit Three.js-Landschaft und Scroll-Animation"
git branch -M main
git push -u origin main
```

Wenn das Remote-Repo bereits einen `main`-Branch mit Inhalt hat (z. B. nur eine README), zuerst holen und dann pushen:

```bash
git pull origin main --allow-unrelated-histories
# Konflikte ggf. lösen, dann:
git push -u origin main
```

---

**Hinweis:** Wenn Git im aktuellen Terminal nicht erkannt wird, installiere [Git für Windows](https://git-scm.com/download/win) und starte danach Cursor/das Terminal neu, oder führe die Befehle in **Git Bash** aus.
