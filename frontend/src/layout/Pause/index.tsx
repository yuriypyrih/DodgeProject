import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import Game from '../../game/engine/game.ts';
import styles from './styles.module.scss';
import { useNavigate } from 'react-router-dom';
import { GAME_STATE } from '../../game/enum/game_state.ts';

type PauseProps = {
  game: Game | null;
  toggleReset: () => void;
};

const Pause: React.FC<PauseProps> = ({ game, toggleReset }) => {
  const navigate = useNavigate();
  const handleResume = () => {
    if (game) game.togglePause(GAME_STATE.PLAYING);
  };

  const handleReset = () => {
    if (game) game.reset();
    toggleReset();
  };

  const handleQuit = () => {
    if (game) game.close();
    const lvl = Number(window.location.pathname.split('/')[2]);
    let page = 1;
    if (!lvl) {
      page = 1;
    }
    if (lvl <= 12) {
      page = 1;
    } else if (lvl <= 24) {
      page = 2;
    } else if (lvl <= 27) {
      page = 3;
    }
    navigate(`/Selection?queryPage=${page}`, { replace: true });
  };

  return (
    <Box className={styles.root}>
      <Box className={styles.container}>
        <Typography variant="h2" style={{ color: 'white', textShadow: '5px 5px #222' }}>
          PAUSED
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            marginTop: '24px',
            marginBottom: '12px',
          }}
        >
          <Box>
            <Button className={styles.button} onClick={handleResume}>
              <Typography variant="h5">RESUME</Typography>
            </Button>
          </Box>

          <Box>
            <Button className={styles.button} onClick={handleReset}>
              <Typography variant="h5">RESET</Typography>
            </Button>
          </Box>

          <Box>
            <Button className={styles.button} onClick={handleQuit}>
              <Typography variant="h5">QUIT</Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Pause;
