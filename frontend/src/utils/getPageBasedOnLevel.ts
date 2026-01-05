export const getPageBasedOnLevel = (level?: number): number => {
  let page = 1;
  if (!level) {
    page = 1;
  } else if (level <= 12) {
    page = 1;
  } else if (level <= 24) {
    page = 2;
  } else if (level <= 27) {
    page = 3;
  } else if (level <= 39) {
    page = 4;
  } else if (level <= 42) {
    page = 5;
  }

  return page;
};
