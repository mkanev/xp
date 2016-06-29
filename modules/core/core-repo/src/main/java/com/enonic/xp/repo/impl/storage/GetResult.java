package com.enonic.xp.repo.impl.storage;

import java.util.Map;

import com.google.common.collect.Maps;

import com.enonic.xp.repo.impl.ReturnValues;

public class GetResult
{
    private final String id;

    private final ReturnValues returnValues;

    private final long version;

    private final Map<String, Object> source;

    private GetResult( final Builder builder )
    {
        id = builder.id;
        returnValues = builder.returnValues;
        version = builder.version;
        source = builder.source;
    }

    public ReturnValues getReturnValues()
    {
        return returnValues;
    }

    public String getId()
    {
        return id;
    }

    public long getVersion()
    {
        return version;
    }

    public Map<String, Object> getSource()
    {
        return source;
    }

    public static Builder create()
    {
        return new Builder();
    }

    private GetResult()
    {
        this.id = null;
        this.returnValues = null;
        this.version = 0;
        this.source = Maps.newHashMap();
    }

    public static GetResult empty()
    {
        return new GetResult();
    }

    public boolean isEmpty()
    {
        return this.id == null;
    }

    public static final class Builder
    {
        private String id;

        private ReturnValues returnValues;

        private long version;

        private Map<String, Object> source;

        private Builder()
        {
        }

        public Builder id( String id )
        {
            this.id = id;
            return this;
        }

        public Builder version( final long val )
        {
            version = val;
            return this;
        }

        public Builder source( final Map<String, Object> val )
        {
            source = val;
            return this;
        }

        public Builder returnValues( final ReturnValues returnValues )
        {
            this.returnValues = returnValues;
            return this;
        }

        public GetResult build()
        {
            return new GetResult( this );
        }
    }
}