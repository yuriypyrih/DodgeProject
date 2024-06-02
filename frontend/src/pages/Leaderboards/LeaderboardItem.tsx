import React from 'react';
import { Box } from '@mui/material';

import { ScoreRecord } from '../../Models/ScoreRecord.ts';
import styles from './styles.module.scss';
import DefaultIcon from '@mui/icons-material/Description';
import { relics } from '../../game/engine/relics/relics_collection.ts';
import USerIcon from '@mui/icons-material/AccountCircle';
import clsx from 'clsx';

type TProps = {
  scoreRecord: ScoreRecord;
  highlighted?: boolean;
  lastPlaced?: boolean;
  index: number;
};

const LeaderboardItem: React.FC<TProps> = ({ scoreRecord, index, lastPlaced, highlighted }) => {
  const getAugmentIcon = () => {
    let Icon = DefaultIcon;
    const foundRelic = relics.find((r) => r.id === scoreRecord.augment);
    if (foundRelic) {
      Icon = foundRelic.Icon;
    }
    return <Icon className={styles.augmentIcon} />;
  };

  const getPlace = () => {
    const place = scoreRecord.place ? scoreRecord.place : index + 1;
    if (place === 1) {
      return (
        <div>
          {place}
          <span style={{ fontSize: 12 }}>st</span>
        </div>
      );
    } else if (place === 2) {
      return (
        <div>
          {place}
          <span style={{ fontSize: 12 }}>nd</span>
        </div>
      );
    } else if (place === 3) {
      return (
        <div>
          {place}
          <span style={{ fontSize: 12 }}>rd</span>
        </div>
      );
    } else {
      return (
        <div>
          {place}
          <span style={{ fontSize: 12 }}>th</span>
        </div>
      );
    }
  };

  return (
    <Box>
      {lastPlaced && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 1 }}>
          {[1, 2, 3].map((dot) => (
            <Box key={dot} className={styles.dot} />
          ))}
        </Box>
      )}
      <Box className={clsx(styles.item, highlighted && styles.highlighted)}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'center' }}>
          <Box sx={{ pl: 1, textAlign: 'left', minWidth: '34px' }}>
            <Box sx={{ color: 'white' }}>{getPlace()}</Box>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', gap: 1 }}>
            <USerIcon sx={{ color: 'white' }} />
            <Box sx={{ color: 'white' }}>{scoreRecord.userName}</Box>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'right', pr: 2 }}>
            <Box sx={{ color: 'white' }}>{scoreRecord.score}</Box>
          </Box>
          <Box sx={{ flex: 0, width: '40px', display: 'flex', alignItems: 'center' }}>{getAugmentIcon()}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LeaderboardItem;
