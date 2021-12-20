import { getView } from "./manage";

const fetchView = async (address, view, setData) => {
  setData([]);
  const [data] = await getView(view, address);
  setData(data);
};

export const makeViewHook = (useState, useEffect) => (view, address) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchView(address, view, setData);
  }, [view, address]);

  return data;
};
