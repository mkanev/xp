package com.enonic.wem.script.mapper;

import com.enonic.wem.api.content.page.region.Component;
import com.enonic.wem.api.content.page.region.Region;
import com.enonic.wem.script.serializer.MapGenerator;
import com.enonic.wem.script.serializer.MapSerializable;

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
