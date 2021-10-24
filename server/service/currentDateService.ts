import { Board } from '../model/Board';

const T0 = 0;
const T1 = 24 * 60;
const T2 = 2 * 24 * 60;

export function getDate(board: Board): Date {
  const date = new Date();
  date.setMinutes(getMode(board) + date.getMinutes() - date.getTimezoneOffset());
  return date;
}

export function formattedDate(board: Board): string {
  return getDate(board).toJSON().slice(0, 10);
}

function getMode(board: Board): number {
  //TODO some security can support different modes

  return T2;
}