# 5eTools - Stabby Fork

This is a fork of [5etools-mirror-3/5etools-src](https://github.com/5etools-mirror-3/5etools-src/).

## About 5eTools

5eTools is a suite of browser-based tools for Dungeons & Dragons 5th Edition players and Dungeon Masters.

## Syncing with Upstream

This fork can be kept in sync with the upstream repository. For detailed instructions on how to sync with the latest changes from upstream, see [SYNC_UPSTREAM.md](./SYNC_UPSTREAM.md).

### Quick Sync Guide

**Method 1: Create a separate branch with upstream code (Recommended)**

```bash
./create-upstream-branch.sh
```

This creates an `upstream-sync` branch that you can review and merge via pull request or directly.

**Method 2: Direct sync with helper script**

```bash
./sync-upstream.sh
```

**Method 3: Manual sync**

```bash
# Add upstream remote (first time only)
git remote add upstream https://github.com/5etools-mirror-3/5etools-src.git

# Fetch and merge upstream changes
git fetch upstream
git checkout master
git merge upstream/main
git push origin master
```

### Automated Sync

This repository includes a GitHub Actions workflow that automatically syncs with upstream daily. The workflow can also be triggered manually from the Actions tab.

## Development

For development instructions, please refer to the upstream repository documentation.

## License

See [LICENSE.md](./LICENSE.md) for license information.
