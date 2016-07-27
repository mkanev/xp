package com.enonic.xp.branch;

public class Branch
{
    private final BranchId branchId;

    private final boolean isMaster;

    private final BranchId master;

    private Branch( final Builder builder )
    {
        branchId = builder.branchId;
        isMaster = builder.isMaster;
        master = builder.master;
    }

    public BranchId getBranchId()
    {
        return branchId;
    }

    public boolean isMaster()
    {
        return isMaster;
    }

    public BranchId getMaster()
    {
        return master;
    }

    public static Builder create()
    {
        return new Builder();
    }


    public static final class Builder
    {
        private BranchId branchId;

        private boolean isMaster;

        private BranchId master;

        private Builder()
        {
        }

        public Builder branchId( final BranchId val )
        {
            branchId = val;
            return this;
        }

        public Builder isMaster( final boolean val )
        {
            isMaster = val;
            return this;
        }

        public Builder master( final BranchId val )
        {
            master = val;
            return this;
        }

        public Branch build()
        {
            return new Branch( this );
        }
    }
}
