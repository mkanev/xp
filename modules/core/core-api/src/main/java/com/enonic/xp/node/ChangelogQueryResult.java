package com.enonic.xp.node;

import java.util.Set;

import com.google.common.collect.Sets;

public class ChangelogQueryResult
{
    private final NodeIds nodeIds;

    public ChangelogQueryResult( final NodeIds nodeIds )
    {
        this.nodeIds = nodeIds;
    }

    public static Builder create()
    {
        return new Builder();
    }

    public NodeIds getNodeIds()
    {
        return nodeIds;
    }

    public static class Builder
    {
        private Set<NodeId> nodeIds = Sets.newLinkedHashSet();

        public Builder add( final NodeId nodeId )
        {
            this.nodeIds.add( nodeId );
            return this;
        }

        public ChangelogQueryResult build()
        {
            return new ChangelogQueryResult( NodeIds.from( nodeIds ) );
        }

    }

}
