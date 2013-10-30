package com.enonic.wem.core.index.elastic;

import java.util.Collection;

import com.enonic.wem.api.content.query.ContentIndexQuery;
import com.enonic.wem.core.index.DeleteDocument;
import com.enonic.wem.core.index.IndexStatus;
import com.enonic.wem.core.index.content.ContentSearchResults;
import com.enonic.wem.core.index.document.IndexDocument;
import com.enonic.wem.core.index.document.IndexDocument2;

public interface ElasticsearchIndexService
{
    public IndexStatus getIndexStatus( final String indexName, final boolean waitForStatusYellow );

    public boolean indexExists( String indexName );

    public void createIndex( String indexName );

    public void putMapping( IndexMapping indexMapping );

    public void index( Collection<IndexDocument> indexDocuments );

    public void indexDocuments( Collection<IndexDocument2> indexDocuments );

    public void delete( final DeleteDocument deleteDocument );

    public ContentSearchResults search( final ContentIndexQuery contentIndexQuery );

    public void deleteIndex( final String indexName );
}
