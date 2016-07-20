package com.enonic.xp.repo.impl.repository;

import com.enonic.xp.index.IndexType;
import com.enonic.xp.repository.IndexMapping;
import com.enonic.xp.repository.RepositoryId;

public interface IndexMappingProvider
{
    IndexMapping get( final RepositoryId repositoryId, final IndexType indexType );

}
