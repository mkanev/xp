package com.enonic.xp.inputtype;


import java.time.LocalDate;

import org.junit.Test;

import com.enonic.xp.data.Value;
import com.enonic.xp.data.ValueFactory;
import com.enonic.xp.data.ValueTypes;

import static org.junit.Assert.*;

public class DateTypeTest
    extends BaseInputTypeTest
{
    public DateTypeTest()
    {
        super( DateType.INSTANCE );
    }

    @Test
    public void testName()
    {
        assertEquals( "Date", this.type.getName().toString() );
    }

    @Test
    public void testToString()
    {
        assertEquals( "Date", this.type.toString() );
    }

    @Test
    public void testCreateProperty()
    {
        final InputTypeConfig config = newEmptyConfig();
        final Value value = this.type.createValue( ValueFactory.newString( "2015-01-02" ), config );

        assertNotNull( value );
        assertSame( ValueTypes.LOCAL_DATE, value.getType() );
    }

    @Test
    public void testCreateDefaultValue()
    {
        final InputTypeDefault config = InputTypeDefault.create().
            property( InputTypeProperty.create( "default", "2014-08-16" ).
                build() ).
            build();

        final Value value = this.type.createDefaultValue( config );

        assertNotNull( value );
        assertSame( ValueTypes.LOCAL_DATE, value.getType() );
        assertEquals( value.toString(), "2014-08-16" );
    }

    @Test
    public void testRelativeDefaultValue()
    {
        final InputTypeDefault config = InputTypeDefault.create().
            property( InputTypeProperty.create( "default", "+1year -5months -36d" ).
                build() ).
            build();

        final Value value = this.type.createDefaultValue( config );

        assertNotNull( value );
        assertSame( ValueTypes.LOCAL_DATE, value.getType() );
        assertEquals( value.getObject(), LocalDate.now().plusYears( 1 ).plusMonths( -5 ).plusDays( -36 ) );
    }

    @Test(expected = IllegalArgumentException.class)
    public void testCreateDefaultValue_invalid()
    {
        final InputTypeDefault config = InputTypeDefault.create().
            property( InputTypeProperty.create( "default", "2014-18-16" ).
                build() ).
            build();

        this.type.createDefaultValue( config );
    }

    @Test
    public void testValidate()
    {
        final InputTypeConfig config = newEmptyConfig();
        this.type.validate( localDateProperty(), config );
    }

    @Test(expected = InputTypeValidationException.class)
    public void testValidate_invalidType()
    {
        final InputTypeConfig config = newEmptyConfig();
        this.type.validate( booleanProperty( true ), config );
    }

    private InputTypeConfig newEmptyConfig()
    {
        return InputTypeConfig.create().build();
    }
}
