import { AchievementSet } from '@cruncheevos/core'

import makeAchievements from './achievements.js';
import makeLeaderboards from './leaderboards.js';
import makeRichPresence from './rich-presence.js';

const set = new AchievementSet({
  gameId: 16375,
  title: '~Unlicensed~ Super Boy 4',
});

makeAchievements(set);
makeLeaderboards(set);

export const rich = makeRichPresence();

export default set;
