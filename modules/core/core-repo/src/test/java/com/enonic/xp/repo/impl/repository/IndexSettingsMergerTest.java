package com.enonic.xp.repo.impl.repository;

import org.junit.Test;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import com.enonic.xp.repository.IndexSettings;

import static org.junit.Assert.*;

public class IndexSettingsMergerTest
{
    @Test
    public void override_default_setting()
        throws Exception
    {
        final ObjectNode defaultSettings = JsonNodeFactory.instance.objectNode();
        defaultSettings.put( "val1", "orig1" );
        defaultSettings.put( "val2", "orig2" );

        final ObjectNode settings = JsonNodeFactory.instance.objectNode();
        settings.put( "val2", "new2" );

        final IndexSettings merged = IndexSettingsMerger.merge( new IndexSettings( defaultSettings ), new IndexSettings( settings ) );
        assertEquals( "orig1", merged.get().get( "val1" ).asText() );
        assertEquals( "new2", merged.get().get( "val2" ).asText() );
    }
}