import { Board } from '../model/Board';

export const T0 = 0;
export const T1 = 24 * 60;
export const T2 = 2 * 24 * 60;

export function getDate(board: Board): Date {
  return getDateForMode(getMode(board));
}

export function getDateForMode(mode: number): Date {
  const date = new Date();
  date.setMinutes(mode + date.getMinutes() - date.getTimezoneOffset());
  return date;
}

export function formattedDate(board: Board): string {
  return getDate(board).toJSON().slice(0, 10);
}

function getMode(board: Board): number {
  //TODO some security can support different modes

  return T2;
}