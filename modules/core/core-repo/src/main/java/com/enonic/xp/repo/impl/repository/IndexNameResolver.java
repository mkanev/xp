package com.enonic.xp.repo.impl.repository;

import com.enonic.xp.index.IndexType;
import com.enonic.xp.repository.RepositoryId;

public class IndexNameResolver
{
    private final static String SEARCH_INDEX_PREFIX = "search";

    private final static String VERSION_INDEX_PREFIX = "version";

    private final static String BRANCH_INDEX_PREFIX = "branch";

    private final static String CHANGELOG_INDEX_PREFIX = "changelog";

    private final static String DIVIDER = "-";


    public static String resolveIndexName( final String repositoryId, final IndexType indexType )
    {
        return doResolveIndexName( RepositoryId.from( repositoryId ), indexType );
    }

    public static String resolveIndexName( final RepositoryId repositoryId, final IndexType indexType )
    {
        return doResolveIndexName( repositoryId, indexType );
    }

    private static String doResolveIndexName( final RepositoryId repositoryId, final IndexType indexType )
    {
        switch ( indexType )
        {
            case SEARCH:
                return repositoryId.toString() + DIVIDER + SEARCH_INDEX_PREFIX;
            case BRANCH:
                return repositoryId.toString() + DIVIDER + BRANCH_INDEX_PREFIX;
            case VERSION:
                return repositoryId.toString() + DIVIDER + VERSION_INDEX_PREFIX;
            case CHANGELOG:
                return repositoryId.toString() + DIVIDER + CHANGELOG_INDEX_PREFIX;
            default:
                throw new IllegalArgumentException( "Cannot resolve name for index-type [" + indexType + "]" );
        }
    }
}
