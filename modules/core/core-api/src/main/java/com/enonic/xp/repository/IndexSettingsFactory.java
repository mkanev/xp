package com.enonic.xp.repository;

import java.io.IOException;
import java.net.URL;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.common.base.Charsets;
import com.google.common.io.Resources;

import com.enonic.xp.data.PropertyTree;
import com.enonic.xp.json.ObjectMapperHelper;

public class IndexSettingsFactory
{
    private final static ObjectMapper mapper = ObjectMapperHelper.create().
        configure( SerializationFeature.WRITE_SINGLE_ELEM_ARRAYS_UNWRAPPED, true );

    public static IndexSettings from( final JsonNode jsonNode )
    {
        return new IndexSettings( jsonNode );
    }

    public static IndexSettings from( final URL url )
    {
        if ( url == null )
        {
            throw new RepositoryExeption( "Cannot create index-settings: URL not given" );
        }

        try
        {
            return new IndexSettings( mapper.readTree( Resources.toString( url, Charsets.UTF_8 ) ) );
        }
        catch ( IOException e )
        {
            throw new RepositoryExeption( "Cannot load settings from URL [" + url + "]", e );
        }
    }

    public static IndexSettings from( final PropertyTree propertyTree )
    {
        final Map<String, Object> settingsMap = propertyTree.toMap();

        return new IndexSettings( mapper.valueToTree( settingsMap ) );
    }

    public static IndexSettings from( final String json )
    {
        try
        {
            return new IndexSettings( mapper.readTree( json ) );
        }
        catch ( IOException e )
        {
            throw new RepositoryExeption( "Cannot serialize settings from string [" + json + "]", e );
        }
    }

}
