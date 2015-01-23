package com.enonic.wem.api.content.page;

import org.junit.Test;

import com.enonic.wem.api.content.page.region.LayoutDescriptor;
import com.enonic.wem.api.content.page.region.PartDescriptor;
import com.enonic.wem.api.form.Form;
import com.enonic.wem.api.form.inputtype.InputTypes;

import static com.enonic.wem.api.content.page.region.RegionDescriptors.newRegionDescriptors;
import static com.enonic.wem.api.form.Input.newInput;
import static org.junit.Assert.*;

public class DescriptorsTest
{

    @Test
    public void pageDescriptor()
    {
        Form pageForm = Form.newForm().
            addFormItem( newInput().name( "pause" ).inputType( InputTypes.DOUBLE ).build() ).
            // add input of type region
                build();

        PageDescriptor pageDescriptor = PageDescriptor.newPageDescriptor().
            displayName( "Landing page" ).
            config( pageForm ).
            regions( newRegionDescriptors().build() ).
            key( DescriptorKey.from( "module:landing-page" ) ).
            build();

        assertEquals( "Landing page", pageDescriptor.getDisplayName() );
        assertEquals( "landing-page", pageDescriptor.getName().toString() );
    }

    @Test
    public void partDescriptor()
    {
        Form partForm = Form.newForm().
            addFormItem( newInput().name( "width" ).inputType( InputTypes.DOUBLE ).build() ).
            build();

        PartDescriptor partDescriptor = PartDescriptor.newPartDescriptor().
            name( "news-part" ).
            displayName( "News part" ).
            config( partForm ).
            key( DescriptorKey.from( "module:new-part" ) ).
            build();

        assertEquals( "News part", partDescriptor.getDisplayName() );
    }

    @Test
    public void layoutDescriptor()
    {
        Form layoutForm = Form.newForm().
            addFormItem( newInput().name( "columns" ).inputType( InputTypes.DOUBLE ).build() ).
            build();

        LayoutDescriptor layoutDescriptor = LayoutDescriptor.newLayoutDescriptor().
            name( "fancy-layout" ).
            displayName( "Fancy layout" ).
            config( layoutForm ).
            regions( newRegionDescriptors().build() ).
            key( DescriptorKey.from( "module:fancy-layout" ) ).
            build();

        assertEquals( "Fancy layout", layoutDescriptor.getDisplayName() );
    }

}