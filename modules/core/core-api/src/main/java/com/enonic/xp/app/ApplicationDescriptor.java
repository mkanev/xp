package com.enonic.xp.app;

import java.util.Objects;

import com.google.common.annotations.Beta;
import com.google.common.base.MoreObjects;
import com.google.common.base.Preconditions;

import com.enonic.xp.icon.Icon;

@Beta
public final class ApplicationDescriptor
{
    private final ApplicationKey key;

    private final String description;

    private final Icon icon;

    private ApplicationDescriptor( final Builder builder )
    {
        Preconditions.checkNotNull( builder.key, "key is required" );
        this.key = builder.key;
        this.description = builder.description != null ? builder.description : "";
        this.icon = builder.icon;
    }

    public ApplicationKey getKey()
    {
        return key;
    }

    public String getDescription()
    {
        return description;
    }

    public Icon getIcon()
    {
        return icon;
    }

    @Override
    public boolean equals( final Object o )
    {
        if ( this == o )
        {
            return true;
        }
        if ( o == null || getClass() != o.getClass() )
        {
            return false;
        }
        final ApplicationDescriptor that = (ApplicationDescriptor) o;
        return Objects.equals( key, that.key ) && Objects.equals( description, that.description ) && Objects.equals( icon, that.icon );
    }

    @Override
    public int hashCode()
    {
        return Objects.hash( key, description, icon );
    }

    @Override
    public String toString()
    {
        return MoreObjects.toStringHelper( this ).
            add( "key", key ).
            add( "description", description ).
            add( "icon", icon ).
            toString();
    }

    public static Builder create()
    {
        return new Builder();
    }

    public final static class Builder
    {
        private ApplicationKey key;

        private String description;

        private Icon icon;

        private Builder()
        {
        }

        public Builder key( final ApplicationKey key )
        {
            this.key = key;
            return this;
        }

        public Builder description( final String description )
        {
            this.description = description;
            return this;
        }

        public Builder icon( final Icon icon )
        {
            this.icon = icon;
            return this;
        }

        public ApplicationDescriptor build()
        {
            return new ApplicationDescriptor( this );
        }
    }
}
