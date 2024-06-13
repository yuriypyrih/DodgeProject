import { Relic } from '../../types/Relic.ts';
import { RELIC_TYPE } from '../../enum/relic_type';
import { LEVEL_STATUS } from 'Models/enum/LEVEL_STATUS';
import HealIcon from '@mui/icons-material/Favorite';
import ImmunityIcon from '../../../assets/svg/relic_immunity.svg?react';
import RegenIcon from '@mui/icons-material/LocalHospital';
import CureIcon from '../../../assets/svg/relic_cure.svg?react';
import FearIcon from '../../../assets/svg/relic_fear.svg?react';
import VisionIcon from '../../../assets/svg/relic_vision.svg?react';
import PortalIcon from '../../../assets/svg/relic_portal.svg?react';
import BerserkIcon from '../../../assets/svg/relic_berserk.svg?react';
import AngelIcon from '../../../assets/svg/relic_angel.svg?react';
import StabilizerIcon from '../../../assets/svg/relic_stabilizer.svg?react';
import StopwatchIcon from '../../../assets/svg/stopwatch.svg?react';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import SkullIcon from 'assets/svg/skull.svg?react';
import BlockIcon from '@mui/icons-material/Block';
import { AUGMENTS } from '../../../lib/api/specs/api.ts';

export const relics: Relic[] = [
  {
    id: AUGMENTS.HACKED,
    name: 'None',
    type: RELIC_TYPE.HIDDEN,
    state: LEVEL_STATUS.UNLOCKED,
    max_uses: 0,
    cost: 0,
    Icon: BlockIcon,
    cooldown: -1,
  },
  {
    id: AUGMENTS.HEAL,
    name: 'Heal',
    type: RELIC_TYPE.ACTIVE,
    state: LEVEL_STATUS.LOCKED,
    max_uses: 1,
    cost: 1,
    Icon: HealIcon,
    cooldown: -1,
  },
  {
    id: AUGMENTS.IMMUNITY,
    name: 'Immunity',
    type: RELIC_TYPE.ACTIVE,
    state: LEVEL_STATUS.LOCKED,
    max_uses: 3,
    cost: 4,
    Icon: ImmunityIcon,
    cooldown: -1,
  },
  {
    id: AUGMENTS.REGENERATION,
    name: 'Regeneration',
    type: RELIC_TYPE.PASSIVE,
    state: LEVEL_STATUS.LOCKED,
    max_uses: Number.POSITIVE_INFINITY,
    cost: 4,
    Icon: RegenIcon,
    cooldown: -1,
  },
  {
    id: AUGMENTS.POISON_CURE,
    name: 'Elixir of Vigor',
    type: RELIC_TYPE.ACTIVE,
    state: LEVEL_STATUS.LOCKED,
    max_uses: 3,
    cost: 4,
    Icon: CureIcon,
    cooldown: -1,
  },
  {
    id: AUGMENTS.FEAR,
    name: 'Fear',
    type: RELIC_TYPE.ACTIVE,
    state: LEVEL_STATUS.LOCKED,
    max_uses: 4,
    cost: 4,
    Icon: FearIcon,
    cooldown: -1,
  },
  {
    id: AUGMENTS.NIGHT_VISION,
    name: 'Night Hunter',
    type: RELIC_TYPE.PASSIVE,
    state: LEVEL_STATUS.LOCKED,
    max_uses: Number.POSITIVE_INFINITY,
    cost: 6,
    Icon: VisionIcon,
    cooldown: -1,
  },
  {
    id: AUGMENTS.STABILIZER,
    name: 'Stabilizer',
    type: RELIC_TYPE.PASSIVE,
    state: LEVEL_STATUS.LOCKED,
    max_uses: Number.POSITIVE_INFINITY,
    cost: 6,
    Icon: StabilizerIcon,
    cooldown: -1,
  },
  {
    id: AUGMENTS.PORTAL,
    name: 'Teleportation',
    type: RELIC_TYPE.PASSIVE,
    state: LEVEL_STATUS.LOCKED,
    max_uses: Number.POSITIVE_INFINITY,
    cost: 6,
    Icon: PortalIcon,
    cooldown: -1,
  },
  {
    id: AUGMENTS.RECALL_BEACON,
    name: 'Recall Beacon',
    type: RELIC_TYPE.ACTIVE,
    state: LEVEL_STATUS.LOCKED,
    max_uses: Number.POSITIVE_INFINITY,
    cost: 6,
    Icon: CenterFocusWeakIcon,
    cooldown: -1,
  },
  {
    id: AUGMENTS.GUARDIAN_ANGEL,
    name: 'Guardian Angel',
    type: RELIC_TYPE.PASSIVE,
    state: LEVEL_STATUS.LOCKED,
    max_uses: 1,
    cost: 8,
    Icon: AngelIcon,
    cooldown: -1,
  },
  {
    id: AUGMENTS.BERSERK,
    name: 'Berserk',
    type: RELIC_TYPE.PASSIVE,
    state: LEVEL_STATUS.LOCKED,
    max_uses: 1,
    cost: 8,
    Icon: BerserkIcon,
    cooldown: -1,
  },
  {
    id: AUGMENTS.STOPWATCH,
    name: 'Stopwatch',
    type: RELIC_TYPE.ACTIVE,
    state: LEVEL_STATUS.LOCKED,
    max_uses: 1,
    cost: 8,
    Icon: StopwatchIcon,
    cooldown: -1,
  },
  {
    id: AUGMENTS.DEMON_SOUL,
    name: 'Demon Soul',
    type: RELIC_TYPE.PASSIVE,
    state: LEVEL_STATUS.LOCKED,
    max_uses: Number.POSITIVE_INFINITY,
    cost: 10,
    Icon: WhatshotIcon,
    cooldown: -1,
  },
  {
    id: AUGMENTS.HARVESTER,
    name: 'Harvester',
    type: RELIC_TYPE.PASSIVE,
    state: LEVEL_STATUS.LOCKED,
    max_uses: Number.POSITIVE_INFINITY,
    cost: 1,
    Icon: SkullIcon,
    cooldown: -1,
  },
];
