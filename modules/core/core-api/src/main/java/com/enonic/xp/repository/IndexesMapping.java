package com.enonic.xp.repository;

import java.util.Map;

import com.google.common.collect.Maps;

import com.enonic.xp.index.IndexType;

public class IndexesMapping
{
    private final Map<IndexType, IndexMapping> mappings;

    private IndexesMapping( final Builder builder )
    {
        this.mappings = builder.mappings;
    }

    public static Builder create()
    {
        return new Builder();
    }

    public IndexMapping getMapping( final IndexType indexType )
    {
        return mappings.get( indexType );
    }

    public static final class Builder
    {
        private final Map<IndexType, IndexMapping> mappings = Maps.newHashMap();

        private Builder()
        {
        }

        public Builder add( final IndexType type, final IndexMapping mapping )
        {
            this.mappings.put( type, mapping );
            return this;
        }

        public IndexesMapping build()
        {
            return new IndexesMapping( this );
        }
    }
}
