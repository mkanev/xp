package com.enonic.xp.portal;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import com.google.common.collect.Lists;

import com.enonic.xp.portal.serializer.RequestBodyReader;
import com.enonic.xp.web.HttpMethod;
import com.enonic.xp.web.servlet.ServletRequestUrlHelper;

public class PortalRequestAdapter
{
    public final static String BASE_URI = "/portal";

    public PortalRequest adapt( final HttpServletRequest req )
        throws IOException
    {
        final PortalRequest result = new PortalRequest();

        setBaseUri( req, result );
        setRenderMode( req, result );

        result.setMethod( HttpMethod.valueOf( req.getMethod().toUpperCase() ) );
        result.setRawRequest( req );
        result.setContentType( req.getContentType() );
        result.setBody( RequestBodyReader.readBody( req ) );

        result.setScheme( ServletRequestUrlHelper.getScheme( req ) );
        result.setHost( ServletRequestUrlHelper.getHost( req ) );
        result.setPort( ServletRequestUrlHelper.getPort( req ) );
        result.setPath( ServletRequestUrlHelper.getPath( req ) );
        result.setUrl( ServletRequestUrlHelper.getFullUrl( req ) );

        setParameters( req, result );
        setHeaders( req, result );
        setCookies( req, result );

        return result;
    }

    private void setBaseUri( final HttpServletRequest from, final PortalRequest to )
    {
        final PortalAttributes portalAttributes = (PortalAttributes) from.getAttribute( PortalAttributes.class.getName() );
        if ( portalAttributes != null && portalAttributes.getBaseUri() != null )
        {
            to.setBaseUri( portalAttributes.getBaseUri() );
        }
        else
        {
            to.setBaseUri( BASE_URI );
        }
    }

    private void setRenderMode( final HttpServletRequest from, final PortalRequest to )
    {
        final PortalAttributes portalAttributes = (PortalAttributes) from.getAttribute( PortalAttributes.class.getName() );
        if ( portalAttributes != null && portalAttributes.getRenderMode() != null )
        {
            to.setMode( portalAttributes.getRenderMode() );
        }
    }


    private void setHeaders( final HttpServletRequest from, final PortalRequest to )
    {
        for ( final String key : Collections.list( from.getHeaderNames() ) )
        {
            to.getHeaders().put( key, from.getHeader( key ) );
        }
    }

    private void setCookies( final HttpServletRequest from, final PortalRequest to )
    {
        final Cookie[] cookies = from.getCookies();
        if ( cookies == null )
        {
            return;
        }

        for ( final Cookie cookie : cookies )
        {
            to.getCookies().put( cookie.getName(), cookie.getValue() );
        }
    }

    private void setParameters( final HttpServletRequest from, final PortalRequest to )
    {
        for ( final Map.Entry<String, String[]> entry : from.getParameterMap().entrySet() )
        {
            to.getParams().putAll( entry.getKey(), Lists.newArrayList( entry.getValue() ) );
        }
    }
}