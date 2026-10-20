// ==============================================================================
// Cryogenic Frontiers - Master Campaign & Environment Engine for Planet Nivalis
// ==============================================================================

var Attribute = Packages.mindustry.world.meta.Attribute;
var Attributes = Packages.mindustry.world.meta.Attributes;
var Blocks = Packages.mindustry.content.Blocks;
var Team = Packages.mindustry.game.Team;
var SpawnGroup = Packages.mindustry.game.SpawnGroup;
var ItemStack = Packages.mindustry.type.ItemStack;
var Simplex = Packages.arc.util.noise.Simplex;
var Mathf = Packages.arc.math.Mathf;

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

function getItem(name) {
    return Vars.content.item("cryogenic-frontiers-" + name) || Vars.content.item(name);
}

function getUnit(name) {
    return Vars.content.unit("cryogenic-frontiers-" + name) || Vars.content.unit(name);
}

// ------------------------------------------------------------------------------
// 3. Helper: Scatter Ore Vein
// ------------------------------------------------------------------------------
function placeOreVein(cx, cy, radius, oreBlock, chance) {
    if (oreBlock == null) return;
    for (var dx = -radius; dx <= radius; dx++) {
        for (var dy = -radius; dy <= radius; dy++) {
            var distSq = dx * dx + dy * dy;
            if (distSq <= radius * radius && Mathf.chance(chance || 0.75)) {
                var tx = cx + dx;
                var ty = cy + dy;
                var tile = Vars.world.tile(tx, ty);
                if (tile != null && tile.floor() != null && !tile.floor().isLiquid) {
                    tile.setOverlay(oreBlock);
                }
            }
        }
    }
}

function carveCorridor(x1, y1, x2, y2, radius, floorTile) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) return;
    var steps = Math.floor(dist * 1.5);
    for (var i = 0; i <= steps; i++) {
        var t = i / steps;
        var meander = Math.sin(t * Math.PI * 2.5) * (radius * 0.7);
        var cx = Math.floor(x1 + dx * t - (dy / dist) * meander);
        var cy = Math.floor(y1 + dy * t + (dx / dist) * meander);
        clearArea(cx, cy, radius, floorTile);
    }
}

function smoothTerrain(frostStoneWall, permafrostIceWall, passes) {
    var W = Vars.world.width();
    var H = Vars.world.height();
    for (var p = 0; p < (passes || 2); p++) {
        var toClear = [];
        var toWall = [];
        for (var x = 8; x < W - 8; x++) {
            for (var y = 8; y < H - 8; y++) {
                var t = Vars.world.tile(x, y);
                if (t == null) continue;
                var wallNeighbors = 0;
                for (var ox = -1; ox <= 1; ox++) {
                    for (var oy = -1; oy <= 1; oy++) {
                        if (ox === 0 && oy === 0) continue;
                        var n = Vars.world.tile(x + ox, y + oy);
                        if (n != null && n.solid()) wallNeighbors++;
                    }
                }
                if (t.solid() && wallNeighbors < 3) {
                    toClear.push(t);
                } else if (!t.solid() && wallNeighbors >= 6) {
                    toWall.push(t);
                }
            }
        }
        for (var i = 0; i < toClear.length; i++) toClear[i].setBlock(Blocks.air);
        for (var i = 0; i < toWall.length; i++) toWall[i].setBlock(frostStoneWall);
    }
}

// ------------------------------------------------------------------------------
// 4. Sector Map Builders (Using Mod Environment Blocks)
// ------------------------------------------------------------------------------
function buildSectorTerrain(secNumber) {
    var frostStone = getBlock("frost-stone") || Blocks.stone;
    var permafrostIce = getBlock("permafrost-ice") || Blocks.ice;
    var glacialSnow = getBlock("glacial-snow") || Blocks.snow;
    var frostStoneWall = getBlock("frost-stone-wall") || Blocks.stoneWall;
    var permafrostIceWall = getBlock("permafrost-ice-wall") || Blocks.iceWall;
    var cryoBoulder = getBlock("cryo-boulder");

    var oreGlacite = getBlock("ore-glacite");
    var oreCryoShale = getBlock("ore-cryo-shale");
    var oreBoreonite = getBlock("ore-boreonite");
    var orePolarQuartz = getBlock("ore-polar-quartz");
    var oreFrostMagnetite = getBlock("ore-frost-magnetite");
    var oreBorealClathrate = getBlock("ore-boreal-clathrate");

    var coreFrost = getBlock("core-frost") || Blocks.coreShard;
    var coreGlacier = getBlock("core-glacier") || coreFrost;

    var glaciteItem = getItem("glacite");
    var cryoShaleItem = getItem("cryo-shale");
    var boreoniteItem = getItem("boreonite");
    var polarQuartzItem = getItem("polar-quartz");
    var subzeroSiliconItem = getItem("subzero-silicon");

    var W = Vars.world.width();
    var H = Vars.world.height();
    var seed = (secNumber * 31337 + 101) & 0x7FFFFFFF;

    Log.info("[CryogenicFrontiers] Generating custom Nivalis terrain for sector " + secNumber + " (" + W + "x" + H + ")");

    // A. Base Floor & Wall Passes using low-frequency ridged noise
    var ridgeScale = 1.0 / 85.0;
    var biomeScale = 1.0 / 110.0;
    var elevScale = 1.0 / 140.0;

    for (var x = 0; x < W; x++) {
        for (var y = 0; y < H; y++) {
            var tile = Vars.world.tile(x, y);
            if (tile == null) continue;

            // Border barrier
            if (x < 6 || x >= W - 6 || y < 6 || y >= H - 6) {
                tile.setFloor(frostStone);
                tile.setBlock(frostStoneWall);
                continue;
            }

            var nCont = Simplex.noise2d(seed, 3, 0.5, elevScale, x, y);
            var nRidge = 1.0 - Math.abs(Simplex.noise2d(seed + 50, 4, 0.5, ridgeScale, x, y));
            var nBiome = Simplex.noise2d(seed + 100, 3, 0.5, biomeScale, x, y);
            var nRiver = 1.0 - Math.abs(Simplex.noise2d(seed + 200, 3, 0.5, 1.0 / 95.0, x, y));

            // Floor selection (large continuous biomes)
            if (nBiome > 0.25) {
                tile.setFloor(permafrostIce);
            } else if (nBiome < -0.2) {
                tile.setFloor(glacialSnow);
            } else {
                tile.setFloor(frostStone);
            }

            // Natural winding water river channels in valleys
            if (nRiver > 0.88 && nCont < 0.2) {
                tile.setFloor(Blocks.water);
                tile.setBlock(Blocks.air);
                continue;
            } else if (nRiver > 0.82 && nCont < 0.15) {
                tile.setFloor(Blocks.sandWater);
            }

            // Continuous mountain ridges & canyons (connected mountain walls)
            if (nRidge > 0.68 && nCont > -0.25) {
                if (nBiome > 0.3) {
                    tile.setBlock(permafrostIceWall);
                } else {
                    tile.setBlock(frostStoneWall);
                }
            } else if (nCont > 0.55) {
                tile.setBlock(frostStoneWall);
            } else {
                tile.setBlock(Blocks.air);
                if (cryoBoulder != null && nRidge > 0.55 && Mathf.chance(0.03)) {
                    tile.setBlock(cryoBoulder);
                }
            }
        }
    }

    // Clean up scattered single-tile dots with cellular automata
    smoothTerrain(frostStoneWall, permafrostIceWall, 2);

    // B. Sector Specific Configurations
    if (secNumber === 0) {
        // --- Sector 0: Boreal Basin (Landing Site) ---
        var pcX = Math.floor(W / 2);
        var pcY = 40;

        // Clear player landing zone
        clearArea(pcX, pcY, 12, frostStone);

        // Place Core: Frost
        var cTile = Vars.world.tile(pcX, pcY);
        cTile.setBlock(coreFrost, Vars.state.rules.defaultTeam, 0);

        // Add starting resources to core
        if (cTile.build != null && cTile.build.items != null) {
            if (glaciteItem != null) cTile.build.items.add(glaciteItem, 400);
            if (cryoShaleItem != null) cTile.build.items.add(cryoShaleItem, 300);
            if (polarQuartzItem != null) cTile.build.items.add(polarQuartzItem, 150);
            if (boreoniteItem != null) cTile.build.items.add(boreoniteItem, 100);
        }

        // Ore veins around player core
        placeOreVein(pcX - 16, pcY + 6, 7, oreGlacite, 0.85);
        placeOreVein(pcX + 16, pcY + 4, 7, oreCryoShale, 0.85);
        placeOreVein(pcX - 12, pcY - 14, 6, oreBoreonite, 0.80);
        placeOreVein(pcX + 14, pcY - 12, 6, orePolarQuartz, 0.80);

        // Hydro water stream right near base for hydro turbines
        for (var py = pcY - 8; py <= pcY + 8; py++) {
            for (var px = pcX - 28; px <= pcX - 24; px++) {
                var wt = Vars.world.tile(px, py);
                if (wt != null) {
                    wt.setFloor(Blocks.water);
                    wt.setBlock(Blocks.air);
                }
            }
        }

        // Enemy spawn points at the north
        var spX = pcX;
        var spY = H - 25;
        clearArea(spX, spY, 8, permafrostIce);
        var spTile = Vars.world.tile(spX, spY);
        if (spTile != null) spTile.setOverlay(Blocks.spawn);

        // Guaranteed wide continuous path from Core to Spawn
        carveCorridor(pcX, pcY, spX, spY, 8, permafrostIce);
        // Flanking side paths for natural maneuvering and base expansion
        carveCorridor(pcX, pcY, pcX - 35, pcY + 45, 6, glacialSnow);
        carveCorridor(pcX - 35, pcY + 45, spX - 25, spY - 20, 6, glacialSnow);
        carveCorridor(pcX, pcY, pcX + 35, pcY + 45, 6, frostStone);
        carveCorridor(pcX + 35, pcY + 45, spX + 25, spY - 20, 6, frostStone);

        // Rules & Wave Setup
        Vars.state.rules.winWave = 25;
        Vars.state.rules.waveTimer = true;
        Vars.state.rules.initialWaveSpacing = 240 * 60; // 4.0 minutes prep
        Vars.state.rules.waveSpacing = 75 * 60;

        configureSectorWaves(25, 1);

    } else if (secNumber === 12) {
        // --- Sector 1: Quartz Valley ---
        var pcX = 45;
        var pcY = 45;

        clearArea(pcX, pcY, 14, permafrostIce);
        var cTile = Vars.world.tile(pcX, pcY);
        cTile.setBlock(coreFrost, Vars.state.rules.defaultTeam, 0);

        if (cTile.build != null && cTile.build.items != null) {
            if (glaciteItem != null) cTile.build.items.add(glaciteItem, 500);
            if (cryoShaleItem != null) cTile.build.items.add(cryoShaleItem, 400);
            if (polarQuartzItem != null) cTile.build.items.add(polarQuartzItem, 250);
            if (boreoniteItem != null) cTile.build.items.add(boreoniteItem, 200);
        }

        placeOreVein(pcX + 16, pcY + 4, 8, orePolarQuartz, 0.90);
        placeOreVein(pcX + 6, pcY + 16, 8, oreBoreonite, 0.85);
        placeOreVein(pcX - 14, pcY + 10, 6, oreGlacite, 0.80);
        placeOreVein(pcX + 12, pcY - 14, 6, oreCryoShale, 0.80);
        placeOreVein(pcX + 35, pcY + 35, 5, oreFrostMagnetite, 0.75);

        // Enemy spawn NE
        var spX = W - 35;
        var spY = H - 35;
        clearArea(spX, spY, 10, glacialSnow);
        var spTile = Vars.world.tile(spX, spY);
        if (spTile != null) spTile.setOverlay(Blocks.spawn);

        // Winding valley corridor connecting SW player to NE enemy spawn
        carveCorridor(pcX, pcY, Math.floor(W / 2), Math.floor(H / 2), 8, permafrostIce);
        carveCorridor(Math.floor(W / 2), Math.floor(H / 2), spX, spY, 8, permafrostIce);
        carveCorridor(pcX, pcY, W - 40, 50, 7, frostStone);
        carveCorridor(W - 40, 50, spX, spY, 7, frostStone);

        Vars.state.rules.winWave = 30;
        Vars.state.rules.waveTimer = true;
        Vars.state.rules.initialWaveSpacing = 270 * 60; // 4.5 minutes prep
        Vars.state.rules.waveSpacing = 75 * 60;

        configureSectorWaves(30, 2);

    } else if (secNumber === 28) {
        // --- Sector 2: Subzero Crags ---
        var pcX = 50;
        var pcY = Math.floor(H / 2);

        clearArea(pcX, pcY, 14, frostStone);
        var cTile = Vars.world.tile(pcX, pcY);
        cTile.setBlock(coreFrost, Vars.state.rules.defaultTeam, 0);

        if (cTile.build != null && cTile.build.items != null) {
            if (glaciteItem != null) cTile.build.items.add(glaciteItem, 600);
            if (cryoShaleItem != null) cTile.build.items.add(cryoShaleItem, 500);
            if (polarQuartzItem != null) cTile.build.items.add(polarQuartzItem, 350);
            if (boreoniteItem != null) cTile.build.items.add(boreoniteItem, 250);
            if (subzeroSiliconItem != null) cTile.build.items.add(subzeroSiliconItem, 150);
        }

        placeOreVein(pcX + 18, pcY + 8, 8, oreGlacite, 0.85);
        placeOreVein(pcX + 18, pcY - 8, 8, oreCryoShale, 0.85);
        placeOreVein(pcX + 8, pcY + 18, 7, orePolarQuartz, 0.85);
        placeOreVein(pcX + 8, pcY - 18, 7, oreBoreonite, 0.85);
        placeOreVein(pcX + 28, pcY + 22, 6, oreFrostMagnetite, 0.80);
        placeOreVein(pcX + 28, pcY - 22, 6, oreBorealClathrate, 0.80);

        // Dual East spawns
        var sp1X = W - 35; var sp1Y = pcY - 45;
        var sp2X = W - 35; var sp2Y = pcY + 45;
        clearArea(sp1X, sp1Y, 10, permafrostIce);
        clearArea(sp2X, sp2Y, 10, permafrostIce);
        var t1 = Vars.world.tile(sp1X, sp1Y); if (t1 != null) t1.setOverlay(Blocks.spawn);
        var t2 = Vars.world.tile(sp2X, sp2Y); if (t2 != null) t2.setOverlay(Blocks.spawn);

        // Continuous canyon channels from west core to both east spawns
        carveCorridor(pcX, pcY, sp1X, sp1Y, 8, frostStone);
        carveCorridor(pcX, pcY, sp2X, sp2Y, 8, glacialSnow);

        Vars.state.rules.winWave = 35;
        Vars.state.rules.waveTimer = true;
        Vars.state.rules.initialWaveSpacing = 300 * 60; // 5.0 minutes prep
        Vars.state.rules.waveSpacing = 70 * 60;

        configureSectorWaves(35, 3);

    } else if (secNumber === 44) {
        // --- Sector 3: Glacial Citadel (ATTACK MAP: 2 Crux Cores) ---
        var pcX = Math.floor(W / 2);
        var pcY = 40;

        clearArea(pcX, pcY, 14, frostStone);
        var cTile = Vars.world.tile(pcX, pcY);
        cTile.setBlock(coreFrost, Vars.state.rules.defaultTeam, 0);

        if (cTile.build != null && cTile.build.items != null) {
            if (glaciteItem != null) cTile.build.items.add(glaciteItem, 800);
            if (cryoShaleItem != null) cTile.build.items.add(cryoShaleItem, 600);
            if (polarQuartzItem != null) cTile.build.items.add(polarQuartzItem, 400);
            if (boreoniteItem != null) cTile.build.items.add(boreoniteItem, 300);
            if (subzeroSiliconItem != null) cTile.build.items.add(subzeroSiliconItem, 200);
        }

        // Rich player resource cluster
        placeOreVein(pcX - 18, pcY + 6, 8, oreGlacite, 0.85);
        placeOreVein(pcX + 18, pcY + 6, 8, oreCryoShale, 0.85);
        placeOreVein(pcX - 12, pcY - 14, 7, orePolarQuartz, 0.85);
        placeOreVein(pcX + 12, pcY - 14, 7, oreBoreonite, 0.85);
        placeOreVein(pcX - 30, pcY + 15, 6, oreFrostMagnetite, 0.80);
        placeOreVein(pcX + 30, pcY + 15, 6, oreBorealClathrate, 0.80);

        // Crux Stronghold 1: Eastern Outpost Core
        var e1X = W - 60;
        var e1Y = H - 65;
        clearArea(e1X, e1Y, 16, permafrostIce);
        var ec1 = Vars.world.tile(e1X, e1Y);
        ec1.setBlock(coreFrost, Team.crux, 0);
        buildCruxFortification(e1X, e1Y, 1);

        // Crux Stronghold 2: Northern Citadel Core
        var e2X = 65;
        var e2Y = H - 55;
        clearArea(e2X, e2Y, 18, permafrostIce);
        var ec2 = Vars.world.tile(e2X, e2Y);
        ec2.setBlock(coreGlacier, Team.crux, 0);
        buildCruxFortification(e2X, e2Y, 2);

        // Continuous attack avenues from player base to both Crux bases
        carveCorridor(pcX, pcY, e1X, e1Y, 9, permafrostIce);
        carveCorridor(pcX, pcY, e2X, e2Y, 9, frostStone);
        carveCorridor(e1X, e1Y, e2X, e2Y, 7, glacialSnow);

        // Attack map rules: Win by destroying all enemy cores!
        Vars.state.rules.attackMode = true;
        Vars.state.rules.winWave = 0;
        Vars.state.rules.waveTimer = true;
        Vars.state.rules.initialWaveSpacing = 360 * 60; // 6.0 minutes ceasefire
        Vars.state.rules.waveSpacing = 85 * 60;

        configureSectorWaves(60, 4);
    }

    Log.info("[CryogenicFrontiers] Nivalis Sector " + secNumber + " generated successfully!");
}

// ------------------------------------------------------------------------------
// 5. Helper: Clear Area of Walls & Set Floor
// ------------------------------------------------------------------------------
function clearArea(cx, cy, rad, floorBlock) {
    for (var dx = -rad; dx <= rad; dx++) {
        for (var dy = -rad; dy <= rad; dy++) {
            if (dx * dx + dy * dy <= rad * rad) {
                var t = Vars.world.tile(cx + dx, cy + dy);
                if (t != null) {
                    t.setFloor(floorBlock);
                    t.setBlock(Blocks.air);
                    t.setOverlay(Blocks.air);
                }
            }
        }
    }
}

// ------------------------------------------------------------------------------
// 6. Helper: Crux Base Fortifications for Attack Map
// ------------------------------------------------------------------------------
function buildCruxFortification(cx, cy, tier) {
    var glaciteWallLarge = getBlock("glacite-wall-large") || Blocks.copperWallLarge;
    var cryoWallLarge = getBlock("cryo-wall-large") || glaciteWallLarge;
    var shieldedWallLarge = getBlock("shielded-cryo-wall-large") || cryoWallLarge;

    var frostbite = getBlock("frostbite");
    var permafrost = getBlock("permafrost");
    var blizzard = getBlock("blizzard");
    var glacialis = getBlock("glacialis");

    var wallBlock = tier === 1 ? cryoWallLarge : shieldedWallLarge;

    // Defense ring (cardinal wall bastions)
    var offsets = [-6, 6];
    for (var i = 0; i < offsets.length; i++) {
        var ox = offsets[i];
        var tWallX = Vars.world.tile(cx + ox, cy);
        if (tWallX != null) tWallX.setBlock(wallBlock, Team.crux, 0);

        var tWallY = Vars.world.tile(cx, cy + ox);
        if (tWallY != null) tWallY.setBlock(wallBlock, Team.crux, 0);
    }

    // Defensive Turrets
    var tTurret1 = Vars.world.tile(cx + 8, cy + 8);
    var tTurret2 = Vars.world.tile(cx - 8, cy + 8);
    var tTurret3 = Vars.world.tile(cx, cy - 8);

    if (tTurret1 != null && frostbite != null) tTurret1.setBlock(frostbite, Team.crux, 0);
    if (tTurret2 != null && permafrost != null) tTurret2.setBlock(permafrost, Team.crux, 0);
    if (tTurret3 != null) {
        var heavyTurret = tier === 1 ? permafrost : (glacialis || blizzard || permafrost);
        if (heavyTurret != null) tTurret3.setBlock(heavyTurret, Team.crux, 0);
    }
}

// ------------------------------------------------------------------------------
// 7. Helper: Configure Wave Composition
// ------------------------------------------------------------------------------
function configureSectorWaves(totalWaves, threatLevel) {
    var sleet = getUnit("sleet");
    var boreas = getUnit("boreas");
    var hailstorm = getUnit("hailstorm");
    var tempest = getUnit("tempest");

    if (Vars.state.rules.spawns == null) return;
    Vars.state.rules.spawns.clear();

    // Sleet walkers (Tier 1 Ground)
    if (sleet != null) {
        var gSleet = new SpawnGroup(sleet);
        gSleet.begin = 1;
        gSleet.end = totalWaves;
        gSleet.unitAmount = 2 + threatLevel;
        gSleet.unitScaling = 3.0;
        gSleet.spacing = 1;
        Vars.state.rules.spawns.add(gSleet);
    }

    // Boreas interceptors (Tier 1 Air)
    if (boreas != null) {
        var gBoreas = new SpawnGroup(boreas);
        gBoreas.begin = 3;
        gBoreas.end = totalWaves;
        gBoreas.unitAmount = 1 + threatLevel;
        gBoreas.unitScaling = 4.0;
        gBoreas.spacing = 2;
        Vars.state.rules.spawns.add(gBoreas);
    }

    // Tier 2 Units on higher threat levels
    if (threatLevel >= 2 && hailstorm != null) {
        var gHail = new SpawnGroup(hailstorm);
        gHail.begin = 10;
        gHail.end = totalWaves;
        gHail.unitAmount = 1;
        gHail.unitScaling = 5.0;
        gHail.spacing = 3;
        Vars.state.rules.spawns.add(gHail);
    }

    if (threatLevel >= 3 && tempest != null) {
        var gTempest = new SpawnGroup(tempest);
        gTempest.begin = 15;
        gTempest.end = totalWaves;
        gTempest.unitAmount = 1;
        gTempest.unitScaling = 6.0;
        gTempest.spacing = 3;
        Vars.state.rules.spawns.add(gTempest);
    }
}

// ------------------------------------------------------------------------------
// 8. World Load & Sector Entry Hooks
// ------------------------------------------------------------------------------
Events.on(EventType.WorldLoadEvent, cons(function(e) {
    patchWaterAttributes();

    try {
        if (!Vars.state.isCampaign()) return;
        var sec = Vars.state.getSector();
        if (sec == null || sec.planet == null) return;

        var planetName = "" + sec.planet.name;
        if (planetName.indexOf("nivalis") === -1) return;

        Log.info("[CryogenicFrontiers] Entered Nivalis campaign sector: " + sec.id);

        // Procedural terrain generation override disabled:
        // Sector maps are now loaded directly from .msav files.
        // if (!hasPlayerCore || Vars.state.wave <= 1) {
        //     buildSectorTerrain(sec.id);
        // }
    } catch (err) {
        Log.err("[CryogenicFrontiers] Error initializing Nivalis campaign world: " + err);
    }
}));

// Re-apply shallow water patch on client load and verify environment atlas
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

    // Register core-frost default loadout so sector launches use Glacite/Shale/Quartz instead of Copper/Lead
    registerCoreFrostLoadout();
}));

// ------------------------------------------------------------------------------
// 9. Core Loadout Registration for Sector Launching
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

// Initial immediate patch execution
patchWaterAttributes();
registerCoreFrostLoadout();

