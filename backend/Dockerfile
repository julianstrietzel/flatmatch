# Use a base Node.js image
FROM node:20.13.1

# Set the working directory inside the container
WORKDIR /app

# Copy the package files to the working directory
COPY package.json package-lock.json ./

# Install npm packages
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Transpile TypeScript to JavaScript 
RUN npm run build

# Expose the port that the server will listen on
EXPOSE 3000

# Start the Express server
CMD ["npm", "start"]
