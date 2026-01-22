const fs = require('fs');
const path = require('path');

// Configuration
const PATH_DATA = './data/items.json';
const PATH_PATCH = './patches/items-price.json';

function runPatch() {
	if (!fs.existsSync(PATH_PATCH)) {
		console.log(`No patch file found at ${PATH_PATCH}, skipping.`);
		return;
	}

	console.log(`Loading patches from ${PATH_PATCH}...`);
	const patchData = JSON.parse(fs.readFileSync(PATH_PATCH, 'utf8'));
	const officialData = JSON.parse(fs.readFileSync(PATH_DATA, 'utf8'));

	let patchCount = 0;

	// Create a lookup map for the official items for O(1) access
	// We key by "Name|Source" (case insensitive match is safer)
	const itemMap = new Map();
	officialData.item.forEach((it, index) => {
		const key = `${it.name.toLowerCase()}|${it.source.toLowerCase()}`;
		itemMap.set(key, index);
	});

	// Apply patches
	Object.entries(patchData).forEach(([key, changes]) => {
		const lookupKey = key.toLowerCase();
		
		const targetIndex = itemMap.get(lookupKey);

		if (targetIndex !== undefined) {
			const targetItem = officialData.item[targetIndex];
			
			// Apply fields (Merge logic)
			Object.entries(changes).forEach(([field, value]) => {
				// Special handling if you want to merge arrays/objects, 
				// but for prices (primitive values), direct assignment is best.
				targetItem[field] = value;
			});

			patchCount++;
		} else {
			console.warn(`[WARNING] Patch target not found in official data: ${key}`);
		}
	});

	console.log(`Applied ${patchCount} patches to ${PATH_DATA}`);
	
	// Write back to disk
	fs.writeFileSync(PATH_DATA, JSON.stringify(officialData, null, '\t'), 'utf8');
}

runPatch();