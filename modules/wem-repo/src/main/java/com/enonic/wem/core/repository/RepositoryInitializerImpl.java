package com.enonic.wem.core.repository;

import java.util.Set;

import org.elasticsearch.common.unit.TimeValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.collect.Sets;

import com.enonic.wem.api.repository.Repository;
import com.enonic.wem.core.elasticsearch.ClusterHealth;
import com.enonic.wem.core.index.IndexService;
import com.enonic.wem.core.index.IndexType;
import com.enonic.wem.repo.RepositoryInitializer;

public final class RepositoryInitializerImpl
    implements RepositoryInitializer
{
    private IndexService indexService;

    private final static Logger LOG = LoggerFactory.getLogger( RepositoryInitializerImpl.class );

    public final void init( final Repository repository )
    {
        LOG.info( "Initializing repositoryId {}", repository.getId() );

        final ClusterHealth clusterHealth = indexService.getClusterHealth( TimeValue.timeValueSeconds( 2 ) );

        if ( !clusterHealth.equals( ClusterHealth.RED ) )
        {
            deleteExistingRepoIndices( repository );
        }

        createIndexes( repository );

        final String storageIndexName = getStoreIndexName( repository );
        final String searchIndexName = getSearchIndexName( repository );

        indexService.applyMapping( storageIndexName, IndexType.WORKSPACE.getName(),
                                   RepositoryIndexMappingProvider.getWorkspaceMapping( repository ) );

        indexService.applyMapping( storageIndexName, IndexType.VERSION.getName(),
                                   RepositoryIndexMappingProvider.getVersionMapping( repository ) );

        indexService.applyMapping( searchIndexName, IndexType._DEFAULT_.getName(),
                                   RepositoryIndexMappingProvider.getSearchMappings( repository ) );

        indexService.refresh( storageIndexName, searchIndexName );
    }

    public void waitForInitialized( final Repository repository )
    {
        final String storageIndexName = getStoreIndexName( repository );
        final String searchIndexName = getSearchIndexName( repository );

        indexService.getClusterHealth( TimeValue.timeValueSeconds( 1 ), storageIndexName, searchIndexName );
    }

    private void createIndexes( final Repository repository )
    {
        LOG.info( "Create storage-index for repositoryId {}", repository.getId() );
        final String storageIndexName = getStoreIndexName( repository );
        final String storageIndexSettings = RepositoryStorageSettingsProvider.getSettings( repository );
        indexService.createIndex( storageIndexName, storageIndexSettings );

        LOG.info( "Create search-index for repositoryId {}", repository.getId() );
        final String searchIndexName = getSearchIndexName( repository );
        final String searchIndexSettings = RepositorySearchIndexSettingsProvider.getSettings( repository );
        indexService.createIndex( searchIndexName, searchIndexSettings );
    }

    private void deleteExistingRepoIndices( final Repository repository )
    {
        if ( isInitialized( repository ) )
        {
            LOG.info( "Deleting existing repository indices" );

            final Set<String> repoIndexes = Sets.newHashSet();

            repoIndexes.add( getStoreIndexName( repository ) );
            repoIndexes.add( getSearchIndexName( repository ) );

            if ( !repoIndexes.isEmpty() )
            {
                indexService.deleteIndices( repoIndexes );
            }
        }
        else
        {
            LOG.info( "No existing indices found" );
        }
    }

    public boolean isInitialized( final Repository repository )
    {
        final String storageIndexName = getStoreIndexName( repository );
        final String searchIndexName = getSearchIndexName( repository );

        return indexService.indicesExists( storageIndexName, searchIndexName );
    }

    private String getStoreIndexName( final Repository repository )
    {
        return StorageNameResolver.resolveStorageIndexName( repository.getId() );
    }

    private String getSearchIndexName( final Repository repository )
    {
        return IndexNameResolver.resolveSearchIndexName( repository.getId() );
    }

    public void setIndexService( final IndexService indexService )
    {
        this.indexService = indexService;
    }
}