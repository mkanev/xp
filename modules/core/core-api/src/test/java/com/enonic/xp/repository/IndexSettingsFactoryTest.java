package com.enonic.xp.repository;

import java.net.URL;

import org.junit.Test;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import com.enonic.xp.data.PropertySet;
import com.enonic.xp.data.PropertyTree;
import com.enonic.xp.json.ObjectMapperHelper;

import static org.junit.Assert.*;

public class IndexSettingsFactoryTest
{
    @Test
    public void from_property_tree()
        throws Exception
    {
        final PropertyTree settings = new PropertyTree();
        final PropertySet index = settings.addSet( "index" );
        index.setLong( "number_of_shards", 4L );
        index.setLong( "number_of_replicas", 4L );

        final IndexSettings indexSettings = IndexSettingsFactory.from( settings );

        jsonAssert( "{\"index\":{\"number_of_shards\":4,\"number_of_replicas\":4}}", indexSettings.get() );
    }

    @Test
    public void from_JsonNode()
        throws Exception
    {
        final ObjectNode settings = JsonNodeFactory.instance.objectNode();
        final ObjectNode indexValues = JsonNodeFactory.instance.objectNode();
        indexValues.put( "number_of_shards", 4 );
        indexValues.put( "number_of_replicas", 4 );
        settings.set( "index", indexValues );

        final IndexSettings indexSettings = IndexSettingsFactory.from( settings );

        jsonAssert( "{\"index\":{\"number_of_shards\":4,\"number_of_replicas\":4}}", indexSettings.get() );
    }

    @Test
    public void from_jsonString()
        throws Exception
    {
        final IndexSettings indexSettings = IndexSettingsFactory.from( "{\"index\":{\"number_of_shards\":4,\"number_of_replicas\":4}}" );

        jsonAssert( "{\"index\":{\"number_of_shards\":4,\"number_of_replicas\":4}}", indexSettings.get() );
    }

    @Test
    public void from_URL()
        throws Exception
    {
        final URL url = IndexSettingsFactoryTest.class.getResource( "index_settings.json" );

        final IndexSettings indexSettings = IndexSettingsFactory.from( url );

        jsonAssert( "{\"index\":{\"number_of_shards\":4,\"number_of_replicas\":4}}", indexSettings.get() );
    }

    private void jsonAssert( final String expected, final JsonNode actual )
        throws Exception
    {
        ObjectMapper mapper = ObjectMapperHelper.create();
        final String expectedString = mapper.writeValueAsString( mapper.readTree( expected ) );
        final String actualString = mapper.writeValueAsString( actual );

        assertEquals( expectedString, actualString );
    }
}