package com.enonic.xp.portal.handler;

import com.google.common.base.Strings;

import com.enonic.xp.branch.Branch;
import com.enonic.xp.content.ContentPath;
import com.enonic.xp.portal.PortalWebRequest;
import com.enonic.xp.portal.PortalWebResponse;
import com.enonic.xp.web.handler.BaseWebHandler;
import com.enonic.xp.web.handler.WebException;
import com.enonic.xp.web.handler.WebExceptionMapper;
import com.enonic.xp.web.handler.WebExceptionRenderer;
import com.enonic.xp.web.handler.WebHandlerChain;
import com.enonic.xp.web.handler.WebRequest;
import com.enonic.xp.web.handler.WebResponse;

public abstract class BasePortalHandler
    extends BaseWebHandler
{
    protected WebExceptionMapper webExceptionMapper;

    protected WebExceptionRenderer webExceptionRenderer;

    public BasePortalHandler()
    {
        super( -50 );
    }

    @Override
    protected WebResponse doHandle( final WebRequest webRequest, final WebResponse webResponse, final WebHandlerChain webHandlerChain )
    {
        final PortalWebRequest portalWebRequest;
        if ( webRequest instanceof PortalWebRequest )
        {
            portalWebRequest = (PortalWebRequest) webRequest;
        }
        else
        {
            portalWebRequest = createPortalRequest( webRequest, webResponse );
        }

        try
        {
            final WebResponse returnedWebResponse = webHandlerChain.handle( portalWebRequest, new PortalWebResponse() );
            webExceptionMapper.throwIfNeeded( returnedWebResponse );
            return returnedWebResponse;
        }
        catch ( Exception e )
        {
            return handleError( portalWebRequest, e );
        }
    }

    protected abstract PortalWebRequest createPortalRequest( final WebRequest webRequest, final WebResponse webResponse );

    private WebResponse handleError( final WebRequest webRequest, final Exception e )
    {
        final WebException webException = webExceptionMapper.map( e );
        return webExceptionRenderer.render( webRequest, webException );
    }

    protected static Branch findBranch( final String baseSubPath )
    {
        final int index = baseSubPath.indexOf( '/' );
        final String result = baseSubPath.substring( 0, index > 0 ? index : baseSubPath.length() );
        return Strings.isNullOrEmpty( result ) ? null : Branch.from( result );
    }

    protected static ContentPath findContentPath( final String baseSubPath )
    {
        final String branchSubPath = findPathAfterBranch( baseSubPath );
        final int underscore = branchSubPath.indexOf( "/_/" );
        final String result = branchSubPath.substring( 0, underscore > -1 ? underscore : branchSubPath.length() );
        return ContentPath.from( result.startsWith( "/" ) ? result : ( "/" + result ) );
    }

    protected static String findPathAfterBranch( final String baseSubPath )
    {
        final int index = baseSubPath.indexOf( '/' );
        return baseSubPath.substring( index > 0 ? index : baseSubPath.length() );
    }
}
