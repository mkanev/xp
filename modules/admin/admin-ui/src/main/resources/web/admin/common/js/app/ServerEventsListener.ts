import {ContentServerEvent} from "../content/event/ContentServerEvent";
import {ServerEventsConnection} from "./ServerEventsConnection";
import {App} from "./Application";
import {Event} from "../event/Event";
import {BatchContentServerEvent} from "../content/event/BatchContentServerEvent";
import {ObjectHelper} from "../ObjectHelper";
import {ServerEventAggregator} from "./ServerEventAggregator";

export class ServerEventsListener {

        private serverEventsConnection: ServerEventsConnection;
        private applications: App[];
        private aggregator: ServerEventAggregator;

        constructor(applications: App[]) {
            this.applications = applications;
            this.serverEventsConnection = ServerEventsConnection.getInstance();
            this.serverEventsConnection.onServerEvent((event: Event) => this.onServerEvent(event));
            this.aggregator = new ServerEventAggregator();

            this.aggregator.onBatchIsReady(() => {

                var event = new BatchContentServerEvent(<ContentServerEvent[]>this.aggregator.getEvents(), this.aggregator.getType());
                this.fireEvent(event);

                this.aggregator.resetEvents();
            });
        }

        start() {
            this.serverEventsConnection.connect();
        }

        stop() {
            this.serverEventsConnection.disconnect();
        }

        onConnectionLost(listener: () => void) {
            this.serverEventsConnection.onConnectionLost(listener);
        }

        unConnectionLost(listener: () => void) {
            this.serverEventsConnection.unConnectionLost(listener);
        }

        onConnectionRestored(listener: () => void) {
            this.serverEventsConnection.onConnectionRestored(listener);
        }

        unConnectionRestored(listener: () => void) {
            this.serverEventsConnection.unConnectionRestored(listener);
        }

        private onServerEvent(event: Event) {
            if (!ObjectHelper.iFrameSafeInstanceOf(event, ContentServerEvent)) {
                this.fireEvent(event)
            } else {
                this.aggregator.appendEvent(<ContentServerEvent>event);
            }
        }

        private fireEvent(event: Event) {
            this.applications.forEach((application)=> {
                var appWindow = application.getWindow();
                if (appWindow) {
                    event.fire(appWindow);
                }
            });
        }


    }

