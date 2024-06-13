import React, { useEffect, useMemo } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import { useLocation } from 'react-router-dom';
import HealIcon from '@mui/icons-material/Favorite';
import ImmunityIcon from '../../assets/svg/relic_immunity.svg?react';
import RegenIcon from '@mui/icons-material/LocalHospital';
import CureIcon from '../../assets/svg/relic_cure.svg?react';
import FearIcon from '../../assets/svg/relic_fear.svg?react';
import VisionIcon from '../../assets/svg/relic_vision.svg?react';
import PortalIcon from '../../assets/svg/relic_portal.svg?react';
import BerserkIcon from '../../assets/svg/relic_berserk.svg?react';
import AngelIcon from '../../assets/svg/relic_angel.svg?react';
import StabilizerIcon from '../../assets/svg/relic_stabilizer.svg?react';
import SkullIcon from '../../assets/svg/skull.svg?react';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import StarIcon from 'assets/svg/diamond.svg?react';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import StopwatchIcon from 'assets/svg/stopwatch.svg?react';
import styles from './Wiki.module.scss';
import ColorfullSquare from '../../components/ColorfullSquare';

import { COLOR } from 'game/enum/colors.ts';
import CustomButton from '../../components/CustomButton';
import useNavigateBack from '../../utils/hooks/useNavigateBack.ts';

type ContentType = { Icon?: any; title?: string | string[]; description: string[] };

const generalContent: ContentType[] = [
  {
    Icon: <ImportContactsIcon style={{ width: 30, height: 30 }} />,
    title: 'Basics',
    description: [
      'Dodge all the enemies in your path and collect the stars along the way to progress.',
      '- Normal levels have a Boss at the end while Marathon levels are mini challenges.',
      '- YURIV is your trusty copilot, dropping dumb tips whenever possible ~',
    ],
  },
  {
    Icon: (
      <StarIcon
        style={{
          width: 30,
          height: 30,
          marginLeft: '2px',
          fill: 'white',
        }}
      />
    ),
    title: 'Stars',
    description: [
      'Stars are the currency of this game. With them you unlock levels, augments, and cosmetics. Every star you collect in the game goes directly to your wallet, so keep farming ~',
      '- Beating a level for the first time grants a Bonus Star and unlocks the next level for free!',
    ],
  },
  {
    Icon: <ColorfullSquare size={24} color1={'white'} />,
    title: 'Enemies',
    description: [
      'Each type of enemy is uniquely color coded. Pay attention to each color since it has a specific behavioral pattern and effect.',
      '- Only the head of the enemies does damage and apply effects, the tails are harmless.',
      '- Hop into the Enemies section to learn more about them individually.',
    ],
  },
  {
    Icon: <StabilizerIcon style={{ width: 30, height: 30 }} />,
    title: 'Augments',
    description: [
      'Augments are powerful abilities that you can equip during the level selection.',
      '- To activate an augment press Q (or L when playing AWSD) during the game.',
      '- Hop into the augment section to learn more about them individually.',
    ],
  },
  {
    Icon: <SkullIcon style={{ width: 30, height: 30 }} />,
    title: 'Chaos Dungeons',
    description: [
      'Once you get enough experience you can jump into the Chaos Dungeons!',
      "It starts as a normal level but it doesn't have a boss or an ending. " +
        'Instead at the last star you enter into a race to get the best score by surviving as long as possible.',
      '- When the timer starts, EVERYTHING deals 5 extra damage on hit.',
      '- You can compare scores on the global leaderboards!',
      '- Your augment is your best friend so choose wisely..',
    ],
  },
];
const enemiesContent: ContentType[] = [
  {
    title: 'Scout',
    Icon: <ColorfullSquare size={30} color1={COLOR.RED} />,
    description: ['The simplest enemy', '- Does 25 dmg'],
  },
  {
    title: 'Bosses',
    Icon: <ColorfullSquare size={46} color1={COLOR.RED} />,
    description: [
      'Each Boss behavior will adapt to the color of its child',
      '- Do 40 dmg, usually',
      '- Immune to Fear',
    ],
  },
  {
    title: 'Bullet',
    Icon: <ColorfullSquare size={8} color1={COLOR.RED} />,
    description: ['Bullets are fired by Bosses', '- Do 10 dmg, usually'],
  },
  {
    title: 'Speeder',
    Icon: <ColorfullSquare size={30} color1={COLOR.LIGHT_BLUE} />,
    description: ['A faster version of the Scout', '- Does 25 dmg'],
  },
  {
    title: 'Tracer',
    Icon: <ColorfullSquare size={30} color1={COLOR.YELLOW} />,
    description: ['An enemy that follows you', '- Does 25 dmg'],
  },
  {
    title: 'Worm',
    Icon: <ColorfullSquare size={30} color1={COLOR.PINK} />,
    description: ['Loops around the walls', '- Does 25 dmg'],
  },
  {
    title: 'Slime',
    Icon: <ColorfullSquare size={30} color1={COLOR.GREEN} />,
    description: ['Bounces around', '- Does 25 dmg'],
  },
  {
    title: 'Bomber',
    Icon: <ColorfullSquare size={30} color1={COLOR.ORANGE} color2={COLOR.RED} edge />,
    description: ['Hitting a wall causes an Explosion', '- Head: 25 dmg', '- Explosion: 45 dmg'],
  },
  {
    title: 'Venom',
    Icon: <ColorfullSquare size={30} color1={COLOR.PURPLE} />,
    description: [
      'Getting hit by it will apply Poison to you',
      '- Head: 10 dmg. If already poisoned it does 30 dmg instead',
      '- Poison Effect: Deals 3 dmg per second until you die',
    ],
  },
  {
    title: 'Titan',
    Icon: <ColorfullSquare size={30} color1={COLOR.DARK_BLUE} />,
    description: ['Grows in size steadily', '- Does 25 dmg'],
  },
  {
    title: 'Ghost',
    Icon: <ColorfullSquare size={30} color1={COLOR.LIGHT_GREY} />,
    description: ['Periodically becomes transparent', '- Does 25 dmg'],
  },
  {
    title: 'Shadow',
    Icon: <ColorfullSquare size={30} color1={COLOR.BLACK} />,
    description: [
      'Carries around an Aura that Applies Darkness',
      '- Does 25 dmg',
      '- When in Darkness the screen gets dimmer which makes it harder to see the Shadow Enemies',
    ],
  },
  {
    title: 'Glitch',
    Icon: <ColorfullSquare size={30} color1={COLOR.WHITE} />,
    description: ['Periodically morphs into a different enemy type', '- Exact copy of the morphed enemy'],
  },
  {
    title: 'Portal',
    Icon: <ColorfullSquare size={30} color1={COLOR.PORTAL_ORANGE} color2={COLOR.PORTAL_BLUE} />,
    description: ['Phases through the Right and Left walls', '- Does 25 dmg', '- Immune to Fear'],
  },
  {
    title: 'Magnet',
    Icon: <ColorfullSquare size={30} color1={COLOR.RED} color2={COLOR.LIGHT_BLUE} />,
    description: ['Carries a magnetic Aura that pulls you in', '- Does 25 dmg'],
  },
  {
    title: 'Hacker',
    Icon: <ColorfullSquare size={30} color2={COLOR.DARK_GREEN} color1={COLOR.VENOM} />,
    description: [
      'When hit you get Hacked',
      '- Does 25 dmg',
      '- Has completely random movement pattern but can be frightened',
      '- Hacked: disables your Augment',
    ],
  },
  {
    title: 'Inferno',
    Icon: <ColorfullSquare size={30} color2={COLOR.RED} color1={COLOR.YELLOW} />,
    description: [
      'Hitting a wall sets it briefly on fire',
      '- Head: 25 dmg',
      '- Firewall: 10 dmg twice per second while in the fire zone',
    ],
  },
  {
    title: 'Frosty',
    Icon: <ColorfullSquare size={30} color2={COLOR.DARK_BLUE} color1={COLOR.LIGHT_BLUE} />,
    description: ['Carries an Aura of Frost that slows you down', '- Does 25 dmg'],
  },
  {
    title: 'Reaper',
    Icon: <ColorfullSquare size={30} color2={COLOR.LIGHT_GREY} color1={COLOR.BLACK} />,
    description: [
      'Getting hit applies Deathmark',
      '- Head: No damage',
      '- Deathmark: After a delay you will receive a lethal amount of damage',
    ],
  },
  {
    title: 'Voidborn',
    Icon: <ColorfullSquare size={30} color2={COLOR.PURPLE} color1={COLOR.VENOM} />,
    description: ['Chooses an orbit to circle around', '- Does 25 dmg', '- Immune to Fear'],
  },
  {
    title: 'Scorpion',
    Icon: <ColorfullSquare size={30} color2={COLOR.ORANGE} color1={COLOR.RED} />,
    description: [
      'Resembles an ordinary enemy but carries a second Head on its tail',
      '- Head/Tail: 25 dmg',
      '- Immune to Fear',
    ],
  },
];

const augmentsContent: ContentType[] = [
  {
    Icon: <HealIcon style={{ width: 30, height: 30 }} />,
    title: ['Heal', '(Active x1)'],
    description: [
      'Heals for 35hp (Max Hp is 100)',
      '- Overhealing will cleanse all negative effects like Poison and Deathmark',
    ],
  },
  {
    Icon: <ImmunityIcon style={{ width: 30, height: 30 }} />,
    title: ['Immunity', '(Active x3)'],
    description: [
      'Grants damage immunity for 2 seconds and heals for 10hp',
      '- While immune you also cannot get Poisoned or Deathmarked',
    ],
  },
  {
    Icon: <RegenIcon style={{ width: 30, height: 30 }} />,
    title: 'Regeneration (Passive ∞)',
    description: [
      'Heals for 2hp every second and take 10% less damage',
      `- Damage reduction doesn't apply on Poison, Explosions, Deathmark and Burn effects`,
    ],
  },
  {
    Icon: <CureIcon style={{ width: 30, height: 30 }} />,
    title: ['Elixir of Vigor', '(Active x3)'],
    description: [
      'Cleanses all negative effects like Poison, Deathmark, and Frost/Darkness buildup',
      '- Also heals you 5hp + 5% of your missing hp + all the hp you lost from poison until then',
      '- Stored poison is reused for subsequent healing making Elixir stronger each time',
    ],
  },
  {
    Icon: <FearIcon style={{ width: 30, height: 30 }} />,
    title: ['Fear', '(Active x4)'],
    description: [
      'Scare all enemies and bullets away from you',
      '- Upon activation alleviates Frost/Darkness build up',
      `- Does not work on Bosses or on enemies like Portal, Voidborn, and Scorpion`,
      `- Very effective against Tracer and Hacker`,
    ],
  },
  {
    Icon: <VisionIcon style={{ width: 30, height: 30 }} />,
    title: 'Night Hunter (Passive ∞)',
    description: [
      'Applies a night vision filter on screen',
      '- Makes spotting Ghost & Shadow enemies easier',
      '- Increased resistance to Poison (66%) and Frost (50%)',
      '- Deathmark deals only 20dmg to you',
    ],
  },
  {
    Icon: <StabilizerIcon style={{ width: 30, height: 30 }} />,
    title: 'Stabilizer (Passive ∞)',
    description: [
      'Stabilized: You are immune to immobilizing effects and take 30% less damage',
      '- Immobilizing is any magnetic or slowing effect',
      `- Damage reduction doesn't apply on Poison, Explosions, Deathmark and Burn effects`,
    ],
  },
  {
    Icon: <PortalIcon style={{ width: 30, height: 30 }} />,
    title: 'Teleportation (Passive ∞)',
    description: ['You can pass through the left and right wall', '- You are briefly Stabilized after teleporting'],
  },
  {
    Icon: <CenterFocusWeakIcon style={{ width: 30, height: 30 }} />,
    title: 'Recall Beacon (Active ∞)',
    description: [
      'Press once to place a beacon. Press again to recall back to it',
      '- Recalling on top of a star fully heals you',
    ],
  },
  {
    Icon: <AngelIcon style={{ width: 30, height: 30 }} />,
    title: 'Guardian Angel (Passive x1)',
    description: [
      'The first time you are about to die, you gain 2 seconds of damage immunity instead',
      '- Raises your health to 35hp after saving you',
      '- Also cures Poison and alleviates Frost/Darkness build up',
    ],
  },
  {
    Icon: <BerserkIcon style={{ width: 30, height: 30 }} />,
    title: 'Berserk (Passive x1)',
    description: [
      'The first time you are about to die, your health gets instantly refilled, you scare the enemies away and you become Berserk',
      '- During Berserk your life burns until you die (~ 27s before you run out of HP)',
      '- During Berserk you take 60% less damage',
      '- During Berserk you are immune to Frost/Darkness build up',
      `- Damage reduction doesn't apply on Poison, Explosions, Deathmark and Burn effects`,
    ],
  },
  {
    Icon: <StopwatchIcon style={{ width: 30, height: 30 }} />,
    title: ['Stopwatch', ' (Active x1)', 'Rechargeable'],
    description: [
      'Slows down the time for the enemies for 3s and heals you for 40% of your missing hp',
      '- You are Stabilized during this duration',
      '- Collecting a star will recharge the augment',
    ],
  },
  {
    Icon: <WhatshotIcon style={{ width: 30, height: 30 }} />,
    title: 'Demon Soul (Passive ∞)',
    description: [
      'You receive 50% MORE damage from hitting enemies, but..',
      '- Poison heals you instead of damaging you',
      '- Deathmark heals you for 20hp instead of killing you',
      '- Increased resistance to Burn (60%) and Explosions (75%)',
    ],
  },
  {
    Icon: <SkullIcon style={{ width: 30, height: 30 }} />,
    title: 'Harvester (Passive ∞)',
    description: ['You only have 1hp but you get x10 the amount of the stars you collect', '- Aka: Hardcore mode'],
  },
];

const Wiki: React.FC<unknown> = () => {
  const { navigateBack } = useNavigateBack();
  const [tab, setTab] = React.useState(0);

  const { search } = useLocation();
  const query = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  useEffect(() => {
    const queryTab = query.get('queryTab');
    if (queryTab) {
      const newTab = Number(queryTab);
      if (newTab >= 0 && newTab <= 2) {
        setTab(newTab);
      }
    }
  }, [query]);
  const handleChange = (_event: React.ChangeEvent<unknown>, newValue: number) => {
    setTab(newValue);
  };

  const getListItem = (item: ContentType, index: number) => {
    return (
      <Box
        sx={{ display: 'grid', gridTemplateColumns: '40px 120px 1fr', color: '#ffffffDD', columnGap: 2 }}
        key={index}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {item.Icon ? item.Icon : <DescriptionIcon style={{ width: 30, height: 30 }} />}
        </Box>
        {item.title && (
          <Box sx={{ marginRight: 16, minWidth: 100, maxWidth: 100 }}>
            {typeof item.title === 'string' ? (
              <Typography>{item.title}</Typography>
            ) : (
              item.title.map((d, index) => <Typography key={index}>{d}</Typography>)
            )}
          </Box>
        )}
        <Box>
          {item.description.map((d, index) => (
            <Typography
              key={index}
              style={{
                color: (index !== 0 && !item.title) || !!item.title ? '#00AFA3' : '#ffffffDD',
              }}
            >
              {d}
            </Typography>
          ))}
        </Box>
      </Box>
    );
  };

  const getContent = () => {
    if (tab === 0) return generalContent.map((item, index) => getListItem(item, index));
    else if (tab === 1) return enemiesContent.map((item, index) => getListItem(item, index));
    else if (tab === 2) return augmentsContent.map((item, index) => getListItem(item, index));
  };

  return (
    <Box className={styles.root}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <Box sx={{ position: 'absolute', display: 'flex', width: '100%', justifyContent: 'center' }}>
            <Typography variant={'h5'} color={'primary'} sx={{ textAlign: 'center' }}>
              Wiki
            </Typography>
          </Box>
          <Box>
            <Tabs value={tab} onChange={handleChange} indicatorColor="primary">
              <Tab label="General" className={styles.tabs} />
              <Tab label="Enemies" className={styles.tabs} />
              <Tab label="Augments" className={styles.tabs} />
            </Tabs>
          </Box>
          <Box className={styles.mainContainer}>{getContent()}</Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CustomButton text={'BACK'} onClick={() => navigateBack('/Selection')} />
        </Box>
      </Box>
    </Box>
  );
};

export default Wiki;
