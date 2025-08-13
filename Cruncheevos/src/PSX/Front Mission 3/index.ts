import { AchievementSet, define } from '@cruncheevos/core'

import makeAchievements from './achievements.js';
import makeLeaderboards from './leaderboards.js';
import makeRichPresence from './rich-presence.js';

const set = new AchievementSet({
  gameId: 11263,
  title: 'Front Mission 3',
});

makeAchievements(set);
makeLeaderboards(set);

export const rich = makeRichPresence();

export default set;
