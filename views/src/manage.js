export const prepareView = async (view, address) => {
  const { mapData, getData } = view(address);

  return {
    blink: async () => {
      const [data, err] = await getData();
      if (err) {
        return [null, err];
      }
      return [data.map(mapData), null];
    },
  };
};

export const getView = async (view, address) => {
  const eyes = await prepareView(view, address);
  return eyes.blink();
};
