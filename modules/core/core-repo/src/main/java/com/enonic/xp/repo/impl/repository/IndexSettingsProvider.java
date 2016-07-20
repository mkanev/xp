package com.enonic.xp.repo.impl.repository;

import com.enonic.xp.index.IndexType;
import com.enonic.xp.repository.IndexSettings;
import com.enonic.xp.repository.RepositoryId;

public interface IndexSettingsProvider
{
    IndexSettings get( final RepositoryId repositoryId, final IndexType indexType );
}
