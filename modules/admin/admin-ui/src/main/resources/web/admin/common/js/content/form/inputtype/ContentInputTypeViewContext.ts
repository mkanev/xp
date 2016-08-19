import {InputTypeViewContext} from "../../../form/inputtype/InputTypeViewContext";
import {ContentFormContext} from "../ContentFormContext";
import {Site} from "../../site/Site";
import {ContentSummary} from "../../ContentSummary";
import {ContentPath} from "../../ContentPath";

export interface ContentInputTypeViewContext extends InputTypeViewContext {

        formContext: ContentFormContext;

        site: Site;

        content: ContentSummary;

        contentPath: ContentPath;

        parentContentPath: ContentPath;
    }
