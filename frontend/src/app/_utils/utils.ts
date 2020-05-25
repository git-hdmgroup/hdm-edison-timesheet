export const toMilliseconds = (unit: 'h' | 'm' | 's', value) => {
  switch (unit) {
    case 'h': return value * 60 * 60 * 1000;
    case 'm': return value * 60 * 1000;
    case 's': return value * 1000;
  }
};

export const fromMilliseconds = (unit: 'h' | 'm' | 's', value) => {
  switch (unit) {
    case 'h': return value / 60 / 60 / 1000;
    case 'm': return value / 60 / 1000;
    case 's': return value / 1000;
  }
};
