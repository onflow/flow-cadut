export const prepareView = async (view, address) => {
  const { mapData, getData, name } = view(address);

  return {
    name,
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

export const resolveView = async (preparedView, onChange) => {
  const { name, blink } = preparedView;
  const [data] = await blink();
  onChange(name, data);
};

export const getDisplay = async (views, address, onChange = null) => {
  const panels = [];
  for (let i = 0; i < views.length; i++) {
    const view = views[i];
    const panel = await prepareView(view, address);
    panels.push(panel);
  }

  const promised = await Promise.all(
    panels.map(async ({ name, blink }) => {
      const [data] = await blink();
      if (onChange) {
        onChange(name, data);
      }
      return data;
    })
  );

  return promised.reduce((acc, item, i) => {
    acc[panels[i].name] = item;
    return acc;
  }, {});
};
