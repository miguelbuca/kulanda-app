export const getStock = (stock = []) => {
  let qtd = 0;

  stock?.map(({ quantity }) => {
    qtd = qtd + quantity;
  });

  return qtd;
};
