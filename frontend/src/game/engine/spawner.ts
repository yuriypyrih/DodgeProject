import Game from './game';
import store from '../../redux/store';
import { getSec, sec } from '../../utils/deltaTime';
import { setChaosTimer, setCurrentTimer, setProgress } from '../../redux/slices/gameSlice';
import { getLevel1, level1Stars } from './levels/getLevel1';
import { getLevel2, level2Stars } from './levels/getLevel2';
import { getLevel3, level3Stars } from './levels/getLevel3';
import { getLevel4, level4Stars } from './levels/getLevel4';
import { getLevel5, level5Stars } from './levels/getLevel5';
import { getLevel6, level6Stars } from './levels/getLevel6';
import { getLevel7, level7Stars } from './levels/getLevel7';
import { getLevel8, level8Stars } from './levels/getLevel8';
import { getLevel9, level9Stars } from './levels/getLevel9';
import { getLevel10, level10Stars } from './levels/getLevel10';
import { getLevel0, level0Stars } from './levels/getLevel0';
import { getLevel11, level11Stars } from './levels/getLevel11';
import { getLevel12, level12Stars } from './levels/getLevel12';
import { getLevel13, level13Stars } from './levels/getLevel13';
import { getLevel14, level14Stars } from './levels/getLevel14.ts';
import { getLevel15, level15Stars } from './levels/getLevel15.ts';
import { getLevel16, level16Stars } from './levels/getLevel16.ts';
import { getLevel17, level17Stars } from './levels/getLevel17.ts';
import { getLevel18, level18Stars } from './levels/getLevel18.ts';
import { getLevel19, level19Stars } from './levels/getLevel19.ts';
import { getLevel20, level20Stars } from './levels/getLevel20.ts';
import { getLevel21, level21Stars } from './levels/getLevel21.ts';
import { getLevel22, level22Stars } from './levels/getLevel22.ts';
import { getLevel23, level23Stars } from './levels/getLevel23.ts';
import { getLevel24, level24Stars } from './levels/getLevel24.ts';
import { getLevel25, level25Stars } from './levels/getLevel25.ts';
import { getLevel26, level26Stars } from './levels/getLevel26.ts';
import { getLevel27, level27Stars } from './levels/getLevel27.ts';
import { isChaosDungeon } from '../../utils/isChaosDungeon.ts';

type SpawnerProps = {
  game: Game;
};

export default class Spawner {
  game: Game;
  executionSequence: number;
  roundTimer: number;
  chaosRoundTimer: number;
  levelStars: number[][];
  timerInterval: number;
  constructor({ game }: SpawnerProps) {
    this.game = game;

    this.executionSequence = 0;
    this.roundTimer = 0; // Through calculations 1 sec of real Time is about roundTimer = 60
    this.chaosRoundTimer = 0;
    this.timerInterval = 0;
    this.levelStars = [
      level1Stars,
      level2Stars,
      level3Stars,
      level4Stars,
      level5Stars,
      level6Stars,
      level7Stars,
      level8Stars,
      level9Stars,
      level10Stars,
      level11Stars,
      level12Stars,
      level13Stars,
      level14Stars,
      level15Stars,
      level16Stars,
      level17Stars,
      level18Stars,
      level19Stars,
      level20Stars,
      level21Stars,
      level22Stars,
      level23Stars,
      level24Stars,
      level25Stars,
      level26Stars,
      level27Stars,
    ];
  }

  reset() {
    this.executionSequence = 0; // 3, after the star
    this.roundTimer = sec(0);
    this.chaosRoundTimer = 0;
    this.timerInterval = 0;
  }

  startLevel(_level: number) {
    this.updateHudProgress();
    this.reset();
    //hud.reset():
  }

  updateHudProgress() {
    if (this.game.level === 0) {
      store.dispatch(
        setProgress({
          max_stars: level0Stars.length,
          total_stars_collected: this.game.player.stars,
          star_timers: level0Stars,
        }),
      );
    } else {
      store.dispatch(
        setProgress({
          max_stars: this.levelStars[this.game.level - 1].length,
          total_stars_collected: this.game.player.stars,
          star_timers: this.levelStars[this.game.level - 1],
        }),
      );
    }
  }

  update(_deltaTime: number) {
    this.roundTimer++;
    if (this.game.player.isChaosActive) this.chaosRoundTimer++;

    if (isChaosDungeon(this.game.level) && !this.game.player.isChaosActive) {
      const max_stars_minus_1 = this.levelStars[this.game.level - 1].length - 1;
      const total_stars_collected = this.game.player.stars;
      if (max_stars_minus_1 === total_stars_collected) {
        this.game.player.isChaosActive = true;
      }
    }

    this.timerInterval++;
    if (this.timerInterval >= 5) {
      this.timerInterval = 0;
      store.dispatch(setCurrentTimer(getSec(this.roundTimer, 2)));
      if (this.game.player.isChaosActive) {
        store.dispatch(setChaosTimer(getSec(this.chaosRoundTimer, 2)));
      }
    }

    if (this.game.player.milestone) {
      this.executionSequence++;
      this.game.player.milestone = false;
    }
    if (this.game.level === 0) {
      getLevel0(this.game);
    } else if (this.game.level === 1) {
      getLevel1(this.game);
    } else if (this.game.level === 2) {
      getLevel2(this.game);
    } else if (this.game.level === 3) {
      getLevel3(this.game);
    } else if (this.game.level === 4) {
      getLevel4(this.game);
    } else if (this.game.level === 5) {
      getLevel5(this.game);
    } else if (this.game.level === 6) {
      getLevel6(this.game);
    } else if (this.game.level === 7) {
      getLevel7(this.game);
    } else if (this.game.level === 8) {
      getLevel8(this.game);
    } else if (this.game.level === 9) {
      getLevel9(this.game);
    } else if (this.game.level === 10) {
      getLevel10(this.game);
    } else if (this.game.level === 11) {
      getLevel11(this.game);
    } else if (this.game.level === 12) {
      getLevel12(this.game);
    } else if (this.game.level === 13) {
      getLevel13(this.game);
    } else if (this.game.level === 14) {
      getLevel14(this.game);
    } else if (this.game.level === 15) {
      getLevel15(this.game);
    } else if (this.game.level === 16) {
      getLevel16(this.game);
    } else if (this.game.level === 17) {
      getLevel17(this.game);
    } else if (this.game.level === 18) {
      getLevel18(this.game);
    } else if (this.game.level === 19) {
      getLevel19(this.game);
    } else if (this.game.level === 20) {
      getLevel20(this.game);
    } else if (this.game.level === 21) {
      getLevel21(this.game);
    } else if (this.game.level === 22) {
      getLevel22(this.game);
    } else if (this.game.level === 23) {
      getLevel23(this.game);
    } else if (this.game.level === 24) {
      getLevel24(this.game);
    } else if (this.game.level === 25) {
      getLevel25(this.game);
    } else if (this.game.level === 26) {
      getLevel26(this.game);
    } else if (this.game.level === 27) {
      getLevel27(this.game);
    }
  }
}
