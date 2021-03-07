export enum OrderStatusEnum {
  // Status inicial usado caso o item seja um produto e não tenha data de retirada
  SEPARATING = 'SEPARATING',
  // Segundo Status usado caso o item seja um produto e não tenha data de retirada
  SENT = 'SENT',

  // Status inicial usado caso o item seja um produto e tenha data de retirada
  WAITING_FOR_WITHDRAWL = 'WAITING_FOR_WITHDRAWL',

  // Status inicial usado caso o item seja um serviço
  NOTIFYING_COMPANY = 'NOTIFYING_COMPANY',
  // Segundo Status usado caso o item seja um serviço
  SENT_TO_COMPANY = 'SENT_TO_PROVIDER',

  // Status final
  DONE = 'DONE',
  // Pedido cancelado por motivos como
  // 1- Pedido não tem a quantidade necessária
  // 2- Usuário não tem a quantidade de pontos necessária pra fazer a transação
  // 3- Pedido cancelado pelo administrador
  CANCELED = 'CANCELED',
}
