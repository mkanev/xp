package com.enonic.xp.repository;

public class RepositorySettings
{
    private final String name;

    private final IndicesSettings indicesSettings;

    private RepositorySettings( final Builder builder )
    {
        name = builder.name;
        indicesSettings = builder.indicesSettings;
    }

    public IndicesSettings getIndicesSettings()
    {
        return this.indicesSettings;
    }

    public String getName()
    {
        return name;
    }

    public static Builder create()
    {
        return new Builder();
    }


    public static final class Builder
    {
        private String name;

        private IndicesSettings indicesSettings;

        private Builder()
        {
        }

        public Builder name( final String val )
        {
            name = val;
            return this;
        }

        public Builder indiciesSettings( final IndicesSettings indicesSettings )
        {
            this.indicesSettings = indicesSettings;
            return this;
        }

        public RepositorySettings build()
        {
            return new RepositorySettings( this );
        }
    }
}
