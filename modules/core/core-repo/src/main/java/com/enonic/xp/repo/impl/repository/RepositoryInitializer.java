package com.enonic.xp.repo.impl.repository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.io.Resources;

import com.enonic.xp.index.IndexType;
import com.enonic.xp.json.ObjectMapperHelper;
import com.enonic.xp.repo.impl.elasticsearch.ClusterHealthStatus;
import com.enonic.xp.repo.impl.elasticsearch.ClusterStatusCode;
import com.enonic.xp.repo.impl.index.IndexException;
import com.enonic.xp.repo.impl.index.IndexServiceInternal;
import com.enonic.xp.repo.impl.index.OldIndexSettings;
import com.enonic.xp.repository.IndexSettings;
import com.enonic.xp.repository.IndexesMapping;
import com.enonic.xp.repository.IndexesSettings;
import com.enonic.xp.repository.RepositoryId;
import com.enonic.xp.repository.RepositoryService;
import com.enonic.xp.repository.RepositorySettings;
import com.enonic.xp.util.JsonHelper;

public final class RepositoryInitializer
{
    private final static String CLUSTER_HEALTH_TIMEOUT_VALUE = "10s";

    private final static Logger LOG = LoggerFactory.getLogger( RepositoryInitializer.class );

    private final IndexServiceInternal indexServiceInternal;

    private final RepositoryService repositoryService;

    private final static ObjectMapper mapper = ObjectMapperHelper.create();

    private final static String INDEX_SETTINGS_FILES_DIR = "/META-INF/index/settings/";

    public RepositoryInitializer( final IndexServiceInternal indexServiceInternal, final RepositoryService repoService )
    {
        this.indexServiceInternal = indexServiceInternal;
        this.repositoryService = repoService;
    }

    public void initializeRepositories( final RepositoryId... repositoryIds )
    {
        final IndexSettingsResourceProvider settingsProvider = new IndexSettingsResourceProvider();
        final IndexMappingResourceProvider mappingProvider = new IndexMappingResourceProvider();

        if ( !checkClusterHealth() )
        {
            throw new RepositoryException( "Unable to initialize repositories" );
        }

        final boolean isMaster = indexServiceInternal.isMaster();

        for ( final RepositoryId repositoryId : repositoryIds )
        {
            if ( !isInitialized( repositoryId ) && isMaster )
            {
                final RepositorySettings repoSettings = RepositorySettings.create().
                    name( repositoryId.toString() ).
                    indexesSettings( IndexesSettings.create().
                        add( IndexType.VERSION, settingsProvider.get( repositoryId, IndexType.VERSION ) ).
                        add( IndexType.SEARCH, settingsProvider.get( repositoryId, IndexType.SEARCH ) ).
                        add( IndexType.BRANCH, settingsProvider.get( repositoryId, IndexType.BRANCH ) ).
                        build() ).
                    indexesMapping( IndexesMapping.create().
                        add( IndexType.VERSION, mappingProvider.get( repositoryId, IndexType.VERSION ) ).
                        add( IndexType.SEARCH, mappingProvider.get( repositoryId, IndexType.SEARCH ) ).
                        add( IndexType.BRANCH, mappingProvider.get( repositoryId, IndexType.BRANCH ) ).
                        build() ).
                    build();

                this.repositoryService.create( repoSettings );
            }
            else
            {
                waitForInitialized( repositoryId );
            }
        }

        //test();
    }


    private boolean checkClusterHealth()
    {
        try
        {
            final ClusterHealthStatus clusterHealth = indexServiceInternal.getClusterHealth( CLUSTER_HEALTH_TIMEOUT_VALUE );

            if ( clusterHealth.isTimedOut() || clusterHealth.getClusterStatusCode().equals( ClusterStatusCode.RED ) )
            {
                LOG.error( "Cluster not healthy: " + "timed out: " + clusterHealth.isTimedOut() + ", state: " +
                               clusterHealth.getClusterStatusCode() );
                return false;
            }

            return true;
        }
        catch ( Exception e )
        {
            LOG.error( "Failed to get cluster health status", e );
        }

        return false;
    }

    private void doInitializeRepo( final RepositoryId repositoryId )
    {
        LOG.info( "Initializing repositoryId {}", repositoryId );

        createIndexes( repositoryId );

        final String storageIndexName = getBranchIndexName( repositoryId );
        final String searchIndexName = getSearchIndexName( repositoryId );

        indexServiceInternal.applyMapping( storageIndexName, IndexType.BRANCH,
                                           RepositoryIndexMappingProvider.getBranchMapping( repositoryId ) );

        indexServiceInternal.applyMapping( storageIndexName, IndexType.VERSION,
                                           RepositoryIndexMappingProvider.getVersionMapping( repositoryId ) );

        indexServiceInternal.applyMapping( searchIndexName, IndexType.SEARCH,
                                           RepositoryIndexMappingProvider.getSearchMappings( repositoryId ) );

        indexServiceInternal.refresh( storageIndexName, searchIndexName );
    }

    private void waitForInitialized( final RepositoryId repositoryId )
    {
        LOG.info( "Waiting for repository '{}' to be initialized", repositoryId );

        final String branchIndexName = getBranchIndexName( repositoryId );
        final String versionIndexName = getVersionIndexName( repositoryId );
        final String searchIndexName = getSearchIndexName( repositoryId );

        indexServiceInternal.getClusterHealth( CLUSTER_HEALTH_TIMEOUT_VALUE, branchIndexName, searchIndexName, versionIndexName );
    }

    private void createIndexes( final RepositoryId repositoryId )
    {
        createBranchIndex( repositoryId );
        createSearchIndex( repositoryId );
        createVersionIndex( repositoryId );
    }

    private void createSearchIndex( final RepositoryId repositoryId )
    {
        LOG.info( "Create search-index for repositoryId {}", repositoryId );
        final String searchIndexName = getSearchIndexName( repositoryId );
        final OldIndexSettings searchOldIndexSettings = RepositorySearchIndexSettingsProvider.getSettings( repositoryId );
        LOG.debug( "Applying search-index settings for repo {}: {}", repositoryId, searchOldIndexSettings.getSettingsAsString() );
        indexServiceInternal.createIndex( searchIndexName, searchOldIndexSettings );
    }

    private void createBranchIndex( final RepositoryId repositoryId )
    {
        LOG.info( "Create storage-index for repositoryId {}", repositoryId );
        final String storageIndexName = getBranchIndexName( repositoryId );
        final OldIndexSettings storageOldIndexSettings = RepositoryStorageSettingsProvider.getSettings( repositoryId );
        LOG.debug( "Applying storage-index settings for repo {}: {}", repositoryId, storageOldIndexSettings.getSettingsAsString() );
        indexServiceInternal.createIndex( storageIndexName, storageOldIndexSettings );
    }

    private void createVersionIndex( final RepositoryId repositoryId )
    {
        LOG.info( "Create storage-index for repositoryId {}", repositoryId );
        final String storageIndexName = getVersionIndexName( repositoryId );
        final OldIndexSettings storageOldIndexSettings = RepositoryStorageSettingsProvider.getSettings( repositoryId );
        LOG.debug( "Applying storage-index settings for repo {}: {}", repositoryId, storageOldIndexSettings.getSettingsAsString() );
        indexServiceInternal.createIndex( storageIndexName, storageOldIndexSettings );
    }

    private IndexSettings getIndexSettingsFromResource( final RepositoryId repositoryId, final IndexType indexType )
    {
        String fileName = INDEX_SETTINGS_FILES_DIR + repositoryId.toString() + "-" + indexType.getName();

        try
        {
            final JsonNode settings = JsonHelper.from( Resources.getResource( RepositoryStorageSettingsProvider.class, fileName ) );

            return new IndexSettings( settings );
        }
        catch ( Exception e )
        {
            throw new IndexException( "Settings for repositoryId " + repositoryId + " from file: " + fileName + " not found", e );
        }
    }

    private boolean isInitialized( final RepositoryId repositoryId )
    {
        final String branchIndex = getBranchIndexName( repositoryId );
        final String searchIndexName = getSearchIndexName( repositoryId );
        final String versionIndex = getSearchIndexName( repositoryId );

        return indexServiceInternal.indicesExists( branchIndex, searchIndexName, versionIndex );
    }

    private String getBranchIndexName( final RepositoryId repositoryId )
    {
        return IndexNameResolver.resolveIndexName( repositoryId, IndexType.BRANCH );
    }

    private String getVersionIndexName( final RepositoryId repositoryId )
    {
        return IndexNameResolver.resolveIndexName( repositoryId, IndexType.VERSION );
    }

    private String getSearchIndexName( final RepositoryId repositoryId )
    {
        return IndexNameResolver.resolveIndexName( repositoryId, IndexType.SEARCH );
    }

}
