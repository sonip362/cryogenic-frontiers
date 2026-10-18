# Cryogenic Frontiers - Mindustry Mod

[![Mindustry Version](https://img.shields.io/badge/Mindustry-v7%20%2F%20v8%20(Build%20136%2B)-6ecdec.svg)](https://github.com/Anuken/Mindustry)
[![Mod Version](https://img.shields.io/badge/Version-2.7.0-4be3b0.svg)](file:///e:/Mindustry_Mods/mod.hjson)
[![License](https://img.shields.io/badge/Ecosystem-100%25%20Standalone-78f3e5.svg)](#)

**Cryogenic Frontiers** is a massive standalone technological expansion for **Mindustry** (supporting v7 and v8 build 136+). It introduces a completely self-contained technological progression featuring **zero dependencies** on vanilla Serpulo/Erekir resources, ammo, or crafting trees.

From shallow-water kinetic hydro-turbines and sub-zero crystal refining to bipedal assault mechs, capital-class naval battlecruisers, and quantum-condensate hyper-railguns, Cryogenic Frontiers delivers a deep, tactical, and mechanically rich industrial warfare experience.

---

## Key Features

- **100% Self-Contained Ecosystem**: Complete standalone tech tree starting from `Core: Frost` with its own dedicated ores, manufactured materials, power plants, and weapons.
- **3 Command Cores & Autonomous Constructor Crafts**:
  - `Core: Frost` (3×3) → Spawns `Frost Alpha`
  - `Core: Glacier` (4×4) → Spawns `Frost Beta`
  - `Core: Cryosphere` (5×5) → Spawns `Frost Gamma`
  - *All core units feature 360° autonomous auto-targeting defense weapons that automatically track and eliminate approaching threats.*
- **6 Natural Geological Ores**: Glacite, Cryo-Shale, Boreonite, Polar Quartz, Frost-Magnetite, and Boreal Clathrate with authentic vanilla-style vein spawning.
- **12 High-Tier Manufactured Materials**: Full industrial production chain from Subzero Silicon to self-replicating Cryo-Nanites and Quantum Condensates.
- **Two Complete Tiers of Combat Units (Air, Land, Sea)**:
  - **Tier 1**: Boreas (interceptor), Sleet (bipedal assault walker), Icebreaker (naval torpedo cutter).
  - **Tier 2**: Tempest (heavy strike craft), Hailstorm (armored assault mech), Glacier Cruiser (arctic battlecruiser).
- **Unit Production & Upgrade Suite**:
  - `Cryo Unit Factory` (3×3) & `Cryo Naval Shipyard` (3×3, Floating)
  - `Cryo Reconstructor` (3×3, Floating): Upgrades Tier 1 units into Tier 2 machines using Cryo-Alloy, Subzero Silicon, Cryo-Processors, and Superconducting Solenoids.
- **Clean Energy & Power Grid**:
  - `Cryo Hydro-Turbine` (2×2, animated rotating kinetic turbine operating in shallow water)
  - `Thermo-Stirling Engine` (2×2, Boreonite-fueled combustion generator)
  - `Zero-Point Cryo-Reactor` (4×4, quantum thermal-collapse monumental power complex)
  - `Cryo Node` (1×1) & `Large Cryo Node` (2×2)
- **Heavy Defensive Ordnance**: Multi-tier railguns, siege mortars, rotary gatling storm cannons, and guided torpedo batteries.
- **Zero Useless Items**: Every single manufactured material is actively integrated across turret ammunitions, unit production blueprints, and high-tech structure costs.
- **Authentic Mindustry Pixel Art**: Stepped mechanical contours, top-left directional bevel lighting, dark gunmetal armor plates, and vibrant sub-zero cyan energy accents.

---

## Command Cores & Player Units

| Core Structure | Size | Health | Capacity | Core Unit | Unit Armament & Role |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **Core: Frost** | 3×3 | 1,400 | 1,200 | **Frost Alpha** | Sub-zero mining lasers, rapid construction beams, and autonomous 360° freezing bolt emitter. |
| **Core: Glacier** | 4×4 | 3,200 | 4,500 | **Frost Beta** | Boosted excavation lasers, heavy construction emitters, and twin autonomous freezing shard blasters. |
| **Core: Cryosphere** | 5×5 | 6,500 | 9,000 | **Frost Gamma** | Monumental command craft with industrial nanite beams, twin heavy piercing blasters, and autonomous homing missile pods. |

---

## Materials & Economy

### 1. Natural Geological Ores
The 6 natural ores are divided into two distinct extraction tiers, creating a meaningful progression loop between the early-game **Cryo Drill** and the advanced **Titan Drill**:

| Ore | Required Drill | Hardness | Visual Archetype | Accent | Description & Primary Uses |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **Glacite** (`glacite`) | **Cryo Drill** (Tier 1+) | 1 | Clustered Boulders (*Copper-style*) | Steel / Glacial Cyan (`#7294b8`) | Foundational structural iron-ice mineral. Used in conveyors, structural frames, and kinetic ammo. |
| **Cryo-Shale** (`cryo-shale`) | **Cryo Drill** (Tier 1+) | 1 | Bedrock Strata (*Coal-style*) | Cool Slate Grey (`#546a85`) | Dense conductive bedrock strata mineral. Replaces lead in heavy munition loads, mortars, and silicon synthesis. |
| **Polar Quartz** (`polar-quartz`) | **Cryo Drill** (Tier 1+) | 1 | Prismatic Crystals (*Thorium-style*) | Glacial Ice-White (`#b2e8f7`) | Glacial silica crystal. Essential for microchips, optical glass, and laser optics. |
| **Boreonite** (`boreonite`) | **Titan Drill** (Tier 2+) | 2 | Faceted Chunks (*Titanium-style*) | **Vibrant Emerald Green** (`#4be3b0`) | Highly reactive cryogenic hydrocarbon fuel mineral. Used in Stirling generation, Endothermic Salt, and heavy torpedoes. |
| **Frost-Magnetite** (`frost-magnetite`) | **Titan Drill** (Tier 2+) | 2 | Dense Pebbles (*Lead-style*) | Ferromagnetic Dark Iron (`#3e4f6d`) | Natural lodestone ore with intense magnetic properties. Used in superconducting solenoids and railgun coils. |
| **Boreal Clathrate** (`boreal-clathrate`) | **Titan Drill** (Tier 2+) | 2 | Lattice Shards (*Scrap-style*) | Methane-Ice Turquoise (`#6ee3b4`) | Volatile gas hydrate crystal cages trapped under ice. Essential for Gelid Polymer synthesis and turbine fuel. |

---

### 2. Mining Drills & Progression
| Drill | Size | Tier | Drill Time | Footprint / Capacity | Power Drain | Requirements | Role & Capability |
| :--- | :---: | :---: | :---: | :---: | :--- | :--- | :--- |
| **Cryo Drill** | 3×3 | **1** | 200 | 9 tiles / 20 cap | 0 Power (Water boost ×1.5) | Glacite (50), Cryo-Shale (35) | Foundational early drill. Mines the 3 base ores: **Glacite**, **Cryo-Shale**, and **Polar Quartz**. Incapable of penetrating hard volatile deposits. |
| **Titan Drill** | 5×5 | **2** | 150 | 25 tiles / 40 cap | 2.2/sec (Water boost ×1.8) | Glacite (130), Cryo-Shale (90), Polar Quartz (60), Subzero Silicon (40) | Heavy industrial platform. Required to extract the 3 advanced ores: **Boreonite** (fuel), **Frost-Magnetite** (magnetic), and **Boreal Clathrate** (hydrate). |

---

### 3. Manufactured Industrial Materials
| Material | Producing Facility | Recipe Ingredients | Applications |
| :--- | :--- | :--- | :--- |
| **Subzero Silicon** (`subzero-silicon`) | Cryo-Synthesizer | Polar Quartz (2), Cryo-Shale (1) → Yields ×2 | Distribution bridges, Titan Drills, processor circuitry, turret guidance, unit blueprints. |
| **Cryo-Glass** (`cryo-glass`) | Cryo-Glass Kiln | Polar Quartz (2), Glacite (1) → Yields ×1 | Insulated liquid conduits, tanks, optical prisms, naval shipbuilding. |
| **Cryo-Fiber** (`cryo-fiber`) | Fiber Extruder | Polar Quartz (2), Glacite (1) → Yields ×2 | High-tensile cables, processor assembler input, airframes, Frostbite flechette ammo. |
| **Endothermic Salt** (`endothermic-salt`) | Endothermic Vat | Cryo-Shale (2), Boreonite (2) → Yields ×1 | Quantum Condenser input, Cryo Wall death nova explosive, Permafrost chemical freeze mortar shells. |
| **Cryo-Crystal** (`cryo-crystal`) | Cryo-Crystallizer / Industrial Crystallizer | Polar Quartz + Boreonite + Chilled Water | Core ammunition for all heavy turrets, reactive Cryo Walls, Cryo-Alloy synthesis. |
| **Gelid Polymer** (`gelid-polymer`) | Polymer Press | Boreal Clathrate (2), Cryo-Glass (1) → Yields ×1 | Cavitation Foundry input, Sleet walker armor, Icebreaker naval hull plating. |
| **Cryo-Processor** (`cryo-processor`) | Processor Assembler | Subzero Silicon (3), Cryo-Fiber (2), Glacite (2) → Yields ×1 | Nanite Fabricator input, guided missile tracking (Avalanche), railgun targeting (Glacialis), unit computers. |
| **Cryo-Alloy** (`cryo-alloy`) | Cryo-Alloy Foundry | Glacite (3), Subzero Silicon (2), Cryo-Crystal (2) + Chilled Water | Zero-Point Reactor fuel, Shielded Cryo Walls, Reconstructors, Glacialis kinetic ammo. |
| **Superconducting Solenoid** (`superconducting-solenoid`) | Solenoid Winder | Cryo-Alloy (2), Frost-Magnetite (3), Subzero Silicon (1) → Yields ×1 | EMP guided torpedo ammo (Avalanche), walker servo limbs, railgun induction accelerators. |
| **Aero-Glacite** (`aero-glacite`) | Cavitation Foundry | Glacite (3), Gelid Polymer (2) + Chilled Water → Yields ×1 | Hypersonic kinetic sabot ammo (Glacialis), strike aircraft airframes, Absolute Zero optics. |
| **Cryo-Nanites** (`cryo-nanites`) | Nanite Fabricator | Cryo-Processor (1), Cryo-Alloy (2), Cryo-Crystal (2) → Yields ×1 | Swarm ammo (Blizzard), cluster ammo (Permafrost), self-repairing armor & Shielded Walls. |
| **Quantum Condensate** (`quantum-condensate`) | Quantum Condenser | Cryo-Crystal (4), Superconducting Solenoid (2), Endothermic Salt (3) + Chilled Water → Yields ×1 | Pinnacle freeze-implosion ammo (Glacialis: 2,400 dmg + 750 splash), Zero-Point Reactor quantum core. |

---

### 3. Fluids
- **Chilled Water** (`chilled-water`): Condensed atmospheric coolant generated by the **Cryo Freezer** using electrical power. Essential refrigerant for high-tier chemical foundries, crystallizers, drills, and reactor containment.

---

## Combat Units & Upgraders

### Production Facilities
- **Cryo Unit Factory** (3×3): Assembles Tier 1 air interceptors and land assault walker mechs.
- **Cryo Naval Shipyard** (3×3, Floating): Assembles Tier 1 reinforced naval cutters over water.
- **Cryo Reconstructor** (3×3, Floating): Upgrades Tier 1 units into Tier 2 war machines using Cryo-Alloy, Subzero Silicon, Cryo-Processors, and Superconducting Solenoids. Placeable on land or water.

### Tier 1 Combat Units
| Unit | Type | Health / Armor | Armament | Description |
| :--- | :---: | :---: | :--- | :--- |
| **Boreas** | Air | 420 / 3 | Twin rapid-cycle shard autocannons | Agile cryogenic assault interceptor; shreds light ground and air targets. |
| **Sleet** | Land | 720 / 5 | Dual piercing shard autocannons (`sleet-weapon`) | Heavy armored assault walker mech with custom animated bipedal legs. |
| **Icebreaker** | Naval | 980 / 6 | Long-range torpedo launcher & dual frost flak | Reinforced naval cutter; ploughs through waters to engage ships and coastlines. |

### Tier 2 Combat Units (Upgraded in Cryo Reconstructor)
| Unit | Upgraded From | Type | Health / Armor | Armament | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **Tempest** | Boreas | Air | 920 / 6 | High-cadence autocannons & seeker frost missiles | Twin-engine heavy strike aircraft; delivers sustained saturation fire and homing missiles. |
| **Hailstorm** | Sleet | Land | 1,550 / 9 | Dual heavy rail-blasters & shoulder burst mortars | Fortified heavy assault walker mech with heavy hydraulic legs and anti-fortification artillery. |
| **Glacier Cruiser** | Icebreaker | Naval | 2,350 / 11 | Dual 360° heavy naval artillery turrets & flak guns | Capital-class naval battlecruiser; dominates waterways with devastating long-range bombardments. |

---

## Combat Turrets & Weaponry

| Turret | Size | Type | Range | Ammo / Consumption | Role & Special Traits |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **Frostbite** | 2×2 | Rail / Shard | 195 | Cryo-Shale, Subzero Silicon (Homing), Cryo-Crystal (Pierce 2), **Cryo-Fiber** (Flechette Sabot: speed 8.5, pierce 3) | Rapid-fire kinetic rail turret; excels at early-to-midgame air and ground suppression. |
| **Permafrost** | 3×3 | Artillery | 285 | Boreonite (Frag 5), Cryo-Crystal (Frag 8), **Endothermic Salt** (Chem Freeze Nova: radius 56, 10s freeze), **Cryo-Nanites** (Sapping cluster) | Heavy siege mortar firing volatile bursting shells that shred armor and blanket ground targets in ice. |
| **Blizzard** | 3×3 | Rotary Gatling | 220 | Glacite, Cryo-Crystal, Cryo-Alloy (Pierce 2 + Frag 3), **Cryo-Nanites** (Micro-swarm: sapped status & knockback) | 10 rounds/sec rotary storm cannon; violent knockback stops heavy ground and air assault columns in their tracks. |
| **Avalanche** | 3×3 | Guided Missile | 310 | Boreonite (Torpedo), Cryo-Crystal, Cryo-Alloy (Cluster Torpedo), **Superconducting Solenoid** (EMP Torpedo: 260 dmg + 180 splash + shock lightning) | Long-range missile launcher firing intelligent tracking torpedoes with multi-stage cluster warheads. |
| **Absolute Zero** | 3×3 | Power Laser | 220 | 360 Power/sec (Optional Coolant Boost) | Continuous piercing cryogenic laser beam inflicting thermal shock and sustained freeze lockdown. |
| **Glacialis** | 4×4 | Super Railgun | 390 | Cryo-Crystal (620 dmg), Cryo-Alloy (1,250 dmg, pierce 8), **Aero-Glacite** (Hypersonic: speed 24, 980 dmg, pierce 12), **Quantum Condensate** (Implosion: 2,400 dmg + 750 splash + 20s freeze) | Colossal anti-titan rail accelerator capable of punching through multiple armored bosses in a single shot. |

---

## Power Generation & Grid

- **Cryo Hydro-Turbine** (2×2 Generator, Floating):
  - Produces **270 power/sec** (4.5/tick) directly from natural water currents when constructed on shallow water.
  - Features an animated 6-blade kinetic rotor spinning smoothly beneath structural gantry struts.
  - Requires only 25 Glacite and 18 Cryo-Shale.
- **Thermo-Stirling Engine** (2×2 Generator):
  - Produces **450 power/sec** by combusting volatile Boreonite inside an endothermically boosted expansion chamber.
  - *Consumes*: Boreonite (1 every 2s).
- **Zero-Point Cryo-Reactor** (4×4 Monumental Power Complex):
  - Produces **3,600 power/sec** by harnessing zero-point thermal vacuum compression.
  - *Consumes*: Cryo-Alloy (1 every 3s), Chilled Water (0.3/sec).
- **Cryo Node** (1×1) & **Large Cryo Node** (2×2):
  - Insulated high-voltage beam pylons connecting up to 10 and 22 structures across long ranges.

---

## Fortifications & Defensive Walls

- **Glacite Wall** (1×1, 440 HP) & **Large Glacite Wall** (2×2, 1,760 HP): Early-game physical perimeter containment.
- **Cryo Wall** (1×1, 720 HP) & **Large Cryo Wall** (2×2, 2,880 HP):
  - Built with Glacite, Cryo-Crystals, and **Endothermic Salt**.
  - **Reactive Freeze Blast**: Upon destruction, detonates in an endothermic shockwave (up to 140 splash damage, 72-tile radius) that freezes all nearby attackers for 8 seconds.
- **Shielded Cryo Wall** (1×1, 1,200 HP) & **Large Shielded Cryo Wall** (2×2, 4,800 HP):
  - High-tier bastion forged from **Cryo-Alloy** and infused with **Cryo-Nanites**.
  - Built-in **14 Armor** and **30% projectile deflection** chance with molecular self-repair matrix.

---

## Logistics & Fluid Networks

- **Cryo Conveyor**: Low-friction transport track featuring **28-frame animated directional sprites** across straight, turn, and corner configurations (speed: 12.2 items/sec).
- **Cryo Junction, Router & Distributor**: Supercooled frictionless manifolds to prevent logistical clogs.
- **Cryo Bridge & Cryo Liquid Bridge**: Long-distance suspended magnetic conduits spanning up to 5 tiles.
- **Cryo Conduit**: Armored, leak-proof fluid duct with 1.25 liquid pressure rating.
- **Cryo Liquid Tank**: 2×2 refrigerated vacuum reservoir storing up to 800 units of liquid.

---

## Installation & How to Play

### Option 1: Direct Folder Copy (Recommended)
Copy this entire mod folder to your Mindustry mods directory:
- **Windows**: `%appdata%\Mindustry\mods\cryogenic-frontiers`
- **Steam**: `[Steam Library]\steamapps\common\Mindustry\saves\mods\cryogenic-frontiers`
- **Linux**: `~/.local/share/Mindustry/mods/cryogenic-frontiers`
- **MacOS**: `~/Library/Application Support/Mindustry/mods/cryogenic-frontiers`

### Option 2: Import ZIP in Mindustry
1. Launch **Mindustry**.
2. Click **Mods** -> **Import Mod**.
3. Select `cryogenic-frontiers.zip`.
4. Mindustry will extract, verify, and enable the mod immediately!

---

## Credits & License

- **Mod Author**: `sonip362`
- **Mod Name**: `cryogenic-frontiers`
- **Version**: `2.7.0`
- **Compatibility**: Mindustry v7 & v8 (Build 136+)
