import {DropdownInput} from "../../../ui/selector/dropdown/DropdownInput";
import {Option} from "../../../ui/selector/Option";
import {DropdownConfig} from "../../../ui/selector/dropdown/DropdownInput";
import {OptionSelectedEvent} from "../../../ui/selector/OptionSelectedEvent";
import {ImageCroppingOption} from "./ImageCroppingOption";
import {ImageCroppingOptions} from "./ImageCroppingOptions";
import {ImageCroppingOptionViewer} from "./ImageCroppingOptionViewer";

export class ImageCroppingSelector extends DropdownInput<ImageCroppingOption> {


        constructor() {
            super("imageSelector", <DropdownConfig<ImageCroppingOption>>{
                optionDisplayValueViewer: new ImageCroppingOptionViewer(),
                inputPlaceholderText: "Cropping effect"
            });
            this.addClass("image-cropping-selector");

            this.initDropdown();
        }

        private initDropdown() {

            this.addNoneOption();
            this.addCroppingOptions();

            this.onOptionSelected((event: OptionSelectedEvent<ImageCroppingOption>) => {
                if(event.getOption().displayValue.getName() == "none") {
                    this.reset();
                }
            });
        }

        private addNoneOption() {
            var noneOption = new ImageCroppingOption("none", 0 , 0);
            noneOption.setDisplayValue("<None>");

            var option =  {
                value: noneOption.getName(),
                displayValue: noneOption
            };

            this.addOption(option);
        }

        private addCroppingOptions() {
            ImageCroppingOptions.getOptions().forEach((option: Option<ImageCroppingOption>) => {
                this.addOption(option);
            });
        }

    }
