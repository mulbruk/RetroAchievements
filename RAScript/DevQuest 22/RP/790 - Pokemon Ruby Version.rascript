// Pokemon Ruby Version
// #ID = 790

// $00063C: Actual music ID (jp)
function music_id_jp() => word(0x00063C)

// $0006D4: ACTUAL Music ID
function music_id_en() => word(0x0006D4)

// $0042E5: ff=ingame (jp) (can be used to check for jp region)
function is_jp_region() => byte(0x0042E5) == 0xFF

// $02CECF: Caught 25-32
//          b0=pikachu
//          b1=raichu
//          b2=sandshrew
//          b3=sandslash
function caught_pikachu()   => bit0(0x02CECF)
function caught_raichu()    => bit1(0x02CECF)
function caught_sandshrew() => bit2(0x02CECF)
function caught_sandslash() => bit3(0x02CECF)

// $02CED0: Caught 33-40
//          b4=vulpix
//          b5=ninetales
//          bit6=Jigglypuff
//          bit7=Wigglytuff
function caught_vulpix()     => bit4(0x02CED0)
function caught_ninetales()  => bit5(0x02CED0)
function caught_jigglypuff() => bit6(0x02CED0)
function caught_wigglytuff() => bit7(0x02CED0)

// $02CED1: Caught 41-48
//          b0=Zubat
//          b1=Golbat
//          b2=oddish
//          b3=gloom
//          b4=vileplume
function caught_zubat()     => bit0(0x02CED1)
function caught_golbat()    => bit1(0x02CED1)
function caught_oddish()    => bit2(0x02CED1)
function caught_gloom()     => bit3(0x02CED1)
function caught_vileplume() => bit4(0x02CED1)

// $02CED2: b5=psyduck
//          b6=golduck
function caught_psyduck()   => bit5(0x02CED2)
function caught_golduck()   => bit6(0x02CED2)

// $02CED3: Pokedex caught
//          b6=Abra
//          b7=Kadabra
function caught_abra()      => bit6(0x02CED3)
function caught_kadabra()   => bit7(0x02CED3)

// $02CED4: Pokedex caught
//          b0=Alakazam
//          b1=Machop
//          b2=Machoke
//          b3=Machamp
//          b7=Tentacool
function caught_alakazam()  => bit0(0x02CED4)
function caught_machop()    => bit1(0x02CED4)
function caught_machoke()   => bit2(0x02CED4)
function caught_machamp()   => bit3(0x02CED4)
function caught_tentacool() => bit7(0x02CED4)

// $02CED5: Pokedex caught
//          b0=Tentacruel
//          b1=Geodude
//          b2=Graveler
//          b3=Golem
function caught_tentacruel() => bit0(0x02CED5)
function caught_geodude()    => bit1(0x02CED5)
function caught_graveler()   => bit2(0x02CED5)
function caught_golem()      => bit3(0x02CED5)

// $02CED6: Pokedex caught
//          b0=Magnemite
//          b1=Magneton
//          b3=doduo
//          b4=dodrio
//          b7=grimer
function caught_magnemite()  => bit0(0x02CED6)
function caught_magneton()   => bit1(0x02CED6)
function caught_doduo()      => bit3(0x02CED6)
function caught_dodrio()     => bit4(0x02CED6)
function caught_grimer()     => bit7(0x02CED6)

// $02CED7: b0=muk
function caught_muk()        => bit0(0x02CED7)

// $02CED8: Pokedex caught
//          b3=Voltorb
//          b4=Electrode
function caught_voltorb()    => bit3(0x02CED8)
function caught_electrode()  => bit4(0x02CED8)

// $02CED9: b4=koffing
//          b5=weezing
//          b6=rhyhorn
//          b7=rhydon
function caught_koffing()    => bit4(0x02CED9)
function caught_weezing()    => bit5(0x02CED9)
function caught_rhyhorn()    => bit6(0x02CED9)
function caught_rhydon()     => bit7(0x02CED9)

// $02CEDA: Pokedex caught
//          b3=horsea
//          b4=seadra
//          bit5=Goldeen
//          bit6=Seaking
//          b7=staryu
function caught_horsea()     => bit3(0x02CEDA)
function caught_seadra()     => bit4(0x02CEDA)
function caught_goldeen()    => bit5(0x02CEDA)
function caught_seaking()    => bit6(0x02CEDA)
function caught_staryu()     => bit7(0x02CEDA)

// $02CEDB: b0=starmie
//          b6=pinsir
function caught_starmie()    => bit0(0x02CEDB)
function caught_pinsir()     => bit6(0x02CEDB)

// $02CEDC: Pokedex caught
//          b0=Magikarp
//          b1=Gyarados
function caught_magikarp()   => bit0(0x02CEDC)
function caught_gyarados()   => bit1(0x02CEDC)

// $02CEE1: Pokedex caught
//          b0=Crobat
//          b1=chinchou
//          b2=lanturn
//          b3=pichu
//          b5=igglybuff
function caught_crobat()     => bit0(0x02CEE1)
function caught_chinchou()   => bit1(0x02CEE1)
function caught_lanturn()    => bit2(0x02CEE1)
function caught_pichu()      => bit3(0x02CEE1)
function caught_igglybuff()  => bit5(0x02CEE1)

// $02CEE2: Pokedex caught
//          b0=natu
//          b1=xatu
//          bit5=Bellossom
//          bit6=Marill
//          bit7=Azumarill
function caught_natu()       => bit0(0x02CEE2)
function caught_xatu()       => bit1(0x02CEE2)
function caught_bellossom()  => bit5(0x02CEE2)
function caught_marill()     => bit6(0x02CEE2)
function caught_azumarill()  => bit7(0x02CEE2)

// $02CEE5: b1=wobbuffet
//          b2=girafarig
function caught_wobbuffet()  => bit1(0x02CEE5)
function caught_girafarig()  => bit2(0x02CEE5)

// $02CEE6: b5=heracross
function caught_heracross()  => bit5(0x02CEE6)

// $02CEE7: Pokedex caught
//          b1=Slugma
//          b2=Magcargo
//          b5=corsola
function caught_slugma()     => bit1(0x02CEE7)
function caught_magcargo()   => bit2(0x02CEE7)
function caught_corsola()    => bit5(0x02CEE7)

// $02CEE8: b2=skarmory
//          b5=kingdra
//          b6=phanpy
//          b7=donphan
function caught_skarmory()   => bit2(0x02CEE8)
function caught_kingdra()    => bit5(0x02CEE8)
function caught_phanpy()     => bit6(0x02CEE8)
function caught_donphan()    => bit7(0x02CEE8)

// $02CEEB: Pokedex CAUGHT region - bit3=Treecko, bit4=Grovyle, bit5=Sceptile, bit6=Torchic, bit7=Combusken
function caught_treecko()    => bit3(0x02CEEB)
function caught_grovyle()    => bit4(0x02CEEB)
function caught_sceptile()   => bit5(0x02CEEB)
function caught_torchic()    => bit6(0x02CEEB)
function caught_combusken()  => bit7(0x02CEEB)

// $02CEEC: Pokedex caught - bit0=Blaziken, bit1=Mudkip, bit2=Marshtomp, bit3=Swampert, bit4=Poochyena, bit5=Mightyena, bit6=Zigzagoon, bit7=Linoone
function caught_blaziken()   => bit0(0x02CEEC)
function caught_mudkip()     => bit1(0x02CEEC)
function caught_marshtomp()  => bit2(0x02CEEC)
function caught_swampert()   => bit3(0x02CEEC)
function caught_poochyena()  => bit4(0x02CEEC)
function caught_mightyena()  => bit5(0x02CEEC)
function caught_zigzagoon()  => bit6(0x02CEEC)
function caught_linoone()    => bit7(0x02CEEC)

// $02CEF0: Pokedex caught - bit0=Slaking, bit1=Nincada, bit2=Ninjask, bit3=Shedinja, bit4=Whismur, bit5=Loudred, bit6=Exploud, bit7=Makuhita
function caught_slaking()    => bit0(0x02CEF0)
function caught_nincada()    => bit1(0x02CEF0)
function caught_ninjask()    => bit2(0x02CEF0)
function caught_shedinja()   => bit3(0x02CEF0)
function caught_whismur()    => bit4(0x02CEF0)
function caught_loudred()    => bit5(0x02CEF0)
function caught_exploud()    => bit6(0x02CEF0)
function caught_makuhita()   => bit7(0x02CEF0)

// $02CEF1: Pokedex caught - bit0=Hariyama, bit1=Azurill, bit2=Nosepass, bit3=Skitty, bit4=Delcatty, bit5=Sableye, bit6=Mawile, bit7=Aron
function caught_hariyama()   => bit0(0x02CEF1)
function caught_azurill()    => bit1(0x02CEF1)
function caught_nosepass()   => bit2(0x02CEF1)
function caught_skitty()     => bit3(0x02CEF1)
function caught_delcatty()   => bit4(0x02CEF1)
function caught_sableye()    => bit5(0x02CEF1)
function caught_mawile()     => bit6(0x02CEF1)
function caught_aron()       => bit7(0x02CEF1)

// $02CEF2: Pokedex caught - bit0=Lairon, bit1=Aggron, bit2=Meditite, bit3=Medicham, bit4=Electrike, bit5=Manectric, bit6=Plusle, bit7=Minun
function caught_lairon()     => bit0(0x02CEF2)
function caught_aggron()     => bit1(0x02CEF2)
function caught_meditite()   => bit2(0x02CEF2)
function caught_medicham()   => bit3(0x02CEF2)
function caught_electrike()  => bit4(0x02CEF2)
function caught_manectric()  => bit5(0x02CEF2)
function caught_plusle()     => bit6(0x02CEF2)
function caught_minun()      => bit7(0x02CEF2)

// $02CEF3: Pokedex caught - bit0=Volbeat, bit1=Illumise, bit2=Roselia, bit3=Gulpin, bit4=Swalot, bit5=Carvanha, bit6=Sharpedo, bit7=Wailmer
function caught_volbeat()    => bit0(0x02CEF3)
function caught_illumise()   => bit1(0x02CEF3)
function caught_roselia()    => bit2(0x02CEF3)
function caught_gulpin()     => bit3(0x02CEF3)
function caught_swalot()     => bit4(0x02CEF3)
function caught_carvanha()   => bit5(0x02CEF3)
function caught_sharpedo()   => bit6(0x02CEF3)
function caught_wailmer()    => bit7(0x02CEF3)

// $02CEF4: Pokedex caught - bit0=Wailord, bit1=Numel, bit2=Camerupt, bit3=Torkoal, bit4=Spoink, bit5=Grumpig, bit6=Spinda, bit7=Trapinch
function caught_wailord()    => bit0(0x02CEF4)
function caught_numel()      => bit1(0x02CEF4)
function caught_camerupt()   => bit2(0x02CEF4)
function caught_torkoal()    => bit3(0x02CEF4)
function caught_spoink()     => bit4(0x02CEF4)
function caught_grumpig()    => bit5(0x02CEF4)
function caught_spinda()     => bit6(0x02CEF4)
function caught_trapinch()   => bit7(0x02CEF4)

// $02CEF5: Pokedex caught - bit0=Vibrava, bit1=Flygon, bit2=Cacnea, bit3=Cacturne, bit4=Swablu, bit5=Altaria, bit6=Zangoose, bit7=Seviper
function caught_vibrava()    => bit0(0x02CEF5)
function caught_flygon()     => bit1(0x02CEF5)
function caught_cacnea()     => bit2(0x02CEF5)
function caught_cacturne()   => bit3(0x02CEF5)
function caught_swablu()     => bit4(0x02CEF5)
function caught_altaria()    => bit5(0x02CEF5)
function caught_zangoose()   => bit6(0x02CEF5)
function caught_seviper()    => bit7(0x02CEF5)

// $02CEF6: Pokedex caught - bit0=Lunatone, bit1=Solrock, bit2=Barboach, bit3=Whiscash, bit4=Corphish, bit5=Crawdaunt, bit6=Baltoy, bit7=Claydol
function caught_lunatone()   => bit0(0x02CEF6)
function caught_solrock()    => bit1(0x02CEF6)
function caught_barboach()   => bit2(0x02CEF6)
function caught_whiscash()   => bit3(0x02CEF6)
function caught_corphish()   => bit4(0x02CEF6)
function caught_crawdaunt()  => bit5(0x02CEF6)
function caught_baltoy()     => bit6(0x02CEF6)
function caught_claydol()    => bit7(0x02CEF6)

// $02CEF7: Pokedex caught - bit0=Lileep, bit1=Cradily, bit2=Anorith, bit3=Armaldo, bit4=Feebas, bit5=Milotic, bit6=Castform, bit7=Kecleon
function caught_lileep()    => bit0(0x02CEF7)
function caught_cradily()   => bit1(0x02CEF7)
function caught_anorith()   => bit2(0x02CEF7)
function caught_armaldo()   => bit3(0x02CEF7)
function caught_feebas()    => bit4(0x02CEF7)
function caught_milotic()   => bit5(0x02CEF7)
function caught_castform()  => bit6(0x02CEF7)
function caught_kecleon()   => bit7(0x02CEF7)

// $02CEF8: Pokedex caught - bit0=Shuppet, bit1=Banette, bit2=Duskull, bit3=Dusclops, bit4=Tropius, bit5=Chimecho, bit6=Absol, bit7=Wynaut
function caught_shuppet()   => bit0(0x02CEF8)
function caught_banette()   => bit1(0x02CEF8)
function caught_duskull()   => bit2(0x02CEF8)
function caught_dusclops()  => bit3(0x02CEF8)
function caught_tropius()   => bit4(0x02CEF8)
function caught_chimecho()  => bit5(0x02CEF8)
function caught_absol()     => bit6(0x02CEF8)
function caught_wynaut()    => bit7(0x02CEF8)

// $02CEF9: Pokedex caught - bit0=Snorunt, bit1=Glalie, bit2=Spheal, bit3=Sealeo, bit4=Walrein, bit5=Clamperl, bit6=Huntail, bit7=Gorebyss
function caught_snorunt()   => bit0(0x02CEF9)
function caught_glalie()    => bit1(0x02CEF9)
function caught_spheal()    => bit2(0x02CEF9)
function caught_sealeo()    => bit3(0x02CEF9)
function caught_walrein()   => bit4(0x02CEF9)
function caught_clamperl()  => bit5(0x02CEF9)
function caught_huntail()   => bit6(0x02CEF9)
function caught_gorebyss()  => bit7(0x02CEF9)

// $02CEFA: Pokedex caught - bit0=Relicanth, bit1=Luvdisc, bit2=Bagon, bit3=Shelgon, bit4=Salamence, bit5=Beldum, bit6=Metang, bit7=Metagross
function caught_relicanth() => bit0(0x02CEFA)
function caught_luvdisc()   => bit1(0x02CEFA)
function caught_bagon()     => bit2(0x02CEFA)
function caught_shelgon()   => bit3(0x02CEFA)
function caught_salamence() => bit4(0x02CEFA)
function caught_beldum()    => bit5(0x02CEFA)
function caught_metang()    => bit6(0x02CEFA)
function caught_metagross() => bit7(0x02CEFA)

// $02CEFB: Pokedex - bit0=Regirock, bit1=Regice, bit2=Registeel, bit3=Latias, bit4=Latios, bit5=Kyogre, bit6-Groudon, bit7=Rayquaza
function caught_regirock()  => bit0(0x02CEFB)
function caught_regice()    => bit1(0x02CEFB)
function caught_registeel() => bit2(0x02CEFB)
function caught_latias()    => bit3(0x02CEFB)
function caught_latios()    => bit4(0x02CEFB)
function caught_kyogre()    => bit5(0x02CEFB)
function caught_rayquaza()  => bit7(0x02CEFB)

// $02CEFC: Pokedex caught - bit0=Jirachi, bit1=Deoxys
function caught_jirachi()   => bit0(0x02CEFC)
function caught_deoxys()    => bit1(0x02CEFC)

// $02E7B4: b7=1st badge
function stone_badge_jp() => bit7(0x02E7B4)

// $02E7B5: b0=2nd badge
//          b1=3rd badge
//          b2=4th badge
//          b3=5th badge
//          b4=6th badge
//          b5=7th badge
//          b6=8th badge
function knuckle_badge_jp() => bit0(0x02E7B5)
function dynamo_badge_jp()  => bit1(0x02E7B5)
function heat_badge_jp()    => bit2(0x02E7B5)
function balance_badge_jp() => bit3(0x02E7B5)
function feather_badge_jp() => bit4(0x02E7B5)
function mind_badge_jp()    => bit5(0x02E7B5)
function rain_badge_jp()    => bit6(0x02E7B5)

function badge_count_jp() => (
  stone_badge_jp()   + knuckle_badge_jp() + dynamo_badge_jp() + heat_badge_jp() +
  balance_badge_jp() + feather_badge_jp() + mind_badge_jp()   + rain_badge_jp()
)

// $02EA54: Badge Flags - bit7=StoneBadgeRoxanne
function stone_badge_en()   => bit7(0x02EA54)

// $02EA55: Badge Flags - bit0=KnuckleBadgeBrawly, bit1=DynamoBadgeWattson, bit2=HeatBadgeFlannery, bit3=BalanceBadgeNorman, bit4=FeatherBadgeWinona, bit5=MindBadgeTateAndLiza, bit6=RainBadgeWallace
function knuckle_badge_en() => bit0(0x02EA55)
function dynamo_badge_en()  => bit1(0x02EA55)
function heat_badge_en()    => bit2(0x02EA55)
function balance_badge_en() => bit3(0x02EA55)
function feather_badge_en() => bit4(0x02EA55)
function mind_badge_en()    => bit5(0x02EA55)
function rain_badge_en()    => bit6(0x02EA55)

function badge_count_en() => (
  stone_badge_en()   + knuckle_badge_en() + dynamo_badge_en() + heat_badge_en() +
  balance_badge_en() + feather_badge_en() + mind_badge_en()   + rain_badge_en()
)

function location_id_jp() => word(0x03659C)
function location_id_en() => word(0x03683C)

LocationLookup = {
    0x00: "Littleroot Town",
    0x01: "Oldale Town",
    0x02: "Dewford Town",
    0x03: "Lavaridge Town",
    0x04: "Fallarbor Town",
    0x05: "Verdanturf Town",
    0x06: "Pacifidlog Town",
    0x07: "Petalburg City",
    0x08: "Slateport City",
    0x09: "Mauville City",
    0x0a: "Rustboro City",
    0x0b: "Fortree City",
    0x0c: "Lilycove City",
    0x0d: "Mossdeep City",
    0x0e: "Sootopolis City",
    0x0f: "Ever Grande City",
    0x10: "Route 101",
    0x11: "Route 102",
    0x12: "Route 103",
    0x13: "Route 104",
    0x14: "Route 105",
    0x15: "Route 106",
    0x16: "Route 107",
    0x17: "Route 108",
    0x18: "Route 109",
    0x19: "Route 110",
    0x1a: "Route 111",
    0x1b: "Route 112",
    0x1c: "Route 113",
    0x1d: "Route 114",
    0x1e: "Route 115",
    0x1f: "Route 116",
    0x20: "Route 117",
    0x21: "Route 118",
    0x22: "Route 119",
    0x23: "Route 120",
    0x24: "Route 121",
    0x25: "Route 122",
    0x26: "Route 123",
    0x27: "Route 124",
    0x28: "Route 125",
    0x29: "Route 126",
    0x2a: "Route 127",
    0x2b: "Route 128",
    0x2c: "Route 129",
    0x2d: "Route 130",
    0x2e: "Route 131",
    0x2f: "Route 132",
    0x30: "Route 133",
    0x31: "Route 134",
    0x32: "underwater on Route 124",
    0x33: "underwater on Route 126",
    0x34: "underwater on Route 127",
    0x35: "underwater on Route 128",
    0x36: "underwater on Sootopolis",
    0x37: "Granite Cave",
    0x38: "Mt. Chimney",
    0x39: "the Safari Zone",
    0x3a: "the Battle Tower",
    0x3b: "Petalburg Woods",
    0x3c: "Rusturf Tunnel",
    0x3d: "an Abandoned Ship",
    0x3e: "New Mauville",
    0x3f: "Meteor Falls",
    0x40: "Meteor Falls",
    0x41: "Mt. Pyre",
    0x42: "the Hideout near Lilycove City",
    0x43: "Shoal Cave",
    0x44: "Seafloor Cavern",
    0x45: "underwater at Seafloor Cavern",
    0x46: "Victory Road",
    0x47: "the elusive Mirage Island",
    0x48: "the Cave of Origin",
    0x49: "Southern Island",
    0x4a: "Fiery Path",
    0x4b: "Fiery Path",
    0x4c: "Jagged Pass",
    0x4d: "Jagged Pass",
    0x4e: "the Sealed Chamber",
    0x4f: "underwater on Route 134",
    0x50: "Scorched Slab",
    0x51: "the Island Cave",
    0x52: "the Desert Ruins",
    0x53: "the Ancient Tomb",
    0x54: "a Truck",
    0x55: "Sky Pillar",
    0x56: "a Secret Base",
    0x57: "the S.S. Tidal",
}

BadgeLookup = {
    0x01: "Badge",
}

rich_presence_conditional_display(
  (
    is_jp_region() &&
    location_id_jp() == 0 &&     // This address is unnoted -> seems to be location ID
    prior(music_id_jp()) == 0 && // Why the fuck is this using prior?
    music_id_jp() == 0           // Presumably the title screen music
  ),
  "Title screen"
)

rich_presence_conditional_display(
  is_jp_region(),
  "Exploring {0} • {1} {2} • {3}/202 Pokemon",
  rich_presence_lookup("Location", location_id_jp(), LocationLookup),
  rich_presence_value("Count", badge_count_jp()),
  rich_presence_lookup("Badge", badge_count_jp(), BadgeLookup, fallback="Badges"),
  rich_presence_value(
    "Count",
    bit0(0x02CC2F) + bit1(0x02CC2F) + bit2(0x02CC2F) + bit3(0x02CC2F) + bit4(0x02CC30) +
    bit5(0x02CC30) + bit6(0x02CC30) + bit7(0x02CC30) + bit0(0x02CC31) + bit1(0x02CC31) +
    bit2(0x02CC31) + bit3(0x02CC31) + bit4(0x02CC31) + bit5(0x02CC32) + bit6(0x02CC32) +
    bit6(0x02CC33) + bit7(0x02CC33) + bit0(0x02CC34) + bit1(0x02CC34) + bit2(0x02CC34) +
    bit3(0x02CC34) + bit7(0x02CC34) + bit0(0x02CC35) + bit1(0x02CC35) + bit2(0x02CC35) +
    bit3(0x02CC35) + bit0(0x02CC36) + bit1(0x02CC36) + bit3(0x02CC36) + bit4(0x02CC36) +
    bit7(0x02CC36) + bit0(0x02CC37) + bit3(0x02CC38) + bit4(0x02CC38) + bit4(0x02CC39) +
    bit5(0x02CC39) + bit6(0x02CC39) + bit7(0x02CC39) + bit3(0x02CC3A) + bit4(0x02CC3A) +
    bit5(0x02CC3A) + bit6(0x02CC3A) + bit7(0x02CC3A) + bit0(0x02CC3B) + bit6(0x02CC3B) +
    bit0(0x02CC3C) + bit1(0x02CC3C) + bit0(0x02CC41) + bit1(0x02CC41) + bit2(0x02CC41) +
    bit3(0x02CC41) + bit5(0x02CC41) + bit0(0x02CC42) + bit1(0x02CC42) + bit5(0x02CC42) +
    bit6(0x02CC42) + bit7(0x02CC42) + bit1(0x02CC45) + bit2(0x02CC45) + bit5(0x02CC46) +
    bit1(0x02CC47) + bit2(0x02CC47) + bit5(0x02CC47) + bit2(0x02CC48) + bit5(0x02CC48) +
    bit6(0x02CC48) + bit7(0x02CC48) + bit3(0x02CC4B) + bit4(0x02CC4B) + bit5(0x02CC4B) +
    bit6(0x02CC4B) + bit7(0x02CC4B) + bit0(0x02CC4C) + bit1(0x02CC4C) + bit2(0x02CC4C) +
    bit3(0x02CC4C) + bit4(0x02CC4C) + bit5(0x02CC4C) + bit6(0x02CC4C) + bit7(0x02CC4C) +
    bit0(0x02CC4D) + bit1(0x02CC4D) + bit2(0x02CC4D) + bit3(0x02CC4D) + bit4(0x02CC4D) +
    bit5(0x02CC4D) + bit6(0x02CC4D) + bit7(0x02CC4D) + bit0(0x02CC4E) + bit1(0x02CC4E) +
    bit2(0x02CC4E) + bit3(0x02CC4E) + bit4(0x02CC4E) + bit5(0x02CC4E) + bit6(0x02CC4E) +
    bit7(0x02CC4E) + bit0(0x02CC4F) + bit1(0x02CC4F) + bit2(0x02CC4F) + bit3(0x02CC4F) +
    bit4(0x02CC4F) + bit5(0x02CC4F) + bit6(0x02CC4F) + bit7(0x02CC4F) + bit0(0x02CC50) +
    bit1(0x02CC50) + bit2(0x02CC50) + bit3(0x02CC50) + bit4(0x02CC50) + bit5(0x02CC50) +
    bit6(0x02CC50) + bit7(0x02CC50) + bit0(0x02CC51) + bit1(0x02CC51) + bit2(0x02CC51) +
    bit3(0x02CC51) + bit4(0x02CC51) + bit5(0x02CC51) + bit6(0x02CC51) + bit7(0x02CC51) +
    bit0(0x02CC52) + bit1(0x02CC52) + bit2(0x02CC52) + bit3(0x02CC52) + bit4(0x02CC52) +
    bit5(0x02CC52) + bit6(0x02CC52) + bit7(0x02CC52) + bit0(0x02CC53) + bit1(0x02CC53) +
    bit2(0x02CC53) + bit3(0x02CC53) + bit4(0x02CC53) + bit5(0x02CC53) + bit6(0x02CC53) +
    bit7(0x02CC53) + bit0(0x02CC54) + bit1(0x02CC54) + bit2(0x02CC54) + bit3(0x02CC54) +
    bit4(0x02CC54) + bit5(0x02CC54) + bit6(0x02CC54) + bit7(0x02CC54) + bit0(0x02CC55) +
    bit1(0x02CC55) + bit2(0x02CC55) + bit3(0x02CC55) + bit4(0x02CC55) + bit5(0x02CC55) +
    bit6(0x02CC55) + bit7(0x02CC55) + bit0(0x02CC56) + bit1(0x02CC56) + bit2(0x02CC56) +
    bit3(0x02CC56) + bit4(0x02CC56) + bit5(0x02CC56) + bit6(0x02CC56) + bit7(0x02CC56) +
    bit0(0x02CC57) + bit1(0x02CC57) + bit2(0x02CC57) + bit3(0x02CC57) + bit4(0x02CC57) +
    bit5(0x02CC57) + bit6(0x02CC57) + bit7(0x02CC57) + bit0(0x02CC58) + bit1(0x02CC58) +
    bit2(0x02CC58) + bit3(0x02CC58) + bit4(0x02CC58) + bit5(0x02CC58) + bit6(0x02CC58) +
    bit7(0x02CC58) + bit0(0x02CC59) + bit1(0x02CC59) + bit2(0x02CC59) + bit3(0x02CC59) +
    bit4(0x02CC59) + bit5(0x02CC59) + bit6(0x02CC59) + bit7(0x02CC59) + bit0(0x02CC5A) +
    bit1(0x02CC5A) + bit2(0x02CC5A) + bit3(0x02CC5A) + bit4(0x02CC5A) + bit5(0x02CC5A) +
    bit6(0x02CC5A) + bit7(0x02CC5A) + bit0(0x02CC5B) + bit1(0x02CC5B) + bit2(0x02CC5B) +
    bit3(0x02CC5B) + bit4(0x02CC5B) + bit5(0x02CC5B) + bit6(0x02CC5B) + bit7(0x02CC5B) +
    bit0(0x02CC5C) + bit1(0x02CC5C)
  )
)

rich_presence_conditional_display(
  (
    !is_jp_region() &&
    location_id_en() == 0 &&
    prior(music_id_en()) == 0 &&
    music_id_en() == 0
  ),
  "Title screen"
)

rich_presence_conditional_display(
  !is_jp_region(),
  "Exploring {0} • {1} {2} • {3}/202 Pokemon",
  rich_presence_lookup("Location", byte(0x03683C), LocationLookup),
  rich_presence_value("Count", badge_count_en()),
  rich_presence_lookup("Badge", badge_count_en(), BadgeLookup, fallback="Badges"),
  rich_presence_value(
    "Count",
    caught_pikachu()   + caught_raichu()     + caught_sandshrew()  + caught_sandslash()  +
    caught_vulpix()    + caught_ninetales()  + caught_jigglypuff() + caught_wigglytuff() +
    caught_zubat()     + caught_golbat()     + caught_oddish()     + caught_gloom()      +
    caught_vileplume() + caught_psyduck()    + caught_golduck()    +
    caught_abra()      + caught_kadabra()    + caught_alakazam()   + caught_machop()     +
    caught_machoke()   + caught_machamp()    + caught_tentacool()  + caught_tentacruel() +
    caught_geodude()   + caught_graveler()   + caught_golem()      + caught_magnemite()  +
    caught_magneton()  + caught_doduo()      + caught_dodrio()     + caught_grimer()     +
    caught_muk()       + caught_voltorb()    + caught_electrode()  + caught_koffing()    +
    caught_weezing()   + caught_rhyhorn()    + caught_rhydon()     + caught_horsea()     +
    caught_seadra()    + caught_goldeen()    + caught_seaking()    + caught_staryu()     +
    caught_starmie()   + caught_pinsir()     + caught_magikarp()   + caught_gyarados()   +
    caught_crobat()    + caught_chinchou()   + caught_lanturn()    + caught_pichu()      +
    caught_igglybuff() + caught_natu()       + caught_xatu()       + caught_bellossom()  +
    caught_marill()    + caught_azumarill()  + caught_wobbuffet()  + caught_girafarig()  +
    caught_heracross() + caught_slugma()     + caught_magcargo()   + caught_corsola()    +
    caught_skarmory()  + caught_kingdra()    + caught_phanpy()     + caught_donphan()    +
    caught_treecko()   + caught_grovyle()    + caught_sceptile()   + caught_torchic()    +
    caught_combusken() + caught_blaziken()   + caught_mudkip()     + caught_marshtomp()  +
    caught_swampert()  + caught_poochyena()  + caught_mightyena()  + caught_zigzagoon()  +
    caught_linoone()   +
    bit0(0x02CEED) + bit1(0x02CEED) + bit2(0x02CEED) + bit3(0x02CEED) + bit4(0x02CEED) +
    bit5(0x02CEED) + bit6(0x02CEED) + bit7(0x02CEED) + bit0(0x02CEEE) + bit1(0x02CEEE) +
    bit2(0x02CEEE) + bit3(0x02CEEE) + bit4(0x02CEEE) + bit5(0x02CEEE) + bit6(0x02CEEE) +
    bit7(0x02CEEE) + bit0(0x02CEEF) + bit1(0x02CEEF) + bit2(0x02CEEF) + bit3(0x02CEEF) +
    bit4(0x02CEEF) + bit5(0x02CEEF) + bit6(0x02CEEF) + bit7(0x02CEEF) +
    caught_slaking()   + caught_nincada()   + caught_ninjask()   + caught_shedinja()  +
    caught_whismur()   + caught_loudred()   + caught_exploud()   + caught_makuhita()  +
    caught_hariyama()  + caught_azurill()   + caught_nosepass()  + caught_skitty()    +
    caught_delcatty()  + caught_sableye()   + caught_mawile()    + caught_aron()      +
    caught_lairon()    + caught_aggron()    + caught_meditite()  + caught_medicham()  +
    caught_electrike() + caught_manectric() + caught_plusle()    + caught_minun()     +
    caught_volbeat()   + caught_illumise()  + caught_roselia()   + caught_gulpin()    +
    caught_swalot()    + caught_carvanha()  + caught_sharpedo()  + caught_wailmer()   +
    caught_wailord()   + caught_numel()     + caught_camerupt()  + caught_torkoal()   +
    caught_spoink()    + caught_grumpig()   + caught_spinda()    + caught_trapinch()  +
    caught_vibrava()   + caught_flygon()    + caught_cacnea()    + caught_cacturne()  +
    caught_swablu()    + caught_altaria()   + caught_zangoose()  + caught_seviper()   +
    caught_lunatone()  + caught_solrock()   + caught_barboach()  + caught_whiscash()  +
    caught_corphish()  + caught_crawdaunt() + caught_baltoy()    + caught_claydol()   +
    caught_lileep()    + caught_cradily()   + caught_anorith()   + caught_armaldo()   +
    caught_feebas()    + caught_milotic()   + caught_castform()  + caught_kecleon()   +
    caught_shuppet()   + caught_banette()   + caught_duskull()   + caught_dusclops()  +
    caught_tropius()   + caught_chimecho()  + caught_absol()     + caught_wynaut()    +
    caught_snorunt()   + caught_glalie()    + caught_spheal()    + caught_sealeo()    +
    caught_walrein()   + caught_clamperl()  + caught_huntail()   + caught_gorebyss()  +
    caught_relicanth() + caught_luvdisc()   + caught_bagon()     + caught_shelgon()   +
    caught_salamence() + caught_beldum()    + caught_metang()    + caught_metagross() +
    caught_regirock()  + caught_regice()    + caught_registeel() + caught_latias()    +
    caught_latios()    + caught_kyogre()    +
    bit6(0x02CEFB) +
    caught_rayquaza()  + caught_jirachi()   + caught_deoxys()
  )
)

rich_presence_display("Adventuring in Hoenn")
