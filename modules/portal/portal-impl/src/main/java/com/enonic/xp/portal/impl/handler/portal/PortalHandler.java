package com.enonic.xp.portal.impl.handler.portal;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.enonic.xp.branch.Branch;
import com.enonic.xp.content.ContentPath;
import com.enonic.xp.portal.PortalWebRequest;
import com.enonic.xp.portal.handler.BasePortalHandler;
import com.enonic.xp.web.handler.WebExceptionMapper;
import com.enonic.xp.web.handler.WebExceptionRenderer;
import com.enonic.xp.web.handler.WebHandler;
import com.enonic.xp.web.handler.WebRequest;
import com.enonic.xp.web.handler.WebResponse;

@Component(immediate = true, service = WebHandler.class)
public class PortalHandler
    extends BasePortalHandler
{
    private final static String BASE_URI = "/portal";

    private final static String BRANCH_PREFIX = BASE_URI + "/";

    @Override
    protected boolean canHandle( final WebRequest webRequest )
    {
        return webRequest.getPath().startsWith( BRANCH_PREFIX );
    }

    @Override
    protected PortalWebRequest createPortalRequest( final WebRequest webRequest, final WebResponse webResponse )
    {
        final String baseSubPath = webRequest.getPath().substring( BRANCH_PREFIX.length() );
        final Branch branch = findBranch( baseSubPath );
        final ContentPath contentPath = findContentPath( baseSubPath );

        return PortalWebRequest.create( webRequest ).
            baseUri( BASE_URI ).
            branch( branch ).
            contentPath( contentPath ). //TODO @SRS Should we retrieve content/site here ? It was not done before but we could
            build();
    }

    @Reference
    public void setWebExceptionMapper( final WebExceptionMapper webExceptionMapper )
    {
        this.webExceptionMapper = webExceptionMapper;
    }

    @Reference
    public void setWebExceptionRenderer( final WebExceptionRenderer webExceptionRenderer )
    {
        this.webExceptionRenderer = webExceptionRenderer;
    }
}
