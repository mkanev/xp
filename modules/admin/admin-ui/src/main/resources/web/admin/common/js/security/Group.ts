import {assert} from "../util/Assert";
import {Equitable} from "../Equitable";
import {ObjectHelper} from "../ObjectHelper";
import {GroupJson} from "./GroupJson";
import {Principal} from "./Principal";
import {PrincipalBuilder} from "./Principal";
import {PrincipalKey} from "./PrincipalKey";

export class Group extends Principal {

        private members: PrincipalKey[];

        constructor(builder: GroupBuilder) {
            super(builder);
            assert(builder.key.isGroup(), 'Expected PrincipalKey of type Group');
            this.members = builder.members || [];
        }

        getMembers(): PrincipalKey[] {
            return this.members;
        }

        setMembers(members: PrincipalKey[]): void {
            this.members = members || [];
        }

        addMember(member: PrincipalKey): void {
            this.members.push(member);
        }

        equals(o: Equitable): boolean {
            if (!ObjectHelper.iFrameSafeInstanceOf(o, Group)) {
                return false;
            }

            var other = <Group> o;
            return super.equals(o) && ObjectHelper.arrayEquals(this.members, other.getMembers());
        }

        clone(): Group {
            return this.newBuilder().build();
        }

        newBuilder(): GroupBuilder {
            return new GroupBuilder(this);
        }

        static create(): GroupBuilder {
            return new GroupBuilder();
        }

        static fromJson(json: GroupJson): Group {
            return new GroupBuilder().fromJson(json).build();
        }
    }

    export class GroupBuilder extends PrincipalBuilder {
        members: PrincipalKey[];

        constructor(source?: Group) {
            if (source) {
                super(source);
                this.members = source.getMembers().slice(0);
            } else {
                this.members = [];
            }
        }

        fromJson(json: GroupJson): GroupBuilder {
            super.fromJson(json);

            if (json.members) {
                this.members = json.members.map((memberStr) => PrincipalKey.fromString(memberStr));
            }
            return this;
        }

        setMembers(members: PrincipalKey[]): GroupBuilder {
            this.members = members || [];
            return this;
        }

        build(): Group {
            return new Group(this);
        }
    }
