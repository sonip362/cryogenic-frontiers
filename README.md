# [#6ecdec]Cryogenic Frontiers[] - Mindustry Mod

[![Mindustry Version](https://img.shields.io/badge/Mindustry-v7%20%2F%20v8%20(Build%20136%2B)-6ecdec.svg)](https://github.com/Anuken/Mindustry)
[![Mod Version](https://img.shields.io/badge/Version-2.3.0-4be3b0.svg)](file:///e:/Mindustry_Mods/mod.hjson)
[![License](https://img.shields.io/badge/Ecosystem-100%25%20Standalone-78f3e5.svg)](#)

**Cryogenic Frontiers** is a massive standalone technological expansion for **Mindustry** (supporting v7 and v8 build 136+). Set upon the frigid, blizzard-swept world of **Nivalis**, it introduces a completely self-contained technological progression featuring **zero dependencies** on vanilla Serpulo/Erekir resources, ammo, or crafting trees.

From sub-zero crystal refining and cryogenic particle compression to bipedal assault mechs and quantum-condensate hyper-railguns, Cryogenic Frontiers delivers a deep, tactical, and mechanically rich industrial warfare experience.

---

## Key Features

- **100% Self-Contained Ecosystem**: Fully standalone tech tree starting from `Core: Frost` with its own dedicated ores, manufactured materials, power plants, and weapons.
- **6 Natural Geological Ores**: Glacite, Cryo-Shale, Boreonite, Polar Quartz, Frost-Magnetite, and Boreal Clathrate with authentic vanilla-style scattered rock vein spawning.
- **12 High-Tier Manufactured Materials**: Full industrial production chain from Subzero Silicon to self-replicating Cryo-Nanites and Quantum Condensates.
- **Bipedal Walker Mechs & Naval Shipyards**: Land assault walkers with procedural stride animations, combat interceptors, and floating deep-water naval drydocks.
- **Heavy Defensive Ordnance**: Multi-tier railguns, siege mortars, rotary gatling storm cannons, and guided torpedo batteries.
- **Zero Useless Items**: Every single manufactured material is actively integrated across turret ammunitions, unit production blueprints, and high-tech structure costs.
- **Authentic Mindustry Pixel Art**: Stepped mechanical contours, top-left directional bevel lighting, dark gunmetal armor plates, and vibrant sub-zero cyan energy accents.

---

## Materials & Economy

### 1. Natural Geological Ores (Mined from Nivalis)
| Ore | Description | Primary Uses |
| :--- | :--- | :--- |
| **Glacite** (`glacite`) | Brittle, highly conductive icy crystal mineral. | Structural frames, basic conveyors, crafter casings, kinetic ammo. |
| **Cryo-Shale** (`cryo-shale`) | Dense metamorphic rock layered with sub-zero mineral frost. | Structural ballast, wall reinforcement, thermal insulation, heavy mortar shells. |
| **Boreonite** (`boreonite`) | Heavy mineral matrix containing polarized magnetic inclusions. | Crystallization catalyst, Stirling generator fuel, magnetic torpedoes. |
| **Polar Quartz** (`polar-quartz`) | Prismatic crystalline silica with exceptional optical and dielectric traits. | Optical glass synthesis, silicon distillation, fiber extrusion, laser optics. |
| **Frost-Magnetite** (`frost-magnetite`) | Natural lodestone with intense magnetic field properties. | Superconducting solenoids, magnetic accelerator coils. |
| **Boreal Clathrate** (`boreal-clathrate`) | Volatile hydrocarbon-methane ice cage formed under extreme pressure. | Synthetic polymer synthesis, specialized chemical fuels. |

---

### 2. Manufactured Industrial Materials
| Material | Producing Facility | Recipe Ingredients | Applications |
| :--- | :--- | :--- | :--- |
| **Subzero Silicon** (`subzero-silicon`) | Cryo-Synthesizer | Polar Quartz (2), Cryo-Shale (1) → Yields ×2 | Distribution bridges, processor circuitry, turret guidance, unit blueprints. |
| **Cryo-Glass** (`cryo-glass`) | Cryo-Glass Kiln | Polar Quartz (2), Glacite (1) → Yields ×1 | Insulated liquid conduits, tanks, optical prisms, naval shipbuilding. |
| **Cryo-Fiber** (`cryo-fiber`) | Fiber Extruder | Polar Quartz (2), Glacite (1) → Yields ×2 | High-tensile cables, processor assembler input, Boreas interceptor airframes, Frostbite flechette ammo. |
| **Endothermic Salt** (`endothermic-salt`) | Endothermic Vat | Cryo-Shale (2), Boreonite (2) → Yields ×1 | Quantum Condenser input, Cryo Wall death nova explosive, Permafrost chemical freeze mortar shells. |
| **Cryo-Crystal** (`cryo-crystal`) | Cryo-Crystallizer / Industrial Crystallizer | Polar Quartz + Boreonite + Chilled Water | Core ammunition for all heavy turrets, reactive Cryo Walls, Cryo-Alloy synthesis. |
| **Gelid Polymer** (`gelid-polymer`) | Polymer Press | Boreal Clathrate (2), Cryo-Glass (1) → Yields ×1 | Cavitation Foundry input, Sleet walker armor, Icebreaker naval hull plating. |
| **Cryo-Processor** (`cryo-processor`) | Processor Assembler | Subzero Silicon (3), Cryo-Fiber (2), Glacite (2) → Yields ×1 | Nanite Fabricator input, guided missile tracking (Avalanche), railgun targeting (Glacialis), unit computers. |
| **Cryo-Alloy** (`cryo-alloy`) | Cryo-Alloy Foundry | Glacite (3), Subzero Silicon (2), Cryo-Crystal (2) + Chilled Water | Zero-Point Reactor fuel, Shielded Cryo Walls, Titan Drills, Glacialis hyper-velocity kinetic ammo. |
| **Superconducting Solenoid** (`superconducting-solenoid`) | Solenoid Winder | Cryo-Alloy (2), Frost-Magnetite (3), Subzero Silicon (1) → Yields ×1 | EMP guided torpedo ammo (Avalanche), Sleet walker servo limbs, railgun induction accelerators. |
| **Aero-Glacite** (`aero-glacite`) | Cavitation Foundry | Glacite (3), Gelid Polymer (2) + Chilled Water → Yields ×1 | Hypersonic kinetic sabot ammo (Glacialis), Boreas interceptor airframe, Absolute Zero optics, Titan Drill. |
| **Cryo-Nanites** (`cryo-nanites`) | Nanite Fabricator | Cryo-Processor (1), Cryo-Alloy (2), Cryo-Crystal (2) → Yields ×1 | Swarm ammo (Blizzard), cluster ammo (Permafrost), self-repairing Sleet armor & Shielded Walls. |
| **Quantum Condensate** (`quantum-condensate`) | Quantum Condenser | Cryo-Crystal (4), Superconducting Solenoid (2), Endothermic Salt (3) + Chilled Water → Yields ×1 | Pinnacle freeze-implosion ammo (Glacialis: 2,400 dmg + 750 splash), Zero-Point Reactor quantum core. |

---

### 3. Fluids
- **Chilled Water** (`chilled-water`): Condensed atmospheric coolant generated by the **Cryo Freezer** using electrical power. Essential refrigerant for high-tier chemical foundries, crystallizers, drills, and reactor containment.

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

## Combat Units & Shipbuilding

### Production Facilities
- **Cryo Unit Factory** (3×3): Assembles air interceptors and land assault walker mechs.
- **Cryo Naval Shipyard** (3×3, Floating): Constructed over deep waters to build reinforced naval cutters and warships.

### Unit Rosters
- **Boreas** (Tier 2 Flying Interceptor):
  - *Armament*: Twin wing-mounted rapid-cycle shard autocannons with piercing freeze rounds.
  - *Built With*: Subzero Silicon (25), Glacite (20), Cryo-Crystal (15), **Aero-Glacite (12)**, **Cryo-Fiber (15)**.
- **Sleet** (Tier 2 Heavy Assault Walker Mech):
  - *Armament*: Dual shoulder-mounted heavy autocannons (`sleet-weapon`) with piercing shard rounds.
  - *Locomotion*: Custom bipedal armored legs (`sleet-leg`) with procedural stride animation and pelvic chassis (`sleet-base`).
  - *Built With*: Glacite (35), Subzero Silicon (25), Gelid Polymer (15), **Superconducting Solenoid (8)**, **Cryo-Processor (10)**, **Cryo-Nanites (8)**.
- **Icebreaker** (Tier 2 Naval Cutter Warship):
  - *Armament*: Long-range torpedo launcher (`icebreaker-torpedo`) and dual flak cannons (`icebreaker-flak`).
  - *Built With*: Glacite (40), Gelid Polymer (25), Cryo-Shale (30), Cryo-Glass (15), **Cryo-Alloy (15)**, **Cryo-Processor (12)**.
- **Frost Alpha** (Starting Core Drone):
  - Heavy core builder unit equipped with mining and build beam emitters.

---

## Power Generation & Grid

- **Cryo Node** (1×1) & **Large Cryo Node** (2×2):
  - Insulated high-voltage beam pylons connecting up to 10 and 22 structures across long ranges.
- **Thermo-Stirling Engine** (2×2 Generator):
  - Produces **450 power/sec** by combusting volatile Boreonite inside an endothermically boosted expansion chamber.
  - *Consumes*: Boreonite (1 every 2s).
- **Zero-Point Cryo-Reactor** (4×4 Monumental Power Complex):
  - Produces **3,600 power/sec** by harnessing zero-point thermal vacuum compression.
  - *Consumes*: Cryo-Alloy (1 every 3s), Chilled Water (0.3/sec).
  - *Constructed With*: Glacite (320), Subzero Silicon (220), Cryo-Crystal (140), Cryo-Alloy (80), Superconducting Solenoid (40), Cryo-Processor (35), Cryo-Nanites (30), Quantum Condensate (20).

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
- **Version**: `2.3.0`
- **Compatibility**: Mindustry v7 & v8 (Build 136+)
