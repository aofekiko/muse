import { LightstreamerClient, Subscription } from 'lightstreamer-client-node'

export var piss_percent: string;

export default class {
    public lsClient: LightstreamerClient | null = null;

    constructor() {
        this.lsClient = null;
    }

    startup(): void {
        this.lsClient = new LightstreamerClient("https://push.lightstreamer.com/", "ISSLIVE");
        this.lsClient.addListener({
            onStatusChange: function (newStatus) {
                console.log(newStatus);
            }
        });

        this.lsClient.connect();

        var SCHEMA = ["TimeStamp", "Value", "Status.Class", "Status.Indicator", "Status.Color", "CalibratedData"];
        var DEFAULT_SUBSCRIPTIONS = ["NODE3000005"];

        for (var i = 0; i < DEFAULT_SUBSCRIPTIONS.length; i++) {
            var itemName = DEFAULT_SUBSCRIPTIONS[i];
            console.log("Subscribing " + itemName);
            var mySubscription = new Subscription("MERGE", itemName, SCHEMA);
            mySubscription.setRequestedSnapshot("yes");
            mySubscription.setRequestedMaxFrequency(0.5);
            mySubscription.addListener({
                onSubscription: function () {
                    console.log("SUBSCRIBED");
                },
                onUnsubscription: function () {
                    console.log("UNSUBSCRIBED");
                },
                onItemUpdate: function (obj) {
                    console.log(obj.getValue("TimeStamp") + ": " + obj.getValue("Value"));
                    piss_percent = obj.getValue("Value");
                }
            });
            this.lsClient.subscribe(mySubscription);
        }
    }
}