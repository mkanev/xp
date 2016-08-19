import {TextComponentView} from "./TextComponentView";
import {NamesAndIconViewer} from "../../ui/NamesAndIconViewer";
import {TextComponent} from "../../content/page/region/TextComponent";
import {ItemViewIconClassResolver} from "../ItemViewIconClassResolver";
import {ItemView} from "../ItemView";

export class TextComponentViewer extends NamesAndIconViewer<TextComponent> {

        constructor() {
            super();
        }

        resolveDisplayName(object: TextComponent, componentView?: TextComponentView): string {
            if (componentView) {
                return this.extractTextFromTextComponentView(componentView) || componentView.getName();
            }
            else {
                return object.getText();
            }
        }

        resolveSubName(object: TextComponent, relativePath: boolean = false): string {
            return object.getPath() ? object.getPath().toString() : '';
        }

        resolveIconClass(object: TextComponent): string {
            return ItemViewIconClassResolver.resolveByType("text");
        }

        private extractTextFromTextComponentView(object: ItemView): string {
            return wemjq(object.getHTMLElement()).text().trim();
        }
    }

