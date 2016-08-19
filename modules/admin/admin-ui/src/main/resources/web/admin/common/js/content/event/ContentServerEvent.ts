import {NodeServerEvent} from "../../event/NodeServerEvent";
import {NodeEventJson} from "../../event/NodeServerEvent";
import {ContentServerChange} from "./ContentServerChange";

export class ContentServerEvent extends NodeServerEvent {

        constructor(change: ContentServerChange) {
            super(change);
        }

        getNodeChange(): ContentServerChange {
            return <ContentServerChange>super.getNodeChange();
        }

        static is(eventJson: NodeEventJson): boolean {
            return eventJson.data.nodes.some(node => node.path.indexOf("/content") == 0);
        }

        static fromJson(nodeEventJson: NodeEventJson): ContentServerEvent {
            var change = ContentServerChange.fromJson(nodeEventJson);
            return new ContentServerEvent(change);
        }
    }
