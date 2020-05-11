import { showModal } from './modal';
import { createFighterImage } from '../fighterPreview';
import { fight } from '../fight';

export function showWinnerModal(fighter) {
  // call showModal function
  showModal({ title: 'WINNER', bodyElement: fighter.name });
}
