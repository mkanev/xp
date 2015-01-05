package com.enonic.wem.core.content.page;

import com.enonic.wem.api.content.page.region.Component;
import com.enonic.wem.api.content.page.region.ComponentName;
import com.enonic.wem.api.content.page.region.ComponentService;
import com.enonic.wem.api.content.page.region.LayoutDescriptorService;
import com.enonic.wem.api.content.page.region.PartDescriptorService;
import com.enonic.wem.api.module.ModuleKey;

public final class ComponentServiceImpl
    implements ComponentService
{
    protected PartDescriptorService partDescriptorService;

    protected LayoutDescriptorService layoutDescriptorService;

    @Override
    public Component getByName( final ModuleKey module, final ComponentName name )
    {
        return new GetComponentByNameCommand().
            partDescriptorService( this.partDescriptorService ).
            layoutDescriptorService( this.layoutDescriptorService ).
            module( module ).
            name( name ).
            execute();
    }

    public void setPartDescriptorService( final PartDescriptorService partDescriptorService )
    {
        this.partDescriptorService = partDescriptorService;
    }

    public void setLayoutDescriptorService( final LayoutDescriptorService layoutDescriptorService )
    {
        this.layoutDescriptorService = layoutDescriptorService;
    }
}
