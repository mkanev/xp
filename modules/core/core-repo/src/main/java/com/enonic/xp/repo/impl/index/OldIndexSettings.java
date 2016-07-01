package com.enonic.xp.repo.impl.index;

import com.fasterxml.jackson.databind.JsonNode;

public class OldIndexSettings
{
    private final String settings;

    private OldIndexSettings( final String settings )
    {
        this.settings = settings;
    }

    public static OldIndexSettings from( final String settings )
    {
        return new OldIndexSettings( settings );
    }

    public static OldIndexSettings from( final JsonNode jsonNode )
    {
        return new OldIndexSettings( jsonNode.toString() );
    }

    public String getSettingsAsString()
    {
        return settings;
    }
}
