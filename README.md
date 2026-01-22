# Fork'd

This is a fork of 5e.tools, see below.

It contains my personal homebrew files, plus a minor UI update to allow Rarity on mundane items and Cost on magic items.

## Custom Pricing / Patching Workflow
To apply custom modifications (like prices) directly to the official data files (avoiding circular dependency issues with homebrew `_copy`):

1. Edit your patches in `patches/items-price.json`.
   - Format: `"Item Name|SOURCE": { "value": 5000 }`
2. Run the patcher script:
   ```bash
   node node/patch-data.cjs
   ```
   This will modify `data/items.json` in place.
3. Deploy/Build as normal.

To update from upstream:
1. `git checkout data/items.json` (Discard local patches)
2. `git pull` (Get upstream changes)
3. `node node/patch-data.js` (Re-apply your patches)

# 5e.tools

Visit the [main site](https://5e.tools/index.html) or go to the unofficial GitHub [mirror](index.html).

[Join the 5etools Discord here!](https://discord.gg/5etools)

## Help and Support

Please see [our wiki](https://wiki.tercept.net/) for FAQs, installation guides, supported integrations, and more.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project, except for the files included in the homebrew directory, is licensed under the terms of the MIT license.
