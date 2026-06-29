# Garage Remote Next.js

Telecommande garage migree vers Next.js, Tailwind CSS et shadcn/ui.

## Developpement

Copier les variables serveur si besoin :

```bash
cp .env.example .env.local
```

Lancer l'application :

```bash
npm run dev
```

Next.js ecoute sur `http://localhost:3000`. Le navigateur appelle seulement les routes internes `/api/garage/*`; le serveur Next relaie ensuite vers l'API Python configuree avec `PYTHON_API_URL`.

## Variables Serveur

- `PYTHON_API_URL` : URL de l'API Python vue depuis le serveur Next. En Docker, utiliser `http://host.docker.internal:5000`. Hors Docker, `http://127.0.0.1:5000` fonctionne si l'API tourne sur la meme machine.
- `PYTHON_API_KEY` : valeur envoyee dans le header `x-api-key`. Par defaut : `test`.

Ces variables ne doivent pas utiliser le prefixe `NEXT_PUBLIC_`, afin de rester cote serveur.

## Production Docker

```bash
docker compose up -d --build
```

Le service publie Next.js sur le port `80`, donc l'application est accessible sans `:3000`. Depuis le conteneur, `host.docker.internal` pointe vers l'hote Linux/VPS ou tourne l'API Python.
