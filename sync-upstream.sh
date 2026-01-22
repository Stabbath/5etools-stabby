#!/bin/bash
# Sync with upstream repository
# This script helps sync the fork with the upstream repository

set -e

echo "🔄 Syncing fork with upstream repository..."

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

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Default to master if no branch specified
TARGET_BRANCH=${1:-master}

# Switch to target branch if not already on it
if [ "$CURRENT_BRANCH" != "$TARGET_BRANCH" ]; then
    echo "🔀 Switching to $TARGET_BRANCH branch..."
    git checkout "$TARGET_BRANCH"
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Warning: You have uncommitted changes."
    echo "Please commit or stash your changes before syncing."
    exit 1
fi

# Check if upstream has new commits
UPSTREAM_COMMIT=$(git rev-parse upstream/$TARGET_BRANCH)
LOCAL_COMMIT=$(git rev-parse HEAD)

if [ "$UPSTREAM_COMMIT" = "$LOCAL_COMMIT" ]; then
    echo "✓ Already up to date with upstream/$TARGET_BRANCH"
    exit 0
fi

echo "🔀 Merging upstream/$TARGET_BRANCH..."
if git merge upstream/$TARGET_BRANCH --no-edit; then
    echo "✓ Successfully merged upstream changes"
    
    echo "⬆️  Pushing changes to origin..."
    git push origin "$TARGET_BRANCH"
    
    echo "✅ Sync complete!"
else
    echo "❌ Merge conflicts detected!"
    echo "Please resolve conflicts manually and run:"
    echo "  git add <resolved-files>"
    echo "  git merge --continue"
    echo "  git push origin $TARGET_BRANCH"
    exit 1
fi
