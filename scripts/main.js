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
                    initSubzeroCombat();
                    Log.info("[CryogenicFrontiers] Initialized Subzero Crags Attack Mode & Combat AI.");
                } else {
                    subzeroCombatActive = false;
                }
            } else {
                subzeroCombatActive = false;
            }
        } else {
            // Also enable in custom game or editor playtest if map name contains subzero crags
            if (Vars.state.map != null && Vars.state.map.name() != null) {
                var mapName = ("" + Vars.state.map.name()).toLowerCase();
                if (mapName.indexOf("subzero crags") !== -1) {
                    initSubzeroCombat();
                    Log.info("[CryogenicFrontiers] Initialized Subzero Crags Combat AI for Custom Map.");
                } else {
                    subzeroCombatActive = false;
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
// 6. Subzero Crags Crux Combat AI: Base Auto-Repair & Squadron Staging System
// ==============================================================================

var subzeroCombatActive = false;
var subzeroCombatTimer = 0;
var builderRespawnTimer = 0;
var stagedUnitIds = {};
var assaultingUnitIds = {};
var lastStagedTimeBoreas = 0;
var lastStagedTimeIcebreaker = 0;

function initSubzeroCombat() {
    subzeroCombatActive = true;
    subzeroCombatTimer = 0;
    builderRespawnTimer = 0;
    stagedUnitIds = {};
    assaultingUnitIds = {};
    lastStagedTimeBoreas = 0;
    lastStagedTimeIcebreaker = 0;

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

// Dynamic squad threshold: starts at 2 units in early game, scales up over time
function getSquadThreshold() {
    var minutes = subzeroCombatTimer / (60 * 60);
    if (minutes < 5) {
        return 2; // 0-5 min: 2 units at a time
    } else if (minutes < 10) {
        return 3; // 5-10 min: 3 units
    } else if (minutes < 16) {
        return 4; // 10-16 min: 4 units
    } else if (minutes < 24) {
        return 5; // 16-24 min: 5 units
    } else {
        return 6; // 24+ min: 6 units
    }
}

// Steers waiting units into position while holding in staging
function updateSubzeroStagedMovement() {
    var cruxTeam = Packages.mindustry.game.Team.crux;
    if (cruxTeam == null) return;

    // Rally waypoint outside Crux factory: Tile (170, 106)
    var airStagingX = 170 * 8;
    var airStagingY = 106 * 8;

    Groups.unit.each(cons(function(u) {
        if (u == null || u.dead || u.team != cruxTeam || u.type == null) return;
        var typeName = "" + u.type.name;

        // Never touch or steer repair bots here
        if (typeName.indexOf("frost-beta") !== -1) return;

        var uNum = (typeof u.id === "function" ? u.id() : u.id);
        var uid = "" + uNum;
        var stageInfo = stagedUnitIds[uid];
        if (!stageInfo) return;

        if (typeName.indexOf("boreas") !== -1) {
            // Air squadron formation offset
            var offsetX = ((uNum % 5) - 2) * 18;
            var offsetY = (((uNum >> 2) % 5) - 2) * 18;
            var targetX = airStagingX + offsetX;
            var targetY = airStagingY + offsetY;

            var uVel = (typeof u.vel === "function" ? u.vel() : u.vel);
            var uSpeed = (typeof u.speed === "function" ? u.speed() : (u.type != null ? u.type.speed : 1.5));
            var dx = targetX - u.x;
            var dy = targetY - u.y;
            var distSq = dx * dx + dy * dy;
            if (distSq > (24 * 24)) {
                if (uVel != null) uVel.set(dx, dy).limit(uSpeed * 0.75);
            } else {
                if (uVel != null) uVel.scl(0.8);
            }
        } else if (typeName.indexOf("icebreaker") !== -1) {
            // Naval units loiter safely in their water channel near where they spawned
            var uVel = (typeof u.vel === "function" ? u.vel() : u.vel);
            var uSpeed = (typeof u.speed === "function" ? u.speed() : (u.type != null ? u.type.speed : 1.5));
            var ndx = stageInfo.spawnX - u.x;
            var ndy = stageInfo.spawnY - u.y;
            var ndistSq = ndx * ndx + ndy * ndy;
            if (ndistSq > (20 * 20)) {
                if (uVel != null) uVel.set(ndx, ndy).limit(uSpeed * 0.5);
            } else {
                if (uVel != null) uVel.scl(0.8);
            }
        }
    }));
}

// Restores native combat assault AI to released units
function restoreUnitCombatAI(unit) {
    if (unit == null || unit.dead) return;
    try {
        if (unit.type != null) {
            unit.controller(unit.type.createController(unit));
            return;
        }
    } catch(err) {}

    // Fallback if createController reflection fails
    try {
        var isFlying = (unit.isFlying != null && (typeof unit.isFlying === "function" ? unit.isFlying() : unit.isFlying));
        if (isFlying) {
            unit.controller(new Packages.mindustry.ai.types.FlyingAI());
        } else {
            unit.controller(new Packages.mindustry.ai.types.GroundAI());
        }
    } catch(err2) {
        Log.err("[CryogenicFrontiers] Error restoring unit AI: " + err2);
    }
}

// Scans units, enforces waiting with NoAI, and launches assault when squad size reached
function updateSubzeroSquadrons() {
    var cruxTeam = Packages.mindustry.game.Team.crux;
    if (cruxTeam == null || cruxTeam.cores() == null || cruxTeam.cores().isEmpty()) return;

    var currentStagedBoreas = [];
    var currentStagedIcebreaker = [];
    var boreasUnderAttack = false;
    var icebreakerUnderAttack = false;
    var threshold = getSquadThreshold();

    Groups.unit.each(cons(function(u) {
        if (u == null || u.dead || u.team != cruxTeam || u.type == null) return;
        var typeName = "" + u.type.name;

        // Base builder drone is managed separately
        if (typeName.indexOf("frost-beta") !== -1) return;

        var isBoreas = typeName.indexOf("boreas") !== -1;
        var isIcebreaker = typeName.indexOf("icebreaker") !== -1;
        if (!isBoreas && !isIcebreaker) return;

        var uNum = (typeof u.id === "function" ? u.id() : u.id);
        var uid = "" + uNum;

        // If unit already launched in an assault, let native combat AI lead it
        if (assaultingUnitIds[uid]) {
            return;
        }

        // If unit wanders past Crux home territory (x < 115 tiles), release immediately into assault
        if (u.x < 115 * 8) {
            assaultingUnitIds[uid] = true;
            delete stagedUnitIds[uid];
            restoreUnitCombatAI(u);
            return;
        }

        // Register in staged registry
        if (!stagedUnitIds[uid]) {
            stagedUnitIds[uid] = {
                spawnX: u.x,
                spawnY: u.y
            };
        }

        // Put into NoAI so it stands and waits for partners instead of solo rushing
        if (!(u.controller() instanceof Packages.mindustry.ai.types.NoAI)) {
            u.controller(new Packages.mindustry.ai.types.NoAI());
        }

        // If player attacks waiting units, trigger immediate retaliatory assault
        if (u.health < u.maxHealth * 0.95) {
            if (isBoreas) boreasUnderAttack = true;
            if (isIcebreaker) icebreakerUnderAttack = true;
        }

        if (isBoreas) {
            currentStagedBoreas.push(u);
        } else if (isIcebreaker) {
            currentStagedIcebreaker.push(u);
        }
    }));

    // Boreas Squadron Launch
    if (currentStagedBoreas.length > 0) {
        if (lastStagedTimeBoreas === 0) {
            lastStagedTimeBoreas = subzeroCombatTimer;
        }
        var elapsedBoreas = (subzeroCombatTimer - lastStagedTimeBoreas) / 60;
        // Launch if squad reaches threshold, or timeout (> 150s), or under player attack
        if (currentStagedBoreas.length >= threshold || elapsedBoreas > 150 || boreasUnderAttack) {
            for (var b = 0; b < currentStagedBoreas.length; b++) {
                var ub = currentStagedBoreas[b];
                var ubNum = (typeof ub.id === "function" ? ub.id() : ub.id);
                var ubId = "" + ubNum;
                assaultingUnitIds[ubId] = true;
                delete stagedUnitIds[ubId];
                restoreUnitCombatAI(ub);
            }
            lastStagedTimeBoreas = 0;
            Log.info("[CryogenicFrontiers] Crux launched Boreas air squadron (" + currentStagedBoreas.length + " units, Threshold: " + threshold + ").");
        }
    } else {
        lastStagedTimeBoreas = 0;
    }

    // Icebreaker Fleet Launch
    if (currentStagedIcebreaker.length > 0) {
        if (lastStagedTimeIcebreaker === 0) {
            lastStagedTimeIcebreaker = subzeroCombatTimer;
        }
        var elapsedIce = (subzeroCombatTimer - lastStagedTimeIcebreaker) / 60;
        // Launch if fleet reaches threshold, or timeout (> 150s), or under player attack
        if (currentStagedIcebreaker.length >= threshold || elapsedIce > 150 || icebreakerUnderAttack) {
            for (var i = 0; i < currentStagedIcebreaker.length; i++) {
                var ui = currentStagedIcebreaker[i];
                var uiNum = (typeof ui.id === "function" ? ui.id() : ui.id);
                var uiId = "" + uiNum;
                assaultingUnitIds[uiId] = true;
                delete stagedUnitIds[uiId];
                restoreUnitCombatAI(ui);
            }
            lastStagedTimeIcebreaker = 0;
            Log.info("[CryogenicFrontiers] Crux launched Icebreaker naval fleet (" + currentStagedIcebreaker.length + " units, Threshold: " + threshold + ").");
        }
    } else {
        lastStagedTimeIcebreaker = 0;
    }
}

// ------------------------------------------------------------------------------
// Crux Base Auto-Repair Bot (Frost Beta)
// ------------------------------------------------------------------------------
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

    // Find and control ALL active Crux Frost Beta builder drones
    var builderCount = 0;
    Groups.unit.each(cons(function(u) {
        if (u != null && !u.dead && u.team == cruxTeam && u.type != null) {
            var typeName = "" + u.type.name;
            if (typeName.indexOf("frost-beta") !== -1) {
                builderCount++;
                // Behavioral control for EVERY Frost Beta unit:
                if (hasCruxPlans) {
                    // Broken blocks exist in Crux base -> activate BuilderAI to reconstruct them
                    if (!(u.controller() instanceof Packages.mindustry.ai.types.BuilderAI)) {
                        u.controller(new Packages.mindustry.ai.types.BuilderAI());
                    }
                } else {
                    // No broken blocks exist -> park at Crux Core with NoAI so it NEVER attacks the player!
                    if (!(u.controller() instanceof Packages.mindustry.ai.types.NoAI)) {
                        u.controller(new Packages.mindustry.ai.types.NoAI());
                    }
                    var uVel = (typeof u.vel === "function" ? u.vel() : u.vel);
                    var uSpeed = (typeof u.speed === "function" ? u.speed() : (u.type != null ? u.type.speed : 1.5));
                    var cdx = core.x - u.x;
                    var cdy = core.y - u.y;
                    var cdist = Math.sqrt(cdx * cdx + cdy * cdy);
                    if (cdist > 40) {
                        if (uVel != null) uVel.set(cdx, cdy).limit(uSpeed);
                    } else {
                        if (uVel != null) uVel.scl(0.8);
                    }
                }

                // Hard boundary tether: If the builder bot ever wanders to x < 125 tiles, immediately leash it back
                if (u.x < 125 * 8) {
                    u.x = core.x;
                    u.y = core.y;
                    var uVel = (typeof u.vel === "function" ? u.vel() : u.vel);
                    if (uVel != null) uVel.set(0, 0);
                    u.controller(new Packages.mindustry.ai.types.NoAI());
                }
            }
        }
    }));

    // If no drone exists, spawn replacement at Crux core
    if (builderCount === 0) {
        if (builderRespawnTimer > 0) {
            builderRespawnTimer--;
            return;
        }
        try {
            var unitType = Vars.content.unit("cryogenic-frontiers-frost-beta");
            if (unitType != null) {
                var spawned = unitType.spawn(cruxTeam, core.x, core.y);
                if (spawned != null) {
                    spawned.add();
                    spawned.controller(new Packages.mindustry.ai.types.NoAI());
                    builderRespawnTimer = 35 * 60; // 35 seconds cooldown if destroyed
                    Log.info("[CryogenicFrontiers] Deployed Crux Frost Beta base reconstruction bot.");
                }
            }
        } catch(err) {
            Log.err("[CryogenicFrontiers] Error spawning Crux builder bot: " + err);
        }
    }
}

// ------------------------------------------------------------------------------
// 7. World Tick Update Hook
// ------------------------------------------------------------------------------
Events.run(Packages.mindustry.game.EventType.Trigger.update, run(function() {
    if (Vars.state == null || !Vars.state.isPlaying() || !subzeroCombatActive) return;

    subzeroCombatTimer++;

    // 1. Crux auto-repair bot check (every 30 ticks, independently protected)
    if (subzeroCombatTimer % 30 === 0) {
        try {
            updateCruxRebuilder();
        } catch(err1) {
            Log.err("[CryogenicFrontiers] Error in crux rebuilder: " + err1);
        }
    }

    // 2. Squadron coordination and launch check (every 30 ticks, independently protected)
    if (subzeroCombatTimer % 30 === 15) {
        try {
            updateSubzeroSquadrons();
        } catch(err2) {
            Log.err("[CryogenicFrontiers] Error in squad check: " + err2);
        }
    }

    // 3. Staged unit movement (every frame, independently protected)
    try {
        updateSubzeroStagedMovement();
    } catch(err3) {
        // Safe catch for per-frame steering
    }
}));
