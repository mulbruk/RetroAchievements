0x1225e0
0x801e3bd0

[32-bit] Pointer to big block of in-battle data
+0x0000 [16-bit] Number of entities present in battle
| ..... Pilots and Wanzers are each their own entity
+0x0002 [16-bit] Number of units present on battlefield
| ..... Pilots inside a vehicle count as a single unit, ejected pilots and empty vehicles are each counted as a unit
+0x0004 [16-bit] Number of enemy units deployed to battle
+0x0010 [136 bytes, 32-bit values] Array of pointers to pilot and vehicle data for actors present on battlefield
+0x0098 [4836 bytes, 372 byte values] Enemy/guest pilot data
+0x137C [8060 bytes, 620 byte values] Enemy/guest Wanzer data
+0x32F8 [1088 bytes, 32 byte values] Battle actors table
| ..... An array containing assorted state data for units present on the battlefield. Each entry is a 32 byte struct taking the format:
| ..... +0x00 [16-bit] When targeting/targeted for attack takes on % chance of this unit being hit during attack/counterattack, 0xFFFF otherwise
| ..... +0x04 [8-bit] x-coordinate
| ..... +0x05 [8-bit] y-coordinate
| ..... +0x0c [8-bit] Action state -> Values TBD
| ..... +0x0d [8-bit] 0 for active unit, 1 for all others
| ..... +0x0e [8-bit] Index of actor in this array, 0xff when no actor stored at this index
| ..... +0x0f [8-bit] Index of this actor in pilot/vehicle pointer table at 0x1e3be0
| ..... +0x11 [8-bit] Unit facing
| ........... 0x00 = Negative y-axis
| ........... 0x02 = Negative x-axis
| ........... 0x04 = Positive y-axis
| ........... 0x06 = Positive x-axis
| ..... +0x14 [8-bit] Weapon selection
| ........... 0x00 = Left hand
| ........... 0x01 = Left shoulder
| ........... 0x02 = Right hand
| ........... 0x03 = Right shoulder

----------------------------------------------------------------

0x1e30a0 	
[8-bit] Selected tile x-coordinate
		
0x1e30a2 	
[8-bit] Selected tile y-coordinate
		
0x1e30a4 	
[8-bit] Selected tile x-coordinate
		
0x1e30a6 	
[8-bit] Selected tile y-coordinate
	

0x1e3bd4 	
[8-bit] Number of enemy units deployed
		
0x1e3be0 	
[136 bytes, 4-byte values] Array of pointers to pilot and vehicle data for actors present on battlefield
		
0x1e3c68 	
[4836 bytes, 372 byte values] Enemy/guest pilot data
		
0x1e3d04 	
Unit 2 AP Current
		
0x1e3d05 	
Unit 2 AP Total
		
0x1e4f4c 	
[8060 bytes, 620 byte values] Enemy/guest wanzer data
		
0x1e4fd2 	
[16-bit]NPC Or Wanzer Body Enemy 1 HP
	Cheatsalot123 	
0x1e5002 	
[16-bit] Kazuki Leg hp
		
0x1e5032 	
[16-bit] Kazuki Left Arm hp
		
0x1e5062 	
[16-bit] Kazuki Right Arm hp
		
0x1e523e 	
[16-bit]NPC or Wanzer Enemy 2 Body remaining hp
	Cheatsalot123 	
0x1e5240 	
[16-bit]NPC or Enemy 1 Wanzer Body max hp
	Cheatsalot123 	
0x1e526e 	
[16-bit] Enemy 1 Leg current hp
		
0x1e5270 	
[16-bit] Enemy 1 Leg max hp
		
0x1e529e 	
[16-bit] Enemy 1 Left Arm current hp
		
0x1e52a0 	
[16-bit] Enemy 1 Left Arm max hp
		
0x1e52ce 	
[16-bit] Enemy 1 Right Arm current hp
		
0x1e52d0 	
[16-bit] Enemy 1 Right Arm max hp
		
0x1e54aa 	
[16-Bit]NPC or Enemy 3 Wanzer Body Remaining HP
	Cheatsalot123 	
0x1e54ac 	
Mission 2 Enemy 1 Body HP Max
		
0x1e5716 	
[16-Bit]NPC OR Enemy 2 Body HP Current
	Cheatsalot123 	
0x1e5718 	
Mission 2 Enemy 2 Body HP Max
		
0x1e5982 	
[16-Bit]NPC or Enemy 3 Wanzer Body Remaining HP
	Cheatsalot123 	
0x1e5984 	
Mission 2 Enemy 3 Body HP Max
		
0x1e5bee 	
Mission 2 Enemy 4 Body HP Current
		
0x1e5bf0 	
Mission 2 Enemy 4 Body HP Max
		
0x1e6ec8 	
[1088 bytes, 32 byte values] Battle actors table
An array containing assorted state data for units present on the battlefield. Each entry is a 32 byte struct taking the format:

+0x00 [16-bit] When targeting/targeted for attack takes on % chance of this unit being hit during attack/counterattack, 0xFFFF otherwise
+0x04 [8-bit] x-coordinate
+0x05 [8-bit] y-coordinate
+0x0c [8-bit] Action state -> Values TBD
+0x0d [8-bit] 0 for active unit, 1 for all others
+0x0e [8-bit] Index of actor in this array, 0xff when no actor stored at this index
+0x0f [8-bit] Index of this actor in pilot/vehicle pointer table at 0x1e3be0
+0x11 [8-bit] Unit facing
..... 0x00 = Negative y-axis
..... 0x02 = Negative x-axis
..... 0x04 = Positive y-axis
..... 0x06 = Positive x-axis
+0x14 [8-bit] Weapon selection
..... 0x00 = Left hand
..... 0x01 = Left shoulder
..... 0x02 = Right hand
..... 0x03 = Right shoulder
		
0x1e741c 	
[16-Bit]

End of Mission Stats - Prize Money