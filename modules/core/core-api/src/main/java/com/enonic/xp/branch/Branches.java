package com.enonic.xp.branch;

import java.util.Map;

import com.google.common.collect.Maps;

/**
 * Temporary holder for branches for testing-purposes
 */
public class Branches
{
    public static Branches instance = null;

    private final Map<BranchId, Branch> branches;

    private Branches()
    {
        this.branches = Maps.newHashMap();
    }

    public BranchId add( final Branch branch )
    {
        this.branches.put( branch.getBranchId(), branch );
        return branch.getBranchId();
    }

    public Branch get( final BranchId branchId )
    {
        return this.branches.get( branchId );
    }

    public static Branches getInstance()
    {
        if ( instance == null )
        {
            instance = new Branches();
        }

        return instance;
    }


}
