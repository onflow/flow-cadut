export const prepareView = async (strategy, address) => {
  const { mapData, getData } = strategy(address);

  return {
    resolve: async () => {
      const [data, err] = await getData();
      if (err) {
        return [null, err];
      }
      return [data.map(mapData), null];
    },
  };
};

export const getView = async (strategy, address) => {
  const view = await prepareView(strategy, address);
  return view.resolve();
};
