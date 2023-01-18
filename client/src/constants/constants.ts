
// TODO consider moving these to shared folder (besides host), and using them for express' routes

export const Api = Object.freeze({
    Host: "http://127.0.0.1:5001",
    Path: Object.freeze({
        Player: "/Player",
        BookAccount: "/BookAccount",
        BookSession: "/BookSession"
    }),
});

export const ActionType = Object.freeze({
    Get: "/Get",
    Add: "/Add",
    Update: "/Update",
    Remove: "/Remove",
    List: "/List",
    StartSession: "/StartSession",
    GetSession: "/GetSession",
    ListSessions: "/ListSessions",
    CreateAccount: "/CreateAccount",
    ScrapeLines: "/ScrapeLines",
    PlaceBet: "/PlaceBet",
    EndSession: "/EndSession",
    EndSessions: "/EndSessions"
});