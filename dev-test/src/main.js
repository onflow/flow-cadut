import registry from "./generated";

(async () => {
  //const result = await registry.scripts.log({ args: ["Hello"] });
  const [result, err] = await registry.scripts.panic({});
  console.log({ result, err});
  console.log("Done");
})();
