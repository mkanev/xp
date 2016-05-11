package com.enonic.xp.admin.impl.portal;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.enonic.xp.branch.Branch;
import com.enonic.xp.content.ContentPath;
import com.enonic.xp.portal.PortalWebRequest;
import com.enonic.xp.portal.RenderMode;
import com.enonic.xp.portal.handler.BasePortalHandler;
import com.enonic.xp.web.handler.WebExceptionMapper;
import com.enonic.xp.web.handler.WebExceptionRenderer;
import com.enonic.xp.web.handler.WebHandler;
import com.enonic.xp.web.handler.WebRequest;
import com.enonic.xp.web.handler.WebResponse;

@Component(immediate = true, service = WebHandler.class)
public class AdminPortalHandler
    extends BasePortalHandler
{
    private final static String BASE_URI_START = "/admin/portal";

    private final static Pattern BASE_URI_PATTERN = Pattern.compile( "^" + BASE_URI_START + "/(edit|preview|admin)" );

    @Override
    protected boolean canHandle( final WebRequest webRequest )
    {
        return BASE_URI_PATTERN.matcher( webRequest.getPath() ).find();
    }

    @Override
    protected PortalWebRequest createPortalRequest( final WebRequest webRequest, final WebResponse webResponse )
    {
        final Matcher matcher = BASE_URI_PATTERN.matcher( webRequest.getPath() );
        matcher.find();
        final String baseUri = matcher.group( 0 );
        final RenderMode mode = RenderMode.from( matcher.group( 1 ) );
        final String baseSubPath = webRequest.getPath().substring( baseUri.length() + 1 );
        final Branch branch = findBranch( baseSubPath );
        final ContentPath contentPath = findContentPath( baseSubPath );

        return PortalWebRequest.create( webRequest ).
            baseUri( baseUri ).
            branch( branch ).
            contentPath( contentPath ). //TODO @SRS Should we retrieve content/site here ?
            mode( mode ).
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
