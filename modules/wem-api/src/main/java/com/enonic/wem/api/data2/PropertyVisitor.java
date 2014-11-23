package com.enonic.wem.api.data2;


public abstract class PropertyVisitor
{
    private ValueType valueType;

    private boolean visitPropertiesWithSet = false;

    public PropertyVisitor restrictType( final ValueType valueType )
    {
        this.valueType = valueType;
        return this;
    }

    public PropertyVisitor visitPropertiesWithSet( final boolean value )
    {
        visitPropertiesWithSet = value;
        return this;
    }

    public void traverse( final PropertyTree propertyTree )
    {
        traverse( propertyTree.getRoot() );
    }

    public void traverse( final PropertySet propertySet )
    {
        for ( final Property property : propertySet.getProperties() )
        {
            final boolean valueTypeRestrictionSatisfied = valueType == null || valueType.equals( property.getValue().getType() );
            final boolean propertyWithSetRestrictionSatisfied =
                visitPropertiesWithSet || !property.getValueType().equals( ValueTypes.PROPERTY_SET );
            if ( valueTypeRestrictionSatisfied && propertyWithSetRestrictionSatisfied )
            {
                visit( property );
            }

            if ( property.getValueType().equals( ValueTypes.PROPERTY_SET ) )
            {
                traverse( property.getSet() );
            }
        }
    }

    public abstract void visit( final Property property );
}