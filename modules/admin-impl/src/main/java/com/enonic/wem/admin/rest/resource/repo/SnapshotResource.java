package com.enonic.wem.admin.rest.resource.repo;

import java.time.Instant;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.enonic.wem.admin.AdminResource;
import com.enonic.wem.admin.rest.resource.ResourceConstants;
import com.enonic.wem.api.node.NodeService;
import com.enonic.wem.api.repository.RepositoryId;
import com.enonic.wem.api.snapshot.DeleteSnapshotParams;
import com.enonic.wem.api.snapshot.DeleteSnapshotsResult;
import com.enonic.wem.api.snapshot.RestoreParams;
import com.enonic.wem.api.snapshot.RestoreResult;
import com.enonic.wem.api.snapshot.SnapshotParams;
import com.enonic.wem.api.snapshot.SnapshotResult;
import com.enonic.wem.api.snapshot.SnapshotResults;

@Path(ResourceConstants.REST_ROOT + "repo")
@Produces(MediaType.APPLICATION_JSON)
@Component(immediate = true)
public class SnapshotResource
    implements AdminResource
{
    private NodeService nodeService;

    @POST
    @Path("snapshot")
    public SnapshotResultJson snapshot( final SnapshotRequestJson params )
        throws Exception
    {
        final SnapshotResult result = this.nodeService.snapshot( SnapshotParams.create().
            snapshotName( createSnapshotName( params.getRepositoryId() ) ).
            setIncludeIndexedData( !params.isSkipIndexedData() ).
            repositoryId( params.getRepositoryId() ).
            build() );

        return SnapshotResultJson.from( result );
    }

    @POST
    @Path("restore")
    public RestoreResultJson restore( final RestoreRequestJson params )
        throws Exception
    {
        final RestoreResult result = this.nodeService.restore( RestoreParams.create().
            snapshotName( params.getSnapshotName() ).
            setIncludeIndexedData( !params.isSkipIndexedData() ).
            repositoryId( params.getRepositoryId() ).
            build() );

        return RestoreResultJson.from( result );
    }

    @POST
    @Path("delete")
    public DeleteSnapshotsResultJson delete( final DeleteSnapshotRequestJson params )
        throws Exception
    {
        final DeleteSnapshotsResult result = this.nodeService.deleteSnapshot( DeleteSnapshotParams.create().
            before( params.getBefore() ).
            addAll( params.getSnapshotNames() ).
            build() );

        return DeleteSnapshotsResultJson.from( result );
    }

    @GET
    @Path("list")
    public SnapshotResultsJson list()
        throws Exception
    {
        final SnapshotResults snapshotResults = this.nodeService.listSnapshots();

        return SnapshotResultsJson.from( snapshotResults );
    }

    private static String createSnapshotName( final RepositoryId repositoryId )
    {
        return ( repositoryId + Instant.now().toString() ).toLowerCase();
    }

    @Reference
    public void setNodeService( final NodeService nodeService )
    {
        this.nodeService = nodeService;
    }

}