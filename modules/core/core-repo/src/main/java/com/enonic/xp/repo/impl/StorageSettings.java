package com.enonic.xp.repo.impl;

import com.google.common.base.Preconditions;

import com.enonic.xp.branch.BranchId;
import com.enonic.xp.index.IndexType;
import com.enonic.xp.repo.impl.repository.IndexNameResolver;
import com.enonic.xp.repository.RepositoryId;

public class StorageSettings
{
    private final IndexType indexType;

    private final RepositoryId repositoryId;

    private final BranchId branchId;

    private StorageSettings( final Builder builder )
    {
        indexType = builder.indexType;
        repositoryId = builder.repositoryId;
        branchId = builder.branchId;
    }

    public static Builder create()
    {
        return new Builder();
    }

    public String getIndexName()
    {
        return IndexNameResolver.resolveIndexName( this.repositoryId, this.indexType );
    }

    public String getIndexType()
    {
        if ( !indexType.isDynamicTypes() )
        {
            return indexType.getName();
        }

        return branchId.toString();
    }

    public static final class Builder
    {
        private IndexType indexType;

        private RepositoryId repositoryId;

        private BranchId branchId;

        private Builder()
        {
        }

        public Builder indexType( final IndexType val )
        {
            indexType = val;
            return this;
        }

        public Builder repositoryId( final RepositoryId val )
        {
            repositoryId = val;
            return this;
        }

        public Builder branch( final BranchId val )
        {
            branchId = val;
            return this;
        }

        private void validate()
        {
            Preconditions.checkNotNull( indexType, "indexType must be set" );
            Preconditions.checkNotNull( repositoryId, "repositoryId must be set" );
            Preconditions.checkNotNull( branchId, "branch must be set" );
        }

        public StorageSettings build()
        {
            this.validate();
            return new StorageSettings( this );
        }
    }
}
