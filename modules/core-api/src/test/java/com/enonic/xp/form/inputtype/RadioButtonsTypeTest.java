package com.enonic.xp.form.inputtype;

import org.junit.Test;

import com.enonic.xp.data.PropertyTree;
import com.enonic.xp.form.InputValidationException;

public class RadioButtonsTypeTest
{
    @Test(expected = InputValidationException.class)
    public void breaksRequiredContract_textLine_which_is_empty_throws_exception()
    {
        new RadioButtonsType().checkBreaksRequiredContract( new PropertyTree().setString( "myText", "" ) );
    }

    @Test(expected = InputValidationException.class)
    public void breaksRequiredContract_textLine_which_is_blank_throws_exception()
    {
        new RadioButtonsType().checkBreaksRequiredContract( new PropertyTree().setString( "myText", " " ) );
    }
}