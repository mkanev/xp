package com.enonic.xp.web.handler;

import java.util.EnumSet;

import com.google.common.annotations.Beta;
import com.google.common.base.Joiner;

import com.enonic.xp.web.HttpMethod;
import com.enonic.xp.web.HttpStatus;

@Beta
public abstract class BaseWebHandler
    implements WebHandler
{
    private static final int DEFAULT_ORDER = 0;

    private int order;

    private EnumSet<HttpMethod> methodsAllowed;

    public BaseWebHandler()
    {
        this( DEFAULT_ORDER );
    }

    public BaseWebHandler( final int order )
    {
        this( order, EnumSet.allOf( HttpMethod.class ) );
    }

    public BaseWebHandler( final EnumSet<HttpMethod> methodsAllowed )
    {
        this( DEFAULT_ORDER, methodsAllowed );
    }

    public BaseWebHandler( final int order, final EnumSet<HttpMethod> methodsAllowed )
    {
        this.order = order;
        this.methodsAllowed = methodsAllowed;
    }

    @Override
    public int getOrder()
    {
        return order;
    }

    protected abstract boolean canHandle( WebRequest webRequest );

    protected abstract WebResponse doHandle( WebRequest webRequest, WebResponse webResponse, WebHandlerChain webHandlerChain );

    private void checkMethodAllowed( final HttpMethod method )
    {
        if ( !methodsAllowed.contains( method ) )
        {
            throw new WebException( HttpStatus.METHOD_NOT_ALLOWED, String.format( "Method %s not allowed", method ) );
        }
    }

    private WebResponse handleOptions( final WebResponse webResponse )
    {
        webResponse.setStatus( HttpStatus.OK );
        webResponse.setHeader( "Allow", Joiner.on( "," ).join( this.methodsAllowed ) );
        return webResponse;
    }


    @Override
    public WebResponse handle( final WebRequest webRequest, final WebResponse webResponse, final WebHandlerChain webHandlerChain )
    {
        if ( canHandle( webRequest ) )
        {
            final HttpMethod method = webRequest.getMethod();
            checkMethodAllowed( method );

            if ( HttpMethod.OPTIONS == method )
            {
                return handleOptions( webResponse );
            }

            return doHandle( webRequest, webResponse, webHandlerChain );
        }
        else
        {
            return webHandlerChain.handle( webRequest, webResponse );
        }

    }

    protected final WebException notFound( final String message, final Object... args )
    {
        return new WebException( HttpStatus.NOT_FOUND, String.format( message, args ) );
    }

    protected final WebException methodNotAllowed( final String message, final Object... args )
    {
        return new WebException( HttpStatus.METHOD_NOT_ALLOWED, String.format( message, args ) );
    }
}
