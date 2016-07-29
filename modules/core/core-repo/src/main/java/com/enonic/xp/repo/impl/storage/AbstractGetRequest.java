package com.enonic.xp.repo.impl.storage;

import com.enonic.xp.repo.impl.ReturnFields;
import com.enonic.xp.repo.impl.SearchPreference;
import com.enonic.xp.repo.impl.StorageSettings;

public abstract class AbstractGetRequest
{
    private final StorageSettings storageSettings;

    private final SearchPreference searchPreference;

    private final ReturnFields returnFields;

    private final int timeout;

    AbstractGetRequest( final Builder builder )
    {
        this.searchPreference = builder.searchPreference;
        this.storageSettings = builder.storageSettings;
        this.returnFields = builder.returnFields;
        this.timeout = builder.timeout;
    }

    public StorageSettings getStorageSettings()
    {
        return storageSettings;
    }

    public SearchPreference getSearchPreference()
    {
        return searchPreference;
    }

    public ReturnFields getReturnFields()
    {
        return returnFields;
    }

    public String getTimeout()
    {
        return timeout + "s";
    }

    public static class Builder<B extends Builder>
    {
        private SearchPreference searchPreference = SearchPreference.LOCAL;

        private StorageSettings storageSettings;

        private ReturnFields returnFields;

        private int timeout = 5;

        @SuppressWarnings("unchecked")
        public B searchPreference( SearchPreference searchPreference )
        {
            this.searchPreference = searchPreference;
            return (B) this;
        }


        @SuppressWarnings("unchecked")
        public B returnFields( ReturnFields returnFields )
        {
            this.returnFields = returnFields;
            return (B) this;
        }

        @SuppressWarnings("unchecked")
        public B storageSettings( StorageSettings storageSettings )
        {
            this.storageSettings = storageSettings;
            return (B) this;
        }
    }
}
