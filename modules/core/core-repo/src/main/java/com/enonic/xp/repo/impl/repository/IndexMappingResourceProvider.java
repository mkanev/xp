package com.enonic.xp.repo.impl.repository;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.io.Resources;

import com.enonic.xp.index.IndexType;
import com.enonic.xp.repo.impl.index.IndexException;
import com.enonic.xp.repository.IndexMapping;
import com.enonic.xp.repository.RepositoryId;
import com.enonic.xp.util.JsonHelper;

public class IndexMappingResourceProvider
    implements IndexMappingProvider
{
    private final static String BASE_FOLDER = "/com/enonic/xp/repo/impl/repository/index/mapping";

    @Override
    public IndexMapping get( final RepositoryId repositoryId, final IndexType indexType )
    {
        String fileName = BASE_FOLDER + "/" + repositoryId.toString() + "/" + indexType.getName() + "-mapping.json";

        try
        {
            final JsonNode settings = JsonHelper.from( Resources.getResource( IndexMappingResourceProvider.class, fileName ) );

            return new IndexMapping( settings );
        }
        catch ( Exception e )
        {
            throw new IndexException( "Mapping for repositoryId " + repositoryId + " from file: " + fileName + " not found", e );
        }

    }
}
