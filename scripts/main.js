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
                } else if (presetName.indexOf("subzero-crags") !== -1) {
                    Vars.state.rules.attackMode = true;
                    Vars.state.rules.winWave = 0;
                    var cruxTeamSub = Packages.mindustry.game.Team.crux;
                    if (cruxTeamSub != null && cruxTeamSub.cores() != null && !cruxTeamSub.cores().isEmpty()) {
                        if (sec.info != null) {
                            sec.info.wasCaptured = false;
                        }
                    }
                    initSubzeroRebuilder();
                    Log.info("[CryogenicFrontiers] Initialized Subzero Crags Attack Mode & Auto-Rebuilder.");
                } else {
                    subzeroRebuilderActive = false;
                }
            } else {
                subzeroRebuilderActive = false;
            }
        } else {
            // Also enable in custom game or editor playtest if map name contains subzero crags
            if (Vars.state.map != null && Vars.state.map.name() != null) {
                var mapName = ("" + Vars.state.map.name()).toLowerCase();
                if (mapName.indexOf("subzero crags") !== -1) {
                    initSubzeroRebuilder();
                    Log.info("[CryogenicFrontiers] Initialized Subzero Crags Auto-Rebuilder for Custom Map.");
                } else {
                    subzeroRebuilderActive = false;
                }
            }
        }
    } catch (err) {
        Log.err("[CryogenicFrontiers] Error enforcing attack mode for sectors: " + err);
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

// ==============================================================================
// 6. Subzero Crags Crux Auto-Repair Bot System
// ==============================================================================

var subzeroRebuilderActive = false;
var builderRespawnTimer = 0;

function initSubzeroRebuilder() {
    subzeroRebuilderActive = true;
    builderRespawnTimer = 0;
    try {
        var cruxTeam = Packages.mindustry.game.Team.crux;
        var rule = Vars.state.rules.teams.get(cruxTeam);
        if (rule != null) {
            rule.buildAi = true;
            rule.infiniteResources = true;
            Log.info("[CryogenicFrontiers] Enabled Crux buildAi and infiniteResources for base repair.");
        }
    } catch(e) {
        Log.err("[CryogenicFrontiers] Error enabling Crux buildAi: " + e);
    }
}

function updateCruxRebuilder() {
    var cruxTeam = Packages.mindustry.game.Team.crux;
    if (cruxTeam == null || cruxTeam.cores() == null || cruxTeam.cores().isEmpty()) return;

    var core = cruxTeam.core();
    if (core == null) return;

    // Ensure Crux buildAi remains active
    var rule = Vars.state.rules.teams.get(cruxTeam);
    if (rule != null && !rule.buildAi) {
        rule.buildAi = true;
        rule.infiniteResources = true;
    }

    // Check if there are broken blocks in Crux base territory (x > 115)
    var hasCruxPlans = false;
    try {
        var teamData = cruxTeam.data();
        if (teamData != null && teamData.plans != null && !teamData.plans.isEmpty()) {
            var planSeq = teamData.plans;
            for (var p = 0; p < planSeq.size; p++) {
                var candidate = planSeq.get(p);
                if (candidate != null && candidate.x > 115) {
                    hasCruxPlans = true;
                    break;
                }
            }
        }
    } catch(err) {}

    // Find active Crux Frost Beta builder drone
    var activeBuilder = null;
    Groups.unit.each(cons(function(u) {
        if (u != null && !u.dead && u.team == cruxTeam && u.type != null) {
            var typeName = "" + u.type.name;
            if (typeName.indexOf("frost-beta") !== -1) {
                activeBuilder = u;
            }
        }
    }));

    // If drone does not exist, spawn replacement at Crux core
    if (activeBuilder == null) {
        if (builderRespawnTimer > 0) {
            builderRespawnTimer--;
            return;
        }
        try {
            var unitType = Vars.content.unit("cryogenic-frontiers-frost-beta");
            if (unitType != null) {
                activeBuilder = unitType.spawn(cruxTeam, core.x, core.y);
                if (activeBuilder != null) {
                    activeBuilder.add();
                    activeBuilder.controller(new Packages.mindustry.ai.types.NoAI());
                    builderRespawnTimer = 35 * 60; // 35 seconds cooldown if destroyed
                    Log.info("[CryogenicFrontiers] Deployed Crux Frost Beta base reconstruction bot.");
                }
            }
        } catch(err) {
            Log.err("[CryogenicFrontiers] Error spawning Crux builder bot: " + err);
        }
    }

    if (activeBuilder != null) {
        // Behavioral control:
        if (hasCruxPlans) {
            // Broken blocks exist in Crux base -> activate BuilderAI to reconstruct them
            if (!(activeBuilder.controller() instanceof Packages.mindustry.ai.types.BuilderAI)) {
                activeBuilder.controller(new Packages.mindustry.ai.types.BuilderAI());
            }
        } else {
            // No broken blocks exist -> park at Crux Core with NoAI so it NEVER attacks the player!
            if (!(activeBuilder.controller() instanceof Packages.mindustry.ai.types.NoAI)) {
                activeBuilder.controller(new Packages.mindustry.ai.types.NoAI());
            }
            if (activeBuilder.controller() != null) {
                activeBuilder.controller().target = null;
            }
            var cdx = core.x - activeBuilder.x;
            var cdy = core.y - activeBuilder.y;
            var cdist = Math.sqrt(cdx * cdx + cdy * cdy);
            if (cdist > 40) {
                activeBuilder.vel().set(cdx, cdy).limit(activeBuilder.speed());
            } else {
                activeBuilder.vel().scl(0.8);
            }
        }

        // Hard boundary tether: If the builder bot ever wanders to x < 125 tiles, immediately leash it back
        if (activeBuilder.x < 125 * 8) {
            activeBuilder.x = core.x;
            activeBuilder.y = core.y;
            activeBuilder.vel().set(0, 0);
            activeBuilder.controller(new Packages.mindustry.ai.types.NoAI());
        }
    }
}

// ------------------------------------------------------------------------------
// 7. World Tick Update Hook
// ------------------------------------------------------------------------------
var rebuilderTickCounter = 0;
Events.run(Packages.mindustry.game.EventType.Trigger.update, run(function() {
    try {
        if (Vars.state != null && Vars.state.isPlaying() && subzeroRebuilderActive) {
            rebuilderTickCounter++;
            // Check & update rebuilder bot every 30 ticks (0.5s)
            if (rebuilderTickCounter % 30 === 0) {
                updateCruxRebuilder();
            }
        }
    } catch(err) {
        Log.err("[CryogenicFrontiers] Error in rebuilder update: " + err);
    }
}));
