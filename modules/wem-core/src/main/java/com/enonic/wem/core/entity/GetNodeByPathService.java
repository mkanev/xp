package com.enonic.wem.core.entity;

import javax.jcr.Session;

import com.enonic.wem.api.command.entity.GetNodeByPath;
import com.enonic.wem.api.entity.Node;

public class GetNodeByPathService
    extends NodeService
{
    private final GetNodeByPath getNodeByPath;

    public GetNodeByPathService( final Session session, final GetNodeByPath getNodeByPath )
    {
        super( session );
        this.getNodeByPath = getNodeByPath;
    }

    public Node execute()
    {
        return nodeJcrDao.getNodeByPath( getNodeByPath.getPath() );
    }

}
