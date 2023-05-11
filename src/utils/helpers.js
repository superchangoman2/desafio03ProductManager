export const validateNumber = (number) => {
    return number && !isNaN(number) && number > 0;
  };