package com.enonic.wem.repo.internal.elasticsearch.workspace;

import java.util.Collection;

import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.TermQueryBuilder;

import com.enonic.wem.api.node.NodeVersionId;
import com.enonic.wem.api.node.NodeVersionIds;
import com.enonic.wem.api.repository.RepositoryId;
import com.enonic.wem.repo.internal.elasticsearch.ElasticsearchDao;
import com.enonic.wem.repo.internal.index.result.SearchResultFieldValue;

abstract class AbstractWorkspaceCommand
{
    static final boolean DEFAULT_REFRESH = true;

    final ElasticsearchDao elasticsearchDao;

    final RepositoryId repositoryId;

    AbstractWorkspaceCommand( final Builder builder )
    {
        this.elasticsearchDao = builder.elasticsearchDao;
        this.repositoryId = builder.repositoryId;
    }

    NodeVersionIds fieldValuesToVersionIds( final Collection<SearchResultFieldValue> fieldValues )
    {
        final NodeVersionIds.Builder builder = NodeVersionIds.create();

        for ( final SearchResultFieldValue searchResultFieldValue : fieldValues )
        {
            if ( searchResultFieldValue == null )
            {
                continue;
            }

            builder.add( NodeVersionId.from( searchResultFieldValue.getValue().toString() ) );
        }
        return builder.build();
    }

    BoolQueryBuilder joinWithWorkspaceQuery( final String workspaceName, final QueryBuilder specificQuery )
    {
        final BoolQueryBuilder boolQueryBuilder = new BoolQueryBuilder();

        final TermQueryBuilder workspaceQuery = new TermQueryBuilder( WorkspaceIndexPath.WORKSPACE_ID.getPath(), workspaceName );
        boolQueryBuilder.must( specificQuery );
        boolQueryBuilder.must( workspaceQuery );

        return boolQueryBuilder;
    }

    static abstract class Builder<B extends Builder>
    {
        private ElasticsearchDao elasticsearchDao;

        private RepositoryId repositoryId;

        @SuppressWarnings("unchecked")
        B elasticsearchDao( final ElasticsearchDao elasticsearchDao )
        {
            this.elasticsearchDao = elasticsearchDao;
            return (B) this;
        }

        @SuppressWarnings("unchecked")
        B repository( final RepositoryId repositoryId )
        {
            this.repositoryId = repositoryId;
            return (B) this;
        }

    }

}