Pilot IDs
0x01 = Kazuki
0x02 = Emma
0x03 = Ryogo
0x04 = Dennis
0x05 = Yun
0x06 = Jose
0x07 = Li
0x08 = Linny
0x09 = Marcus
0x0a = Alisa
0x0b = Liu
0x0c = Miho
0x0d = Pham
0x0e = Lan
0x0f = Mayer
0x10 = Isao

Pilot Data - Starts at 0x118470 - 372 byte struct
+0x000

+0x00c [32-bit] Unknown pointer

+0x01c [32-bit] Unknown pointer

+0x038 [32-bit] Unknown pointer
+0x03c [16-bit] Equipped battle computer
...... 0x01 = COM4 
...... 0x02 = COMB652
...... 0x03 = COMB603
...... 0x04 = COMB554
...... 0x05 = COMC554
...... 0x06 = COMC654
...... 0x07 = COMC754
...... 0x08 = COMG10
...... 0x09 = COM5
...... 0x0a = COM6
+0x040 [16-bit] Indexes battle computer name
...... 0x117 = COM4 
...... 0x118 = COMB652
...... 0x119 = COMB603
...... 0x10a = COMB554
...... 0x11b = COMC554
...... 0x11c = COMC654
...... 0x11d = COMC754
...... 0x11e = COMG10
...... 0x11f = COM5
...... 0x120 = COM6
+0x042 [8-bit] Part type
| ..... 0x01 = Body
| ..... 0x02 = Arm
| ..... 0x03 = Legs
| ..... 0x04 = Weapon
| ..... 0x05 = Backpack
| ..... 0x06 = Computer

+0x048 [32-bit] Pointer that changes according to equipped battle computer

+0x062 [16-bit] Melee EXP

+0x066 [16-bit] Rifle EXP
+0x068 [16-bit] Machine gun EXP
+0x06a [16-bit] Shotgun EXP
+0x06c [16-bit] Flamethrower EXP
+0x06e [16-bit] Missile EXP
+0x070 [16-bit] Cannon EXP
+0x072 [16-bit] Beam EXP

+0x07a [16-bit] Grenade EXP

+0x086 [16-bit] Current HP
+0x088 [16-bit] Max HP
+0x08a [16-bit] Ace rank medals count

+0x096 [8-bit] Portrait ID
...... Same as pilot ID (see 0x??????)

+0x09c [8-bit] Current AP
+0x09d [8-bit] Max AP
+0x09e [8-bit] AP assigned to defense
+0x09f [8-bit] AP assigned to accuracy
+0x0a0 [8-bit] AP assigned to evasion

+0x0ae [8-bit] Affiliation
...... 0x00 = Not in party
...... 0x01 = In party
...... 0x02 = Not eligible for recruitment on current route

+0x0af [8-bit] Equipped battle skill slot 1
+0x0b0 [8-bit] Equipped battle skill slot 2
+0x0b1 [8-bit] Equipped battle skill slot 3
+0x0b2 [8-bit] Equipped battle skill slot 4
+0x0b3 [8-bit] Equipped battle skill slot 5
+0x0b4 [8-bit] Equipped battle skill slot 6

+0x0c0 [8-bit] Surrendering status
+0x0c1 [8-bit] Stun status
...... >= 0x20 = Stunned
...... While stunned, ticks down by 0x20 at the start of each turn
+0x0c2 [8-bit] Confuse status
...... >= 0x20 = Confused
...... While confused, ticks down by 0x20 at the start of each turn

+0x0d0 [96 bytes, 8-bit values] Number of each battle skill available
...... 0x00 = Not listed
...... 0x01 = Greyed out
...... 0x02 = 1 available
...... 0x03 = 2 availalbe
...... et cetera
+0x130 [ASCII, 17 bytes] Pilot first name
+0x141 [ASCII, 17 bytes] Pilot last name
+0x152 [ASCII, 17 bytes] Pilot first name (variant)
+0x163 [ASCII, 17 bytes] Pilot last name (variant)





Wanzer Data - Starts at 0x119f90 - 620 byte struct
+0x000 Unknown (7 bytes)
+0x007 Machine colour (8-bit)
+0x008 Unknown (8-bit)
+0x009 Machine name (17 bytes, ASCII)
+0x01a Unknown (30 bytes)
+0x038 Pointer to body data (32-bit)
| +0x00 Unknown (16-bit)
| +0x02 Part appearance (16-bit)
| +0x04 Part name (16-bit)
|...... Indexes string table at 0x0d0620
| +0x06 Part type (8-bit)
| ..... 0x01 = Body
| ..... 0x02 = Arm
| ..... 0x03 = Legs
| ..... 0x04 = Weapon
| ..... 0x05 = Backpack
| ..... 0x06 = Compter
| +0x07 Unknown (8-bit)
| +0x08 Weight (16-bit)
| +0x0a Unknown (16-bit)
| +0x0c Unknown (8-bit)
| +0x0d Unknown (8-bit)
| +0x0e Unknown (2 bytes)
| +0x10 Def-C upgrade level (8-bit)
| +0x11 HP-C upgrade level (8-bit)
| +0x12 Unknown (8-bit)
| +0x13 Unknown (8-bit)
| +0x14 ?? Max Def-C ?? (16-bit)
| +0x16 ?? Max HP multiplier ?? (16-bit)
| +0x18 ?? Battle skill modifier ?? (16-bit)
| +0x1a Unknown (6 bytes)
| +0x20 Unknown (16-bit)
| +0x22 Current HP (16-bit)
| +0x24 Max HP (16-bit)
| +0x26 Unknown (16-bit)
| +0x28 Unknown pointer (32-bit)
| +0x2c Power (16-bit)
| +0x2e Def-C damage class (8 bit)
| ..... 0x01 = Penetrating
| ..... 0x02 = Impact
| ..... 0x04 = Flame
| +0x2f Unknown (8-bit)
+0x03c Pointer to legs data (32-bit)
| +0x00 Unknown (16-bit)
| +0x02 Part appearance (16-bit)
| +0x04 Part name (16-bit)
| +0x06 Part type (8-bit)
| ..... 0x01 = Body
| ..... 0x02 = Arm
| ..... 0x03 = Legs
| ..... 0x04 = Weapon
| ..... 0x05 = Backpack
| +0x07 Unknown (8-bit)
| +0x08 Weight (16-bit)
| +0x0a Unknown (16-bit)
| +0x0c Unknown (8-bit)
| +0x0d Unknown (8-bit)
| +0x0e Unknown (2 bytes)
| +0x10 Eva upgrade level (8-bit)
| +0x11 HP upgrade level (8-bit)
| +0x12 Unknown (8-bit)
| +0x13 Bst upgrade level (8-bit)
| +0x14 ?? Max Acc ?? (16-bit)
| +0x16 ?? Max HP multiplier ?? (16-bit)
| +0x18 ?? Battle skill modifier ?? (16-bit)
| +0x1a Unknown (6 bytes)
| +0x20 Unknown (16-bit)
| +0x22 Current HP (16-bit)
| +0x24 Max HP (16-bit)
| +0x26 Unknown (16-bit)
| +0x28 Unknown pointer (32-bit)
| +0x2c Unknown (16-bit)
| +0x2e Unknown (16 bit)
+0x040 Pointer to left arm data (32-bit)
| +0x00 Unknown (16-bit)
| +0x02 Part appearance (16-bit)
| +0x04 Part name (16-bit)
| +0x06 Part type (8-bit)
| ..... 0x01 = Body
| ..... 0x02 = Arm
| ..... 0x03 = Legs
| ..... 0x04 = Weapon
| ..... 0x05 = Backpack
| +0x07 Unknown (8-bit)
| +0x08 Weight (16-bit)
| +0x0a Unknown (16-bit)
| +0x0c Unknown (8-bit)
| +0x0d Unknown (8-bit)
| +0x0e Unknown (2 bytes)
| +0x10 Acc upgrade level (8-bit)
| +0x11 HP upgrade level (8-bit)
| +0x12 Unknown (8-bit)
| +0x13 Unknown (8-bit)
| +0x14 ?? Max Acc ?? (16-bit)
| +0x16 ?? Max HP multiplier ?? (16-bit)
| +0x18 ?? Battle skill modifier ?? (16-bit)
| +0x1a Unknown (6 bytes)
| +0x20 Unknown (16-bit)
| +0x22 Current HP (16-bit)
| +0x24 Max HP (16-bit)
| +0x26 Unknown (16-bit)
| +0x28 Unknown pointer (32-bit)
| +0x2c Unknown (16-bit)
| +0x2e Unknown (16 bit)
+0x044 Pointer to right arm data (32-bit)
| +0x00 Unknown (16-bit)
| +0x02 Part appearance (16-bit)
| +0x04 Part name (16-bit)
| +0x06 Part type (8-bit)
| ..... 0x01 = Body
| ..... 0x02 = Arm
| ..... 0x03 = Legs
| ..... 0x04 = Weapon
| ..... 0x05 = Backpack
| ..... 0x06 = Computer
| +0x07 Unknown (8-bit)
| +0x08 Weight (16-bit)
| +0x0a Unknown (16-bit)
| +0x0c Unknown (8-bit)
| +0x0d Unknown (8-bit)
| +0x0e Unknown (2 bytes)
| +0x10 Acc upgrade level (8-bit)
| +0x11 HP upgrade level (8-bit)
| +0x12 Unknown (8-bit)
| +0x13 Unknown (8-bit)
| +0x14 ?? Max Acc ?? (16-bit)
| +0x16 ?? Max HP multiplier ?? (16-bit)
| +0x18 ?? Battle skill modifier ?? (16-bit)
| +0x1a Unknown (6 bytes)
| +0x20 Unknown (16-bit)
| +0x22 Current HP (16-bit)
| +0x24 Max HP (16-bit)
| +0x26 Unknown (16-bit)
| +0x28 Unknown pointer (32-bit)
| +0x2c Unknown (16-bit)
| +0x2e Unknown (16 bit)
+0x048 Pointer to left hand weapon data (32-bit)
| +0x00 Unknown (16-bit)
| +0x02 Part appearance (16-bit)
| +0x04 Part name (16-bit)
| +0x06 Part type (8-bit)
| ..... 0x01 = Body
| ..... 0x02 = Arm
| ..... 0x03 = Legs
| ..... 0x04 = Weapon
| ..... 0x05 = Backpack
| +0x07 Unknown (8-bit)
| +0x08 Weight (16-bit)
| +0x0a Unknown (8-bit)
| +0x0b Unknown (8-bit)
| +0x0c Unknown pointer (32-bit)
| +0x10 Weapon class (8-bit)
| ..... 0x00 = (None)
| ..... 0x01 = Penetrating
| ..... 0x02 = Impact
| ..... 0x04 = Flame
| +0x11 Weapon animation (8-bit)
| +0x12 Damage per hit (weapon) / Damage reduction % (shield) (8-bit)
| +0x13 Number of hits (8-bit)
| +0x14 Accuracy (8-bit)
| +0x16 Maximum range (8-bit)
| +0x17 Unknown (8-bit)
| +0x18 Unknown (2 bytes)
| +0x1a Unknown (2 bytes)
| +0x1c Unknown (2 bytes)
| +0x1e Durability / ammo? (8-bit)
| +0x1f Unknown (9 bytes)
| +0x28 Pointer to arm that weapon is equipped on (32-bit)
+0x04c Pointer to left shoulder weapon data (32-bit)
| +0x00 Unknown (16-bit)
| +0x02 Part appearance (16-bit)
| +0x04 Part name (16-bit)
| +0x06 Part type (8-bit)
| ..... 0x01 = Body
| ..... 0x02 = Arm
| ..... 0x03 = Legs
| ..... 0x04 = Weapon
| ..... 0x05 = Backpack
| +0x07 Unknown (8-bit)
| +0x08 Weight (16-bit)
| +0x0a Unknown (8-bit)
| +0x0b Unknown (8-bit)
| +0x0c Unknown pointer (32-bit)
| +0x10 Weapon class (8-bit)
| ..... 0x00 = (None)
| ..... 0x01 = Penetrating
| ..... 0x02 = Impact
| ..... 0x04 = Flame
| +0x11 Weapon animation (8-bit)
| +0x12 Damage per hit (weapon) / Damage reduction % (shield) (8-bit)
| +0x13 Number of hits (8-bit)
| +0x14 Accuracy (8-bit)
| +0x16 Maximum range (8-bit)
| +0x17 Unknown (8-bit)
| +0x18 Unknown (2 bytes)
| +0x1a Unknown (2 bytes)
| +0x1c Unknown (2 bytes)
| +0x1e Durability / ammo? (8-bit)
| +0x1f Unknown (9 bytes)
| +0x28 Pointer to arm that weapon is equipped on (32-bit)
+0x050 Pointer to right hand weapon data (32-bit)
| +0x00 Unknown (16-bit)
| +0x02 Part appearance (16-bit)
| +0x04 Part name (16-bit)
| +0x06 Part type (8-bit)
| ..... 0x01 = Body
| ..... 0x02 = Arm
| ..... 0x03 = Legs
| ..... 0x04 = Weapon
| ..... 0x05 = Backpack
| +0x07 Unknown (8-bit)
| +0x08 Weight (16-bit)
| +0x0a Unknown (8-bit)
| +0x0b Unknown (8-bit)
| +0x0c Unknown pointer (32-bit)
| +0x10 Weapon class (8-bit)
| ..... 0x00 = (None)
| ..... 0x01 = Penetrating
| ..... 0x02 = Impact
| ..... 0x04 = Flame
| +0x11 Weapon animation (8-bit)
| +0x12 Damage per hit (weapon) / Damage reduction % (shield) (8-bit)
| +0x13 Number of hits (8-bit)
| +0x14 Accuracy (8-bit)
| +0x16 Maximum range (8-bit)
| +0x17 Unknown (8-bit)
| +0x18 Unknown (2 bytes)
| +0x1a Unknown (2 bytes)
| +0x1c Unknown (2 bytes)
| +0x1e Durability / ammo? (8-bit)
| +0x1f Unknown (9 bytes)
| +0x28 Pointer to arm that weapon is equipped on (32-bit)
+0x054 Pointer to right shoulder weapon data (32-bit)
| +0x00 Unknown (16-bit)
| +0x02 Part appearance (16-bit)
| +0x04 Part name (16-bit)
| +0x06 Part type (8-bit)
| ..... 0x01 = Body
| ..... 0x02 = Arm
| ..... 0x03 = Legs
| ..... 0x04 = Weapon
| ..... 0x05 = Backpack
| +0x07 Unknown (8-bit)
| +0x08 Weight (16-bit)
| +0x0a Unknown (8-bit)
| +0x0b Unknown (8-bit)
| +0x0c Unknown pointer (32-bit)
| +0x10 Weapon class (8-bit)
| ..... 0x00 = (None)
| ..... 0x01 = Penetrating
| ..... 0x02 = Impact
| ..... 0x04 = Flame
| +0x11 Weapon animation (8-bit)
| +0x12 Damage per hit (weapon) / Damage reduction % (shield) (8-bit)
| +0x13 Number of hits (8-bit)
| +0x14 Accuracy (8-bit)
| +0x16 Maximum range (8-bit)
| +0x17 Unknown (8-bit)
| +0x18 Unknown (2 bytes)
| +0x1a Unknown (2 bytes)
| +0x1c Unknown (2 bytes)
| +0x1e Durability / ammo? (8-bit)
| +0x1f Unknown (9 bytes)
| +0x28 Pointer to arm that weapon is equipped on (32-bit)
+0x058 Pointer to backpack data (32-bit)
| +0x00 Unknown (16-bit)
| +0x02 Part appearance (16-bit)
| +0x04 Part name (16-bit)
| +0x06 Part type (8-bit)
| ..... 0x01 = Body
| ..... 0x02 = Arm
| ..... 0x03 = Legs
| ..... 0x04 = Weapon
| ..... 0x05 = Backpack
| +0x07 Unknown (8-bit)
| +0x08 Weight (16-bit)
| +0x0a Unknown (8-bit)
| +0x0b Unknown (8-bit)
| +0x0c Unknown pointer (32-bit)
| +0x10 Capacity (8-bit)
| +0x11 Additional power (8-bit)
| +0x12 Unknown (16-bit)
+0x05c Unknown (8 bytes)
+0x064 Body data (48 bytes)
+0x094 Legs data (48 bytes)
+0x0c4 Left arm data (48 bytes)
+0x0f4 Right arm data (48 bytes)
+0x124 Left hand weapon data (44 bytes)
+0x150 Left shoulder weapon data (44 bytes)
+0x17c Right hand weapon data (44 bytes)
+0x1a8 Right shoulder weapon data (44 bytes)
+0x1d4 Backpack data (20 bytes)
+0x1e6 Unknown (116 bytes)
+0x25c Backpack items (8 bytes, 8-bit values)
...... 0x00 = (Empty)
...... 0x01 = Land Mine
...... 0x02 = Area Mine
...... 0x03 = Grenade
...... 0x04 = Missile
...... 0x05 = Repair
...... 0x06 = Repair Mx
...... 0x07 = Restore Lo
...... 0x08 = Restore Hi
...... 0x09 = Restore Mx
...... 0x0a = Recover
...... 0x0b = Recover Mx
...... 0x0c = Shield Rpr
...... 0x0d = Shield Mx
+0x264 Unknown (8 bytes)

-----------------------------------------------------------------------------------------------

In-battle units data (starts at 0x1e6ec8, 32-byte values)
+0x00 [16-bit] When targeting/targeted for attack takes on % chance of this unit being hit during attack/counterattack, 0xFFFF otherwise
+0x03 ??
+0x04 ??
+0x04 [8-bit] x-coordinate
+0x05 [8-bit] y-coordinate
+0x06 ??
+0x07 ??
+0x08 [32-bit] Pointer to ??
+0x0c [8-bit] Action state? 0x20 when melee/shield, 0x28 for gun?
+0x0d [8-bit] Seems to be 0 for selected player character, 1 for unselected, unsure for computer
+0x0e [8-bit] Index of actor in this array, 0xff when no actor stored at this index
+0x0f [8-bit] Index of this actor in pilot/vehicle pointer table at 0x1e3be0
+0x10 [8-bit] 
+0x11 [8-bit] Unit facing
..... 0x00 = Negative y-axis
..... 0x02 = Negative x-axis
..... 0x04 = Positive y-axis
..... 0x06 = Positive x-axis
+0x12 ??
+0x13 ??
+0x14 [8-bit] Weapon selection
..... 0x00 = Left hand
..... 0x01 = Left shoulder
..... 0x02 = Right hand
..... 0x03 = Right shoulder
+0x15 ??
+0x16 ??
+0x18 [32-bit] Pointer to ??
+0x1c [32-bit] Pointer to ??