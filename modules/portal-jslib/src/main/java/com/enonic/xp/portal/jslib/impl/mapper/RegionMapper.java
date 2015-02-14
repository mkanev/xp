package com.enonic.xp.portal.jslib.impl.mapper;

import com.enonic.wem.api.content.page.region.Component;
import com.enonic.wem.api.content.page.region.Region;
import com.enonic.xp.portal.script.serializer.MapGenerator;
import com.enonic.xp.portal.script.serializer.MapSerializable;

public final class RegionMapper
    implements MapSerializable
{
    private final Region value;

    public RegionMapper( final Region value )
    {
        this.value = value;
    }

    @Override
    public void serialize( final MapGenerator gen )
    {
        serialize( gen, this.value );
    }

    private static void serialize( final MapGenerator gen, final Region value )
    {
        gen.map( value.getName() );
        serializeComponents( gen, value.getComponents() );
        gen.end();
    }

    private static void serializeComponents( final MapGenerator gen, final Iterable<Component> values )
    {
        gen.array( "components" );
        for ( final Component component : values )
        {
            gen.map();
            new ComponentMapper( component ).serialize( gen );
            gen.end();
        }
        gen.end();
    }
}