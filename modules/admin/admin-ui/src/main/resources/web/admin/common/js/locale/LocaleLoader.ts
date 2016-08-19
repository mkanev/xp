import {BaseLoader} from "../util/loader/BaseLoader";
import {LocaleListJson} from "./json/LocaleListJson";
import {Locale} from "./Locale";
import {GetLocalesRequest} from "./GetLocalesRequest";

export class LocaleLoader extends BaseLoader<LocaleListJson, Locale> {

        private preservedSearchString: string;

        private getLocalesRequest: GetLocalesRequest;

        constructor() {
            this.getLocalesRequest = new GetLocalesRequest();
            super(this.getLocalesRequest);
        }

        search(searchString: string): wemQ.Promise<Locale[]> {
            
            this.getLocalesRequest.setSearchQuery(searchString);

            return this.load();
        }

        load(): wemQ.Promise<Locale[]> {

            this.notifyLoadingData();

            return this.sendRequest()
                .then((locales: Locale[]) => {

                    this.notifyLoadedData(locales);
                    if (this.preservedSearchString) {
                        this.search(this.preservedSearchString);
                        this.preservedSearchString = null;
                    }
                    return locales;
                });
        }

    }

