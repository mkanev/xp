package com.enonic.xp.repo.impl.search;

import com.enonic.xp.query.Query;
import com.enonic.xp.repo.impl.ReturnFields;
import com.enonic.xp.repo.impl.StorageSettings;
import com.enonic.xp.security.PrincipalKeys;

public class SearchRequest
{
    private final StorageSettings settings;

    private final Query query;

    private final ReturnFields returnFields;

    private final PrincipalKeys acl;

    private final boolean includeSource;

    private SearchRequest( final Builder builder )
    {
        settings = builder.settings;
        query = builder.query;
        returnFields = builder.returnFields;
        acl = builder.acl;
        includeSource = builder.includeSource;
    }

    public static Builder create()
    {
        return new Builder();
    }

    public StorageSettings getSettings()
    {
        return settings;
    }

    public PrincipalKeys getAcl()
    {
        return acl;
    }

    public Query getQuery()
    {
        return query;
    }

    public boolean isIncludeSource()
    {
        return includeSource;
    }

    public ReturnFields getReturnFields()
    {
        return returnFields;
    }

    public static final class Builder
    {
        private StorageSettings settings;

        private Query query;

        private ReturnFields returnFields;

        private PrincipalKeys acl;

        private boolean includeSource = false;

        private Builder()
        {
        }

        public Builder settings( StorageSettings settings )
        {
            this.settings = settings;
            return this;
        }

        public Builder query( Query query )
        {
            this.query = query;
            return this;
        }

        public Builder returnFields( final ReturnFields returnFields )
        {
            this.returnFields = returnFields;
            return this;
        }

        public Builder acl( final PrincipalKeys acl )
        {
            this.acl = acl;
            return this;
        }

        public Builder includeSource( final boolean val )
        {
            includeSource = val;
            return this;
        }

        public SearchRequest build()
        {
            return new SearchRequest( this );
        }
    }
}
