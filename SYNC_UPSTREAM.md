# Syncing with Upstream

This repository is a fork of [5etools-mirror-3/5etools-src](https://github.com/5etools-mirror-3/5etools-src/). This guide explains how to sync your fork with the upstream repository to keep it up-to-date.

## Manual Sync Process

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

You have two options:

#### Option A: Merge (Recommended for preserving history)

```bash
git merge upstream/master
```

This creates a merge commit and preserves the complete history of both branches.

#### Option B: Rebase (For a linear history)

```bash
git rebase upstream/master
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
          git merge upstream/master --no-edit || echo "Merge conflicts detected"
      
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

# Merge upstream branch
git merge upstream/branch-name

# Push to your fork
git push origin your-branch-name
```

## Best Practices

1. **Always sync before starting new work** - Fetch and merge upstream changes before creating new branches
2. **Review changes** - Use `git log upstream/master..master` to see what changes will be merged
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
git merge upstream/master --allow-unrelated-histories
```

### Problem: Want to discard local changes and match upstream exactly

**Solution:** Reset your branch to match upstream:
```bash
git fetch upstream
git reset --hard upstream/master
git push --force origin master
```

**Warning:** This will permanently delete any local commits!

## Additional Resources

- [GitHub Docs: Syncing a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)
- [Git Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
