import { AchievementSet } from '@cruncheevos/core'

import makeAchievements from './achievements.js';
// import makeRichPresence from './rich-presence.js';

const set = new AchievementSet({
  gameId: 5029,
  title: 'Tactics Ogre: The Knight of Lodis',
});

makeAchievements(set);

// export const rich = makeRichPresence();

export default set;
