package com.enonic.xp.portal.impl.handler.portal;

import org.osgi.service.component.annotations.Component;

import com.google.common.base.Strings;

import com.enonic.xp.branch.Branch;
import com.enonic.xp.content.ContentPath;
import com.enonic.xp.portal.PortalWebRequest;
import com.enonic.xp.portal.PortalWebResponse;
import com.enonic.xp.web.handler.BaseWebHandler;
import com.enonic.xp.web.handler.WebHandler;
import com.enonic.xp.web.handler.WebHandlerChain;
import com.enonic.xp.web.handler.WebRequest;
import com.enonic.xp.web.handler.WebResponse;

@Component(immediate = true, service = WebHandler.class)
public class PortalWebHandler
    extends BaseWebHandler
{
    private final static String BASE_URI = "/test/portal"; //TODO Rewrite

    private final static String BRANCH_PREFIX = BASE_URI + "/";

    public PortalWebHandler()
    {
        super( -50 );
    }

    @Override
    protected boolean canHandle( final WebRequest webRequest )
    {
        return webRequest.getPath().startsWith( BASE_URI );
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
            final String baseSubPath = webRequest.getPath().substring( BRANCH_PREFIX.length() );
            final Branch branch = findBranch( baseSubPath );
            final ContentPath contentPath = findContentPath( baseSubPath );

            portalWebRequest = PortalWebRequest.create( webRequest ).
                baseUri( BASE_URI ).
                branch( branch ).
                contentPath( contentPath ). //TODO Retrieval of content and site could be done here
//                site( site ).
//                content( content ).
//                pageTemplate().
//                component().
//                applicationKey().
//                pageDescriptor().
//                controllerScript().
                build();
        }
        return webHandlerChain.handle( portalWebRequest, new PortalWebResponse() );
    }

    private static Branch findBranch( final String baseSubPath )
    {
        final int index = baseSubPath.indexOf( '/' );
        final String result = baseSubPath.substring( 0, index > 0 ? index : baseSubPath.length() );
        return Strings.isNullOrEmpty( result ) ? null : Branch.from( result );
    }

    private static ContentPath findContentPath( final String baseSubPath )
    {
        final String branchSubPath = findPathAfterBranch( baseSubPath );
        final int underscore = branchSubPath.indexOf( "/_/" );
        final String result = branchSubPath.substring( 0, underscore > -1 ? underscore : branchSubPath.length() );
        return ContentPath.from( result.startsWith( "/" ) ? result : ( "/" + result ) );
    }

    private static String findPathAfterBranch( final String baseSubPath )
    {
        final int index = baseSubPath.indexOf( '/' );
        return baseSubPath.substring( index > 0 ? index : baseSubPath.length() );
    }
}
