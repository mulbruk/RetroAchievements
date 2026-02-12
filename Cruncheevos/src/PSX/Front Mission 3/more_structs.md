+0x007 [8-bit] Machine colour
+0x009 [17 bytes, ASCII] Machine name
+0x038 [32-bit] Pointer to body data
| +0x02 [16-bit] Part appearance
| +0x04 [16-bit] Part name
|...... Indexes string table at 0x0d0620
| +0x06 [8-bit] Part type
| ..... 0x01 = Body
| ..... 0x02 = Arm
| ..... 0x03 = Legs
| ..... 0x04 = Weapon
| ..... 0x05 = Backpack
| ..... 0x06 = Compter
| +0x08 [16-bit] Weight
| +0x10 [8-bit] Def-C upgrade level
| +0x11 [8-bit] HP-C upgrade level
| +0x14 [16-bit] Max Def-C
| +0x16 [16-bit] Max HP multiplier
| +0x18 [16-bit] Spark table index for battle skills learned from this part
| +0x22 [16-bit] Current HP
| +0x24 [16-bit] Max HP
| +0x2c [16-bit] Power
| +0x2e [8-bit] Def-C damage class
| ..... 0x01 = Penetrating
| ..... 0x02 = Impact
| ..... 0x04 = Flame
+0x03c [32-bit] Pointer to legs data
| +0x02 [16-bit] Part appearance (16-bit)
| +0x04 [16-bit] Part name (16-bit)
| +0x06 [8-bit] Part type
| ..... 0x01 = Body
| ..... 0x02 = Arm
| ..... 0x03 = Legs
| ..... 0x04 = Weapon
| ..... 0x05 = Backpack
| +0x08 [16-bit] Weight
| +0x10 [8-bit] Eva upgrade level
| +0x11 [8-bit] HP upgrade level
| +0x13 [8-bit] Bst upgrade level
| +0x14 [16-bit] Max Eva
| +0x16 [16-bit] Max HP multiplier
| +0x18 [16-bit] Spark table index for battle skills learned from this part
| +0x22 [16-bit] Current HP
| +0x24 [16-bit] Max HP
+0x040 [32-bit] Pointer to left arm data
| +0x02 [16-bit] Part appearance
| +0x04 [16-bit] Part name
| +0x06 [8-bit] Part type
| ..... 0x01 = Body
| ..... 0x02 = Arm
| ..... 0x03 = Legs
| ..... 0x04 = Weapon
| ..... 0x05 = Backpack
| +0x08 [16-bit] Weight
| +0x10 [8-bit] Acc upgrade level
| +0x11 [8-bit] HP upgrade level
| +0x14 [16-bit] Max Acc
| +0x16 [16-bit] Max HP multiplier
| +0x18 [16-bit] Spark table index for battle skills learned from this part
| +0x22 [16-bit] Current HP
| +0x24 [16-bit] Max HP
+0x044 [32bit] Pointer to right arm data
| +0x02 [16-bit] Part appearance
| +0x04 [16-bit] Part name
| +0x06 [8-bit] Part type
| ..... 0x01 = Body
| ..... 0x02 = Arm
| ..... 0x03 = Legs
| ..... 0x04 = Weapon
| ..... 0x05 = Backpack
| +0x08 [16-bit] Weight
| +0x10 [8-bit] Acc upgrade level
| +0x11 [8-bit] HP upgrade level
| +0x14 [16-bit] Max Acc
| +0x16 [16-bit] Max HP multiplier
| +0x18 [16-bit] Spark table index for battle skills learned from this part
| +0x22 [16-bit] Current HP
| +0x24 [16-bit] Max HP
+0x048 [32-bit] Pointer to left hand weapon data
| +0x02 [16-bit] Part appearance
| +0x04 [16-bit] Part name
| +0x06 [8-bit] Part type
| ..... 0x01 = Body
| ..... 0x02 = Arm
| ..... 0x03 = Legs
| ..... 0x04 = Weapon
| ..... 0x05 = Backpack
| +0x08 [16-bit] Weight
| +0x10 [8-bit] Weapon class
| ..... 0x00 = (None)
| ..... 0x01 = Penetrating
| ..... 0x02 = Impact
| ..... 0x04 = Flame
| +0x11 [8-bit] Weapon animation
| +0x12 [8-bit] Damage per hit (weapon) / Damage reduction % (shield)
| +0x13 [8-bit] Number of hits
| +0x14 [8-bit] Accuracy
| +0x16 [8-bit] Maximum range
| +0x1e [8-bit] Ammo (weapon) / Durability (shield)
| +0x28 [32-bit] Pointer to arm that weapon is equipped on
+0x04c [32-bit] Pointer to left shoulder weapon data
| +0x02 [16-bit] Part appearance
| +0x04 [16-bit] Part name
| +0x06 [8-bit] Part type
| ..... 0x01 = Body
| ..... 0x02 = Arm
| ..... 0x03 = Legs
| ..... 0x04 = Weapon
| ..... 0x05 = Backpack
| +0x08 [16-bit] Weight
| +0x10 [8-bit] Weapon class
| ..... 0x00 = (None)
| ..... 0x01 = Penetrating
| ..... 0x02 = Impact
| ..... 0x04 = Flame
| +0x11 [8-bit] Weapon animation
| +0x12 [8-bit] Damage per hit (weapon) / Damage reduction % (shield)
| +0x13 [8-bit] Number of hits
| +0x14 [8-bit] Accuracy
| +0x16 [8-bit] Maximum range
| +0x1e [8-bit] Ammo (weapon) / Durability (shield)
| +0x28 [32-bit] Pointer to arm that weapon is equipped on
+0x050 [32-bit] Pointer to right hand weapon data
| +0x02 [16-bit] Part appearance
| +0x04 [16-bit] Part name
| +0x06 [8-bit] Part type
| ..... 0x01 = Body
| ..... 0x02 = Arm
| ..... 0x03 = Legs
| ..... 0x04 = Weapon
| ..... 0x05 = Backpack
| +0x08 [16-bit] Weight
| +0x10 [8-bit] Weapon class
| ..... 0x00 = (None)
| ..... 0x01 = Penetrating
| ..... 0x02 = Impact
| ..... 0x04 = Flame
| +0x11 [8-bit] Weapon animation
| +0x12 [8-bit] Damage per hit (weapon) / Damage reduction % (shield)
| +0x13 [8-bit] Number of hits
| +0x14 [8-bit] Accuracy
| +0x16 [8-bit] Maximum range
| +0x1e [8-bit] Ammo (weapon) / Durability (shield)
| +0x28 [32-bit] Pointer to arm that weapon is equipped on
+0x054 [32-bit] Pointer to right shoulder weapon data
| +0x02 [16-bit] Part appearance
| +0x04 [16-bit] Part name
| +0x06 [8-bit] Part type
| ..... 0x01 = Body
| ..... 0x02 = Arm
| ..... 0x03 = Legs
| ..... 0x04 = Weapon
| ..... 0x05 = Backpack
| +0x08 [16-bit] Weight
| +0x10 [8-bit] Weapon class
| ..... 0x00 = (None)
| ..... 0x01 = Penetrating
| ..... 0x02 = Impact
| ..... 0x04 = Flame
| +0x11 [8-bit] Weapon animation
| +0x12 [8-bit] Damage per hit (weapon) / Damage reduction % (shield)
| +0x13 [8-bit] Number of hits
| +0x14 [8-bit] Accuracy
| +0x16 [8-bit] Maximum range
| +0x1e [8-bit] Ammo (weapon) / Durability (shield)
| +0x28 [32-bit] Pointer to arm that weapon is equipped on
+0x058 [32-bit] Pointer to backpack data
| +0x02 [16-bit] Part appearance
| +0x04 [16-bit] Part name
| +0x06 [8-bit] Part type
| ..... 0x01 = Body
| ..... 0x02 = Arm
| ..... 0x03 = Legs
| ..... 0x04 = Weapon
| ..... 0x05 = Backpack
| +0x08 [16-bit] Weight
| +0x10 [8-bit] Capacity
| +0x11 [8-bit] Additional power
+0x064 [48 bytes] Body data
+0x094 [48 bytes] Legs data
+0x0c4 [48 bytes] Left arm data
+0x0f4 [48 bytes] Right arm data
+0x124 [44 bytes] Left hand weapon data
+0x150 [44 bytes] Left shoulder weapon data
+0x17c [44 bytes] Right hand weapon data
+0x1a8 [44 bytes] Right shoulder weapon data
+0x1d4 [20 bytes] Backpack data (20 bytes)
+0x25c [8 bytes, 8-bit values] Backpack items
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
