pub contract Basic{
    pub let message: String
    init(){
        log("Basic deployed")
        self.message = "Hello, Cadence!"
    }
}