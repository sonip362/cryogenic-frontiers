// Cryogenic Frontiers - Hydro Power & Environment Initializer
// Enables shallow water tiles (water, sand-water, darksand-water, tainted-water, etc.)
// to provide the water attribute for the Cryo Hydro-Turbine.

function patchWaterAttributes() {
    try {
        var Attribute = Packages.mindustry.world.meta.Attribute;
        var Attributes = Packages.mindustry.world.meta.Attributes;
        var Blocks = Packages.mindustry.content.Blocks;

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
                // 0.25 per tile -> 4 tiles for a 2x2 turbine = 1.0 (100% full efficiency on shallow water)
                floor.attributes.set(Attribute.water, 0.25);
            }
        }
        Log.info("[CryogenicFrontiers] Shallow water hydro attributes active (0.25 water attribute per tile).");
    } catch (err) {
        Log.err("[CryogenicFrontiers] Failed to patch water attributes: " + err);
    }
}

// 1. Run immediately on script evaluation so attributes exist before world load
patchWaterAttributes();

// 2. Re-apply on world and client load events
Events.on(EventType.ClientLoadEvent, cons(function(e) {
    patchWaterAttributes();
}));

Events.on(EventType.WorldLoadEvent, cons(function(e) {
    patchWaterAttributes();
}));
