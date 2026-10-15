# Použijeme konkrétní LTS verzi 22
FROM node:22-bookworm-slim

# Nastavení pracovního adresáře uvnitř kontejneru
WORKDIR /app

# Kopírujeme package.json a package-lock.json pro instalaci závislostí
COPY package*.json ./
COPY . .

# Instalujeme závislosti
RUN npm install

# Exponujeme port, na kterém běží tvůj Express server (např. 3000)
EXPOSE 5000

# Předpokládáme, že tvůj hlavní soubor je index.js nebo server.js
#CMD ["npm", "start"]
CMD ["npm", "run", "dev"]
