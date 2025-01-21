import {
  Condition, ConditionBuilder,
  define, andNext, orNext, once, measuredIf, resetIf
} from '@cruncheevos/core';

import { cond, prev, not, eq, neq, lt, lte, gt, gte } from '../../common/comparison.js';
import { identity, range } from '../../common/util.js';

import {
  ADDR, GameState, CharacterName, ItemName, StageID, StageName, 
  hiddenItemsLookup, stageData, getCharacterID, getItemID
} from './data.js';

import { match, P } from 'ts-pattern';

// ---------------------------------------------------------------------------------------------------

// Game state ---------------------------------------------------
export function isGameState(state: GameState) {
  return define(
    eq(ADDR.game_state, state)
  );
}

export function mainProgramLoaded() {
  return define(
    eq(ADDR.program_binary, 0xD207DF08)
  );
}

/**
 * Tests whether the main program binary has been loaded and actual gameplay has started. These
 * conditions should be present in all achievements and leaderboards
 */
export function inGame() {
  return define(
    mainProgramLoaded(),
    not(isGameState(GameState.NewGame))
  );
}

/**
 * Provides protection for loading a saved game from the world map. Should be used in any achievement
 * that isn't scoped to being on a stage map
 */
export function worldMapLoadProtection() {
  return define(
    neq(ADDR.map_menu_state, 0xC671)
  );
}

export function onWorldMap() {
  return define(
    mainProgramLoaded(),
    isGameState(GameState.WorldMap),
  );
}

export function notOnWorldMap() {
  return define(
    neq(ADDR.game_state, GameState.WorldMap)
  );
}

export function onStageMap() {
  return define(
    mainProgramLoaded(),
    neq(ADDR.game_state, GameState.WorldMap),
    neq(ADDR.game_state, GameState.NewGame)
  );
}

// -------------------------------------------------------------
export function isStageID(stage: StageID | StageName) {
  const id = match(stage)
    .with(P.number, (n) => n)
    .with(P.string, () => stageData[
        stageData.findIndex((elem) => elem.name === stage)
      ].id
    )
    .exhaustive();
  
  return define(
    eq(ADDR.stage_id, id)
  );
}

export function onStage(stage: StageID | StageName) {
  return define(
    onStageMap(),
    isStageID(stage),
  );
}

/**
 * Tests whether the game is on a stage map and no units are currently fighting it out. Most state
 * changes relevant to achievements (stage completion, event flags, character recruitment, &c.) will
 * occur while the game is in this state
 */
export function stageMapActive() {
  return define(
    eq(ADDR.stage_map_active, 1)
  );
}

/**
 * Tests whether any two units are currently fighting it out
 */
export function inBattle() {
  return define(
    eq(ADDR.combat_active, 1)
  );
}

/**
 * Tests whether a stage map has been loaded to the point that the `Ready!` display has ended and the
 * player has been given control. Use to prevent janky challenge priming during the initial phase of
 * stage load when values are still being copied into local stage data memory regions
 */
export function stageStarted() {
  return define(
    neq(ADDR.stage_map_status, 0xC0)
  );
}


/**
 * Tests whether the currently loaded stage map is complete using the local city liberation table
 */
export function currentStageIsComplete() {
  return define(
    eq(ADDR.local_cities_liberated(1), 0x00)
  );
}

/**
 * Tests whether a given stage is clear in the global stage completion table
 */
export function stageClear(stage: StageID | StageName) {
  const id = match(stage)
    .with(P.number, (n) => n)
    .with(P.string, () => stageData[
        stageData.findIndex((elem) => elem.name === stage)
      ].id
    )
    .exhaustive();
  
  return define(
    eq(ADDR.stage_complete(id), 1)
  );
}

/**
 * Detects the frame when a given stage is set as cleared in the global stage completion table
 */
export function stageWin(stage: StageID | StageName) {
  const id = match(stage)
    .with(P.number, (n) => n)
    .with(P.string, () => stageData[
        stageData.findIndex((elem) => elem.name === stage)
      ].id
    )
    .exhaustive();
  
  return define(
    eq(prev(ADDR.stage_complete(id)), 0),
    eq(ADDR.stage_complete(id), 1)
  );
}

/**
 * Tests menu state to see if the `Use Item` submenu is open. Use this paired with changes in
 * inventory quantities to identify if a consumable item has been used
 */
export function usingItem() {
  return define(
    eq(ADDR.menu_state, 0x0013)
  );
}

// Endings -----------------------------------------------------

export function endingTransition(
  id: number | number[],
  stageID: number,
  finalStage: StageName
): ConditionBuilder {
  const endingIDs = (typeof(id) === 'number') ? [id] : id;

  return define(
    onStageMap(),
    stageClear(finalStage),
    orNext(...endingIDs.map((id) => eq(ADDR.ending_id, id))),
    neq(prev(ADDR.stage_id), stageID),
    eq(ADDR.stage_id, stageID),
  );
}

export function mainEndingTransition(): ConditionBuilder {
  return define(
    onStageMap(),
    stageClear(`Sharia Temple`),
    lte(ADDR.ending_id, 0x0B),
    andNext(
      neq(prev(ADDR.stage_id), 0x25),
      neq(prev(ADDR.stage_id), 0x26),
    ),
    orNext(
      eq(ADDR.stage_id, 0x25),
      eq(ADDR.stage_id, 0x26),
    ),
  );
}

export function justiceEndingTransition(): ConditionBuilder {
  return define(
    onStage("Tsargem Island"),
    stageClear("Tsargem Island"),
    neq(prev(ADDR.ending_id), 0x0D),
    eq(ADDR.ending_id, 0x0D),
  );
}

// Map control -------------------------------------------------

export function localCitiesControlled(stage: StageName): ConditionBuilder {
  const stageDatum = stageData.find(({name}) => name === stage);
  if (!stageDatum) { throw new Error (`No record found for stage ${stage}`) }

  return define(
    ...range(2, 2 + stageDatum.cities).map((n) => eq(ADDR.local_cities_liberated(n), 0))
  );
}

export function localTemplesControlled(stage: StageName): ConditionBuilder {
  const stageDatum = stageData.find(({name}) => name === stage);
  if (!stageDatum) { throw new Error (`No record found for stage ${stage}`) }

  return define(
    ...range(0, stageDatum.temples).map((n) => eq(ADDR.local_temples_liberated(n), 0))
  );
}

// Conditions for rich presence --------------------------------
/**
 * Tests whether the game is on the title screen. Used for rich presence
 */
export function onTitleScreen() {
  return define(
    neq(ADDR.program_binary, 0xD207DF08)
  );
}

/**
 * Tests whether the game is in some intermediate states between the title screen and loading the main
 * program binary. Not fully reliable. Used for rich presence 
 */
export function pseudoTitleScreen() {
  return define(
    eq(ADDR.program_binary, 0xD207DF08),
    isGameState(GameState.NewGame),
    neq(ADDR.misc_state, 0xFF)
  );
}

/**
 * Tests whether the player is starting a new game. Used for rich presence
 */
export function newGame() {
  return define(
    mainProgramLoaded(),
    isGameState(GameState.NewGame),
    eq(ADDR.misc_state, 0xFF)
  );
}

/**
 * Tests whether the final stage has been beaten. Used for rich presence
 */
export function gameComplete() {
  return define(
    eq(ADDR.stage_complete(0x18), 1)
  );
}

/**
 * Tests whether an ending cutscene is being played by testing stage ID. Used for rich presence
 */
export function isEnding() {
  return orNext(
    eq(ADDR.stage_id, 0x25),
    eq(ADDR.stage_id, 0x26),
  );
}


// Stats for rich presence -------------------------------------
/**
 * The number of completed stages
 */
export function stagesCompleted(): ConditionBuilder {
  return define(
    ...range(0, 35).map((n) => cond('AddSource', ADDR.stage_complete(n)))
  ).withLast({flag: 'Measured'});
}

/**
 * The number of cities that have been liberated on the current stage map
 */
export function citiesLiberatedOnMap(): ConditionBuilder {
  return define(
    ...range(2, 20).map((n) => cond('AddSource', ADDR.local_cities_liberated(n), '^', 0x01)),
    cond('Measured', 0x00)
  );
}

/**
 * The total number of cities on the current stage map, excluding the rebel and enemy headquarters
 */
export function citiesOnMap(): ConditionBuilder {
  return define(
    cond('Measured', ADDR.local_cities_count)
  );
}

/**
 * The number of temples that have been liberated on the current stage map
 */
export function templesLiberatedOnMap(): ConditionBuilder {
  return define(
    ...range(0, 20).map((n) => cond('AddSource', ADDR.local_temples_liberated(n), '^', 0x01)),
    cond('Measured', 0x00)
  );
}

/**
 * The total number of temples on the current stage map (except Pogrom Forest)
 */
export function templesOnMap(): ConditionBuilder {
  return define(
    cond('Measured', ADDR.local_temples_count)
  );
}

export function templesOnPogromForest(): ConditionBuilder {
  return define(
    cond('SubSource', 1),
    cond('Measured',  ADDR.local_temples_count)
  );
}

// Character roster --------------------------------------------

/**
 * Detects whether a special character is present in the character roster
 */
export function characterIsRecruited(name: CharacterName): ConditionBuilder {
  return orNext(
    ...range(0, 100).map((n) => eq(ADDR.roster_ids(n), getCharacterID(name)))
  );
}

/**
 * Captures the frame on which a special character is added to the character roster
 */
export function characterRecruited(name: CharacterName): ConditionBuilder {
  return define(
    andNext(
      ...range(0, 100).map((n) => neq(prev(ADDR.roster_ids(n)), getCharacterID(name)))
    ),
    orNext(
      ...range(0, 100).map((n) => eq(ADDR.roster_ids(n), getCharacterID(name)))
    )
  );
}

/**
 * Captures the frame when the first instance of a character with a previously unused class appears
 * in the character roster
 */
export function classRecruited(classID: number): ConditionBuilder {
  return define(
    andNext(
      ...range(0, 100).map((n) => neq(prev(ADDR.roster_class(n)), classID))
    ),
    orNext(
      ...range(0, 100).map((n) => eq(ADDR.roster_class(n), classID))
    )
  );
}

// Inventory ---------------------------------------------------
function equippedItemState(item: ItemName, state: 'equipped' | 'unequipped', when: 'delta' | 'now') {
  const operator = match(state)
    .with('equipped',   () => orNext)
    .with('unequipped', () => andNext)
    .exhaustive();
  const comparator = match(state)
    .with('equipped',   () => eq)
    .with('unequipped', () => neq)
    .exhaustive();
  const modifier = match(when)
    .with('delta', () => prev)
    .with('now',   () => identity)
    .exhaustive();
  
  return operator(
    ...range(0, 100).map((n) => comparator(modifier(ADDR.equipped_items(n)), getItemID(item)))
  )
}

export function itemWasNotEquipped(item: ItemName) {
  return equippedItemState(item, 'unequipped', 'delta');
}
export function itemWasEquipped(item: ItemName) {
  return equippedItemState(item, 'equipped', 'delta');
}
export function itemIsNotEquipped(item: ItemName) {
  return equippedItemState(item, 'unequipped', 'now');
}
export function itemIsEquipped(item: ItemName) {
  return equippedItemState(item, 'equipped', 'now');
}

function inventoryItemState(item: ItemName, state: 'present' | 'absent', when: 'delta' | 'now') {
  const operator = match(state)
    .with('present', () => orNext)
    .with('absent',  () => andNext)
    .exhaustive();
  const comparator = match(state)
    .with('present', () => eq)
    .with('absent',  () => neq)
    .exhaustive();
  const modifier = match(when)
    .with('delta', () => prev)
    .with('now',   () => identity)
    .exhaustive();
  
  return operator(
    ...range(0, 63).map((n) => comparator(modifier(ADDR.inventory_item(n)), getItemID(item)))
  );
}

export function itemWasNotInInventory(item: ItemName) {
  return inventoryItemState(item, 'absent', 'delta');
}
export function itemWasInInventory(item: ItemName) {
  return inventoryItemState(item, 'present', 'delta');
}
export function itemIsNotInInventory(item: ItemName) {
  return inventoryItemState(item, 'absent', 'now');
}
export function itemIsInInventory(item: ItemName) {
  return inventoryItemState(item, 'present', 'now');
}

export function receivedItem(item: ItemName) {
  return define(
    itemWasNotInInventory(item),
    itemIsInInventory(item)
  );
}

export function didNotHaveEquippableItem(item: ItemName) {
  return define(
    itemWasNotEquipped(item).withLast({flag: 'AndNext'}),
    itemWasNotInInventory(item)
  );
}

export function doNotHaveEquippableItem(item: ItemName) {
  return define(
    itemIsNotEquipped(item).withLast({flag: 'AndNext'}),
    itemIsNotInInventory(item)
  );
}

export function hadEquippableItem(item: ItemName) {
  return define(
    itemWasEquipped(item).withLast({flag: 'OrNext'}),
    itemWasInInventory(item)
  );
}

export function haveEquippableItem(item: ItemName) {
  return define(
    itemIsEquipped(item).withLast({flag: 'OrNext'}),
    itemIsInInventory(item)
  );
}

// ---------------------------------------------------------------------------------------------------

function opinionLeaderDefeated() {
  return define(
    gt(prev(ADDR.roster_current_hp(0)), 0),
    eq(ADDR.roster_current_hp(0), 0)
  )
}

function opinionLeaderDead() {
  return define(
    eq(ADDR.roster_current_hp(0), 0)
  )
}

function enemyLeaderDefeated() {
  return define(
    gt(prev(ADDR.deployed_enemies_hp(0)), 0),
    eq(ADDR.deployed_enemies_hp(0), 0)
  )
}

// ---------------------------------------------------------------------------------------------------

export function primeStageChallenge(stageName: StageName, opts?: Partial<{blockItems: boolean}>) {
  const blockItems = (opts && opts.blockItems) ? opts.blockItems : false;

  const stageDatum = stageData.find(({name: datumName}) => stageName === datumName)!;

  return once(
    andNext(
      // Verify stage ID and check stage has not been completed
      eq(ADDR.stage_id, stageDatum.id),
      eq(ADDR.stage_complete(stageDatum.id), 0),

      // Check clock values to exclude resuming a mid-battle save
      // First clock tick occurs before battle begins, so add a little buffer on minutes
       eq(ADDR.stage_clock_days,    0x00),
       eq(ADDR.stage_clock_hours,   0x0C),
      lte(ADDR.stage_clock_minutes, 0x05),

      // Check stage flags to make sure player hasn't partially completed and then had base captured
      ...range(2, 2 + stageDatum.cities).map((n) => eq(ADDR.local_cities_liberated(n), 1)),
      ...range(0, stageDatum.temples).map((n) => eq(ADDR.local_temples_liberated(n), 1)),
      ...(
        blockItems?
        range(0, stageDatum.hiddenObjectCount).map((n) => eq(ADDR.local_hidden_objects(n), 0)) :
        []
      ),

      // Stage intro has finished
      eq(prev(ADDR.stage_map_status), 0xC0),
      neq(ADDR.stage_map_status, 0xC0)
    )
  );
}

export function winStage() {
  // Local city flag at index `1` is always enemy base
  return define(
    eq(prev(ADDR.local_cities_liberated(1)), 1),
    eq(ADDR.local_cities_liberated(1), 0)
  );
}

export function winStageTriggered() {
  // Local city flag at index `1` is always enemy base
  return andNext(
    eq(prev(ADDR.local_cities_liberated(1)), 1),
    eq(ADDR.local_cities_liberated(1), 0)
  ).withLast({flag: 'Trigger'});
}

/**
 * A collection of generic reset conditions to use with all primed challenges
 */
export function resetStageChallenge(stageName: StageName) {
  return define(
    resetIf(not(mainProgramLoaded())),
    resetIf(eq(ADDR.game_state, 0x02)),
    resetIf(eq(ADDR.game_state, 0x60)),
    resetIf(not(isStageID(stageName))),
    resetIf(andNext(opinionLeaderDefeated())),
  );
}

// ---------------------------------------------------------------------------------------------------

type Days = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Hour =  0 |  1 |  2 |  3 |  4 |  5 |  6 |  7 |  8 |  9 | 10 | 11 |
            12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23;

export function timingRequirement(
  days: Days,
  hour?: Hour,
): (assertionType: 'reset' | 'measure') => ConditionBuilder[] {
  const normalizedDay:  number = days - 1;
  const normalizedHour: number = hour ?? 12;

  return match({day: normalizedDay, hour: normalizedHour})
    .with(
      {day: P.number, hour: P.when((hour) => hour < 12)},
      ({day , hour}) => (assertionType: 'reset' | 'measure') => match(assertionType)
        .with('reset', () => [
          resetIf(
            andNext(
              eq(ADDR.stage_clock_days, day),
              gte(ADDR.stage_clock_hours, hour),
              lt(ADDR.stage_clock_hours, 12)
            )
          ),
          resetIf(
            gt(ADDR.stage_clock_days, day)
          )
        ])
        .with('measure', () => [
          define(
            measuredIf(
              eq(ADDR.stage_clock_days, day)
            ),
            measuredIf(
              orNext(
                lt(ADDR.stage_clock_hours, hour),
                gte(ADDR.stage_clock_hours, hour)
              )
            )
          ),
          ...(day > 0 ?
            [measuredIf( lt(ADDR.stage_clock_days, day) )] : 
            []
          )
        ])
        .exhaustive()
    )
    .with(
      {day: P.number, hour: P.when((hour) => hour > 12)},
      ({day , hour}) => (assertionType: 'reset' | 'measure') => match(assertionType)
        .with('reset', () => [
          resetIf(
              andNext(
              eq(ADDR.stage_clock_days, day),
              gte(ADDR.stage_clock_hours, hour)
            )
          ),
          resetIf(
            andNext(
              eq(ADDR.stage_clock_days, day),
              lt(ADDR.stage_clock_hours, 12)
            )
          ),
          resetIf(
            gt(ADDR.stage_clock_days, day)
          )
        ])
        .with('measure', () => [
          measuredIf(
            andNext(
              eq(ADDR.stage_clock_days, day),
              gte(ADDR.stage_clock_hours, 12),
              lt(ADDR.stage_clock_hours, hour)
            )
          ),
          ...(day > 0 ?
            [measuredIf( lt(ADDR.stage_clock_days, day) )] : 
            []
          )
        ])
        .exhaustive()
    )
    .with(
      {day: P.number, hour: P.number},
      ({day, hour}) => (assertionType: 'reset' | 'measure') => match(assertionType)
        .with('reset', () => [
          resetIf( gt(ADDR.stage_clock_days, day) )
        ])
        .with('measure', () => [
          measuredIf(
            (day > 0) ? lte(ADDR.stage_clock_days, day) : eq(ADDR.stage_clock_days, day)
          )
        ])
        .exhaustive()
    )
    .exhaustive();
}

export function measuredTimedMapControlChallenge(
  stage: StageName,
  timingConditions: (assertionType: 'reset' | 'measure') => ConditionBuilder[],
  opts?: Partial<{
    complications: ConditionBuilder[],
    controlType: 'CitiesTemples' | 'BuriedTreasures'
  }>
): Condition.GroupSetObject {
  const complications = (opts && opts.complications) ? opts.complications : [];
  const controlType = (opts && opts.controlType) ? opts.controlType : 'CitiesTemples';

  const primingOpts = (controlType === 'CitiesTemples') ?
    {} :
    { blockItems: true };

  const stageDatum = stageData.find(({name}) => name === stage)!;
  const hiddenItems = hiddenItemsLookup.find(({name}) => name === stage)!.indices;

  const measuredConditions = match(controlType)
    .with('CitiesTemples', () => define(
      ...range(2, 2 + stageDatum.cities).map((i) =>
        cond('AddSource', ADDR.local_cities_liberated(i), '^', 1)
      ),
      ...range(0, stageDatum.temples).map((i) =>
        cond('AddSource', ADDR.local_temples_liberated(i), '^', 1)
      ),
      cond('Measured', 0, '=', stageDatum.cities + stageDatum.temples)
    ))
    .with('BuriedTreasures', () => define(
      ...hiddenItems.map((i) => 
        cond('AddSource', ADDR.local_hidden_objects(i))
      ),
      cond('Measured', 0, '=', hiddenItems.length)
    ))
    .exhaustive();

  return {
    core: define(
      primeStageChallenge(stage, primingOpts).withLast({flag: 'MeasuredIf'}),
      ...measuredConditions,
      winStageTriggered(),
      resetStageChallenge(stage),
      ...timingConditions('reset'),
      ...complications
    )
  };
}

// ---------------------------------------------------------------------------------------------------

// Nested 8-bit array lookups require checking parity of each index in the lookup chain and shifting
// the base addresses of indexed arrays by +/- 1 accordingly, to account for emulator memory swizzling

/**
 * Creates a set of reset conditions to be used to enforce requirements on what characters may be
 * deployed during a battle
 * 
 * @param swz_lookup - Lookup function for the array of 8-bit values used in the reset conditions. Must index the array in raw swizzled order, rather than deswizzled logical order
 * @param cmp - Comparison operator for the reset conditions
 * @param rvalue - Right-hand value for the reset conditions
 * @returns 
 */
export function deployedCharactersRestriction(
  swz_lookup: (n: number) => Condition.Value,
  cmp:    Condition.OperatorComparison,
  rvalue: ((n: number) => Condition.Value) | Condition.Value | number
) {
  const conditions = range(0, 10).flatMap((deployIndex: number) => {
    // Two levels of nested array access requires examining 2^2 cases to account for memory swizzling
    const parityData: [number, number][] = [[0, 0], [0, 1], [1, 0], [1, 1]];
    
    const membershipOffsetsTable: [number, number][] = [
      [0, -1],
      [1,  1],
      [2,  2],
      [3,  3],
      [5,  4]
    ];
    const rosterOffsets: [number, number] = [1, -1]; 

    return range(0, 5).flatMap((unitMember: number) => {
      const membershipOffsets = membershipOffsetsTable[unitMember];
      
      return parityData.flatMap(([deployParity, membershipParity]) => {
        const mOff = membershipOffsets[deployParity];
        const rOff = rosterOffsets[membershipParity];

        const rval = (typeof(rvalue) === 'function') ? rvalue(rOff) : rvalue;

        return [
          cond('AndNext',    ADDR.swz_deployed_units(deployIndex), '!=', 0xFF),
          cond('AddSource',  ADDR.swz_deployed_units(deployIndex), '&',  0x01),
          cond('AndNext',    0x00,                                 '=',  deployParity),
          cond('AddAddress', ADDR.swz_deployed_units(deployIndex), '*',  0x05),
          cond('AndNext',    ADDR.swz_unit_membership_data(mOff),  '!=', 0xFF),
          cond('AddAddress', ADDR.swz_deployed_units(deployIndex), '*',  0x05),
          cond('AddSource',  ADDR.swz_unit_membership_data(mOff),  '&',  0x01),
          cond('AndNext',    0x00,                                 '=',  membershipParity),
          cond('AddAddress', ADDR.swz_deployed_units(deployIndex), '*',  0x05),
          cond('AddAddress', ADDR.swz_unit_membership_data(mOff)),
          cond('ResetIf',    swz_lookup(rOff),                     cmp,  rval)
        ];
      })
    })
  });

  return define(...conditions);
}

/**
 * Creates a set of reset conditions to be used to enforce requirements on what characters may be
 * deployed during a battle
 * 
 * @param swz_lookup - Lookup function for the array of 8-bit values used in the reset conditions. Must index the array in raw swizzled order, rather than deswizzled logical order
 * @param cmp - Comparison operator for the reset conditions
 * @param rvalue - Right-hand value for the reset conditions
 */
export function deployedCharactersRestrictionStricter(
  swz_lookup: (n: number) => Condition.Value,
  cmp:    Condition.OperatorComparison,
  rvalue: ((n: number) => Condition.Value) | Condition.Value | number
) {
  const conditions = range(0, 10).flatMap((deployIndex: number) => {
    // Two levels of nested array access requires examining 2^2 cases to account for memory swizzling
    const parityData: [number, number][] = [[0, 0], [0, 1], [1, 0], [1, 1]];
    
    const membershipOffsetsTable: [number, number][] = [
      [0, -1],
      [1,  1],
      [2,  2],
      [3,  3],
      [5,  4]
    ];
    const rosterOffsets: [number, number] = [1, -1]; 

    return range(0, 5).flatMap((unitMember: number) => {
      const membershipOffsets = membershipOffsetsTable[unitMember];
      
      return parityData.flatMap(([deployParity, membershipParity]) => {
        const mOff = membershipOffsets[deployParity];
        const rOff = rosterOffsets[membershipParity];

        const rval = (typeof(rvalue) === 'function') ? rvalue(rOff) : rvalue;

        return [
          cond('AndNext',    ADDR.swz_deployed_units(deployIndex), '=',  prev(ADDR.swz_deployed_units(deployIndex))),
          cond('AndNext',    ADDR.swz_deployed_units(deployIndex), '!=', 0xFF),
          cond('AddSource',  ADDR.swz_deployed_units(deployIndex), '&',  0x01),
          cond('AndNext',    0x00,                                 '=',  deployParity),
          cond('AddAddress', ADDR.swz_deployed_units(deployIndex), '*',  0x05),
          cond('AndNext',    ADDR.swz_unit_membership_data(mOff),  '!=', 0xFF),
          cond('AddAddress', ADDR.swz_deployed_units(deployIndex), '*',  0x05),
          cond('AddSource',  ADDR.swz_unit_membership_data(mOff),  '&',  0x01),
          cond('AndNext',    0x00,                                 '=',  membershipParity),
          cond('AddAddress', ADDR.swz_deployed_units(deployIndex), '*',  0x05),
          cond('AddAddress', ADDR.swz_unit_membership_data(mOff)),
          cond('ResetIf',    swz_lookup(rOff),                     cmp,  rval)
        ];
      })
    })
  });

  return define(...conditions);
}

/**
 * Creates a challenge achievement requiring a member of the unit that defeats a stage boss to be
 * a specific special character
 */
export function bossKillCharacterRequirement(stage: StageName, character: CharacterName) {
  return bossKillRequirement(
    stage,
    ADDR.swz_roster_id,
    '=',
    getCharacterID(character)
  );
}

/**
 * Creates a challenge achievement requiring a member of the unit that defeats a stage boss to be
 * equipped with a specific piece of gear
 */
export function bossKillEquippedItemRequirement(stage: StageName, item: ItemName) {
  return bossKillRequirement(
    stage,
    ADDR.swz_equipped_items,
    '=',
    getItemID(item)
  );
}

/**
 * Creates a challenge achievement that enforces a specific condtion alongside defeating a stage boss
 * 
 * @param stage - The name of the stage that this challenge is scoped to
 * @param swz_lookup - Lookup function for the array of 8-bit values used in the trigger condition. Must index the array in raw swizzled order, rather than deswizzled logical order
 * @param cmp - Comparison operator for the trigger condition
 * @param rvalue - Right-hand value for the trigger condition
 */
function bossKillRequirement(
  stage: StageName,
  swz_lookup: (n: number) => Condition.Value,
  cmp: Condition.OperatorComparison,
  rvalue: ((n: number) => Condition.Value) | Condition.Value | number
): Condition.GroupSetObject {
  // Stage boss always resides at (logical) index 10 in combat matchmaking array
  const bossIndex = 10;

  // Three levels of nested array access requires examining 2^3 cases to account for memory swizzling
  const parityData: [number, number, number][] = [
    [0, 0, 0], [0, 0, 1], [0, 1, 0], [0, 1, 1],
    [1, 0, 0], [1, 0, 1], [1, 1, 0], [1, 1, 1],
  ];
  
  const combatOffsets: [number, number] = [1, -1];
  const membershipOffsetsTable: [number, number][] = [
    [0, -1],
    [1,  1],
    [2,  2],
    [3,  3],
    [5,  4]
  ];
  const rosterOffsets: [number, number] = [1, -1]; 

  const conditions = range(0, 5).flatMap((unitMember: number) => {
    const membershipOffsets = membershipOffsetsTable[unitMember];
    
    return parityData.map(([combatParity, deployParity, membershipParity]) => {
      const cOff = combatOffsets[combatParity];
      const mOff = membershipOffsets[deployParity];
      const rOff = rosterOffsets[membershipParity];

      const rval = (typeof(rvalue) === 'function') ? rvalue(rOff) : rvalue;

      return [
        cond('',           ADDR.in_combat_with(bossIndex),       '!=', 0xFF),
        cond('AddSource',  ADDR.in_combat_with(bossIndex),       '&',  0x01),
        cond('',           0x00,                                 '=',  combatParity),
        cond('AddAddress', ADDR.in_combat_with(bossIndex)),
        cond('',           ADDR.swz_deployed_units(cOff),        '!=', 0xFF),
        cond('AddAddress', ADDR.in_combat_with(bossIndex)),
        cond('AddSource',  ADDR.swz_deployed_units(cOff),        '&',  0x01),
        cond('',           0x00,                                 '=',  deployParity),
        cond('AddAddress', ADDR.in_combat_with(bossIndex)),
        cond('AddAddress', ADDR.swz_deployed_units(cOff),        '*',  0x05),
        cond('',           ADDR.swz_unit_membership_data(mOff),  '!=', 0xFF),
        cond('AddAddress', ADDR.in_combat_with(bossIndex)),
        cond('AddAddress', ADDR.swz_deployed_units(cOff),        '*',  0x05),
        cond('AddSource',  ADDR.swz_unit_membership_data(mOff),  '&',  0x01),
        cond('',           0x00,                                 '=',  membershipParity),
        cond('AddAddress', ADDR.in_combat_with(bossIndex)),
        cond('AddAddress', ADDR.swz_deployed_units(cOff),        '*',  0x05),
        cond('AddAddress', ADDR.swz_unit_membership_data(mOff)),
        cond('',           swz_lookup(rOff),                     cmp,  rval)
      ];
    })
  });

  const alts = conditions.reduce((acc, conditionGroup, n) => (
    {...acc, [`alt${n + 1}`]: define(...conditionGroup)}
  ), {});

  return {
    core: define(
      not(stageClear(stage)),
      not(opinionLeaderDead()),
      andNext(
        once(enemyLeaderDefeated()),
        eq(prev(ADDR.combat_active), 1),
        eq(ADDR.combat_active, 0)
      ),
      resetIf(
        andNext(
          eq(prev(ADDR.combat_active), 0),
          eq(ADDR.combat_active, 0)
        )
      ),
      resetIf(not(mainProgramLoaded())),
      resetIf(eq(ADDR.game_state, 0x02)),
      resetIf(eq(ADDR.game_state, 0x60)),
      resetIf(not(isStageID(stage))),
    ),
    ...alts
  };
}
