package com.enonic.xp.repository;

import com.fasterxml.jackson.databind.JsonNode;

public class IndexMapping
{
    private final JsonNode mapping;

    public IndexMapping( final JsonNode mapping )
    {
        this.mapping = mapping;
    }

    public JsonNode getMapping()
    {
        return mapping;
    }

    public String getAsString()
    {
        return this.mapping.toString();
    }
}


