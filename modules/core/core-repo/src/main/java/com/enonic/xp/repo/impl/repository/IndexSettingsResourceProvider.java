package com.enonic.xp.repo.impl.repository;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.io.Resources;

import com.enonic.xp.index.IndexType;
import com.enonic.xp.repo.impl.index.IndexException;
import com.enonic.xp.repository.IndexSettings;
import com.enonic.xp.repository.RepositoryId;
import com.enonic.xp.util.JsonHelper;

public class IndexSettingsResourceProvider
    implements IndexSettingsProvider
{
    private final static String BASE_FOLDER = "/com/enonic/xp/repo/impl/repository/index/settings";

    @Override
    public IndexSettings get( final RepositoryId repositoryId, final IndexType indexType )
    {
        String fileName = BASE_FOLDER + "/" + repositoryId.toString() + "/" + indexType.getName() + "-settings.json";

        try
        {
            final JsonNode settings = JsonHelper.from( Resources.getResource( IndexSettingsResourceProvider.class, fileName ) );

            return new IndexSettings( settings );
        }
        catch ( Exception e )
        {
            throw new IndexException( "Settings for repositoryId " + repositoryId + " from file: " + fileName + " not found", e );
        }

    }
}
