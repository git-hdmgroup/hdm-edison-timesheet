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

export const booleanToNumber = (value) => {

  switch (value) {
    case undefined: return value;
    case true: return 1;
    case false: return 0;
  }
};

