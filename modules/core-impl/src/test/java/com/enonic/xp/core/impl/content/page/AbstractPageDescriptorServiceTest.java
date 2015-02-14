package com.enonic.xp.core.impl.content.page;

import org.junit.Before;

import com.enonic.wem.api.content.page.DescriptorKey;
import com.enonic.wem.api.resource.ResourceKey;

public abstract class AbstractPageDescriptorServiceTest
    extends AbstractDescriptorServiceTest
{
    protected PageDescriptorServiceImpl service;

    @Before
    public final void setupService()
    {
        this.service = new PageDescriptorServiceImpl();
    }

    @Override
    protected final ResourceKey toResourceKey( final DescriptorKey key )
    {
        return ResourceKey.from( key.getModuleKey(), "cms/pages/" + key.getName() + "/page.xml" );
    }

    @Override
    protected final String toDescriptorXml( final DescriptorKey key )
    {
        return "<page-component><display-name>" + key.getName() + "</display-name></page-component>";
    }
}