# Use official Playwright image (includes all browsers)
FROM mcr.microsoft.com/playwright:v1.58.1-jammy

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all source code
COPY . .

# Create test results directories
RUN mkdir -p test-results playwright-report allure-results html-report

# Set environment variables
ENV CI=true
# Run tests on Chromium (QA environment by default)
CMD ["npx", "playwright", "test", "--project=Chromium"]