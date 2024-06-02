import { postRequest } from '../index';
import { AUGMENTS } from '../../specs/api.ts';

export const beatLevelRequest = (cypher: string) => {
  return postRequest('/game/beatLevel', { cypher });
};

export const unlockLevelRequest = (body: { unlockLevel: string; cost: number }) => {
  return postRequest('/game/unlockLevel', { ...body });
};

export const unlockAugmentRequest = (body: { augment: string; cost: number }) => {
  return postRequest('/game/unlockAugment', { ...body });
};

export const selectAugmentRequest = (body: { augment: AUGMENTS }) => {
  return postRequest('/game/selectAugment', { ...body });
};
