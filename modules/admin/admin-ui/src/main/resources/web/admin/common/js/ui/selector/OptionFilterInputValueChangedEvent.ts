import {Grid} from "../grid/Grid";
import {Option} from "./Option";

export class OptionFilterInputValueChangedEvent<OPTION_DISPLAY_VALUE> {

        private oldValue: string;

        private newValue: string;

        private grid: Grid<Option<OPTION_DISPLAY_VALUE>>;

        constructor(oldValue: string, newValue: string, grid: Grid<Option<OPTION_DISPLAY_VALUE>>) {
            this.oldValue = oldValue;
            this.newValue = newValue;
            this.grid = grid;
        }

        getOldValue(): string {
            return this.oldValue;
        }

        getNewValue(): string {
            return this.newValue;
        }

        getGrid(): Grid<Option<OPTION_DISPLAY_VALUE>> {
            return this.grid;
        }
    }
