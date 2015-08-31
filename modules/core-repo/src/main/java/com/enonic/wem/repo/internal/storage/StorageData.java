package com.enonic.wem.repo.internal.storage;

import java.util.Arrays;
import java.util.Collection;

import com.google.common.collect.ArrayListMultimap;
import com.google.common.collect.Multimap;

public class StorageData
{
    private final String parent;

    private final String routing;

    private final Multimap<String, Object> values;

    private StorageData( Builder builder )
    {
        this.parent = builder.parent;
        this.routing = builder.routing;
        this.values = builder.values;
    }

    public static Builder create()
    {
        return new Builder();
    }

    public Collection<Object> get( final String key )
    {
        return this.values.get( key );
    }

    public Multimap<String, Object> getValues()
    {
        return values;
    }

    public String getParent()
    {
        return parent;
    }

    public String getRouting()
    {
        return routing;
    }

    public static final class Builder
    {
        private String parent;

        private String routing;

        final Multimap<String, Object> values = ArrayListMultimap.create();

        private Builder()
        {
        }

        public Builder parent( String parent )
        {
            this.parent = parent;
            return this;
        }

        public Builder routing( String routing )
        {
            this.routing = routing;
            return this;
        }

        public Builder add( final String key, final Object value )
        {
            if ( value instanceof Collection )
            {
                values.putAll( key, ( (Collection) value ) );
            }
            else if ( value instanceof Object[] )
            {
                values.putAll( key, Arrays.asList( (Object[]) value ) );
            }
            else
            {
                values.put( key, value );
            }

            return this;
        }

        public StorageData build()
        {
            return new StorageData( this );
        }
    }
}
