package com.enonic.xp.repo.impl.repository;

import com.fasterxml.jackson.databind.JsonNode;

import com.enonic.xp.repo.impl.index.OldIndexSettings;
import com.enonic.xp.repository.RepositoryId;
import com.enonic.xp.util.JsonHelper;

class RepositoryStorageSettingsProvider
    extends AbstractRepositorySettingsProvider
{
    private static final String STORAGE_SETTINGS_FILE_PATTERN = "-storage-settings.json";

    private final static String PREFIX = "/META-INF/index/settings/";

    private static final String DEFAULT_STORAGE_SETTINGS_FILE_NAME = "default-storage-settings.json";

    public static OldIndexSettings getSettings( final RepositoryId repositoryId )
    {
        final JsonNode defaultSettings = doGet( repositoryId, resolveDefaultSettingsFileName() );

        final JsonNode specificSettings = doGet( repositoryId, resolveFileName( repositoryId ) );

        return OldIndexSettings.from( JsonHelper.merge( defaultSettings, specificSettings ) );
    }

    private static String resolveFileName( final RepositoryId repositoryId )
    {
        return ( PREFIX + repositoryId.toString() + STORAGE_SETTINGS_FILE_PATTERN );
    }

    private static String resolveDefaultSettingsFileName()
    {
        return ( PREFIX + DEFAULT_STORAGE_SETTINGS_FILE_NAME );
    }
}
