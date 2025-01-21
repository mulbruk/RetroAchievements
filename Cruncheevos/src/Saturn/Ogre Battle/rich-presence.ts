import { define, RichPresence } from "@cruncheevos/core";

import { not } from '../../common/comparison.js'
import {
  addrStr, richPresenceLookup, richPresencePluralize
} from "../../common/rich-presence.js";

import {
  onTitleScreen, pseudoTitleScreen, newGame,
  onWorldMap, 
  onStageMap, isStageID, stageStarted, stageClear, currentStageIsComplete, stagesCompleted,
  citiesOnMap, citiesLiberatedOnMap,
  templesOnMap, templesOnPogromForest, templesLiberatedOnMap,
  gameComplete, isEnding,
  
} from "./accessors.js";
import { ADDR, endingRPData, stageData } from "./data.js";

// ---------------------------------------------------------------------------------------------------

function makeRichPresence() {
  const Days = richPresencePluralize('Days', 'day', 'days', ADDR.campaign_length);

  const Articles = richPresenceLookup(
    'Articles',
    stageData, 'id', 'article',
    { defaultAt: ADDR.stage_id }
  );

  const EndingName = richPresenceLookup(
    'EndingName',
    endingRPData, 'id', 'name',
    { defaultAt: ADDR.ending_id }
  );

  const MapName = richPresenceLookup(
    'MapName',
    stageData, 'id', 'name',
    { defaultAt: ADDR.stage_id }
  );
  
  return RichPresence({
    format: {
      CampaignLength:  'VALUE',
      ChaosFrame:      'VALUE',
      StagesCompleted: 'VALUE',
    },
    lookupDefaultParameters: { keyFormat: 'hex', compressRanges: false },
    lookup: {
      Articles,
      Days,
      EndingName,
      MapName,
    },
    displays: ({ lookup, format, macro, tag }) => {
      const regions    = tag`Regions liberated: ${macro.Number.at(stagesCompleted())}/33`;
      const reputation = tag`Reputation: ${macro.Number.at(addrStr(ADDR.chaos_frame))}`;
      const campaign   = tag`Campaign length: ${macro.Number.at(addrStr(ADDR.campaign_length))} ${lookup.Days}`

      const stage  = tag`${lookup.Articles}${lookup.MapName}`;
      const ending = tag`${lookup.EndingName}`;

      const citiesLiberated  = tag`Cities: ${macro.Number.at(citiesLiberatedOnMap())}/${macro.Number.at(citiesOnMap())}`;
      const templesLiberated = tag`Temples: ${macro.Number.at(templesLiberatedOnMap())}/${macro.Number.at(templesOnMap())}`;

      const stagePlain = tag`${lookup.MapName}`;

      return [
        [onTitleScreen(), 'Title screen'],
        [pseudoTitleScreen(), 'Title screen'],
        [newGame(), 'Consulting the seer Warren on matters of destiny'],
        
        [
          define( onWorldMap(), isStageID(`Tsargem Island`) ),
          tag`World map • ${stagePlain} • ${reputation} • ${campaign}`
        ],
        [
          define( onWorldMap(), isStageID(`Dragon's Haven`) ),
          tag`World map • ${stagePlain} • ${reputation} • ${campaign}`
        ],
        [
          onWorldMap(),
          tag`World map • ${reputation} • ${regions} • ${campaign}`
        ],
        
        [
          define( onStageMap(), not( stageStarted() ), isStageID(`Tsargem Island`) ),
          tag`Deploying to ${stage} • ${reputation} • ${campaign}`
        ],
        [
          define( onStageMap(), not(currentStageIsComplete()), isStageID(`Tsargem Island`) ),
          tag`Liberating ${stage} • ${citiesLiberated} • ${templesLiberated} • ${reputation} • ${campaign}`
        ],
        [
          define( onStageMap(), currentStageIsComplete(), isStageID(`Tsargem Island`) ),
          tag`Ending and credits • JUSTICE • ${reputation} • ${campaign}`
        ],

        [
          define( onStageMap(), not( stageStarted() ), isStageID(`Dragon's Haven`) ),
          tag`Deploying to ${stage} • ${reputation} • ${campaign}`
        ],
        [
          define( onStageMap(), isStageID(`Dragon's Haven`) ),
          tag`Liberating ${stage} • ${citiesLiberated} • ${templesLiberated}  • ${reputation} • ${campaign}`
        ],
        [
          define( isEnding(), onStageMap(), stageClear(`Dragon's Haven`) ),
          tag`Ending and credits • ${ending} • ${reputation} • ${campaign}`
        ],

        
        [
          define( onStageMap(), not( stageStarted() ) ),
          tag`Deploying to ${stage} • ${reputation} • ${regions} • ${campaign}`
        ],
        [
          define( onStageMap(), isStageID(`Pogrom Forest`), not(currentStageIsComplete()) ),
          tag`Liberating ${stage} • ${citiesLiberated} • Temples: ${macro.Number.at(templesLiberatedOnMap())}/${macro.Number.at(templesOnPogromForest())}  • ${reputation} • ${regions} • ${campaign}`
        ],
        [
          define( onStageMap(), not(currentStageIsComplete()) ),
          tag`Liberating ${stage} • ${citiesLiberated} • ${templesLiberated}  • ${reputation} • ${regions} • ${campaign}`
        ],
        [
          define( onStageMap(), isStageID(`Pogrom Forest`), currentStageIsComplete(), not( gameComplete() ) ),
          tag`Exploring ${stage} • ${citiesLiberated} • Temples: ${macro.Number.at(templesLiberatedOnMap())}/${macro.Number.at(templesOnPogromForest())}  • ${reputation} • ${regions} • ${campaign}`
        ],
        [
          define( onStageMap(), currentStageIsComplete(), not( gameComplete() ) ),
          tag`Exploring ${stage} • ${citiesLiberated} • ${templesLiberated}  • ${reputation} • ${regions} • ${campaign}`
        ],

        [
          define( isEnding(), onStageMap(), gameComplete() ),
          tag`Ending and credits • ${ending} • ${reputation} • ${campaign}`
        ],
        [
          define( onStageMap(), gameComplete() ),
          tag`Ending and credits • ${reputation} • ${campaign}`
        ],

        'Overthrowing the Sacred Xytegenian Empire'
      ]
    },
  });
}

export default makeRichPresence;
