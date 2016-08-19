import {FormJson} from "../../form/json/FormJson";
import {ContentTypeSummaryJson} from "./ContentTypeSummaryJson";

export interface ContentTypeJson extends ContentTypeSummaryJson {

        form: FormJson;
    }
