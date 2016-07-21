package com.enonic.xp.repo.impl.repository;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.enonic.xp.index.IndexType;
import com.enonic.xp.repo.impl.index.IndexServiceInternal;
import com.enonic.xp.repository.IndexConfig;
import com.enonic.xp.repository.IndexConfigs;
import com.enonic.xp.repository.Repository;
import com.enonic.xp.repository.RepositoryId;
import com.enonic.xp.repository.RepositoryService;
import com.enonic.xp.repository.RepositorySettings;

@Component
public class RepositoryServiceImpl
    implements RepositoryService
{
    private IndexServiceInternal indexServiceInternal;

    @Override
    public Repository create( final RepositorySettings repositorySettings )
    {
        doCreateIndexes( repositorySettings.getRepositoryId(), repositorySettings.getIndexConfigs() );
        applyMappings( repositorySettings.getRepositoryId(), repositorySettings.getIndexConfigs() );

        return null;
    }

    public void createIndex( final RepositoryId repositoryId, final IndexType indexType, final IndexConfig indexConfig )
    {
        doCreateIndex( repositoryId, indexType, indexConfig );
    }

    private void doCreateIndexes( final RepositoryId repositoryId, final IndexConfigs indexConfigs )
    {
        createIndex( repositoryId, IndexType.SEARCH, indexConfigs.get( IndexType.SEARCH ) );
        createIndex( repositoryId, IndexType.VERSION, indexConfigs.get( IndexType.VERSION ) );
        createIndex( repositoryId, IndexType.BRANCH, indexConfigs.get( IndexType.BRANCH ) );
    }

    private void applyMappings( final RepositoryId repositoryId, final IndexConfigs indexConfigs )
    {
        applyMapping( repositoryId, IndexType.SEARCH, indexConfigs.get( IndexType.SEARCH ) );
        applyMapping( repositoryId, IndexType.VERSION, indexConfigs.get( IndexType.VERSION ) );
        applyMapping( repositoryId, IndexType.BRANCH, indexConfigs.get( IndexType.BRANCH ) );
    }

    private void applyMapping( final RepositoryId repositoryId, final IndexType indexType, final IndexConfig indexConfig )
    {
        this.indexServiceInternal.applyMapping( resolveIndexName( repositoryId, indexType ), indexType, indexConfig.getMapping() );
    }

    private void doCreateIndex( final RepositoryId repositoryId, final IndexType indexType, final IndexConfig indexConfig )
    {
        indexServiceInternal.createIndex( resolveIndexName( repositoryId, indexType ), indexConfig.getSettings() );
    }

    private String resolveIndexName( final RepositoryId repositoryId, final IndexType indexType )
    {
        return IndexNameResolver.resolveIndexName( repositoryId, indexType );
    }

    @Reference
    public void setIndexServiceInternal( final IndexServiceInternal indexServiceInternal )
    {
        this.indexServiceInternal = indexServiceInternal;
    }
}
