package com.enonic.xp.repository;


import java.util.Map;

import com.google.common.collect.Maps;

import com.enonic.xp.index.IndexType;

public class IndicesSettings
{
    private final Map<IndexType, IndexSettings> settings;

    private IndicesSettings( final Builder builder )
    {
        this.settings = builder.settings;
    }

    public static Builder create()
    {
        return new Builder();
    }

    public IndexSettings getSetting( final IndexType indexType )
    {
        return settings.get( indexType );
    }

    public static final class Builder
    {
        private final Map<IndexType, IndexSettings> settings = Maps.newHashMap();

        private Builder()
        {
        }

        public Builder add( final IndexType type, final IndexSettings settings )
        {
            this.settings.put( type, settings );
            return this;
        }

        public IndicesSettings build()
        {
            return new IndicesSettings( this );
        }
    }
}
