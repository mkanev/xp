import {TabBarItem} from "../../ui/tab/TabBarItem";
import {TabBarItemBuilder} from "../../ui/tab/TabBarItem";
import {WizardStepForm} from "./WizardStepForm";

export class WizardStep {

        private tabBarItem: TabBarItem;

        private stepForm: WizardStepForm;

        constructor(label: string, stepForm: WizardStepForm) {
            this.tabBarItem = new TabBarItemBuilder().setAddLabelTitleAttribute(false).setLabel(label).build();
            this.stepForm = stepForm;
        }

        getTabBarItem(): TabBarItem {
            return this.tabBarItem;
        }

        getStepForm(): WizardStepForm {
            return this.stepForm;
        }

    }
