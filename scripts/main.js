// ==============================================================================
// Cryogenic Frontiers - Master Script for Planet Nivalis
// ==============================================================================

var Attribute = Packages.mindustry.world.meta.Attribute;
var Attributes = Packages.mindustry.world.meta.Attributes;
var Blocks = Packages.mindustry.content.Blocks;

// ------------------------------------------------------------------------------
// 1. Hydro Power Attribute Patching
// Enables shallow water tiles to provide water attribute for Cryo Hydro-Turbine
// ------------------------------------------------------------------------------
function patchWaterAttributes() {
    try {
        var waterFloors = [
            Blocks.water,
            Blocks.sandWater,
            Blocks.darksandWater,
            Blocks.taintedWater,
            Blocks.darksandTaintedWater
        ];

        for (var i = 0; i < waterFloors.length; i++) {
            var floor = waterFloors[i];
            if (floor != null) {
                if (floor.attributes == null) {
                    floor.attributes = new Attributes();
                }
                floor.attributes.set(Attribute.water, 0.25);
            }
        }
        Log.info("[CryogenicFrontiers] Shallow water hydro attributes active (0.25 water attribute per tile).");
    } catch (err) {
        Log.err("[CryogenicFrontiers] Failed to patch water attributes: " + err);
    }
}

// ------------------------------------------------------------------------------
// 2. Safe Content Resolver
// ------------------------------------------------------------------------------
function getBlock(name) {
    return Vars.content.block("cryogenic-frontiers-" + name) || Vars.content.block(name);
}

// ------------------------------------------------------------------------------
// 3. Core Loadout Registration for Sector Launching
// Ensures Core: Frost launches with mod items (Glacite, Shale, Quartz)
// ------------------------------------------------------------------------------
function registerCoreFrostLoadout() {
    try {
        var coreFrost = getBlock("core-frost");
        if (coreFrost == null) return;

        var Stile = Packages.mindustry.game.Schematic.Stile;
        var Schematic = Packages.mindustry.game.Schematic;

        var tiles = new Packages.arc.struct.Seq();
        tiles.add(new Stile(coreFrost, 0, 0, null, 0));
        var tags = new Packages.arc.struct.StringMap();
        tags.put("name", "Core: Frost");
        var schem = new Schematic(tiles, tags, 3, 3);

        // Add to loadouts cache
        var loadoutsSeq = Vars.schematics.getLoadouts().get(coreFrost);
        if (loadoutsSeq == null) {
            loadoutsSeq = new Packages.arc.struct.Seq();
            Vars.schematics.getLoadouts().put(coreFrost, loadoutsSeq);
        }
        if (!loadoutsSeq.contains(schem)) {
            loadoutsSeq.add(schem);
        }

        // Set as default loadout via reflection so getDefaultLoadout(coreFrost) returns schem
        var f = Vars.schematics.getClass().getDeclaredField("defaultLoadouts");
        f.setAccessible(true);
        var map = f.get(Vars.schematics);
        map.put(coreFrost, schem);

        Log.info("[CryogenicFrontiers] Registered default launch loadout for Core: Frost.");
    } catch (err) {
        Log.err("[CryogenicFrontiers] Failed to register core loadout: " + err);
    }
}

// ------------------------------------------------------------------------------
// 4. World Load Hook
// ------------------------------------------------------------------------------
Events.on(EventType.WorldLoadEvent, cons(function(e) {
    patchWaterAttributes();

    try {
        if (Vars.state.isCampaign()) {
            var sec = Vars.state.getSector();
            if (sec != null && sec.preset != null) {
                var presetName = "" + sec.preset.name;
                if (presetName.indexOf("quartz-valley") !== -1) {
                    Vars.state.rules.attackMode = true;
                    Vars.state.rules.winWave = 0;
                    var cruxTeam = Packages.mindustry.game.Team.crux;
                    if (cruxTeam != null && cruxTeam.cores() != null && !cruxTeam.cores().isEmpty()) {
                        if (sec.info != null) {
                            sec.info.wasCaptured = false;
                        }
                    }
                    Log.info("[CryogenicFrontiers] Enforced Quartz Valley Attack Mode (winWave=0, enemy core present).");
                }
            }
        }
    } catch (err) {
        Log.err("[CryogenicFrontiers] Error enforcing attack mode for Quartz Valley: " + err);
    }
}));

// ------------------------------------------------------------------------------
// 5. Client Load Hook
// ------------------------------------------------------------------------------
Events.on(EventType.ClientLoadEvent, cons(function(e) {
    patchWaterAttributes();

    try {
        var grass = Core.atlas.find("grass1");
        var tiles = [
            "cryogenic-frontiers-frost-stone1",
            "cryogenic-frontiers-glacial-snow1",
            "cryogenic-frontiers-permafrost-ice1",
            "cryogenic-frontiers-frost-stone-wall1",
            "cryogenic-frontiers-permafrost-ice-wall1",
            "cryogenic-frontiers-cryo-boulder1"
        ];
        var allOk = true;
        for (var i = 0; i < tiles.length; i++) {
            var reg = Core.atlas.find(tiles[i]);
            if (!reg || !reg.found() || reg.texture != grass.texture) {
                allOk = false;
                Log.err("[CryogenicFrontiers] Tile NOT on env page: " + tiles[i]);
            }
        }
        Log.info("[CryogenicFrontiers] All environment tiles on environment page: " + allOk);
    } catch (ex) {
        Log.err("[CryogenicFrontiers] Texture verify error: " + ex);
    }

    registerCoreFrostLoadout();
}));

// Initial immediate execution
patchWaterAttributes();
registerCoreFrostLoadout();
