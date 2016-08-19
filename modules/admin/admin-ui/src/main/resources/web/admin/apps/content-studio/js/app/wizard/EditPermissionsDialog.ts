import {Content} from "../../../../../common/js/content/Content";
import {AccessControlComboBox} from "../../../../../common/js/ui/security/acl/AccessControlComboBox";
import {AccessControlEntry} from "../../../../../common/js/security/acl/AccessControlEntry";
import {AccessControlList} from "../../../../../common/js/security/acl/AccessControlList";
import {ModalDialog} from "../../../../../common/js/ui/dialog/ModalDialog";
import {Checkbox} from "../../../../../common/js/ui/Checkbox";
import {Action} from "../../../../../common/js/ui/Action";
import {SectionEl} from "../../../../../common/js/dom/SectionEl";
import {Form} from "../../../../../common/js/ui/form/Form";
import {ObjectHelper} from "../../../../../common/js/ObjectHelper";
import {Body} from "../../../../../common/js/dom/Body";
import {OpenEditPermissionsDialogEvent} from "../../../../../common/js/content/event/OpenEditPermissionsDialogEvent";
import {showWarning} from "../../../../../common/js/notify/MessageBus";
import {ApplyContentPermissionsRequest} from "../../../../../common/js/content/resource/ApplyContentPermissionsRequest";
import {showFeedback} from "../../../../../common/js/notify/MessageBus";
import {GetContentByPathRequest} from "../../../../../common/js/content/resource/GetContentByPathRequest";
import {GetContentRootPermissionsRequest} from "../../../../../common/js/content/resource/GetContentRootPermissionsRequest";
import {ModalDialogHeader} from "../../../../../common/js/ui/dialog/ModalDialog";
import {PEl} from "../../../../../common/js/dom/PEl";

import {ContentPermissionsAppliedEvent} from "./ContentPermissionsAppliedEvent";

export class EditPermissionsDialog extends ModalDialog {

    private content: Content;
    private parentPermissions: AccessControlEntry[];
    private originalValues: AccessControlEntry[];
    private originalInherit: boolean;

    private dialogTitle: EditPermissionsDialogTitle;
    private inheritPermissionsCheck: Checkbox;
    private overwriteChildPermissionsCheck: Checkbox;
    private comboBox: AccessControlComboBox;
    private applyAction: Action;


    constructor() {
        this.dialogTitle = new EditPermissionsDialogTitle('Edit Permissions', '');

        super({
            title: this.dialogTitle
        });

        this.addClass('edit-permissions-dialog');

        this.inheritPermissionsCheck = Checkbox.create().setLabelText('Inherit permissions').build();
        this.inheritPermissionsCheck.addClass('inherit-perm-check');
        this.appendChildToContentPanel(this.inheritPermissionsCheck);

        var section = new SectionEl();
        this.appendChildToContentPanel(section);

        var form = new Form();
        section.appendChild(form);

        this.comboBox = new AccessControlComboBox();
        this.comboBox.addClass('principal-combobox');
        form.appendChild(this.comboBox);

        var comboBoxChangeListener = () => {
            var currentEntries: AccessControlEntry[] = this.getEntries().sort();
            var permissionsModified: boolean = !ObjectHelper.arrayEquals(currentEntries, this.originalValues);
            var inheritCheckModified: boolean = this.inheritPermissionsCheck.isChecked() !== this.originalInherit;
            var overwriteModified: boolean = this.overwriteChildPermissionsCheck.isChecked();
            this.applyAction.setEnabled(permissionsModified || inheritCheckModified || overwriteModified);
        };

        var changeListener = () => {
            var inheritPermissions = this.inheritPermissionsCheck.isChecked();

            this.comboBox.toggleClass('disabled', inheritPermissions);
            if (inheritPermissions) {
                this.layoutInheritedPermissions();
            }
            this.comboBox.getComboBox().setVisible(!inheritPermissions);
            this.comboBox.setEditable(!inheritPermissions);

            comboBoxChangeListener();
        };
        this.inheritPermissionsCheck.onValueChanged(changeListener);

        this.overwriteChildPermissionsCheck = Checkbox.create().setLabelText('Overwrite child permissions').build();
        this.overwriteChildPermissionsCheck.addClass('overwrite-child-check');
        this.appendChildToContentPanel(this.overwriteChildPermissionsCheck);

        this.applyAction = new Action('Apply');
        this.applyAction.onExecuted(() => {
            this.applyPermissions();
        });
        this.addAction(this.applyAction, true);

        Body.get().appendChild(this);

        this.comboBox.onOptionValueChanged(comboBoxChangeListener);
        this.comboBox.onOptionSelected(comboBoxChangeListener);
        this.comboBox.onOptionDeselected(comboBoxChangeListener);
        this.overwriteChildPermissionsCheck.onValueChanged(comboBoxChangeListener);

        this.parentPermissions = [];
        OpenEditPermissionsDialogEvent.on((event) => {
            this.content = event.getContent();

            this.getParentPermissions().then((parentPermissions: AccessControlList) => {
                this.parentPermissions = parentPermissions.getEntries();

                this.setUpDialog();

                this.open();

            }).catch(() => {
                showWarning('Could not read inherit permissions for content ' + this.content.getPath().toString());
            }).done();
        });

        this.addCancelButtonToBottom();
    }

    private applyPermissions() {
        var permissions = new AccessControlList(this.getEntries());
        var req = new ApplyContentPermissionsRequest().setId(this.content.getId()).setInheritPermissions(
            this.inheritPermissionsCheck.isChecked()).setPermissions(permissions).setOverwriteChildPermissions(
            this.overwriteChildPermissionsCheck.isChecked());
        var res = req.sendAndParse();

        res.done((updatedContent: Content) => {
            new ContentPermissionsAppliedEvent(updatedContent).fire();
            showFeedback('Permissions applied to content ' + updatedContent.getPath().toString());
            this.close();
        });
    }

    private setUpDialog() {
        this.comboBox.clearSelection(true);
        this.overwriteChildPermissionsCheck.setChecked(false);

        var contentPermissions = this.content.getPermissions();
        var contentPermissionsEntries: AccessControlEntry[] = contentPermissions.getEntries();
        this.originalValues = contentPermissionsEntries.sort();
        this.originalInherit = this.content.isInheritPermissionsEnabled();

        this.originalValues.forEach((item) => {
            if (!this.comboBox.isSelected(item)) {
                this.comboBox.select(item);
            }
        });

        this.inheritPermissionsCheck.setChecked(this.content.isInheritPermissionsEnabled());

        this.comboBox.giveFocus();
    }

    private layoutInheritedPermissions() {
        this.comboBox.clearSelection(true);
        this.parentPermissions.forEach((item) => {
            if (!this.comboBox.isSelected(item)) {
                this.comboBox.select(item);
            }
        });
    }

    private getEntries(): AccessControlEntry[] {
        return this.comboBox.getSelectedDisplayValues();
    }

    private getParentPermissions(): wemQ.Promise<AccessControlList> {
        var deferred = wemQ.defer<AccessControlList>();

        var parentPath = this.content.getPath().getParentPath();
        if (parentPath && parentPath.isNotRoot()) {
            new GetContentByPathRequest(parentPath).sendAndParse().then((content: Content) => {
                deferred.resolve(content.getPermissions());
            }).catch((reason: any) => {
                deferred.reject(new Error("Inherit permissions for [" + this.content.getPath().toString() +
                                          "] could not be retrieved"));
            }).done();
        } else {
            new GetContentRootPermissionsRequest().sendAndParse().then((rootPermissions: AccessControlList) => {
                deferred.resolve(rootPermissions);
            }).catch((reason: any) => {
                deferred.reject(new Error("Inherit permissions for [" + this.content.getPath().toString() +
                                          "] could not be retrieved"));
            }).done();
        }

        return deferred.promise;
    }

    show() {
        if (this.content) {
            this.dialogTitle.setPath(this.content.getPath().toString());
        } else {
            this.dialogTitle.setPath('');
        }
        super.show();

        if (this.comboBox.getComboBox().isVisible()) {
            this.comboBox.giveFocus();
        }
        else {
            this.inheritPermissionsCheck.giveFocus();
        }
    }
}

export class EditPermissionsDialogTitle extends ModalDialogHeader {

    private pathEl: PEl;

    constructor(title: string, path: string) {
        super(title);

        this.pathEl = new PEl('path');
        this.pathEl.setHtml(path);
        this.appendChild(this.pathEl);
    }

    setPath(path: string) {
        this.pathEl.setHtml(path);
    }
}
