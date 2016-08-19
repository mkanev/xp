import {NodeEventJson} from "../../event/NodeServerEvent";
import {NodeEventNodeJson} from "../../event/NodeServerEvent";
import {NodeServerChange} from "../../event/NodeServerChange";
import {NodeServerChangeType} from "../../event/NodeServerChange";
import {NodeServerChangeItem} from "../../event/NodeServerChange";
import {ContentId} from "../ContentId";
import {ContentPath} from "../ContentPath";

export class ContentServerChangeItem extends NodeServerChangeItem<ContentPath> {

        contentId: ContentId;

        constructor(contentPath: ContentPath, branch: string, contentId: ContentId) {
            super(contentPath, branch);
            this.contentId = contentId;
        }

        getContentId(): ContentId {
            return this.contentId;
        }

        static fromJson(node: NodeEventNodeJson): ContentServerChangeItem {
            return new ContentServerChangeItem(ContentPath.fromString(node.path.substr("/content".length)),
                node.branch, new ContentId(node.id));
        }
    }

    export class ContentServerChange extends NodeServerChange<ContentPath> {

        protected changeItems: ContentServerChangeItem[];

        protected newContentPaths: ContentPath[];

        constructor(type: NodeServerChangeType, changeItems: ContentServerChangeItem[], newContentPaths?: ContentPath[]) {
            super(type, changeItems, newContentPaths);
        }

        getChangeItems(): ContentServerChangeItem[] {
            return <ContentServerChangeItem[]>this.changeItems;
        }

        getNewContentPaths(): ContentPath[] {
            return this.newContentPaths;
        }

        toString(): string {
            return NodeServerChangeType[this.type] + ": <" +
                   this.changeItems.map((item) => item.getPath().toString()).join(", ") + !!this.newContentPaths
                ? this.newContentPaths.map((contentPath) => contentPath.toString()).join(", ")
                : "" +
                  ">";
        }

        static fromJson(nodeEventJson: NodeEventJson): ContentServerChange {

            var changeItems = nodeEventJson.data.nodes.
                filter((node) => node.path.indexOf("/content") === 0).
                map((node: NodeEventNodeJson) => ContentServerChangeItem.fromJson(node));

            if (changeItems.length === 0) {
                return null;
            }

            let nodeEventType = this.getNodeServerChangeType(nodeEventJson.type);

            if (NodeServerChangeType.MOVE == nodeEventType || NodeServerChangeType.RENAME == nodeEventType) {

                var newContentPaths = nodeEventJson.data.nodes.
                    filter((node) => node.newPath.indexOf("/content") === 0).
                    map((node: NodeEventNodeJson) => ContentPath.fromString(node.newPath.substr("/content".length)));

                return new ContentServerChange(nodeEventType, changeItems, newContentPaths);
            } else {
                return new ContentServerChange(nodeEventType, changeItems);
            }
        }
    }
