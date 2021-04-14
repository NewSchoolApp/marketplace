export const ErrorEnum = {
  WRONG_FILE_EXTENSION: {
    message: 'Extensão de arquivo errada',
    errorCode: 'WRONG_FILE_EXTENSION',
  },
  ITEM_NOT_FOUND: {
    message: 'Item not found',
    errorCode: 'ITEM_NOT_FOUND',
  },
  NOT_IN_STOCK: {
    message: 'Item not in stock',
    errorCode: 'NOT_IN_STOCK',
  },
  NOT_ENOUGH_POINTS: {
    message: 'Not enought points',
    errorCode: 'NOT_ENOUGH_POINTS',
  },
};

export type ErrorEnumKey = keyof typeof ErrorEnum;
