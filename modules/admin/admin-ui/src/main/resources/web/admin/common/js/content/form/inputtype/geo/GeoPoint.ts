import {ValueTypes} from "../../../../data/ValueTypes";
import {ValueType} from "../../../../data/ValueType";
import {Value} from "../../../../data/Value";
import {Property} from "../../../../data/Property";
import {BaseInputTypeNotManagingAdd} from "../../../../form/inputtype/support/BaseInputTypeNotManagingAdd";
import {GeoPoint as GeoPointUtil} from "../../../../util/GeoPoint";
import {InputTypeViewContext} from "../../../../form/inputtype/InputTypeViewContext";
import {Element} from "../../../../dom/Element";
import {GeoPoint as GeoPointData} from "../../../../ui/geo/GeoPoint";
import {ValueChangedEvent} from "../../../../ValueChangedEvent";
import {InputTypeManager} from "../../../../form/inputtype/InputTypeManager";
import {Class} from "../../../../Class";

// TODO: GeoPoint is not dependent on the content domain and should therefore be moved to geo
    export class GeoPoint extends BaseInputTypeNotManagingAdd<GeoPointUtil> {

        constructor(config: InputTypeViewContext) {
            super(config);
        }

        getValueType(): ValueType {
            return ValueTypes.GEO_POINT;
        }

        newInitialValue(): Value {
            return super.newInitialValue() || ValueTypes.GEO_POINT.newNullValue();
        }

        createInputOccurrenceElement(index: number, property: Property): Element {
            if (!ValueTypes.GEO_POINT.equals(property.getType())) {
                property.convertValueType(ValueTypes.GEO_POINT);
            }

            var geoPoint = new GeoPointData(property.getGeoPoint());

            geoPoint.onValueChanged((event: ValueChangedEvent) => {
                var value = GeoPointUtil.isValidString(event.getNewValue()) ?
                            ValueTypes.GEO_POINT.newValue(event.getNewValue()) :
                            ValueTypes.GEO_POINT.newNullValue();
                this.notifyOccurrenceValueChanged(geoPoint, value);
            });

            return geoPoint;
        }

        updateInputOccurrenceElement(occurrence: Element, property: Property, unchangedOnly: boolean) {
            var geoPoint = <GeoPointData> occurrence;

            if (!unchangedOnly || !geoPoint.isDirty()) {
                geoPoint.setGeoPoint(property.getGeoPoint());
            }
        }

        availableSizeChanged() {
        }

        valueBreaksRequiredContract(value: Value): boolean {
            return value.isNull() || !value.getType().equals(ValueTypes.GEO_POINT);
        }

        hasInputElementValidUserInput(inputElement: Element) {
            var geoPoint = <GeoPointData>inputElement;
            return geoPoint.isValid();
        }
    }

    InputTypeManager.register(new Class("GeoPoint", GeoPoint));
