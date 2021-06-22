import registry from "./generated";

(async () => {
  //const result = await registry.scripts.log({ args: [12] });
  const result = await registry.scripts.panic({});
  console.log({ result });
  console.log("Done");
})();
