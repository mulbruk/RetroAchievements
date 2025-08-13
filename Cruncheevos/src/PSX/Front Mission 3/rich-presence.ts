import { RichPresence, define, orNext } from "@cruncheevos/core";

import { add, cond, eq, prior } from "../../common/comparison.js";
import {
  addrStr, richPresenceLookup, richPresencePluralize
} from "../../common/rich-presence.js";

import { ADDR } from "./data.js";
import { lower4, upper4 } from "../../common/value.js";

// ---------------------------------------------------------------------------------------------------

const hexDigit: { n: number, str: string }[] = [
  { n: 0x0, str: '0' },
  { n: 0x1, str: '1' },
  { n: 0x2, str: '2' },
  { n: 0x3, str: '3' },
  { n: 0x4, str: '4' },
  { n: 0x5, str: '5' },
  { n: 0x6, str: '6' },
  { n: 0x7, str: '7' },
  { n: 0x8, str: '8' },
  { n: 0x9, str: '9' },
  { n: 0xa, str: 'a' },
  { n: 0xb, str: 'b' },
  { n: 0xc, str: 'c' },
  { n: 0xd, str: 'd' },
  { n: 0xe, str: 'e' },
  { n: 0xf, str: 'f' },
];

const routeData: { id: number, name: string }[] = [
  { id: 0x00, name: 'Prologue'},
  { id: 0x02, name: 'USN route' },
  { id: 0x03, name: 'DHZ route' },

] as const;

const battleData: { mapID: number, description: string }[] = [
  { mapID: 0x01, description: 'Mission 0 - JDF Test Facility'},

  // USN route maps --------------------------------------------
  { mapID: 0x02, description: 'Mission 1 - Yokosuka JDF Base'},
  { mapID: 0x04, description: 'Mission 2 - Yokosuka JDF Base'},
  { mapID: 0x05, description: 'Mission 3 - Yokosuka JDF Base'},
  { mapID: 0x06, description: 'Mission 4 - Yokosuka JDF Base'},
  { mapID: 0x09, description: 'Mission 5 - Kamariya JC'},
  { mapID: 0x0a, description: 'Mission 6 - Kamariya JC'},
  { mapID: 0x0b, description: 'Mission 7 - Kamariya JC'},
  { mapID: 0x0c, description: 'Mission 8 - Yokohama'},
  { mapID: 0x0d, description: 'Mission 9 - Honmokufuto'},
  { mapID: 0x0e, description: 'Mission 10 - Honmokufuto'},

  { mapID: 0x0f, description: 'Mission 11 - Wilson Cliffs'},

  { mapID: 0x10, description: 'Mission 12A - Sumatra'},
  { mapID: 0x11, description: 'Mission 13A - Choa Chu Kang'},
  { mapID: 0x14, description: 'Mission 12B - Barilar Farms'},
  { mapID: 0x16, description: 'Mission 13B - Sumatra'},
  { mapID: 0x17, description: 'Mission 14B - Weapon Factory'},
  
  { mapID: 0x1b, description: 'Mission 15A - Taal Naval Base'},
  { mapID: 0x20, description: 'Mission 16A - Taal Naval Base'},
  // { mapID: 0x1d, description: 'Mission 17A - Taal Naval Base'},
  { mapID: 0x22, description: 'Mission 18A - Taal Naval Base'},
  { mapID: 0x19, description: 'Mission 15B - Taal Naval Base'},
  { mapID: 0x1a, description: 'Mission 16B - Taal Naval Base'},
  { mapID: 0x1c, description: 'Mission 17B - Taal Naval Base'},
  // { mapID: 0x1d, description: 'Mission 18B - Taal Naval Base'},
  { mapID: 0x1e, description: 'Mission 19B - Taal Naval Base'},

  { mapID: 0x24, description: 'Mission 20 - Ba Kui Dam'},

  { mapID: 0x29, description: 'Mission 21A1 - Yingko'},
  // { mapID: 0x26, description: 'Mission 21A2 - Xinzhu'},
  { mapID: 0x2e, description: 'Mission 22A1 - Taiwan Farm'},
  { mapID: 0x28, description: 'Mission 22A2 - Taipei Suburb'},
  { mapID: 0x25, description: 'Mission 21B1 - Yingko'},
  // { mapID: 0x26, description: 'Mission 21B2 - Xinzhu'},
  { mapID: 0x2d, description: 'Mission 22B1 - Rural Jungle'},
  { mapID: 0x2c, description: 'Mission 22B2 - Taipei Suburb'},

  { mapID: 0x2f, description: 'Mission 23 - DHZ Factory'},
  { mapID: 0x30, description: 'Mission 24 - DHZ Factory'},
  { mapID: 0x32, description: 'Mission 25 - USN Embassy'},
  { mapID: 0x33, description: 'Mission 26 - Taipei'},

  { mapID: 0x34, description: 'Mission 27 - Futai Tunnel'},
  { mapID: 0x35, description: 'Mission 28 - Futai Tunnel'},
  { mapID: 0x36, description: 'Mission 29 - Futai Tunnel'},

  { mapID: 0x39, description: 'Mission 30 - Oil Field'},
  { mapID: 0x3a, description: 'Mission 31 - Yizhang'},
  { mapID: 0x3b, description: 'Mission 32 - Wuzhou Base'},
  { mapID: 0x3c, description: 'Mission 32 - Wuzhou Base'},
  { mapID: 0x3d, description: 'Mission 33 - Longsheng'},
  { mapID: 0x3e, description: 'Mission 34 - Guilin'},
  { mapID: 0x3f, description: 'Mission 34 - Guilin'},

  { mapID: 0x41, description: 'Mission 35 - Xiamen'},
  { mapID: 0x43, description: 'Mission 36 - Yuping'},
  { mapID: 0x37, description: 'Mission 37 - Foshan'},
  { mapID: 0x39, description: 'Mission 38 - Huanggoushu'},

  { mapID: 0x4e, description: 'Mission 39 - Tianlei'},
  // { mapID: 0x4b, description: 'Mission 40 - Tianlei'},
  // { mapID: 0x4b, description: 'Mission 41 - Tianlei'},
  { mapID: 0x4c, description: 'Mission 42 - Tianlei'},

  { mapID: 0x4f, description: 'Mission 43 - Wuhan Bridge'},
  { mapID: 0x50, description: 'Mission 44 - Wuhan Base'},
  { mapID: 0x52, description: 'Mission 45 - Lake Poyang'},
  { mapID: 0x53, description: 'Mission 46 - Huangshan'},
  { mapID: 0x56, description: 'Mission 47 - Nanjing Bridge'},
  { mapID: 0x54, description: 'Mission 48 - Huangshan'},
  { mapID: 0x57, description: 'Mission 49 - Nanjing City'},
  { mapID: 0x55, description: 'Mission 50 - Huangshan'},

  { mapID: 0x59, description: 'Mission 51 - Shanghai Airport'},
  { mapID: 0x5a, description: 'Mission 52 - Ravnui Embassy'},
  { mapID: 0x5b, description: 'Mission 53 - Ravnui Embassy'},
  { mapID: 0x5d, description: 'Mission 54 - Yancheng Base'},
  { mapID: 0x5e, description: 'Mission 55 - Yancheng Base'},
  { mapID: 0x60, description: 'Mission 56 - Lianyungang'},

  { mapID: 0x62, description: 'Mission 57 - Offshore Japan'},

  { mapID: 0x64, description: 'Mission 58 - Observatory'},
  { mapID: 0x65, description: 'Mission 59 - Mount Shutendoji'},
  { mapID: 0x66, description: 'Mission 60 - Nagahama'},
  { mapID: 0x67, description: 'Mission 61 - Mount Aso'},
  { mapID: 0x68, description: 'Mission 62 - Omuta'},
  { mapID: 0x69, description: 'Mission 63 - Misumi Harbour'},

  { mapID: 0x6a, description: 'Mission 64 - Okinawa Bridge'},
  { mapID: 0x6b, description: 'Mission 65 - Ocean City'},
  { mapID: 0x6c, description: 'Mission 66 - Ocean City'},
  { mapID: 0x6e, description: 'Mission 67 - Ocean City'},
  { mapID: 0x70, description: 'Mission 68 - Ocean City'},
  { mapID: 0xe3, description: 'Mission 69 - Ocean City'},

  { mapID: 0x73, description: 'Mission 70 - Convention Centre'},

  // DHZ route maps --------------------------------------------
  { mapID: 0x76, description: 'Mission 1 - Yokosuka JDF Base'},
  { mapID: 0x78, description: 'Mission 2 - Yokosuka JDF Base'},
  { mapID: 0x79, description: 'Mission 3 - Yokosuka JDF Base'},
  { mapID: 0x7a, description: 'Mission 4 - Power Plant'},
  { mapID: 0x7b, description: 'Mission 5 - Power Plant'},
  { mapID: 0x7d, description: 'Mission 6 - JDF Digi-Com Base'},
  { mapID: 0x7e, description: 'Mission 7 - Ashigara Service Area'},
  { mapID: 0x7f, description: 'Mission 8 - Numazu Harbour'},

  { mapID: 0x81, description: 'Mission 9 - Panay Jungle'},
  { mapID: 0x82, description: 'Mission 10 - Panay Missile Base'},
  { mapID: 0x83, description: 'Mission 11 - Negros Coast'},
  { mapID: 0x84, description: 'Mission 12 - Negros Fortress'},
  { mapID: 0x85, description: 'Mission 13 - Negros Fortress'},

  { mapID: 0x87, description: 'Mission 14 - Dagat Ahas Hangar'},
  { mapID: 0x89, description: 'Mission 15 - Dagat Ahas'},
  { mapID: 0x88, description: 'Mission 16 - Dagat Ahas Flight Deck'},
  { mapID: 0x8a, description: 'Mission 17 - Dagat Ahas Engine Room'},

  { mapID: 0x8c, description: 'Mission 18 - Taal Naval Base'},
  { mapID: 0x8e, description: 'Mission 19 - Taal Naval Base'},
  { mapID: 0x8d, description: 'Mission 20 - Taal Naval Base'},
  { mapID: 0x90, description: 'Mission 21 - Taal Naval Base'},
  { mapID: 0x91, description: 'Mission 22 - Batangas'},
  
  { mapID: 0xe5, description: 'Mission 23 - Kueshan'},
  { mapID: 0x94, description: 'Mission 24 - Taipei Suburb'},
  { mapID: 0x95, description: 'Mission 25 - Futai Tunnel'},
  { mapID: 0x96, description: 'Mission 26 - Futai Tunnel'},
  
  { mapID: 0x97, description: 'Mission 27 - Linchuan'},
  { mapID: 0x98, description: 'Mission 28 - Suichuan'},
  { mapID: 0x99, description: 'Mission 29 - Zhonggang'},
  { mapID: 0xdf, description: 'Mission 30 - Tianlei'},
  { mapID: 0x9c, description: 'Mission 31 - Hengshan'},
  { mapID: 0x9f, description: 'Mission 32 - Tianlei'},
  { mapID: 0xa0, description: 'Mission 33 - Tianlei'},

  { mapID: 0xa1, description: 'Mission 34 - Hankou Airport'},
  { mapID: 0xa3, description: 'Mission 35 - Ravnui Embassy'},
  { mapID: 0xa4, description: 'Mission 36 - Ravnui Embassy'},
  { mapID: 0xa5, description: 'Mission 37 - Shanghai Zoo'},
  { mapID: 0xa8, description: 'Mission 38 - Nanjing City'},

  { mapID: 0xa9, description: 'Mission 39 - Hiroshima Park'},
  { mapID: 0xaa, description: 'Mission 40 - Kaita'},
  { mapID: 0xab, description: 'Mission 41 - Nagoya Sewer'},
  { mapID: 0xe6, description: 'Mission 42 - Nagoya Sewer'},
  { mapID: 0xad, description: 'Mission 43 - Nagoya Factory'},

  { mapID: 0xae, description: 'Mission 44 - Sendai Interstate'},
  { mapID: 0xb0, description: 'Mission 45 - Abukuma River'},
  { mapID: 0xb1, description: 'Mission 46 - Koriyama'},
  { mapID: 0xb2, description: 'Mission 47 - Koriyama'},
  { mapID: 0xb3, description: 'Mission 48 - Koriyama IC'},
  { mapID: 0xb4, description: 'Mission 49 - Tomiyama'},

  { mapID: 0xb5, description: 'Mission 50 - Mount Aso'},
  { mapID: 0xb6, description: 'Mission 51 - Mount Aso Foothills'},
  { mapID: 0xb7, description: 'Mission 52 - Misumi Harbour'},

  { mapID: 0xb8, description: 'Mission 53 - Okinawa Bridge'},
  { mapID: 0xba, description: 'Mission 54 - Ocean City'},
  { mapID: 0xb9, description: 'Mission 55 - Ocean City'},
  { mapID: 0xbc, description: 'Mission 56 - Ocean City'},
  { mapID: 0xbb, description: 'Mission 57 - Ocean City'},
  { mapID: 0xbf, description: 'Mission 58 - Ocean City'},

  // Tutorial maps ---------------------------------------------
  { mapID: 0xc3, description: 'Tutorial'},
  { mapID: 0xc4, description: 'Tutorial'},
  { mapID: 0xc5, description: 'Tutorial'},
  { mapID: 0xc6, description: 'Tutorial'},
  { mapID: 0xc7, description: 'Tutorial'},

  // Simulator maps --------------------------------------------
  { mapID: 0xc8, description: 'Simulator - JDF Test Facility (Test)' },
  { mapID: 0xc9, description: 'Simulator - JDF Test Facility (Training)' },
  { mapID: 0xca, description: 'Simulator - JDF Test Facility (Real Battle)' },
  { mapID: 0xcb, description: 'Simulator - Shin-Ohgishima Bridge (Test)' },
  { mapID: 0xcc, description: 'Simulator - Shin-Ohgishima Bridge (Training)' },
  { mapID: 0xcd, description: 'Simulator - Shin-Ohgishima Bridge (Real Battle)' },
  { mapID: 0xce, description: 'Simulator - Taal Naval Base (Test)' },
  { mapID: 0xcf, description: 'Simulator - Taal Naval Base (Training)' },
  { mapID: 0xd0, description: 'Simulator - Taal Naval Base (Real Battle)' },
  { mapID: 0xd1, description: 'Simulator - Taipei (Test)' },
  { mapID: 0xd2, description: 'Simulator - Taipei (Training)' },
  { mapID: 0xd3, description: 'Simulator - Taipei (Real Battle)' },
  { mapID: 0xd4, description: 'Simulator - Oil Field (Test)' },
  { mapID: 0xd5, description: 'Simulator - Oil Field (Training)' },
  { mapID: 0xd6, description: 'Simulator - Oil Field (Real Battle)' },
  { mapID: 0xd7, description: 'Simulator - Nanjing (Test)' },
  { mapID: 0xd8, description: 'Simulator - Nanjing (Training)' },
  { mapID: 0xd9, description: 'Simulator - Nanjing (Real Battle)' },
  { mapID: 0xda, description: 'Simulator - Fukushima (Test)' },
  { mapID: 0xdb, description: 'Simulator - Fukushima (Training)' },
  { mapID: 0xdc, description: 'Simulator - Fukushima (Real Battle)' },
 ] as const;

const missionCounts: { progressionState: number, missionCount: string}[] = [  
  { progressionState: 0x00, missionCount:  '0' },
  { progressionState: 0x01, missionCount:  '1' },
  { progressionState: 0x02, missionCount:  '2' },
  { progressionState: 0x04, missionCount:  '3' },
  { progressionState: 0x05, missionCount:  '4' },
  { progressionState: 0x06, missionCount:  '5' },
  { progressionState: 0x09, missionCount:  '6' },
  { progressionState: 0x0a, missionCount:  '7' },
  { progressionState: 0x0b, missionCount:  '8' },
  { progressionState: 0x0c, missionCount:  '9' },
  { progressionState: 0x0d, missionCount: '10' },
  // { progressionState: 0x0e, missionCount: '11' },
  { progressionState: 0x0f, missionCount: '12' },
  { progressionState: 0x10, missionCount: '13' },
  { progressionState: 0x12, missionCount: '14' },
  { progressionState: 0x14, missionCount: '13' },
  { progressionState: 0x16, missionCount: '14' },
  { progressionState: 0x17, missionCount: '15' },
  { progressionState: 0x19, missionCount: '16' },
  { progressionState: 0x1a, missionCount: '17' },
  { progressionState: 0x1b, missionCount: '16' },
  { progressionState: 0x1c, missionCount: '18' },
  { progressionState: 0x1d, missionCount: '19' },
  { progressionState: 0x20, missionCount: '17' },
  { progressionState: 0x21, missionCount: '20' },
  { progressionState: 0x24, missionCount: '70' },
  { progressionState: 0x25, missionCount: '22' },
  { progressionState: 0x26, missionCount: '22' },
  { progressionState: 0x28, missionCount: '23' },
  { progressionState: 0x29, missionCount: '22' },
  { progressionState: 0x2a, missionCount: '21' },
  { progressionState: 0x2c, missionCount: '23' },
  { progressionState: 0x2d, missionCount: '23' },
  { progressionState: 0x2e, missionCount: '23' },
  { progressionState: 0x2f, missionCount: '24' },
  { progressionState: 0x30, missionCount: '25' },
  { progressionState: 0x33, missionCount: '27' },
  { progressionState: 0x34, missionCount: '28' },
  { progressionState: 0x35, missionCount: '29' },
  { progressionState: 0x36, missionCount: '30' },
  { progressionState: 0x39, missionCount: '31' },
  { progressionState: 0x3a, missionCount: '32' },
  { progressionState: 0x3b, missionCount: '33' },
  { progressionState: 0x3c, missionCount: '33' },
  { progressionState: 0x3d, missionCount: '34' },
  { progressionState: 0x3e, missionCount: '35' },
  { progressionState: 0x3f, missionCount: '35' },
  { progressionState: 0x41, missionCount: '36' },
  { progressionState: 0x43, missionCount: '37' },
  { progressionState: 0x46, missionCount: '38' },
  { progressionState: 0x47, missionCount: '38' },
  { progressionState: 0x49, missionCount: '39' },
  { progressionState: 0x4a, missionCount: '43' },
  { progressionState: 0x4b, missionCount: '42' },
  { progressionState: 0x4e, missionCount: '40' },
  { progressionState: 0x4f, missionCount: '44' },
  { progressionState: 0x50, missionCount: '45' },
  { progressionState: 0x52, missionCount: '46' },
  { progressionState: 0x53, missionCount: '47' },
  { progressionState: 0x54, missionCount: '49' },
  { progressionState: 0x55, missionCount: '51' },
  { progressionState: 0x56, missionCount: '48' },
  { progressionState: 0x57, missionCount: '50' },
  { progressionState: 0x59, missionCount: '52' },
  { progressionState: 0x5a, missionCount: '53' },
  { progressionState: 0x5b, missionCount: '54' },
  { progressionState: 0x5d, missionCount: '55' },
  { progressionState: 0x5e, missionCount: '56' },
  { progressionState: 0x60, missionCount: '57' },
  { progressionState: 0x62, missionCount: '58' },
  { progressionState: 0x64, missionCount: '59' },
  { progressionState: 0x65, missionCount: '60' },
  { progressionState: 0x66, missionCount: '61' },
  { progressionState: 0x67, missionCount: '62' },
  { progressionState: 0x68, missionCount: '63' },
  { progressionState: 0x69, missionCount: '64' },
  { progressionState: 0x6a, missionCount: '65' },
  { progressionState: 0x6b, missionCount: '66' },
  { progressionState: 0x6c, missionCount: '67' },
  { progressionState: 0x6e, missionCount: '68' },
  { progressionState: 0x70, missionCount: '69' },
  { progressionState: 0x73, missionCount: '71' },
  { progressionState: 0x76, missionCount: '2', },
  { progressionState: 0x78, missionCount: '3', },
  { progressionState: 0x79, missionCount: '4', },
  { progressionState: 0x7a, missionCount: '5', },
  { progressionState: 0x7b, missionCount: '6', },
  { progressionState: 0x7d, missionCount: '7', },
  { progressionState: 0x7e, missionCount: '8', },
  { progressionState: 0x7f, missionCount: '9', },
  { progressionState: 0x81, missionCount: '10' },
  { progressionState: 0x82, missionCount: '11' },
  { progressionState: 0x83, missionCount: '12' },
  { progressionState: 0x84, missionCount: '13' },
  { progressionState: 0x85, missionCount: '14' },
  { progressionState: 0x87, missionCount: '15' },
  { progressionState: 0x88, missionCount: '17' },
  { progressionState: 0x89, missionCount: '16' },
  { progressionState: 0x8a, missionCount: '18' },
  { progressionState: 0x8c, missionCount: '19' },
  { progressionState: 0x8d, missionCount: '21' },
  { progressionState: 0x8e, missionCount: '20' },
  { progressionState: 0x90, missionCount: '22' },
  { progressionState: 0x91, missionCount: '23' },
  { progressionState: 0x94, missionCount: '25' },
  { progressionState: 0x95, missionCount: '26' },
  { progressionState: 0x96, missionCount: '27' },
  { progressionState: 0x97, missionCount: '28' },
  { progressionState: 0x98, missionCount: '29' },
  { progressionState: 0x9a, missionCount: '30' },
  { progressionState: 0x9c, missionCount: '32' },
  { progressionState: 0x9d, missionCount: '31' },
  { progressionState: 0x9f, missionCount: '33' },
  { progressionState: 0xa0, missionCount: '34' },
  { progressionState: 0xa1, missionCount: '35' },
  { progressionState: 0xa4, missionCount: '37' },
  { progressionState: 0xa5, missionCount: '38' },
  { progressionState: 0xa6, missionCount: '36' },
  { progressionState: 0xa8, missionCount: '39' },
  { progressionState: 0xa9, missionCount: '40' },
  { progressionState: 0xaa, missionCount: '41' },
  { progressionState: 0xab, missionCount: '42' },
  { progressionState: 0xad, missionCount: '44' },
  { progressionState: 0xae, missionCount: '45' },
  { progressionState: 0xb0, missionCount: '46' },
  { progressionState: 0xb1, missionCount: '47' },
  { progressionState: 0xb3, missionCount: '49' },
  { progressionState: 0xb4, missionCount: '50' },
  { progressionState: 0xb5, missionCount: '51' },
  { progressionState: 0xb6, missionCount: '52' },
  { progressionState: 0xb7, missionCount: '53' },
  { progressionState: 0xb8, missionCount: '54' },
  { progressionState: 0xb9, missionCount: '56' },
  { progressionState: 0xbb, missionCount: '58' },
  { progressionState: 0xbc, missionCount: '57' },
  { progressionState: 0xbf, missionCount: '59' },
  { progressionState: 0xe5, missionCount: '24' },
  { progressionState: 0xe6, missionCount: '43' },
  { progressionState: 0xe7, missionCount: '48' },
  { progressionState: 0xe8, missionCount: '26' },
] as const;

const missionTotals: { routeID: number, count: string}[] = [
  { routeID: 0x00, count: '??' },
  { routeID: 0x02, count: '71' },
  { routeID: 0x03, count: '59' },
] as const;

function makeRichPresence() {
  const HexDigit = richPresenceLookup(
    'HexDigit',
    hexDigit, 'n', 'str',
  );

  const Mission = richPresenceLookup(
    'Mission',
    battleData, 'mapID', 'description',
    { defaultAt: ADDR.scene_id, defaultValue: 'Unknown mission' }
  );
  
  const Route = richPresenceLookup(
    'Route',
    routeData, 'id', 'name',
    { defaultAt: ADDR.route, defaultValue: '' }
  );

  const MissionCount = richPresenceLookup(
    'MissionCount',
    missionCounts, 'progressionState', 'missionCount',
    { defaultAt: ADDR.progression_state, defaultValue: '??' }
  );

  const MissionTotal = richPresenceLookup(
    'MissionTotal',
    missionTotals, 'routeID', 'count',
    { defaultAt: ADDR.route, defaultValue: '??' }
  );

  return RichPresence({
    format: {
      IGT: 'SECS',
    },
    lookupDefaultParameters:  { keyFormat: 'hex', compressRanges: false },
    lookup: {
      HexDigit,
      Mission,
      Route,

      MissionCount,
      MissionTotal,
    },
    displays: ({ lookup, format, macro, tag }) => {
      const route    = tag`${lookup.Route}`;
      const mission  = tag`${lookup.Mission}`;
      const money    = tag`$${macro.Number.at(addrStr(ADDR.money))}`;
      const medals   = tag`🎖️${macro.Number.at(addrStr(ADDR.platinum_medals))} 🥇${macro.Number.at(addrStr(ADDR.gold_medals))}  🥈${macro.Number.at(addrStr(ADDR.silver_medals))}  🥉${macro.Number.at(addrStr(ADDR.bronze_medals))}`
      const playTime = tag`${format.IGT.at(define(
        cond('AddSource', ADDR.igt, '/', 60),
        cond('Measured',  0x00)
      ))}`;

      const progression = tag`${lookup.MissionCount}/${lookup.MissionTotal}`;

      const debugInfo = tag`🔧 [0x${lookup.HexDigit.at(addrStr(upper4(0x124a0c)))}${lookup.HexDigit.at(addrStr(lower4(0x124a0c)))}, 0x${lookup.HexDigit.at(addrStr(upper4(0xe59a7)))}${lookup.HexDigit.at(addrStr(lower4(0xe59a7)))}${lookup.HexDigit.at(addrStr(upper4(0xe59a6)))}${lookup.HexDigit.at(addrStr(lower4(0xe59a6)))}]`;

      return [
        [
          define(eq(ADDR.overlay1, 0x00000000)),
          'Playstation boot logos'
        ],
        [
          define(eq(ADDR.overlay1, 0x7469747a)),
          '~☆ Desire spawns madness. Madness collapses into disaster. Mankind never learns. ☆~'
        ],
        [
          define(eq(ADDR.overlay1, 0x00766d79), eq(ADDR.scene_id, 0x01)),
          'Prologue'
        ],
        [
          define(eq(ADDR.overlay1, 0x00766d79), eq(prior(ADDR.overlay1), 0x7469747a)),
          '~☆ The legend circles around the world. Faced with a false past. Madness toys with life. A battle tied to fate. Towards a destiny with two outcomes. ☆~'
        ],
        [
          define(eq(ADDR.overlay1, 0x006c7379)),
          'Managing save data'
        ],

        // In battle
        [
          define(
            eq(ADDR.overlay1, 0x66666569), eq(ADDR.battle_state, 0x00),
            eq(ADDR.scene_id, 0x1d), eq(ADDR.progression_state, 0x20)
          ),
          tag`${route}: Mission 17A - Taal Naval Base • ${medals} • ${money} • ${playTime} • ${debugInfo}`
        ],
        [
          define(
            eq(ADDR.overlay1, 0x66666569), eq(ADDR.battle_state, 0x00),
            eq(ADDR.scene_id, 0x1d), eq(ADDR.progression_state, 0x1c)
          ),
          tag`${route}: Mission 18B - Taal Naval Base • ${medals} • ${money} • ${playTime} • ${debugInfo}`
        ],
        [
          define(
            eq(ADDR.overlay1, 0x66666569), eq(ADDR.battle_state, 0x00),
            eq(ADDR.scene_id, 0x4b), eq(ADDR.progression_state, 0x4e)
          ),
          tag`${route}: Mission 40 - Tianlei • ${medals} • ${money} • ${playTime} • ${debugInfo}`
        ],
        [
          define(
            eq(ADDR.overlay1, 0x66666569), eq(ADDR.battle_state, 0x00),
            eq(ADDR.scene_id, 0x4b), eq(ADDR.progression_state, 0x4b)
          ),
          tag`${route}: Mission 41 - Tianlei • ${medals} • ${money} • ${playTime} • ${debugInfo}`
        ],
        [
          define(eq(ADDR.overlay1, 0x66666569), eq(ADDR.battle_state, 0x00)),
          tag`${route}: ${mission} • ${medals} • ${money} • ${playTime} • ${debugInfo}`
        ],

        // Outside of battle (special cases)
        [
          define(eq(ADDR.overlay1, 0x7574737a), eq(ADDR.route, 0x02), eq(ADDR.progression_state, 0x0e)),
          tag`${route}: (11/71) • Setting up wanzers • ${medals} • ${money} • ${playTime} • ${debugInfo}`
        ],
        [
          define(eq(ADDR.overlay1, 0x7574737a), eq(ADDR.route, 0x03), eq(ADDR.progression_state, 0x0e)),
          tag`${route}: (55/59) • Setting up wanzers • ${medals} • ${money} • ${playTime} • ${debugInfo}`
        ],
        [
          define(eq(ADDR.overlay1, 0x74656e7a), eq(ADDR.route, 0x02), eq(ADDR.progression_state, 0x0e), eq(ADDR.network_flag, 0x01)),
          tag`${route}: (11/71) • Exploring the network • ${medals} • ${money} • ${playTime} • ${debugInfo}`
        ],
        [
          define(eq(ADDR.overlay1, 0x74656e7a), eq(ADDR.route, 0x03), eq(ADDR.progression_state, 0x0e), eq(ADDR.network_flag, 0x01)),
          tag`${route}: (55/59) • Exploring the network • ${medals} • ${money} • ${playTime} • ${debugInfo}`
        ],
        [
          define(
            orNext(
              eq(ADDR.overlay1, 0x66666569),
              eq(ADDR.overlay1, 0x6a6d6373),
              eq(ADDR.overlay1, 0x746e6573),
              eq(ADDR.overlay1, 0x65726179),
              eq(ADDR.overlay1, 0x00766d79),
              eq(ADDR.overlay1, 0x74656e7a),
              eq(ADDR.overlay1, 0x7365727a),
            ),
            orNext( eq(ADDR.progression_state, 0x73), eq(ADDR.progression_state, 0xbf ) )
          ),
          tag`${route}: Epilogue and credits • ${medals} • ${playTime} • ${debugInfo}`
        ],
        [
          define(
            orNext(
              eq(ADDR.overlay1, 0x66666569),
              eq(ADDR.overlay1, 0x6a6d6373),
              eq(ADDR.overlay1, 0x746e6573),
              eq(ADDR.overlay1, 0x65726179),
              eq(ADDR.overlay1, 0x00766d79),
              eq(ADDR.overlay1, 0x74656e7a),
              eq(ADDR.overlay1, 0x7365727a),
            ),
            eq(ADDR.route, 0x02), eq(ADDR.progression_state, 0x0e)
          ),
          tag`${route}: (11/71) • Between missions • ${medals} • ${money} • ${playTime} • ${debugInfo}`
        ],
        [
          define(
            orNext(
              eq(ADDR.overlay1, 0x66666569),
              eq(ADDR.overlay1, 0x6a6d6373),
              eq(ADDR.overlay1, 0x746e6573),
              eq(ADDR.overlay1, 0x65726179),
              eq(ADDR.overlay1, 0x00766d79),
              eq(ADDR.overlay1, 0x74656e7a),
              eq(ADDR.overlay1, 0x7365727a),
            ),
            eq(ADDR.route, 0x03), eq(ADDR.progression_state, 0x0e)
          ),
          tag`${route}: (55/59) • Between missions • ${medals} • ${money} • ${playTime} • ${debugInfo}`
        ],

        // Outside of battle (generic)
        [
          define(eq(ADDR.overlay1, 0x7574737a)),
          tag`${route}: ${progression} • Setting up wanzers • ${medals} • ${money} • ${playTime} • ${debugInfo}`
        ],
        [
          define(eq(ADDR.overlay1, 0x74656e7a), eq(ADDR.network_flag, 0x01)),
          tag`${route}: ${progression} • Exploring the network • ${medals} • ${money} • ${playTime} • ${debugInfo}`
        ],
        [
          define(
            orNext(
              eq(ADDR.overlay1, 0x66666569),
              eq(ADDR.overlay1, 0x6a6d6373),
              eq(ADDR.overlay1, 0x746e6573),
              eq(ADDR.overlay1, 0x65726179),
              eq(ADDR.overlay1, 0x00766d79),
              eq(ADDR.overlay1, 0x74656e7a),
              eq(ADDR.overlay1, 0x7365727a),
            )
          ),
          tag`${route}: ${progression} • Between missions • ${medals} • ${money} • ${playTime} • ${debugInfo}`
        ],

        'Front Mission 3',
      ]
    },
  });
}

export default makeRichPresence;
