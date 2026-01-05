import { Howl, Howler } from 'howler';
import Game from './game';

type AudioHandlerProps = {
  game: Game;
};

export default class AudioHandler {
  game: Game;
  themeIsPlaying: boolean;
  theme: Howl;
  damage: Howl;
  starAppear: Howl;
  starGrab: Howl;
  radiation: Howl;
  victory: Howl;
  defeat: Howl;
  button: Howl;
  poison: Howl;
  deathmark: Howl;
  burn: Howl;
  hacked: Howl;
  heal: Howl;
  shield: Howl;
  teleport: Howl;
  roar: Howl;
  dodge: Howl;

  constructor({ game }: AudioHandlerProps) {
    this.game = game;
    this.themeIsPlaying = false;

    const localStorageMusicVolume = localStorage.getItem('musicVolume');
    let musicVolume = 0.1;
    if (localStorageMusicVolume === 'High') {
      musicVolume = 0.1;
    } else if (localStorageMusicVolume === 'Low') {
      musicVolume = 0.02;
    } else if (localStorageMusicVolume === 'Off') {
      musicVolume = 0;
    }
    const localStorageSoundVolume = localStorage.getItem('soundVolume');
    let soundVolume = 0.15;
    if (localStorageSoundVolume === 'High') {
      soundVolume = 0.15;
    } else if (localStorageSoundVolume === 'Low') {
      soundVolume = 0.05;
    } else if (localStorageSoundVolume === 'Off') {
      soundVolume = 0;
    }

    this.theme = new Howl({
      src: ['/audio/electromagic.wav'], //['/audio/ninja.wav', '/audio/electromagic.wav', '/audio/theme.ogg'],
      loop: true,
      volume: musicVolume,
    });

    this.damage = new Howl({
      src: ['/audio/laser.wav'],
      volume: soundVolume,
    });
    this.starAppear = new Howl({
      src: ['/audio/star_appear.wav'],
      volume: soundVolume,
    });
    this.starGrab = new Howl({
      src: ['/audio/star_grab.wav'],
      volume: soundVolume,
    });
    this.victory = new Howl({
      src: ['/audio/victory.wav'],
      volume: soundVolume,
    });
    this.defeat = new Howl({
      src: ['/audio/defeat.wav'],
      volume: soundVolume,
    });
    this.radiation = new Howl({
      src: ['/audio/radiation.wav'],
      volume: soundVolume,
    });
    this.button = new Howl({
      src: ['/audio/button.wav'],
      volume: soundVolume,
    });
    this.deathmark = new Howl({
      src: ['/audio/deathmark.wav'],
      volume: soundVolume,
    });
    this.poison = new Howl({
      src: ['/audio/poison.wav'],
      volume: soundVolume,
    });
    this.burn = new Howl({
      src: ['/audio/damage.wav'],
      volume: soundVolume,
    });
    this.hacked = new Howl({
      src: ['/audio/hacked.wav'],
      volume: soundVolume,
    });
    this.heal = new Howl({
      src: ['/audio/heal.wav'],
      volume: soundVolume,
    });
    this.shield = new Howl({
      src: ['/audio/shield.wav'],
      volume: soundVolume,
    });
    this.teleport = new Howl({
      src: ['/audio/teleport.wav'],
      volume: soundVolume,
    });
    this.roar = new Howl({
      src: ['/audio/roar.wav'],
      volume: soundVolume,
    });
    this.dodge = new Howl({
      src: ['/audio/dodge.wav'],
      volume: soundVolume,
    });
  }

  initAudio() {
    // Play the theme song when the game loads
    if (!this.themeIsPlaying) {
      this.unlockAudio();
      this.theme.play();
    }
  }

  unlockAudio() {
    this.themeIsPlaying = true;
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume();
    }
  }

  changeSoundVolume(volume: number) {
    this.victory.volume(volume);
    this.starGrab.volume(volume);
    this.starAppear.volume(volume);
    this.damage.volume(volume);
  }

  stopAudio() {
    // Stop the theme song
    this.theme.stop();
  }

  pauseAudio() {
    // Pause the theme song
    this.theme.pause();
  }

  resumeAudio() {
    // Resume the theme song if it was paused
    this.theme.play();
  }
}
