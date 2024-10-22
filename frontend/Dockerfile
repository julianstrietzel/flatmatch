# Use a base Node.js image
FROM node:20.13.1

# Set the working directory inside the container
WORKDIR /app

# Copy the package files to the working directory
COPY package.json ./

# Install npm packages
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Start nginx
CMD ["npm", "run", "dev"]
