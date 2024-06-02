import VfxAnimation from './layout/VfxAnimation';
import initialize from './utils/initialize';
import Routes from './Routes/Routes';
import styles from './App.module.scss';
import startEngine from './game';
import Game from './game/engine/game.ts';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './redux/store.ts';
import { setZoom } from './redux/slices/layoutSlice.ts';
import { useEffect } from 'react';

// Init tokens
initialize();
console.log('INITIALIZE ENGINE');
const game: Game = startEngine();
export { game };
function App() {
  const dispatch: AppDispatch = useDispatch();
  const zoom = useSelector((state: RootState) => state.layoutSlice.zoom);
  const chaosTimer = useSelector((state: RootState) => state.gameSlice.chaosTimer);

  useEffect(() => {
    const savedZoom = localStorage.getItem('zoomLevel');
    if (savedZoom) {
      dispatch(setZoom(Number(savedZoom)));
    }
  }, [dispatch]);

  return (
    <div className={clsx(styles.app, chaosTimer > 0 ? styles.chaos : null)}>
      <div className={styles.mainWindow} style={{ transform: `scale(${zoom})` }}>
        <VfxAnimation>
          <Routes />
        </VfxAnimation>
      </div>
    </div>
  );
}

export default App;
