# 5eTools - Stabby Fork

This is a fork of [5etools-mirror-3/5etools-src](https://github.com/5etools-mirror-3/5etools-src/).

## About 5eTools

5eTools is a suite of browser-based tools for Dungeons & Dragons 5th Edition players and Dungeon Masters.

## Syncing with Upstream

This fork is kept in sync with the upstream repository. For instructions on how to sync with the latest changes from upstream, see [SYNC_UPSTREAM.md](./SYNC_UPSTREAM.md).

### Quick Sync Guide

```bash
# Add upstream remote (first time only)
git remote add upstream https://github.com/5etools-mirror-3/5etools-src.git

# Fetch and merge upstream changes
git fetch upstream
git checkout master
git merge upstream/master
git push origin master
```

### Automated Sync

This repository includes a GitHub Actions workflow that automatically syncs with upstream daily. The workflow can also be triggered manually from the Actions tab.

## Development

For development instructions, please refer to the upstream repository documentation.

## License

See [LICENSE.md](./LICENSE.md) for license information.
