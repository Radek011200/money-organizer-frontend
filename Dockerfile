FROM node:18

# Ustawienia pracy
WORKDIR /app

# Kopiowanie plików
COPY package*.json ./

# Instalacja zależności
RUN npm install

# Kopiowanie pozostałych plików
COPY . .

# Uruchomienie aplikacji
CMD ["npm", "run", "dev", "--", "--host"]

RUN npm run build \
  && cp -r dist/* /var/www/html/public/