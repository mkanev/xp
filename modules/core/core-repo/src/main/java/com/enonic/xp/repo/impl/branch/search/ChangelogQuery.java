package com.enonic.xp.repo.impl.branch.search;

import com.enonic.xp.node.AbstractQuery;
import com.enonic.xp.node.NodePath;
import com.enonic.xp.repo.impl.version.search.ExcludeEntries;

public class ChangelogQuery
    extends AbstractQuery
{
    private final NodePath nodePath;

    private final ExcludeEntries excludes;

    private ChangelogQuery( final Builder builder )
    {
        super( builder );
        nodePath = builder.nodePath;
        excludes = builder.excludes;
    }

    public static Builder create()
    {
        return new Builder();
    }

    public NodePath getNodePath()
    {
        return nodePath;
    }

    public ExcludeEntries getExcludes()
    {
        return excludes;
    }

    public static final class Builder
        extends AbstractQuery.Builder<Builder>
    {
        private NodePath nodePath;

        private ExcludeEntries excludes;

        private Builder()
        {
        }

        public Builder nodePath( final NodePath val )
        {
            nodePath = val;
            return this;
        }

        public Builder excludes( final ExcludeEntries val )
        {
            excludes = val;
            return this;
        }

        public ChangelogQuery build()
        {
            return new ChangelogQuery( this );
        }
    }
}
