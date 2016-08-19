import {Form} from "../../../form/Form";
import {FormBuilder} from "../../../form/Form";
import {OccurrencesBuilder} from "../../../form/Occurrences";
import {TextLine} from "../../../form/inputtype/text/TextLine";
import {TextArea} from "../../../form/inputtype/text/TextArea";
import {PropertyTree} from "../../../data/PropertyTree";
import {PropertyEvent} from "../../../data/PropertyEvent";
import {Equitable} from "../../../Equitable";
import {Cloneable} from "../../../Cloneable";
import {ContentId} from "../../ContentId";
import {InputBuilder} from "../../../form/Input";
import {ObjectHelper} from "../../../ObjectHelper";
import {Component} from "./Component";
import {ComponentBuilder} from "./Component";
import {ComponentName} from "./ComponentName";
import {ComponentTypeWrapperJson} from "./ComponentTypeWrapperJson";
import {ImageComponentJson} from "./ImageComponentJson";
import {ImageComponentType} from "./ImageComponentType";
import {Region} from "./Region";

export class ImageComponent extends Component implements Equitable, Cloneable {

        public static PROPERTY_IMAGE = 'image';

        public static PROPERTY_CONFIG = 'config';

        public static debug: boolean = false;

        private disableEventForwarding: boolean;

        private image: ContentId;

        private config: PropertyTree;

        private form: Form;

        private configChangedHandler: (event: PropertyEvent) => void;

        constructor(builder: ImageComponentBuilder) {
            super(builder);

            this.image = builder.image;
            this.config = builder.config;
            this.configChangedHandler = (event: PropertyEvent) => {
                if (ImageComponent.debug) {
                    console.debug("ImageComponent[" + this.getPath().toString() + "].config.onChanged: ", event);
                }
                if (!this.disableEventForwarding) {
                    this.notifyPropertyValueChanged(ImageComponent.PROPERTY_CONFIG);
                }
            };

            this.config.onChanged(this.configChangedHandler);

            var formBuilder = new FormBuilder();
            formBuilder.addFormItem(new InputBuilder().
                setName("caption").
                setInputType(TextArea.getName()).
                setLabel("Caption").
                setOccurrences(new OccurrencesBuilder().setMinimum(0).setMaximum(1).build()).
                build());
            this.form = formBuilder.build();
        }

        setDisableEventForwarding(value: boolean) {
            this.disableEventForwarding = value;
        }

        getImage(): ContentId {
            return this.image;
        }

        getForm(): Form {
            return this.form;
        }

        getConfig(): PropertyTree {
            return this.config;
        }

        setImage(contentId: ContentId, name: string) {
            var oldValue = this.image;
            this.image = contentId;

            this.setName(name ? new ComponentName(name) : this.getType().getDefaultName());

            if (!ObjectHelper.equals(oldValue, contentId)) {
                this.notifyPropertyChanged(ImageComponent.PROPERTY_IMAGE);
            }
        }

        hasImage(): boolean {
            return !!this.image;
        }

        doReset() {
            this.setImage(null, null);
        }

        isEmpty(): boolean {
            return !this.image;
        }

        toJson(): ComponentTypeWrapperJson {

            var json: ImageComponentJson = <ImageComponentJson>super.toComponentJson();
            json.image = this.image != null ? this.image.toString() : null;
            json.config = this.config != null ? this.config.toJson() : null;

            return <ComponentTypeWrapperJson> {
                ImageComponent: json
            };
        }

        equals(o: Equitable): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, ImageComponent)) {
                return false;
            }

            var other = <ImageComponent>o;

            if (!super.equals(o)) {
                return false;
            }

            if (!ObjectHelper.equals(this.image, other.image)) {
                return false;
            }

            if (!ObjectHelper.equals(this.config, other.config)) {
                return false;
            }

            return true;
        }

        clone(): ImageComponent {
            return new ImageComponentBuilder(this).build();
        }
    }

    export class ImageComponentBuilder extends ComponentBuilder<ImageComponent> {

        image: ContentId;

        config: PropertyTree;

        constructor(source?: ImageComponent) {
            super(source);
            if (source) {
                this.image = source.getImage();
                this.config = source.getConfig() ? source.getConfig().copy() : null;
            } else {
                this.config = new PropertyTree();
            }
            this.setType(ImageComponentType.get());
        }

        public setImage(value: ContentId): ImageComponentBuilder {
            this.image = value;
            return this;
        }

        public setConfig(value: PropertyTree): ImageComponentBuilder {
            this.config = value;
            return this;
        }

        public fromJson(json: ImageComponentJson, region: Region): ImageComponentBuilder {

            if (json.image) {
                this.setImage(new ContentId(json.image));
            }

            this.setName(json.name ? new ComponentName(json.name) : null);


            if (json.config) {
                this.setConfig(PropertyTree.fromJson(json.config));
            }

            this.setParent(region);

            return this;
        }

        public build(): ImageComponent {
            return new ImageComponent(this);
        }
    }
