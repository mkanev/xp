import {PropertyPath} from "../../data/PropertyPath";
import {PropertyArray} from "../../data/PropertyArray";
import {FormContext} from "../../form/FormContext";
import {Site} from "../site/Site";
import {Content} from "../Content";
import {ContentTypeName} from "../../schema/content/ContentTypeName";
import {ContentId} from "../ContentId";
import {ContentPath} from "../ContentPath";
import {Input} from "../../form/Input";
import {InputTypeViewContext} from "../../form/inputtype/InputTypeViewContext";
import {ContentInputTypeViewContext} from "./inputtype/ContentInputTypeViewContext";
import {FormContextBuilder} from "../../form/FormContext";

export class ContentFormContext extends FormContext {

        private site: Site;

        private parentContent: Content;

        private persistedContent: Content;

        private contentTypeName: ContentTypeName;

        constructor(builder: ContentFormContextBuilder) {
            super(builder);
            this.site = builder.site;
            this.parentContent = builder.parentContent;
            this.persistedContent = builder.persistedContent;
            if (builder.contentTypeName) {
                this.contentTypeName = builder.contentTypeName;
            } else if (builder.persistedContent) {
                this.contentTypeName = builder.persistedContent.getType();
            }
        }

        getSite(): Site {
            return this.site;
        }

        getContentId(): ContentId {
            return this.persistedContent != null ? this.persistedContent.getContentId() : null;
        }

        getContentPath(): ContentPath {
            return this.persistedContent != null ? this.persistedContent.getPath() : null;
        }

        getParentContentPath(): ContentPath {

            if (this.parentContent == null) {
                return ContentPath.ROOT;
            }

            return this.parentContent.getPath();
        }

        getPersistedContent(): Content {
            return this.persistedContent;
        }

        getContentTypeName(): ContentTypeName {
            return this.contentTypeName;
        }

        createInputTypeViewContext(inputTypeConfig: any, parentPropertyPath: PropertyPath,
                                   input: Input): InputTypeViewContext {

            return <ContentInputTypeViewContext> {
                formContext: this,
                input: input,
                inputConfig: inputTypeConfig,
                parentDataPath: parentPropertyPath,
                site: this.getSite(),
                content: this.getPersistedContent(),
                contentPath: this.getContentPath(),
                parentContentPath: this.getParentContentPath()
            };
        }

        static create(): ContentFormContextBuilder {
            return new ContentFormContextBuilder();
        }
    }

    export class ContentFormContextBuilder extends FormContextBuilder {

        site: Site;

        parentContent: Content;

        persistedContent: Content;

        contentTypeName: ContentTypeName;

        public setSite(value: Site): ContentFormContextBuilder {
            this.site = value;
            return this;
        }

        public setParentContent(value: Content): ContentFormContextBuilder {
            this.parentContent = value;
            return this;
        }

        public setPersistedContent(value: Content): ContentFormContextBuilder {
            this.persistedContent = value;
            return this;
        }

        public setContentTypeName(value: ContentTypeName): ContentFormContextBuilder {
            this.contentTypeName = value;
            return this;
        }

        public build(): ContentFormContext {
            return new ContentFormContext(this);
        }
    }
