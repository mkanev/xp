package com.enonic.xp.repo.impl.node;

import java.util.Set;

import com.google.common.base.Preconditions;
import com.google.common.collect.Sets;

import com.enonic.xp.content.CompareStatus;
import com.enonic.xp.context.Context;
import com.enonic.xp.context.ContextAccessor;
import com.enonic.xp.node.NodeBranchEntries;
import com.enonic.xp.node.NodeComparison;
import com.enonic.xp.node.NodeComparisons;
import com.enonic.xp.node.NodeId;
import com.enonic.xp.node.NodeIds;
import com.enonic.xp.repo.impl.InternalContext;

public class CompareNodesCommand
    extends AbstractCompareNodeCommand
{
    private final NodeIds nodeIds;

    private CompareNodesCommand( final Builder builder )
    {
        super( builder );
        nodeIds = builder.nodeIds;
    }

    public static Builder create()
    {
        return new Builder();
    }

    public NodeComparisons execute()
    {
        Set<NodeId> allNodeIds = Sets.newHashSet();

        final Context context = ContextAccessor.current();

        final NodeComparisons.Builder builder = NodeComparisons.create();

        final NodeBranchEntries sourceVersions = storageService.getBranchNodeVersions( nodeIds, false, InternalContext.from( context ) );
        final NodeBranchEntries targetVersions = storageService.getBranchNodeVersions( nodeIds, false, InternalContext.create( context ).
            branch( this.target ).
            build() );

        allNodeIds.addAll( sourceVersions.getKeys() );
        allNodeIds.addAll( targetVersions.getKeys() );

        for ( final NodeId id : allNodeIds )
        {
            final CompareStatus compareStatus = CompareStatusResolver.create().
                source( sourceVersions.get( id ) ).
                target( targetVersions.get( id ) ).
                storageService( this.storageService ).
                build().
                resolve();

            builder.add( new NodeComparison( sourceVersions.get( id ), targetVersions.get( id ), compareStatus ) );
        }

        return builder.build();
    }

    public static final class Builder
        extends AbstractCompareNodeCommand.Builder<Builder>
    {
        private NodeIds nodeIds;

        public Builder nodeIds( final NodeIds nodeIds )
        {
            this.nodeIds = nodeIds;
            return this;
        }

        protected void validate()
        {
            super.validate();
            Preconditions.checkNotNull( nodeIds );
        }

        public CompareNodesCommand build()
        {
            return new CompareNodesCommand( this );
        }
    }
}
