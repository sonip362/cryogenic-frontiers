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
                    resetSubzeroCragsState();
                    Log.info("[CryogenicFrontiers] Initialized Subzero Crags Combat AI & Attack Mode.");
                } else {
                    subzeroState.active = false;
                }
            } else {
                subzeroState.active = false;
            }
        } else {
            // Also enable in custom game if map name contains subzero crags
            if (Vars.state.map != null && Vars.state.map.name() != null) {
                var mapName = "" + Vars.state.map.name();
                if (mapName.toLowerCase().indexOf("subzero crags") !== -1) {
                    resetSubzeroCragsState();
                    Log.info("[CryogenicFrontiers] Initialized Subzero Crags Combat AI for Custom Map.");
                } else {
                    subzeroState.active = false;
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
// 6. Subzero Crags Specialized Combat Systems
// ==============================================================================

var subzeroState = {
    active: false,
    timer: 0,
    builderRespawnTimer: 0,
    assaultingUnits: {},
    lastStagedTimeBoreas: 0,
    lastStagedTimeIcebreaker: 0
};

function resetSubzeroCragsState() {
    subzeroState.active = true;
    subzeroState.timer = 0;
    subzeroState.builderRespawnTimer = 0;
    subzeroState.assaultingUnits = {};
    subzeroState.lastStagedTimeBoreas = 0;
    subzeroState.lastStagedTimeIcebreaker = 0;

    // Enable buildAi for Team Crux so BuilderAI actively reconstructs broken blocks
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

function getSquadThreshold() {
    var minutes = subzeroState.timer / 3600;
    if (minutes < 6) return 2;       // 0 - 6 min: 2 units
    if (minutes < 12) return 3;      // 6 - 12 min: 3 units
    if (minutes < 18) return 4;      // 12 - 18 min: 4 units
    if (minutes < 25) return 5;      // 18 - 25 min: 5-6 units
    return 7;                        // 25+ min: 7-8 units
}

// Staging AI for flying units (Boreas) - holds position in Crux airspace
var AirStagingAI = extend(Packages.mindustry.ai.types.FlyingAI, {
    updateMovement: function() {
        if (this.unit == null) return;
        var stagingX = 170 * 8;
        var stagingY = 106 * 8;
        var dx = stagingX - this.unit.x;
        var dy = stagingY - this.unit.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 35) {
            var speed = this.unit.speed();
            this.unit.moveAt(new Packages.arc.math.geom.Vec2(dx, dy).limit(speed));
        } else {
            this.unit.vel.scl(0.9);
        }
    }
});

// Staging AI for naval units (Icebreaker) - holds position in Crux waters
var NavalStagingAI = extend(Packages.mindustry.ai.types.GroundAI, {
    updateMovement: function() {
        if (this.unit == null) return;
        var stagingX = 170 * 8;
        var stagingY = 106 * 8;
        var dx = stagingX - this.unit.x;
        var dy = stagingY - this.unit.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 45) {
            var speed = this.unit.speed();
            this.unit.moveAt(new Packages.arc.math.geom.Vec2(dx, dy).limit(speed));
        } else {
            this.unit.vel.scl(0.9);
        }
    }
});

function updateSubzeroSquadrons() {
    var cruxTeam = Packages.mindustry.game.Team.crux;
    if (cruxTeam == null) return;

    var threshold = getSquadThreshold();
    var currentStagedBoreas = [];
    var currentStagedIcebreaker = [];

    Groups.unit.each(cons(function(u) {
        if (u == null || u.dead || u.team != cruxTeam) return;
        var typeName = u.type != null ? ("" + u.type.name) : "";
        var isBoreas = typeName.indexOf("boreas") !== -1;
        var isIcebreaker = typeName.indexOf("icebreaker") !== -1;
        if (!isBoreas && !isIcebreaker) return;

        var uid = u.id();
        // If already launched in an assault, allow native AI to attack
        if (subzeroState.assaultingUnits[uid]) {
            return;
        }

        // If unit is in Crux territory (x > 115 * 8), hold in staging
        if (u.x > 115 * 8) {
            if (isBoreas) {
                if (!(u.controller() instanceof AirStagingAI)) {
                    u.controller(new AirStagingAI());
                }
                currentStagedBoreas.push(u);
            } else if (isIcebreaker) {
                if (!(u.controller() instanceof NavalStagingAI)) {
                    u.controller(new NavalStagingAI());
                }
                currentStagedIcebreaker.push(u);
            }
        }
    }));

    // Boreas squadron launch check
    if (currentStagedBoreas.length > 0) {
        if (subzeroState.lastStagedTimeBoreas === 0) {
            subzeroState.lastStagedTimeBoreas = subzeroState.timer;
        }
        var elapsedBoreas = (subzeroState.timer - subzeroState.lastStagedTimeBoreas) / 60;
        if (currentStagedBoreas.length >= threshold || elapsedBoreas > 150) {
            for (var i = 0; i < currentStagedBoreas.length; i++) {
                var unitB = currentStagedBoreas[i];
                subzeroState.assaultingUnits[unitB.id()] = true;
                // Restore native assault AI
                unitB.controller(unitB.type.createController());
            }
            subzeroState.lastStagedTimeBoreas = 0;
            Log.info("[CryogenicFrontiers] Crux launched Boreas squadron (" + currentStagedBoreas.length + " units, Threshold: " + threshold + ")");
        }
    } else {
        subzeroState.lastStagedTimeBoreas = 0;
    }

    // Icebreaker fleet launch check
    if (currentStagedIcebreaker.length > 0) {
        if (subzeroState.lastStagedTimeIcebreaker === 0) {
            subzeroState.lastStagedTimeIcebreaker = subzeroState.timer;
        }
        var elapsedIce = (subzeroState.timer - subzeroState.lastStagedTimeIcebreaker) / 60;
        if (currentStagedIcebreaker.length >= threshold || elapsedIce > 150) {
            for (var j = 0; j < currentStagedIcebreaker.length; j++) {
                var unitI = currentStagedIcebreaker[j];
                subzeroState.assaultingUnits[unitI.id()] = true;
                // Restore native assault AI
                unitI.controller(unitI.type.createController());
            }
            subzeroState.lastStagedTimeIcebreaker = 0;
            Log.info("[CryogenicFrontiers] Crux launched Icebreaker fleet (" + currentStagedIcebreaker.length + " units, Threshold: " + threshold + ")");
        }
    } else {
        subzeroState.lastStagedTimeIcebreaker = 0;
    }
}

function updateCruxRebuilder() {
    var cruxTeam = Packages.mindustry.game.Team.crux;
    if (cruxTeam == null || cruxTeam.cores() == null || cruxTeam.cores().isEmpty()) return;

    var core = cruxTeam.core();
    if (core == null) return;

    // Ensure Crux buildAi is active
    var rule = Vars.state.rules.teams.get(cruxTeam);
    if (rule != null && !rule.buildAi) {
        rule.buildAi = true;
        rule.infiniteResources = true;
    }

    // 1. Maintain active Frost Beta builder drone
    var activeBuilder = null;
    Groups.unit.each(cons(function(u) {
        if (u != null && !u.dead && u.team == cruxTeam && u.type != null) {
            var typeName = "" + u.type.name;
            if (typeName.indexOf("frost-beta") !== -1) {
                activeBuilder = u;
            }
        }
    }));

    if (activeBuilder == null) {
        if (subzeroState.builderRespawnTimer > 0) {
            subzeroState.builderRespawnTimer--;
            return;
        }
        // Spawn Frost Beta constructor drone at Crux core with BuilderAI
        try {
            var unitType = Vars.content.unit("cryogenic-frontiers-frost-beta");
            if (unitType != null) {
                activeBuilder = unitType.spawn(cruxTeam, core.x, core.y);
                if (activeBuilder != null) {
                    activeBuilder.add();
                    activeBuilder.controller(new Packages.mindustry.ai.types.BuilderAI());
                    subzeroState.builderRespawnTimer = 35 * 60; // 35 seconds cooldown if destroyed
                    Log.info("[CryogenicFrontiers] Deployed Crux Frost Beta base reconstruction bot with BuilderAI.");
                }
            }
        } catch(err) {
            Log.err("[CryogenicFrontiers] Error spawning Crux builder bot: " + err);
        }
    } else {
        // Ensure its controller is BuilderAI
        if (!(activeBuilder.controller() instanceof Packages.mindustry.ai.types.BuilderAI)) {
            activeBuilder.controller(new Packages.mindustry.ai.types.BuilderAI());
        }
    }
}

// ------------------------------------------------------------------------------
// 7. World Tick Update Hook
// ------------------------------------------------------------------------------
var subzeroTickCounter = 0;
Events.run(Packages.mindustry.game.EventType.Trigger.update, run(function() {
    try {
        if (Vars.state != null && Vars.state.isPlaying() && subzeroState.active) {
            subzeroState.timer++;
            subzeroTickCounter++;

            // Every 30 ticks (0.5s): update squadrons
            if (subzeroTickCounter % 30 === 0) {
                updateSubzeroSquadrons();
            }

            // Every 60 ticks (1.0s): update rebuilder bot
            if (subzeroTickCounter % 60 === 0) {
                updateCruxRebuilder();
            }
        }
    } catch(err) {
        // Keep game loop running safely
    }
}));
