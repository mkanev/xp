package com.enonic.wem.admin.rest.resource.repo;

import java.util.Set;

import com.enonic.wem.api.snapshot.RestoreResult;

public class RestoreResultJson
{
    private Set<String> indices;

    private String name;

    private RestoreResultJson()
    {

    }

    static RestoreResultJson from( final RestoreResult restoreResult )
    {
        final RestoreResultJson snapshotResultJson = new RestoreResultJson();
        snapshotResultJson.indices = restoreResult.getIndices();
        snapshotResultJson.name = restoreResult.getName();

        return snapshotResultJson;
    }

    public Set<String> getIndices()
    {
        return indices;
    }

    public String getName()
    {
        return name;
    }
}