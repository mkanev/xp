package com.enonic.xp.repo.impl.elasticsearch.storage;

import java.util.Collection;

import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.delete.DeleteRequestBuilder;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.get.MultiGetRequest;
import org.elasticsearch.action.get.MultiGetRequestBuilder;
import org.elasticsearch.action.get.MultiGetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.Requests;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.TermsFilterBuilder;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.enonic.xp.index.IndexType;
import com.enonic.xp.node.NodeIndexPath;
import com.enonic.xp.repo.impl.ReturnFields;
import com.enonic.xp.repo.impl.StorageSettings;
import com.enonic.xp.repo.impl.elasticsearch.document.IndexDocument;
import com.enonic.xp.repo.impl.elasticsearch.executor.CopyExecutor;
import com.enonic.xp.repo.impl.elasticsearch.executor.StoreExecutor;
import com.enonic.xp.repo.impl.elasticsearch.query.ElasticsearchQuery;
import com.enonic.xp.repo.impl.elasticsearch.result.GetResultFactory;
import com.enonic.xp.repo.impl.elasticsearch.result.GetResultsFactory;
import com.enonic.xp.repo.impl.repository.IndexNameResolver;
import com.enonic.xp.repo.impl.search.SearchStorageType;
import com.enonic.xp.repo.impl.storage.CopyRequest;
import com.enonic.xp.repo.impl.storage.DeleteRequest;
import com.enonic.xp.repo.impl.storage.DeleteRequests;
import com.enonic.xp.repo.impl.storage.GetByIdRequest;
import com.enonic.xp.repo.impl.storage.GetByIdsRequest;
import com.enonic.xp.repo.impl.storage.GetResult;
import com.enonic.xp.repo.impl.storage.GetResults;
import com.enonic.xp.repo.impl.storage.StorageDao;
import com.enonic.xp.repo.impl.storage.StoreRequest;

@Component
public class StorageDaoImpl
    implements StorageDao
{
    private Client client;

    @Override
    public String store( final StoreRequest request )
    {
        final StorageSettings settings = request.getSettings();

        final IndexRequest indexRequest = Requests.indexRequest().
            index( settings.getIndexName() ).
            type( settings.getIndexType() ).
            source( XContentBuilderFactory.create( request ) ).
            id( request.getId() ).
            refresh( request.isForceRefresh() );

        return doStore( indexRequest, request.getTimeout() );
    }

    @Override
    public void store( final Collection<IndexDocument> indexDocuments )
    {
        StoreExecutor.create( this.client ).
            build().
            execute( indexDocuments );
    }

    @Override
    public boolean delete( final DeleteRequest request )
    {
        final StorageSettings settings = request.getSettings();
        final String id = request.getId();

        final DeleteRequestBuilder builder = new DeleteRequestBuilder( this.client ).
            setId( id ).
            setIndex( settings.getIndexName() ).
            setType( settings.getIndexType() ).
            setRefresh( request.isForceRefresh() );

        final DeleteResponse deleteResponse = this.client.delete( builder.request() ).
            actionGet( request.getTimeoutAsString() );

        return deleteResponse.isFound();
    }

    @Override
    public boolean delete( final DeleteRequests request )
    {
        final StorageSettings settings = request.getSettings();

        final BulkRequestBuilder bulkRequest = new BulkRequestBuilder( this.client );

        for ( final String nodeId : request.getIds() )
        {
            bulkRequest.add( new DeleteRequestBuilder( this.client ).
                setId( nodeId ).
                setIndex( settings.getIndexName() ).
                setType( settings.getIndexType() ) );
        }

        final BulkResponse response = bulkRequest.execute().actionGet();

        return response.hasFailures();
    }

    private String doStore( final IndexRequest request, final String timeout )
    {
        final IndexResponse indexResponse = this.client.index( request ).
            actionGet( timeout );

        return indexResponse.getId();
    }

    @Override
    public GetResult getById( final GetByIdRequest request )
    {
        final StorageSettings storageSettings = request.getStorageSettings();
        final GetRequest getRequest = new GetRequest( storageSettings.getIndexName() ).
            type( storageSettings.getIndexType() ).
            preference( request.getSearchPreference().getName() ).
            id( request.getId() );

        if ( request.getReturnFields().isNotEmpty() )
        {
            getRequest.fields( request.getReturnFields().getReturnFieldNames() );
        }

        final GetResponse getResponse = client.get( getRequest ).
            actionGet( request.getTimeout() );

        return GetResultFactory.create( getResponse );
    }

    @Override
    public GetResults getByIds( final GetByIdsRequest requests )
    {
        if ( requests.getRequests().isEmpty() )
        {
            return new GetResults();
        }

        final MultiGetRequestBuilder multiGetRequestBuilder = new MultiGetRequestBuilder( this.client );

        for ( final GetByIdRequest request : requests.getRequests() )
        {
            final StorageSettings storageSettings = request.getStorageSettings();

            final MultiGetRequest.Item item =
                new MultiGetRequest.Item( storageSettings.getIndexName(), storageSettings.getIndexType(), request.getId() );

            if ( request.getReturnFields().isNotEmpty() )
            {
                item.fields( request.getReturnFields().getReturnFieldNames() );
            }

            multiGetRequestBuilder.add( item );

        }

        final MultiGetResponse multiGetItemResponses = this.client.multiGet( multiGetRequestBuilder.request() ).actionGet();

        return GetResultsFactory.create( multiGetItemResponses );
    }

    @Override
    public void copy( final CopyRequest request )
    {
        final TermsFilterBuilder idFilter = new TermsFilterBuilder( NodeIndexPath.ID.getPath(), request.getNodeIds().getAsStrings() );
        QueryBuilder query = QueryBuilders.matchAllQuery();

        final ElasticsearchQuery esQuery = ElasticsearchQuery.create().
            query( QueryBuilders.filteredQuery( query, idFilter ) ).
            index( request.getStorageSettings().getIndexName() ).
            indexType( request.getStorageSettings().getIndexType() ).
            size( request.getNodeIds().getSize() ).
            batchSize( 10_000 ).
            from( 0 ).
            setReturnFields( ReturnFields.from( NodeIndexPath.SOURCE ) ).
            build();

        CopyExecutor.create( this.client ).
            query( esQuery ).
            targetIndex( IndexNameResolver.resolveIndexName( request.getTargetRepo(), IndexType.SEARCH ) ).
            targetType( SearchStorageType.from( request.getTargetBranchId() ).getName() ).
            build().
            execute();
    }

    @Reference
    public void setClient( final Client client )
    {
        this.client = client;
    }
}
