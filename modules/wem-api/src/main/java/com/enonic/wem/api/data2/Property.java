package com.enonic.wem.api.data2;


import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Objects;

import org.apache.commons.lang.StringUtils;

import com.enonic.wem.api.util.GeoPoint;

public final class Property
{
    private final String name;

    private final int index;

    private Value value;

    private final PropertyId id;

    private final PropertySet parent;

    Property( final String name, final int index, final Value value, final PropertyId id, final PropertySet parent )
    {
        checkName( name );
        this.name = name;
        this.index = index;
        this.value = value;
        this.id = id;
        this.parent = parent;
        if ( value.isSet() )
        {
            value.asData().setProperty( this );
            if ( value.asData() == parent.getTree().getRoot() )
            {
                throw new IllegalArgumentException( "Given PropertySet is already the root PropertySet of the PropertyTree" );
            }
        }
    }

    void detach()
    {
        if ( value.getType().equals( ValueTypes.PROPERTY_SET ) && !value.isNull() )
        {
            value.asData().detach();
        }
    }

    public PropertySet getParent()
    {
        return parent;
    }

    PropertyId getId()
    {
        return id;
    }

    public String getName()
    {
        return name;
    }

    public int getIndex()
    {
        return index;
    }

    public PropertyPath getPath()
    {
        if ( this.parent.getProperty() != null )
        {
            return PropertyPath.from( this.parent.getProperty().getPath(), PropertyPath.Element.from( this.name, this.index ) );
        }
        else
        {
            return PropertyPath.from( PropertyPath.Element.from( this.name, this.index ) );
        }
    }

    public ValueType getValueType()
    {
        return value.getType();
    }

    public Value getValue()
    {
        return value;
    }

    public boolean hasNullValue()
    {
        return value.isNull();
    }

    public PropertySet getSet()
    {
        return value.asData();
    }

    public Object getObject()
    {
        return value.getObject();
    }

    public String getString()
    {
        return value.asString();
    }

    public Boolean getBoolean()
    {
        return value.asBoolean();
    }

    public Long getLong()
    {
        return value.asLong();
    }

    public Double getDouble()
    {
        return value.asDouble();
    }

    public GeoPoint getGeoPoint()
    {
        return value.asGeoPoint();
    }

    public LocalDate getLocalDate()
    {
        return value.asLocalDate();
    }

    public LocalDateTime getLocalDateTime()
    {
        return value.asLocalDateTime();
    }

    public LocalTime getLocalTime()
    {
        return value.asLocalTime();
    }

    public Instant getInstant()
    {
        return value.asInstant();
    }

    public static void checkName( final String name )
    {
        if ( name == null )
        {
            throw new NullPointerException( "Property name cannot be null" );
        }
        if ( StringUtils.isBlank( name ) )
        {
            throw new IllegalArgumentException( "Property name cannot be blank" );
        }
        if ( name.contains( "." ) )
        {
            throw new IllegalArgumentException( "Property name cannot contain ." );
        }
        if ( name.contains( "[" ) || name.contains( "]" ) )
        {
            throw new IllegalArgumentException( "Property name cannot contain [ or ]" );
        }
    }

    @Override
    public boolean equals( final Object o )
    {
        if ( this == o )
        {
            return true;
        }
        if ( !( o instanceof Property ) )
        {
            return false;
        }

        final Property property = (Property) o;

        if ( index != property.index )
        {
            return false;
        }
        if ( !name.equals( property.name ) )
        {
            return false;
        }
        if ( !value.equals( property.value ) )
        {
            return false;
        }

        return Objects.equals( index, property.index ) && Objects.equals( name, property.name ) && Objects.equals( value, property.value );
    }

    @Override
    public int hashCode()
    {
        return Objects.hash( name, index, value );
    }

    @Override
    public String toString()
    {
        final StringBuilder s = new StringBuilder();
        s.append( name ).append( ": " ).append( value );
        return s.toString();
    }

    public int countAncestors()
    {
        return getPath().elementCount() - 1;
    }

    /**
     * Copies this Property and adds it to the given PropertySet.
     */
    public Property copyTo( final PropertySet destination )
    {
        final Value copiedValue = value.copy( destination.getTree() );
        final Property property = new Property( name, index, copiedValue, id, destination );
        destination.add( property );
        return property;
    }
}