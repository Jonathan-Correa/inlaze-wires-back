export const asyncForEach = async (array: any[], callback: Function) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const generateToken = (): string => {
  const alph: string =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token: string = '';

  for (let i = 0; i < 20; i++) {
    const pos1 = Math.floor(Math.random() * alph.length);
    const pos2 = Math.floor(Math.random() * alph.length);

    token += alph[pos1];
    token += alph[pos2];
  }

  return token;
};
