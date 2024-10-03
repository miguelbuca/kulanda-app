export const getMainIcon = (
  isSelected: boolean,
  type?: keyof typeof StoreSaleEnumType
) => {
  let icon = "home";

  if (type === "SERVICE") icon = "business";
  else if(type === 'PRODUCT') icon = "storefront"

  return isSelected ? icon : icon + "-outline";
};
