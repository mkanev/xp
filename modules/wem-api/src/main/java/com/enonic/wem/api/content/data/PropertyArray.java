package com.enonic.wem.api.content.data;

import java.util.ArrayList;

import com.google.common.base.Preconditions;

import com.enonic.wem.api.content.data.type.ValueType;


public class PropertyArray
    extends DataArray
{
    private final ValueType type;

    private final ArrayList<Value> valueList = new ArrayList<Value>();

    private PropertyArray( final Builder builder )
    {
        super( builder.parent, builder.name );

        Preconditions.checkNotNull( builder.dataType, "dataType cannot be null" );
        this.type = builder.dataType;
    }

    public ValueType getType()
    {
        return type;
    }

    @Override
    void add( final Data data )
    {
        super.add( data );
        valueList.add( data.toProperty().getValue() );
    }

    @Override
    void set( final int index, final Data data )
    {
        super.set( index, data );
        if ( overwritesExisting( index, valueList ) )
        {
            valueList.set( index, data.toProperty().getValue() );
        }
        else
        {
            valueList.add( data.toProperty().getValue() );
        }
    }

    public Value getValue( final int index )
    {
        return valueList.get( index );
    }

    void checkType( Data data )
    {
        if ( !( data instanceof Property ) )
        {
            throw new IllegalArgumentException(
                "Unexpected type of Data for Property array at path [" + getPath() + "]: " + data.getClass().getSimpleName() );
        }
        final Property property = (Property) data;
        if ( !getType().equals( property.getValueType() ) )
        {
            throw new IllegalArgumentException(
                "Array [" + getPath() + "] expects Property of type [" + getType() + "]. Property [" + data.getPath() + "] was of type: " +
                    property.getValueType() );
        }
    }

    public static Builder newPropertyArray()
    {
        return new Builder();
    }

    public static class Builder
    {
        private ValueType dataType;

        private String name;

        private DataSet parent;

        public Builder propertyType( ValueType value )
        {
            this.dataType = value;
            return this;
        }

        public Builder name( String value )
        {
            this.name = value;
            return this;
        }

        public Builder parent( DataSet value )
        {
            this.parent = value;
            return this;
        }

        public PropertyArray build()
        {
            return new PropertyArray( this );
        }
    }
}
