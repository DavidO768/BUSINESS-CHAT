#!/bin/bash

echo "======================================"
echo "PUSH GABSTEP BUSINESS CHAT TO GITHUB"
echo "======================================"
echo ""

# INSTRUCTIONS:
# 1. Create a new repository on GitHub:
#    - Go to: https://github.com/new
#    - Name: gabstep-business-chat
#    - Do NOT initialize with README
#    - Click "Create repository"
#
# 2. Get a Personal Access Token:
#    - Go to: https://github.com/settings/tokens
#    - Generate new token (classic)
#    - Select: repo (full control)
#    - Copy the token
#
# 3. Replace YOUR_USERNAME and YOUR_TOKEN below

GITHUB_USERNAME="YOUR_USERNAME"  # Replace with your GitHub username
GITHUB_TOKEN="YOUR_TOKEN"        # Replace with your personal access token
REPO_NAME="gabstep-business-chat"

# Check if values are set
if [ "$GITHUB_USERNAME" = "YOUR_USERNAME" ] || [ "$GITHUB_TOKEN" = "YOUR_TOKEN" ]; then
    echo "❌ ERROR: Please edit this script and set your GitHub username and token"
    echo ""
    echo "Edit this file: PUSH_TO_GITHUB.sh"
    echo "Replace YOUR_USERNAME with your actual GitHub username"
    echo "Replace YOUR_TOKEN with your personal access token"
    exit 1
fi

echo "📁 Repository: $REPO_NAME"
echo "👤 User: $GITHUB_USERNAME"
echo ""

# Navigate to project
cd /project/workspace/gabstep-business-chat

# Add remote
echo "🔗 Adding GitHub remote..."
git remote add origin https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git

# Push main branch
echo "📤 Pushing main branch..."
git push -u origin main

# Push feature branch
echo "📤 Pushing feature branch..."
git push origin feature/gabstep-business-chat-implementation

echo ""
echo "✅ SUCCESS! Your code is now on GitHub!"
echo "🌐 Visit: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo ""
echo "======================================"
