#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Admin App Setup Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}Node.js version: $(node --version)${NC}"
echo -e "${GREEN}npm version: $(npm --version)${NC}"
echo ""

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}Dependencies installed successfully${NC}"
echo ""

# Check if .env file exists, if not copy from .env.example
if [ ! -f .env ]; then
    echo -e "${YELLOW}.env file not found. Creating from .env.example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}.env file created successfully${NC}"
    else
        echo -e "${RED}.env.example not found. Creating default .env...${NC}"
        cat > .env << EOF
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
EOF
        echo -e "${GREEN}Default .env file created${NC}"
    fi
else
    echo -e "${GREEN}.env file already exists${NC}"
fi
echo ""

# Run build check
echo -e "${BLUE}Running build check...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build check failed${NC}"
    echo -e "${YELLOW}Please fix the errors and run setup again${NC}"
    exit 1
fi

echo -e "${GREEN}Build check passed${NC}"
echo ""

# Success message
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Make sure the backend server is running on port 5000"
echo -e "2. Start the dev server: ${GREEN}npm run dev${NC}"
echo -e "3. Open your browser at: ${GREEN}http://localhost:5173${NC}"
echo ""
echo -e "${BLUE}Default Admin Credentials:${NC}"
echo -e "  Username: ${GREEN}admin${NC}"
echo -e "  Password: ${GREEN}admin123${NC}"
echo ""
echo -e "${YELLOW}Note: Make sure MongoDB is running and backend is seeded${NC}"
echo -e "${YELLOW}Run 'npm run seed' in the backend directory if needed${NC}"
echo ""
