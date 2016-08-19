import {ContentId} from "../../../content/ContentId";
import {ContentPath} from "../../../content/ContentPath";
import {ContentSummary} from "../../../content/ContentSummary";
import {ApplicationKey} from "../../../application/ApplicationKey";
import {Event} from "../../../event/Event";
import {ClassHelper} from "../../../ClassHelper";

export enum HtmlAreaDialogType {
        ANCHOR, IMAGE, LINK, MACRO
    }

    export class CreateHtmlAreaDialogEvent extends Event {

        private config: any;

        private type: HtmlAreaDialogType;

        private content: ContentSummary;

        private contentPath: ContentPath;

        private applicationKeys: ApplicationKey[];

        constructor(builder: HtmlAreaDialogShownEventBuilder) {
            super();

            this.config = builder.config;
            this.type = builder.type;
            this.content = builder.content;
            this.contentPath = builder.contentPath;
            this.applicationKeys = builder.applicationKeys;
        }

        getConfig(): any {
            return this.config;
        }

        getType(): HtmlAreaDialogType {
            return this.type;
        }

        getContent(): ContentSummary {
            return this.content;
        }

        getContentPath(): ContentPath {
            return this.contentPath;
        }

        getApplicationKeys(): ApplicationKey[] {
            return this.applicationKeys;
        }

        static create(): HtmlAreaDialogShownEventBuilder {
            return new HtmlAreaDialogShownEventBuilder();
        }

        static on(handler: (event: CreateHtmlAreaDialogEvent) => void, contextWindow: Window = window) {
            Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
        }

        static un(handler?: (event: CreateHtmlAreaDialogEvent) => void, contextWindow: Window = window) {
            Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
        }
    }

    export class HtmlAreaDialogShownEventBuilder {

        config: any;

        type: HtmlAreaDialogType;

        content: ContentSummary;

        contentPath: ContentPath;

        applicationKeys: ApplicationKey[];

        setContent(content: ContentSummary): HtmlAreaDialogShownEventBuilder {
            this.content = content;
            return this;
        }

        setContentPath(contentPath: ContentPath): HtmlAreaDialogShownEventBuilder {
            this.contentPath = contentPath;
            return this;
        }

        setType(type: HtmlAreaDialogType): HtmlAreaDialogShownEventBuilder {
            this.type = type;
            return this;
        }

        setConfig(config: any): HtmlAreaDialogShownEventBuilder {
            this.config = config;
            return this;
        }

        setApplicationKeys(applicationKeys: ApplicationKey[]): HtmlAreaDialogShownEventBuilder {
            this.applicationKeys = applicationKeys;
            return this;
        }

        build(): CreateHtmlAreaDialogEvent {

            return new CreateHtmlAreaDialogEvent(this);
        }
    }
