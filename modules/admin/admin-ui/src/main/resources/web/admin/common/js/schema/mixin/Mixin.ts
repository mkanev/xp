import {Schema} from "../Schema";
import {Equitable} from "../../Equitable";
import {FormItem} from "../../form/FormItem";
import {ObjectHelper} from "../../ObjectHelper";
import {Form} from "../../form/Form";
import {FormBuilder} from "../../form/Form";
import {MixinJson} from "./MixinJson";
import {SchemaBuilder} from "../Schema";
import {FormItemJson} from "../../form/json/FormItemJson";
import {FormItemFactory} from "../../form/FormItemFactory";
import {MixinName} from "./MixinName";

export class Mixin extends Schema implements Equitable {

        private schemaKey: string;

        private formItems: FormItem[];

        constructor(builder: MixinBuilder) {
            super(builder);
            this.formItems = builder.formItems;
            this.schemaKey = builder.schemaKey;
        }

        getMixinName(): MixinName {
            return new MixinName(this.getName());
        }

        getFormItems(): FormItem[] {
            return this.formItems;
        }

        getSchemaKey(): string {
            return this.schemaKey;
        }

        equals(o: Equitable): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, Mixin)) {
                return false;
            }

            if (!super.equals(o)) {
                return false;
            }

            var other = <Mixin>o;


            if (!ObjectHelper.stringEquals(this.schemaKey, other.schemaKey)) {
                return false;
            }

            if (!ObjectHelper.arrayEquals(this.formItems, other.formItems)) {
                return false;
            }

            return true;
        }

        toForm(): Form {
            return new FormBuilder().addFormItems(this.formItems).build();
        }

        static fromJson(json: MixinJson): Mixin {
            return new MixinBuilder().fromMixinJson(json).build();
        }

    }

    export class MixinBuilder extends SchemaBuilder {

        schemaKey: string;

        formItems: FormItem[];

        constructor(source?: Mixin) {
            super(source);
            if (source) {
                this.schemaKey = source.getSchemaKey();
                this.formItems = source.getFormItems();
            }
        }

        fromMixinJson(mixinJson: MixinJson): MixinBuilder {

            super.fromSchemaJson(mixinJson);

            this.formItems = [];
            mixinJson.items.forEach((formItemJson: FormItemJson) => {
                var formItem = FormItemFactory.createFormItem(formItemJson);
                if (formItem) {
                    this.formItems.push(formItem);
                }
            });
            this.schemaKey = "mixin:" + this.name;
            return this;
        }

        build(): Mixin {
            return new Mixin(this);
        }

    }
