# Flow Cadut
## What is Cadut?
Cadut stands for **Cad**ence **Ut**ilities - it's a set of methods to interact 
with Flow Network. Originally it was meant to provide an easier way to 
operate with Cadence template files, but over time it branched into other areas:
- [Interactions](#Interactions)
- [Generators](#Generators)
- [Plugins](#Plugins)
- [Views](#Views)

## Interactions
Most of the Cadut methods are using current environment, which you can set with 
call to `setEnvironment` method. Then you have `executeScript/query` and 
`sendTransaction/mutate` pairs of methods to interact with Flow Network. 
The Biggest difference with "native" FCL `query/mutate` are automatic type 
resolvers for arguments. Cadut will infere the types from the script and 
prepare it for sending. 

## Generators
## Plugins
## Views