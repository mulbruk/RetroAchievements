import { AchievementSet, define as $ } from '@cruncheevos/core'

import makeAchievements from './achievements.js';
import makeLeaderboards from './leaderboards.js';
import makeRichPresence from './rich-presence.js';

const set = new AchievementSet({
  gameId: 12727,
  title: '~Unlicensed~ Koko Adventure',
});

makeAchievements(set);
makeLeaderboards(set);

export const rich = makeRichPresence();

export default set;
