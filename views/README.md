# How to Create View
`View` is an asynchronous function, which returns object with 3 fields:
- `name` - unique name of the project, will be used to mark data from that strategy in combined call
- `getData` - asynchronous method called to get all the necessary steps to collect data from network
- `formatData` - synchronouse method to format data for user consumption
