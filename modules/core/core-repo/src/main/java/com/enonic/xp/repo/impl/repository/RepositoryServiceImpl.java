package com.enonic.xp.repo.impl.repository;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.enonic.xp.index.IndexType;
import com.enonic.xp.repo.impl.index.IndexServiceInternal;
import com.enonic.xp.repository.IndexMapping;
import com.enonic.xp.repository.IndexSettings;
import com.enonic.xp.repository.Repository;
import com.enonic.xp.repository.RepositoryId;
import com.enonic.xp.repository.RepositoryService;
import com.enonic.xp.repository.RepositorySettings;

@Component
public class RepositoryServiceImpl
    implements RepositoryService
{
    private IndexServiceInternal indexServiceInternal;

    private final IndexSettingsResourceProvider defaultProvider = new IndexSettingsResourceProvider();

    @Override
    public Repository create( final RepositorySettings repositorySettings )
    {
        createIndices( repositorySettings );
        applyMappings( repositorySettings );

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
        applyMapping( repositorySettings, IndexType.SEARCH );
        applyMapping( repositorySettings, IndexType.VERSION );
        applyMapping( repositorySettings, IndexType.BRANCH );
    }

    private void applyMapping( final RepositorySettings repositorySettings, final IndexType indexType )
    {
        final IndexMapping mapping = repositorySettings.getIndexesMapping().getMapping( indexType );
        this.indexServiceInternal.applyMapping( resolveIndexName( repositorySettings.getName(), indexType ), indexType,
                                                mapping.getAsString() );
    }

    private void createIndex( final RepositorySettings repositorySettings, final IndexType indexType )
    {
        indexServiceInternal.createIndex( resolveIndexName( repositorySettings.getName(), indexType ),
                                          getIndexSettings( repositorySettings, indexType ) );
    }

    private IndexSettings getIndexSettings( final RepositorySettings repositorySettings, final IndexType indexType )
    {
        final IndexSettings indexSettings = repositorySettings.getIndexesSettings().getSetting( indexType );

        if ( indexSettings == null )
        {
            return defaultProvider.get( RepositoryId.from( "default" ), indexType );
        }

        return indexSettings.includeDefaultSettings() ? IndexSettingsMerger.merge(
            defaultProvider.get( RepositoryId.from( "default" ), indexType ), indexSettings ) : indexSettings;
    }

    private String resolveIndexName( final String repoName, final IndexType indexType )
    {
        return repoName + "-" + indexType.getName();
    }

    @Reference
    public void setIndexServiceInternal( final IndexServiceInternal indexServiceInternal )
    {
        this.indexServiceInternal = indexServiceInternal;
    }
}
