const fs = require('fs');
const path = require('path');

// Configuration
const PATH_ITEMS = './data/items.json';
const PATH_MAGICVARIANTS = './data/magicvariants.json';
const PATH_PATCH = './patches/items-price.json';

function runPatch() {
	if (!fs.existsSync(PATH_PATCH)) {
		console.log(`No patch file found at ${PATH_PATCH}, skipping.`);
		return;
	}

	console.log(`Loading patches from ${PATH_PATCH}...`);
	const patchData = JSON.parse(fs.readFileSync(PATH_PATCH, 'utf8'));

	// Separate patches by type
	const itemPatches = {};
	const magicvariantPatches = {};
	
	Object.entries(patchData).forEach(([key, value]) => {
		if (key.startsWith('magicvariant:')) {
			// Remove the prefix for lookup
			const cleanKey = key.substring('magicvariant:'.length);
			magicvariantPatches[cleanKey] = value;
		} else {
			itemPatches[key] = value;
		}
	});

	// Patch items.json
	if (Object.keys(itemPatches).length > 0) {
		console.log(`\nPatching items.json...`);
		patchFile(PATH_ITEMS, 'item', itemPatches);
	}

	// Patch magicvariants.json
	if (Object.keys(magicvariantPatches).length > 0) {
		console.log(`\nPatching magicvariants.json...`);
		patchFile(PATH_MAGICVARIANTS, 'magicvariant', magicvariantPatches);
	}
}

function patchFile(filePath, arrayKey, patches) {
	if (!fs.existsSync(filePath)) {
		console.log(`File not found: ${filePath}, skipping.`);
		return;
	}

	const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
	let patchCount = 0;

	// Create a lookup map for O(1) access
	const itemMap = new Map();
	data[arrayKey].forEach((it, index) => {
		// Some magic variants might not have a source
		const source = it.source || it.inherits?.source || '';
		const key = `${it.name.toLowerCase()}|${source.toLowerCase()}`;
		itemMap.set(key, index);
	});

	// For magic variants, also create a name-only map (no source)
	const nameOnlyMap = arrayKey === 'magicvariant' ? new Map() : null;
	if (nameOnlyMap) {
		data[arrayKey].forEach((it, index) => {
			const key = it.name.toLowerCase();
			nameOnlyMap.set(key, index);
		});
	}

	// Apply patches
	Object.entries(patches).forEach(([key, changes]) => {
		const lookupKey = key.toLowerCase();
		
		// Try name|source first
		let targetIndex = itemMap.get(lookupKey);
		
		// For magic variants, also try name-only lookup
		if (targetIndex === undefined && nameOnlyMap) {
			targetIndex = nameOnlyMap.get(lookupKey);
		}

		if (targetIndex !== undefined) {
			const targetItem = data[arrayKey][targetIndex];
			
			// Apply fields (special handling for valueExpression in inherits)
			Object.entries(changes).forEach(([field, value]) => {
				if (field === 'valueExpression' && targetItem.inherits) {
					// Put valueExpression in inherits for magic variants
					targetItem.inherits[field] = value;
				} else if (field === 'value' && targetItem.inherits && targetItem.value === undefined) {
					// If value doesn't exist at root but inherits does, put it at root
					targetItem[field] = value;
				} else {
					targetItem[field] = value;
				}
			});

			patchCount++;
		} else {
			console.warn(`[WARNING] Patch target not found in ${filePath}: ${key}`);
		}
	});

	console.log(`Applied ${patchCount} patches to ${filePath}`);
	
	// Write back to disk
	fs.writeFileSync(filePath, JSON.stringify(data, null, '\t'), 'utf8');
}

runPatch();