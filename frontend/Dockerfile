FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile
# Fix permissions (sometimes helps with missing dependencies)
RUN chmod -R 777 /app/node_modules
# Copy application files
COPY . .

EXPOSE 5015

CMD ["npm", "start"]

