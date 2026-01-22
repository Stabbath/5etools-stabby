#!/bin/bash
# Create a branch with the current upstream state
# This script creates a branch that mirrors the upstream repository

set -e

echo "🔄 Creating upstream-sync branch..."

# Check if upstream remote exists
if ! git remote | grep -q "^upstream$"; then
    echo "➕ Adding upstream remote..."
    git remote add upstream https://github.com/5etools-mirror-3/5etools-src.git
else
    echo "✓ Upstream remote already exists"
fi

# Fetch upstream
echo "⬇️  Fetching upstream changes..."
git fetch upstream

# Branch name
BRANCH_NAME="upstream-sync"

# Check if branch already exists locally
if git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
    echo "⚠️  Local branch '$BRANCH_NAME' already exists."
    read -p "Do you want to delete and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git branch -D $BRANCH_NAME
    else
        echo "❌ Aborted. Please use a different branch name or delete the existing branch."
        exit 1
    fi
fi

# Create new branch from upstream/main
echo "📝 Creating branch '$BRANCH_NAME' from upstream/main..."
git checkout -b $BRANCH_NAME upstream/main

echo "⬆️  Pushing '$BRANCH_NAME' to origin..."
git push -u origin $BRANCH_NAME

echo ""
echo "✅ Successfully created '$BRANCH_NAME' branch!"
echo ""
echo "This branch now contains the latest upstream code."
echo "You can merge it into your main branch with:"
echo ""
echo "  git checkout master"
echo "  git merge $BRANCH_NAME"
echo "  git push origin master"
echo ""
echo "Or create a pull request on GitHub to review the changes before merging."
