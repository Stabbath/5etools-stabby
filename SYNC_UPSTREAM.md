# Syncing with Upstream

This repository is a fork of [5etools-mirror-3/5etools-src](https://github.com/5etools-mirror-3/5etools-src/). This guide explains how to sync your fork with the upstream repository to keep it up-to-date.

## Method 1: Create Upstream Branch (Recommended)

The easiest approach is to create a separate branch that mirrors the upstream repository, then merge it when ready:

```bash
./create-upstream-branch.sh
```

This script will:
1. Add the upstream remote (if not already added)
2. Fetch the latest upstream changes
3. Create an `upstream-sync` branch based on `upstream/main`
4. Push the branch to your repository

Once the branch is created, you can:
- **Review changes** on GitHub by comparing branches
- **Create a Pull Request** to merge upstream changes with review
- **Merge directly** if you're confident: `git checkout master && git merge upstream-sync && git push`

This approach gives you full control and visibility over what's being merged.

## Method 2: Quick Sync with Helper Script

The easiest way to sync is to use the provided helper script:

```bash
./sync-upstream.sh
```

Or to sync a specific branch:

```bash
./sync-upstream.sh branch-name
```

The script will:
- Add the upstream remote if it doesn't exist
- Fetch upstream changes
- Merge upstream changes into your branch
- Push the updated branch to your fork

## Manual Sync Process

If you prefer to sync manually or need more control, follow these steps:

### 1. Add the Upstream Remote (One-time setup)

If you haven't already added the upstream remote, do so with:

```bash
git remote add upstream https://github.com/5etools-mirror-3/5etools-src.git
```

Verify the remote was added:

```bash
git remote -v
```

You should see:
```
origin    https://github.com/Stabbath/5etools-stabby (fetch)
origin    https://github.com/Stabbath/5etools-stabby (push)
upstream  https://github.com/5etools-mirror-3/5etools-src.git (fetch)
upstream  https://github.com/5etools-mirror-3/5etools-src.git (push)
```

### 2. Fetch Upstream Changes

Fetch the latest changes from the upstream repository:

```bash
git fetch upstream
```

### 3. Checkout Your Main Branch

Make sure you're on the branch you want to sync (usually `master` or `main`):

```bash
git checkout master
```

### 4. Merge or Rebase Upstream Changes

**Note:** The upstream repository uses `main` as its default branch, while your fork may use `master`.

You have two options:

#### Option A: Merge (Recommended for preserving history)

```bash
git merge upstream/main
```

This creates a merge commit and preserves the complete history of both branches.

#### Option B: Rebase (For a linear history)

```bash
git rebase upstream/main
```

This replays your commits on top of the upstream changes, creating a linear history.

**Note:** If you have already pushed your branch, rebasing will require a force push (`git push --force`), which can be dangerous if others are working on the same branch.

### 5. Resolve Conflicts (if any)

If there are conflicts, Git will notify you. You'll need to:

1. Open the conflicted files
2. Resolve the conflicts manually
3. Stage the resolved files: `git add <file>`
4. Complete the merge: `git merge --continue` (or `git rebase --continue` if rebasing)

### 6. Push Changes to Your Fork

```bash
git push origin master
```

If you rebased and need to force push (use with caution):

```bash
git push --force-with-lease origin master
```

## Automated Sync with GitHub Actions

You can automate syncing with upstream using GitHub Actions. Create a workflow file at `.github/workflows/sync-upstream.yml`:

```yaml
name: Sync with Upstream

on:
  schedule:
    # Run daily at 00:00 UTC
    - cron: '0 0 * * *'
  workflow_dispatch: # Allows manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Configure Git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
      
      - name: Add upstream remote
        run: |
          git remote add upstream https://github.com/5etools-mirror-3/5etools-src.git || true
          git fetch upstream
      
      - name: Merge upstream changes
        run: |
          git merge upstream/main --no-edit || echo "Merge conflicts detected"
      
      - name: Push changes
        run: |
          git push origin master || echo "Push failed - may need manual intervention"
```

## Syncing Specific Branches

If you need to sync a different branch:

```bash
# Fetch upstream
git fetch upstream

# Checkout your branch
git checkout your-branch-name

# Merge upstream branch (upstream uses 'main')
git merge upstream/main

# Push to your fork
git push origin your-branch-name
```

## Best Practices

1. **Always sync before starting new work** - Fetch and merge upstream changes before creating new branches
2. **Review changes** - Use `git log upstream/main..master` to see what changes will be merged
3. **Test after syncing** - Run tests to ensure upstream changes don't break your custom modifications
4. **Keep custom changes minimal** - The more you diverge from upstream, the harder syncing becomes
5. **Use feature branches** - Make custom changes in feature branches, keeping master close to upstream

## Troubleshooting

### Problem: Conflicts during merge

**Solution:** Resolve conflicts manually, then complete the merge:
```bash
# Edit conflicted files
git add <resolved-files>
git merge --continue
```

### Problem: "fatal: refusing to merge unrelated histories"

**Solution:** Use the `--allow-unrelated-histories` flag:
```bash
git merge upstream/main --allow-unrelated-histories
```

### Problem: Want to discard local changes and match upstream exactly

**Solution:** Reset your branch to match upstream:
```bash
git fetch upstream
git reset --hard upstream/main
git push --force origin master
```

**Warning:** This will permanently delete any local commits!

## Additional Resources

- [GitHub Docs: Syncing a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)
- [Git Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
