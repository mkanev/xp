import {MixinName} from "../schema/mixin/MixinName";
import {PropertyTree} from "../data/PropertyTree";
import {Cloneable} from "../Cloneable";
import {Equitable} from "../Equitable";
import {ObjectHelper} from "../ObjectHelper";
import {ExtraDataJson} from "./json/ExtraDataJson";

export class ExtraData implements Cloneable, Equitable {

        private name: MixinName;

        private data: PropertyTree;

        constructor(name: MixinName, data: PropertyTree) {
            this.name = name;
            this.data = data;
        }

        getName(): MixinName {
            return this.name;
        }

        getData(): PropertyTree {
            return this.data;
        }

        clone(): ExtraData {
            return new ExtraData(this.name, this.data.copy());
        }

        equals(o: Equitable): boolean {
            if (!ObjectHelper.iFrameSafeInstanceOf(o, ExtraData)) {
                return false;
            }

            var other = <ExtraData>o;

            if (!ObjectHelper.equals(this.name, other.name)) {
                return false;
            }

            if (!ObjectHelper.equals(this.data, other.data)) {
                return false;
            }

            return true;
        }

        toJson(): ExtraDataJson {
            return {
                name: this.name.toString(),
                data: this.data.toJson()
            };
        }

        static fromJson(metadataJson: ExtraDataJson): ExtraData {
            return new ExtraData(new MixinName(metadataJson.name), PropertyTree.fromJson(metadataJson.data));
        }

        
    }

