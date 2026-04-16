#!/bin/bash

# Build a image
echo " Building Docker image..."
docker build -t playwright-tests .

if [ $? -ne 0 ]; then
     echo "Docker build failed!"
     exit 1
fi

# run test
echo " Running tests in Docker..."

# Get the absolute path
TEST_RESULTS_PATH=$(pwd -W)/test-results
PLAYWRIGHT_REPORT_PATH=$(pwd -W)/playwright-report

# Mount and run
docker run --rm \
  -e ENV=qa \
  -v "$TEST_RESULTS_PATH:/app/test-results" \
  -v "$PLAYWRIGHT_REPORT_PATH:/app/playwright-report" \
  playwright-tests

# Check result
if [ $? -eq 0 ]; then
   echo " Tests completed successfully!"
   echo " View report: ./playwright-report/index.html"

else
   echo "Tests failed!"
fi