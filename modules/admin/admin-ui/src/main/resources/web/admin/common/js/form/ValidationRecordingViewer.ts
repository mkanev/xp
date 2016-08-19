import {Viewer} from "../ui/Viewer";
import {UlEl} from "../dom/UlEl";
import {LiEl} from "../dom/LiEl";
import {StringHelper} from "../util/StringHelper";
import {ValidationRecording} from "./ValidationRecording";
import {ValidationRecordingPath} from "./ValidationRecordingPath";

export class ValidationRecordingViewer extends Viewer<ValidationRecording> {

        private list: UlEl;
        private minText: string = "Min {0} occurrences required";
        private minTextSingle: string = "This field is required";
        private maxText: string = "Max {0} occurrence{1} allowed";

        constructor() {
            super('validation-viewer');
        }

        doLayout(object: ValidationRecording) {
            super.doLayout(object);

            if (!this.list) {
                this.list = new UlEl();
                this.appendChild(this.list);
            } else {
                this.list.removeChildren();
            }

            if (object) {
                object.breaksMinimumOccurrencesArray.forEach((path: ValidationRecordingPath) => {
                    this.list.appendChild(this.createItemView(path, true));
                });
                object.breaksMaximumOccurrencesArray.forEach((path: ValidationRecordingPath) => {
                    this.list.appendChild(this.createItemView(path, false));
                });
            }
        }

        appendValidationMessage(message: string, removeExisting: boolean = true) {
            if (removeExisting) {
                this.list.removeChildren();
            }
            this.list.appendChild(new LiEl().setHtml(message));
        }

        setError(text: string) {
            this.list.removeChildren();
            if (text) {
                this.list.appendChild(new LiEl().setHtml(text));
            }
        }

        private createItemView(path: ValidationRecordingPath, breaksMin: boolean): LiEl {
            var text = breaksMin ? this.resolveMinText(path) : this.resolveMaxText(path);
            return new LiEl().setHtml(text);
        }

        private resolveMinText(path: ValidationRecordingPath): string {
            return path.getMin() > 1 ? StringHelper.format(this.minText, path.getMin()) : this.minTextSingle;
        }

        private resolveMaxText(path: ValidationRecordingPath): string {
            return StringHelper.format(this.maxText, path.getMax(), path.getMax() > 1 ? 's' : '');
        }

    }

