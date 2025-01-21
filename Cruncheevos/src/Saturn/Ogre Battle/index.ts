import { AchievementSet } from '@cruncheevos/core'

import makeAchievements from './achievements.js';
import makeLeaderboards from './leaderboards.js';
import makeRichPresence from './rich-presence.js';

const set = new AchievementSet({
  gameId: 20248,
  title: 'Ogre Battle | Densetsu no Ogre Battle',
});

makeAchievements(set);
makeLeaderboards(set);

export const rich = makeRichPresence();

export default set;
