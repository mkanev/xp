import {FragmentComponent} from "./FragmentComponent";
import {FragmentComponentJson} from "./FragmentComponentJson";
import {ImageComponent} from "./ImageComponent";
import {ImageComponentJson} from "./ImageComponentJson";
import {LayoutComponent} from "./LayoutComponent";
import {LayoutComponentJson} from "./LayoutComponentJson";
import {PartComponent} from "./PartComponent";
import {PartComponentJson} from "./PartComponentJson";
import {TextComponent} from "./TextComponent";
import {TextComponentJson} from "./TextComponentJson";

export interface ComponentTypeWrapperJson {

        ImageComponent?:ImageComponentJson;

        PartComponent?:PartComponentJson;

        TextComponent?:TextComponentJson;

        LayoutComponent?:LayoutComponentJson;

        FragmentComponent?:FragmentComponentJson;
    }
