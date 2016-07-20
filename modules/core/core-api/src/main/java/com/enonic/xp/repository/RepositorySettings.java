package com.enonic.xp.repository;

public class RepositorySettings
{
    private final String name;

    private final IndexesSettings indexesSettings;

    private final IndexesMapping indexesMapping;

    private RepositorySettings( final Builder builder )
    {
        name = builder.name;
        indexesSettings = builder.indexesSettings;
        indexesMapping = builder.indexesMapping;
    }

    public IndexesSettings getIndexesSettings()
    {
        return this.indexesSettings;
    }

    public IndexesMapping getIndexesMapping()
    {
        return indexesMapping;
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

        private IndexesSettings indexesSettings;

        private IndexesMapping indexesMapping;

        private Builder()
        {
        }

        public Builder name( final String val )
        {
            name = val;
            return this;
        }

        public Builder indexesSettings( final IndexesSettings indexesSettings )
        {
            this.indexesSettings = indexesSettings;
            return this;
        }

        public Builder indexesMapping( final IndexesMapping indexesMapping )
        {
            this.indexesMapping = indexesMapping;
            return this;
        }

        public RepositorySettings build()
        {
            return new RepositorySettings( this );
        }
    }
}
