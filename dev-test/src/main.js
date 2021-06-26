import flow from "./generated";

(async () => {
  //const result = await registry.scripts.log({ args: ["Hello"] });
  //const [result, err] = await registry.scripts.panic({});
  const [result, err] = await flow.scripts.metadata({ args: [{ name: "Cadence" }] });
  console.log({ result, err });
  console.log("Done");
})();
