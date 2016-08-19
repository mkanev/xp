import {Branch} from "../content/Branch";
import {ContentPath} from "../content/ContentPath";
import {UriHelper} from "../util/UriHelper";
import {ComponentPath} from "../content/page/region/ComponentPath";
import {RenderingMode} from "./RenderingMode";

export class PortalUriHelper {

        public static getPortalUri(path: string, renderingMode: RenderingMode, workspace: Branch): string {
            var elementDivider = ContentPath.ELEMENT_DIVIDER;
            path = UriHelper.relativePath(path);

            var workspaceName: string = Branch[workspace].toLowerCase();
            var renderingModeName: string = RenderingMode[renderingMode].toLowerCase();

            return UriHelper.getPortalUri(renderingModeName + elementDivider + workspaceName + elementDivider + path);
        }

        public static getPathFromPortalPreviewUri(portalUri: string, renderingMode: RenderingMode, workspace: Branch): string {
            var workspaceName: string = Branch[workspace].toLowerCase();
            var renderingModeName: string = RenderingMode[renderingMode].toLowerCase();

            var elementDivider = ContentPath.ELEMENT_DIVIDER;
            var searchEntry = renderingModeName + elementDivider + workspaceName;

            var index = portalUri.indexOf(searchEntry);
            if (index > -1) {
                return portalUri.substring(index + searchEntry.length);
            } else {
                return null;
            }
        }

        public static getComponentUri(contentId: string, componentPath: ComponentPath, renderingMode: RenderingMode,
                                      workspace: Branch): string {
            var elementDivider = ContentPath.ELEMENT_DIVIDER,
                componentPart = elementDivider + "_" + elementDivider + "component" + elementDivider;
            var componentPathStr = componentPath ? componentPath.toString() : "";
            return PortalUriHelper.getPortalUri(contentId + componentPart + componentPathStr, renderingMode, workspace);
        }

        public static getAdminUri(baseUrl: string, contentPath: string): string {
            var adminUrl = PortalUriHelper.getPortalUri(contentPath, RenderingMode.ADMIN, Branch.DRAFT);
            return adminUrl + (adminUrl.charAt(adminUrl.length - 1) == '/' ? "" : ContentPath.ELEMENT_DIVIDER) + baseUrl;
        }
    }
