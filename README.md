# Cryogenic Frontiers - Mindustry Mod

**Cryogenic Frontiers** is a content mod for **Mindustry** (supporting v7 and v8, build 136+) that fills one of the most requested gaps in Serpulo's tech tree: a full cryogenic progression tier.

---

## What's in the Mod

### 1. New Materials
- **Cryo-Crystal (`cryo-crystal`)**: A supercooled solid matrix synthesized under high pressure from Titanium, Silicon, and Cryofluid. Emits a sub-zero field; used in advanced weaponry, power, and fortifications.
- **Cryo-Alloy (`cryo-alloy`)**: A superconducting ultra-dense composite forged from Cryo-Crystals, Titanium, and Surge Alloy. Hardness 5, immune to thermal fatigue, charge 0.8. Required to construct high-tier superstructures.

### 2. Production & Manufacturing
- **Cryo-Crystallizer (`cryo-crystallizer`)** (2x2):
  - Consumes: Titanium (2), Silicon (1), Cryofluid (12/s), Power (150/s)
  - Outputs: 1 Cryo-Crystal every 0.75 seconds.
  - Researched from: `cryofluid-mixer`
- **Industrial Cryo-Crystallizer (`industrial-cryo-crystallizer`)** (3x3):
  - High-yield crystallization facility using cryogenic flash-compression.
  - Consumes: Titanium (5), Silicon (3), Cryofluid (27/s), Power (330/s)
  - Outputs: 3 Cryo-Crystals every 1.0 second (over 2.2x total production throughput).
  - Researched from: `cryo-crystallizer`
- **Cryo-Alloy Foundry (`cryo-alloy-foundry`)** (3x3):
  - Consumes: Titanium (3), Surge Alloy (1), Cryo-Crystal (2), Cryofluid (9/s), Power (300/s)
  - Outputs: 1 Cryo-Alloy every 1.25 seconds.
  - Researched from: `cryo-crystallizer`

### 3. Advanced Mining & Drills
- **Cryo Drill (`cryo-drill`)** (3x3):
  - Fast rotary drill using cryogenic fracturing to extract ores with minimal thermal wear.
  - Tier: 4 (mines up to Thorium). Base drill time: 200 (faster than Laser Drill's 280).
  - Coolant boost: 1.8x speed with Cryofluid.
  - Researched from: `laser-drill`
- **Titan Drill (`titan-drill`)** (5x5):
  - Colossal industrial excavation platform capable of fracturing the hardest geological formations across a massive 25-tile footprint.
  - Tier: 5 (mines all ores in the game). Base drill time: 110 (over 2.5x faster than Blast Drill).
  - Coolant boost: 2.2x speed with Cryofluid.
  - Researched from: `blast-drill`

### 4. Weapons & Turrets
- **Frostbite (`frostbite`)** (2x2 Item Turret):
  - Fast-firing shard rail gun.
  - Ammo: `cryo-crystal` (Damage: 42, Speed: 7.5, Freezing Status for 4s, Pierce 2), `titanium`, `silicon` (homing).
  - Researched from: `salvo`
- **Permafrost (`permafrost`)** (3x3 Item Turret):
  - Heavy cryogenic siege mortar / cluster artillery.
  - Ammo: `cryo-crystal` (Damage: 130 + 85 Splash Radius 38, bursts into 8 piercing subzero shards inflicting Freezing for 6s), `graphite`.
  - Researched from: `ripple`
- **Absolute Zero (`absolute-zero`)** (3x3 Power Turret):
  - Channels a continuous high-energy cryogenic laser beam.
  - Stats: Damage: 340, Length: 235, Width: 25, inflicts Freezing for 5s.
  - Power: 360/s (with optional Cryofluid coolant boost).
  - Researched from: `lancer`
- **Glacialis (`glacialis`)** (4x4 Super-Heavy Railgun):
  - Hypersonic anti-titan kinetic accelerator with 390 range.
  - Ammo: **`cryo-alloy`** (Damage: 1,250, Speed: 18, Pierce 8, 10s Freezing), `cryo-crystal` (620 dmg), `surge-alloy` (850 dmg + lightning).
  - Researched from: `foreshadow`
- **Blizzard (`blizzard`)** (3x3 Rotary Storm Cannon):
  - 10 rounds/sec rapid-fire gatling cannon with violent knockback and ricochet flechettes.
  - Ammo: **`cryo-alloy`** (68 dmg + 3 sub-flechettes, 2.2 knockback), `cryo-crystal` (46 dmg, 1.8 knockback), `titanium`.
  - Researched from: `cyclone`
- **Avalanche (`avalanche`)** (3x3 Guided Missile Battery):
  - Long-range homing torpedo swarm launcher with 310 range.
  - Ammo: **`cryo-alloy`** (Guided torpedo: 280 direct + 140 splash, splits into 4 tracking sub-missiles), `cryo-crystal` (160 direct + 90 splash).
  - Researched from: `permafrost`

### 5. Power Generation
- **Thermo-Stirling Engine (`thermo-stirling-engine`)** (2x2 Generator):
  - Generates 450 power/s by exploiting the steep temperature gradient between subzero Cryo-Crystals and ambient atmospheric heat.
  - Consumes: 1 Cryo-Crystal every 2 seconds.
  - Researched from: `differential-generator`
- **Zero-Point Cryo-Reactor (`zero-point-reactor`)** (4x4 Monumental Reactor):
  - Generates **3,600 power/sec** by harnessing zero-point thermal vacuum compression.
  - Consumes: 1 Cryo-Alloy every 3 seconds, 18/s Cryofluid.
  - Researched from: `thermo-stirling-engine`

### 5. Defensive Walls
- **Cryo Wall (`cryo-wall`)** (1x1) & **Large Cryo Wall (`cryo-wall-large`)** (2x2):
  - 650 HP / 2600 HP.
  - 10% / 15% projectile deflection.
  - **Reactive Freeze Blast**: Upon destruction, ruptures into a sub-zero freezing shockwave that damages and chills adjacent attacking units.
  - Researched from: `titanium-wall`

---

## Installation & How to Play

### Option 1: Direct Folder (Recommended)
Copy this entire folder (`e:\Mindustry_Mods` or the mod folder) to your Mindustry mods directory:
- **Windows**: `%appdata%\Mindustry\mods\cryogenic-frontiers`
- **Steam**: `[Steam Library]\steamapps\common\Mindustry\saves\mods\cryogenic-frontiers`
- **Linux**: `~/.local/share/Mindustry/mods/cryogenic-frontiers`
- **MacOS**: `~/Library/Application Support/Mindustry/mods/cryogenic-frontiers`

### Option 2: Import ZIP in Mindustry
1. Open Mindustry.
2. Go to **Mods** -> **Import Mod**.
3. Select `cryogenic-frontiers.zip` located in `e:\Mindustry_Mods\`.
4. Mindustry will extract and enable the mod immediately!
