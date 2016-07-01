package com.enonic.xp.repo.impl.repository;

import com.enonic.xp.index.IndexType;
import com.enonic.xp.repository.RepositoryId;

public class IndexNameResolver
{
    private final static String SEARCH_INDEX_PREFIX = "search";

    private final static String VERSION_INDEX_PREFIX = "version";

    private final static String BRANCH_INDEX_PREFIX = "branch";

    private final static String DIVIDER = "-";

    public static String resolveIndexName( final RepositoryId repositoryId, final IndexType indexType )
    {
        switch ( indexType )
        {
            case SEARCH:
                return SEARCH_INDEX_PREFIX + DIVIDER + repositoryId.toString();
            case BRANCH:
                return BRANCH_INDEX_PREFIX + DIVIDER + repositoryId.toString();
            case VERSION:
                return VERSION_INDEX_PREFIX + DIVIDER + repositoryId.toString();
            default:
                throw new IllegalArgumentException( "Cannot resolve name for index-type [" + indexType + "]" );
        }
    }
}
