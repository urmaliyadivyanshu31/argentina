#!/bin/bash

# Script to push code to theatharv1/argentina-loops
# Usage: ./push-to-theatharv1.sh <GITHUB_TOKEN>

if [ -z "$1" ]; then
    echo "❌ Error: GitHub token required"
    echo ""
    echo "Usage: ./push-to-theatharv1.sh <GITHUB_TOKEN>"
    echo ""
    echo "To get a token, theatharv1 should:"
    echo "1. Go to https://github.com/settings/tokens"
    echo "2. Generate new token (classic)"
    echo "3. Select 'repo' scope"
    echo "4. Copy the token (starts with ghp_)"
    echo "5. Run: ./push-to-theatharv1.sh ghp_xxxxx"
    exit 1
fi

TOKEN=$1

echo "🚀 Pushing to theatharv1/argentina-loops..."
echo ""

# Set the remote with token
git remote remove origin 2>/dev/null || true
git remote add origin https://${TOKEN}@github.com/theatharv1/argentina-loops.git

# Push all commits
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Code pushed to:"
    echo "   https://github.com/theatharv1/argentina-loops"
    echo ""
    echo "🔒 Cleaning up token from git config..."
    git remote remove origin
    git remote add origin https://github.com/theatharv1/argentina-loops.git
    echo "✅ Done!"
else
    echo ""
    echo "❌ Failed to push. Check:"
    echo "   1. Token is valid"
    echo "   2. Token has 'repo' scope"
    echo "   3. theatharv1 owns the repository"
fi
