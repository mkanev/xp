package com.enonic.xp.repo.impl.repository;

import java.net.URL;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.enonic.xp.index.IndexType;
import com.enonic.xp.repo.impl.index.IndexServiceInternal;
import com.enonic.xp.repository.IndexSettings;
import com.enonic.xp.repository.IndexSettingsFactory;
import com.enonic.xp.repository.Repository;
import com.enonic.xp.repository.RepositoryService;
import com.enonic.xp.repository.RepositorySettings;

@Component
public class RepositoryServiceImpl
    implements RepositoryService
{
    private IndexServiceInternal indexServiceInternal;

    private final static String DEFAULT_PREFIX = "/META-INF/index/settings/";

    private static final String DEFAULT_STORAGE_SETTINGS_FILE_NAME = "default-storage-settings.json";

    @Override
    public Repository create( final RepositorySettings repositorySettings )
    {
        createIndices( repositorySettings );

        applyMapping( repositorySettings );

        // Check if repo exists
        // createIndexes
        // Apply mappings

        return null;
    }

    private void createIndices( final RepositorySettings repositorySettings )
    {
        createIndex( repositorySettings, IndexType.SEARCH );
        createIndex( repositorySettings, IndexType.VERSION );
        createIndex( repositorySettings, IndexType.BRANCH );
    }

    private void applyMappings( final RepositorySettings repositorySettings )
    {

    }

    private void applyMapping( final RepositorySettings repositorySettings, final IndexType indexType )
    {

    }


    private void createIndex( final RepositorySettings repositorySettings, final IndexType indexType )
    {
        indexServiceInternal.createIndex( resolveIndexName( repositorySettings.getName(), indexType ),
                                          getIndexSettings( repositorySettings, indexType ) );
    }

    private IndexSettings getIndexSettings( final RepositorySettings repositorySettings, final IndexType indexType )
    {
        final IndexSettings indexSettings = repositorySettings.getIndicesSettings().getSetting( indexType );

        if ( indexSettings == null )
        {
            return IndexSettingsFactory.from( getDefaultSettingsUrl( indexType ) );
        }

        return indexSettings.includeDefaultSettings() ? IndexSettingsMerger.merge(
            IndexSettingsFactory.from( getDefaultSettingsUrl( indexType ) ), indexSettings ) : indexSettings;
    }

    private String resolveIndexName( final String repoName, final IndexType indexType )
    {
        return repoName + "-" + indexType.getName();
    }

    private URL getDefaultSettingsUrl( final IndexType indexType )
    {
        return RepositoryServiceImpl.class.getResource( DEFAULT_PREFIX + "default-" + indexType.getName() + "-settings.json" );
    }

    @Reference
    public void setIndexServiceInternal( final IndexServiceInternal indexServiceInternal )
    {
        this.indexServiceInternal = indexServiceInternal;
    }
}
