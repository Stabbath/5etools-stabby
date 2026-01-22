
const fs = require('fs');

function readJsonFile(path) {
    const data = fs.readFileSync(path, 'utf8');
    // Strip BOM if present
    const cleanData = data.replace(/^\uFEFF/, '');
    return JSON.parse(cleanData);
}

try {
    const userItems = readJsonFile('data/items.json');
    const officialItems = readJsonFile('temp_official_items.json');

    // Create a map of official items for fast lookup
    const officialItemMap = new Map();
    officialItems.item.forEach(it => {
        // Key by name + source (standard 5etools ID)
        const key = `${it.name.toLowerCase()}|${it.source.toLowerCase()}`;
        officialItemMap.set(key, it);
    });

    const homebrew = {
        _meta: {
            sources: [
                {
                    json: "StabbyHomebrew",
                    abbreviation: "Stabby",
                    full: "Stabby's Custom Prices",
                    authors: ["User"],
                    version: "1.0.0",
                    url: "",
                    targetSchema: "1.0.0" 
                }
            ],
            dateAdded: Math.floor(Date.now() / 1000)
        },
        item: []
    };

    let migrationCount = 0;

    userItems.item.forEach(userIt => {
        const key = `${userIt.name.toLowerCase()}|${userIt.source.toLowerCase()}`;
        const officialIt = officialItemMap.get(key);

        if (officialIt) {
            // Check if value/cost is different or added
            let hasPriceChange = false;
            
            // Check 'value' field (in copper pieces typically)
            // Sometimes value is a number (cp), sometimes formatted string? Usually integer.
            if (userIt.value !== undefined) {
                 if (officialIt.value === undefined || JSON.stringify(userIt.value) !== JSON.stringify(officialIt.value)) {
                     hasPriceChange = true;
                 }
            }
            
            if (hasPriceChange) {
                // Construct the _copy entity
                const copyEntry = {
                    name: userIt.name,
                    source: userIt.source,
                    _copy: {
                        name: userIt.name,
                        source: userIt.source,
                        _mod: {
                            value: userIt.value
                        }
                    }
                };
                
                homebrew.item.push(copyEntry);
                migrationCount++;
            }
        }
    });

    console.log(`Migrated prices for ${migrationCount} items.`);
    fs.writeFileSync('homebrew/stabby-prices.json', JSON.stringify(homebrew, null, '\t'));

} catch (e) {
    console.error(e);
}
