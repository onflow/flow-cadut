# Plugin System
In order to provide better support and allow seamless integration to other libraries (i.e. FIND) we've added `Plugin System`.

Currently, supported plugin types are:
- `arguments`

# Development
You can create your own plugins - in most simple case it's an object with `id`, `type` and `resolver` function, which 
transforms input and returns value in a specific format.

Below you can find specifications for different plugin types.

## Argument Resolver
Argument Resolver plugin