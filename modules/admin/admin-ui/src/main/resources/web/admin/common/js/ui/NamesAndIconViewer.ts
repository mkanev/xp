import {Viewer} from "./Viewer";
import {NamesAndIconView} from "../app/NamesAndIconView";
import {NamesAndIconViewSize} from "../app/NamesAndIconViewSize";
import {NamesAndIconViewBuilder} from "../app/NamesAndIconView";
import {ContentUnnamed} from "../content/ContentUnnamed";
import {StringHelper} from "../util/StringHelper";
import {Name} from "../Name";

/**
     * A parent class capable of viewing a given object with names and icon.
     */
    export class NamesAndIconViewer<OBJECT> extends Viewer<OBJECT> {

        static EMPTY_DISPLAY_NAME: string = "<Display Name>";

        private namesAndIconView: NamesAndIconView;

        private relativePath: boolean;

        private size: NamesAndIconViewSize;

        public static debug: boolean = false;

        constructor(className?: string, size: NamesAndIconViewSize = NamesAndIconViewSize.small) {
            super(className);

            this.size = size;
        }

        setObject(object: OBJECT, relativePath: boolean = false) {
            this.relativePath = relativePath;
            return super.setObject(object);
        }


        doLayout(object: OBJECT) {
            super.doLayout(object);

            if (NamesAndIconViewer.debug) {
                console.debug("NamesAndIconViewer.doLayout");
            }

            if (!this.namesAndIconView) {
                this.namesAndIconView = new NamesAndIconViewBuilder().setSize(this.size).build();
                this.appendChild(this.namesAndIconView);
            }

            if (object) {
                const displayName = this.resolveDisplayName(object) || this.normalizeDisplayName(this.resolveUnnamedDisplayName(object));
                const subName = this.resolveSubName(object, this.relativePath) || ContentUnnamed.prettifyUnnamed();
                const subTitle = this.resolveSubTitle(object);
                const iconClass = this.resolveIconClass(object);
                const iconUrl = this.resolveIconUrl(object);

                this.namesAndIconView.setMainName(displayName)
                    .setSubName(subName, subTitle)
                    .setIconClass(iconClass);

                if (iconUrl) {
                    this.namesAndIconView.setIconUrl(iconUrl);
                }
            }
        }

        private normalizeDisplayName(displayName: string): string {
            if (StringHelper.isEmpty(displayName)) {
                return NamesAndIconViewer.EMPTY_DISPLAY_NAME;
            } else {
                return ContentUnnamed.prettifyUnnamed(displayName);
            }
        }

        resolveDisplayName(object: OBJECT): string {
            return "";
        }

        resolveUnnamedDisplayName(object: OBJECT): string {
            return "";
        }

        resolveSubName(object: OBJECT, relativePath: boolean = false): string {
            return "";
        }

        resolveSubTitle(object: OBJECT): string {
            return "";
        }

        resolveIconClass(object: OBJECT): string {
            return "";
        }

        resolveIconUrl(object: OBJECT): string {
            return "";
        }

        getPreferredHeight(): number {
            return 50;
        }

        getNamesAndIconView(): NamesAndIconView {
            return this.namesAndIconView;
        }
    }
