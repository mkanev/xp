package com.enonic.xp.repo.impl.repository;

public class IndexMapping
{
    private final String mapping;

    private IndexMapping( final String mapping )
    {
        this.mapping = mapping;
    }

    public static IndexMapping from( final String mapping )
    {
        return new IndexMapping( mapping );
    }

    public String getMapping()
    {
        return mapping;
    }
}
