import {Equitable} from "../../Equitable";
import {ViewItem} from "../view/ViewItem";
import {ObjectHelper} from "../../ObjectHelper";

export class BrowseItem<M extends Equitable> implements Equitable {

        private model: M;

        private id: string;

        private displayName: string;

        private path: string;

        private iconUrl;

        private iconClass: string;

        private renderable: boolean;

        constructor(model: M) {
            this.model = model;
        }

        setId(value: string): BrowseItem<M> {
            this.id = value;
            return this;
        }

        setDisplayName(value: string): BrowseItem<M> {
            this.displayName = value;
            return this;
        }

        setPath(value: string): BrowseItem<M> {
            this.path = value;
            return this;
        }

        setIconUrl(value: string): BrowseItem<M> {
            this.iconUrl = value;
            return this;
        }

        setIconClass(iconClass: string): BrowseItem<M> {
            this.iconClass = iconClass;
            return this;
        }

        setRenderable(value: boolean): BrowseItem<M> {
            this.renderable = value;
            return this;
        }

        getIconClass(): string {
            return this.iconClass;
        }
        getModel(): M {
            return this.model;
        }

        getId(): string {
            return this.id;
        }

        getDisplayName(): string {
            return this.displayName;
        }

        getPath(): string {
            return this.path;
        }

        getIconUrl(): string {
            return this.iconUrl;
        }

        isRenderable(): boolean {
            return this.renderable;
        }

        toViewItem(): ViewItem<M> {
            return new ViewItem<M>(this.model)
                .setIconUrl(this.iconUrl)
                .setIconClass(this.iconClass)
                .setDisplayName(this.displayName)
                .setPath(this.path)
                .setRenderable(this.isRenderable());
        }

        equals(o: Equitable): boolean {
            if (!ObjectHelper.iFrameSafeInstanceOf(o, BrowseItem)) {
                return false;
            }
            var other = <BrowseItem<M>> o;
            return this.model.equals(other.model) &&
                   this.displayName == other.displayName &&
                   this.path == other.path &&
                   this.iconUrl == other.iconUrl && this.iconClass == other.iconClass;
        }
    }

