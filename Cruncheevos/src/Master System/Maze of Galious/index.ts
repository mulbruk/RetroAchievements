import { AchievementSet } from '@cruncheevos/core'

import makeAchievements from './achievements.js';
import makeLeaderboards from './leaderboards.js';
import makeRichPresence from './rich-presence.js';

const set = new AchievementSet({
  gameId: 11607,
  title: '~Unlicensed~ Knightmare II: The Maze of Galious',
});

makeAchievements(set);
makeLeaderboards(set);

export const rich = makeRichPresence();

export default set;
