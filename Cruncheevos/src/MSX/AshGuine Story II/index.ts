import { AchievementSet } from '@cruncheevos/core';

import makeAchievements from './achievements.js';
import makeLeaderboards from './leaderboards.js';
import makeRichPresence from './rich-presence.js';

const set = new AchievementSet({
  gameId: 10475,
  title: 'AshGuine Story II: Kokuu no Gajou',
});

makeAchievements(set);
makeLeaderboards(set);

export const rich = makeRichPresence();

export default set;
