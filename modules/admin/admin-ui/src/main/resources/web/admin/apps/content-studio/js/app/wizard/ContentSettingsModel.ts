import {Content} from "../../../../../common/js/content/Content";
import {ComboBox} from "../../../../../common/js/ui/selector/combobox/ComboBox";
import {FormItemBuilder} from "../../../../../common/js/ui/form/FormItem";
import {FormItem} from "../../../../../common/js/ui/form/FormItem";
import {Equitable} from "../../../../../common/js/Equitable";
import {PropertyChangedEvent} from "../../../../../common/js/PropertyChangedEvent";
import {PrincipalKey} from "../../../../../common/js/security/PrincipalKey";
import {ObjectHelper} from "../../../../../common/js/ObjectHelper";
import {ContentBuilder} from "../../../../../common/js/content/Content";

export class ContentSettingsModel implements Equitable {

    private propertyChangedListeners: {(event: PropertyChangedEvent):void}[] = [];

    private owner: PrincipalKey;
    private language: string;

    public static PROPERTY_OWNER: string = 'owner';
    public static PROPERTY_LANG: string = 'language';

    constructor(content: Content) {
        this.language = content.getLanguage();
        this.owner = content.getOwner();
    }

    getOwner(): PrincipalKey {
        return this.owner;
    }

    setOwner(owner: PrincipalKey, silent?: boolean): ContentSettingsModel {
        if (!silent) {
            var event = new PropertyChangedEvent(ContentSettingsModel.PROPERTY_OWNER, this.owner, owner);
            this.notifyPropertyChanged(event);
        }
        this.owner = owner;
        return this;
    }

    getLanguage(): string {
        return this.language;
    }

    setLanguage(lang: string, silent?: boolean): ContentSettingsModel {
        if (!silent) {
            var event = new PropertyChangedEvent(ContentSettingsModel.PROPERTY_LANG, this.language, lang);
            this.notifyPropertyChanged(event);
        }
        this.language = lang;
        return this;
    }

    onPropertyChanged(listener: {(event: PropertyChangedEvent): void;}) {
        this.propertyChangedListeners.push(listener);
    }

    unPropertyChanged(listener: {(event: PropertyChangedEvent): void;}) {
        this.propertyChangedListeners =
            this.propertyChangedListeners.filter((curr) => (curr != listener));
    }

    private notifyPropertyChanged(event: PropertyChangedEvent) {
        this.propertyChangedListeners.forEach((listener) => listener(event));
    }

    equals(other: Equitable): boolean {
        if (!ObjectHelper.iFrameSafeInstanceOf(other, ContentSettingsModel)) {
            return false;
        } else {
            var otherModel = <ContentSettingsModel> other;
            return otherModel.owner == this.owner && otherModel.language == this.language;
        }
    }

    apply(builder: ContentBuilder) {
        builder.owner = this.owner;
        builder.language = this.language;
    }

}
