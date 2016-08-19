import {ObjectHelper} from "./ObjectHelper";
import {App} from "./app/Application";
import {ShowAppLauncherEvent} from "./app/ShowAppLauncherEvent";
import {showError} from "./notify/MessageBus";
import {showWarning} from "./notify/MessageBus";
import {showFeedback} from "./notify/MessageBus";
import {AccessDeniedException} from "./AccessDeniedException";
import {ExceptionType} from "./Exception";
import {Exception} from "./Exception";

export class DefaultErrorHandler {

        static handle(error: any) {

            if (ObjectHelper.iFrameSafeInstanceOf(error, Error)) {
                // Rethrowing Error so that we will get a nice stack trace in the console.
                console.error(error);
                throw error;
            }
            else if (ObjectHelper.iFrameSafeInstanceOf(error, AccessDeniedException)) {
                var application: App = App.getApplication();
                var wnd = application.getWindow();
                new ShowAppLauncherEvent(application, true).fire(wnd.parent);
                new ShowAppLauncherEvent(application, true).fire(wnd);
            }
            else if (ObjectHelper.iFrameSafeInstanceOf(error, Exception)) {
                var message = error.getMessage();

                switch (error.getType()) {
                case ExceptionType.ERROR:
                    console.error(message);
                    showError(message);
                    break;
                case ExceptionType.WARNING:
                    console.warn(message);
                    showWarning(message);
                    break;
                case ExceptionType.INFO:
                    console.info(message);
                    showFeedback(message);
                    break;
                }
            } else {
                console.error(error);
                showError(error.toString());
                throw error;
            }

        }

    }
