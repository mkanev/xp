package com.enonic.xp.portal.impl.handler.asset;

import java.util.Map;

import org.junit.Test;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;

import com.google.common.collect.Maps;
import com.google.common.net.MediaType;

import com.enonic.xp.portal.PortalWebRequest;
import com.enonic.xp.portal.RenderMode;
import com.enonic.xp.portal.handler.BaseWebHandlerTest;
import com.enonic.xp.resource.Resource;
import com.enonic.xp.resource.ResourceKey;
import com.enonic.xp.resource.ResourceService;
import com.enonic.xp.web.HttpMethod;
import com.enonic.xp.web.HttpStatus;
import com.enonic.xp.web.handler.WebException;
import com.enonic.xp.web.handler.WebResponse;

import static org.junit.Assert.*;

public class AssetWebHandlerTest
    extends BaseWebHandlerTest
{
    private AssetWebHandler handler;

    private Map<Object, Resource> resources;

    private Resource nullResource;

    @Override
    protected void configure( final PortalWebRequest.Builder requestBuilder )
        throws Exception
    {
        this.resources = Maps.newHashMap();

        final ResourceService resourceService = Mockito.mock( ResourceService.class );
        Mockito.when( resourceService.getResource( Mockito.any() ) ).then( this::getResource );

        this.handler = new AssetWebHandler();
        this.handler.setResourceService( resourceService );

        this.nullResource = Mockito.mock( Resource.class );
        Mockito.when( this.nullResource.exists() ).thenReturn( false );

        requestBuilder.method( HttpMethod.GET );
        requestBuilder.endpointPath( "/_/asset/demo/css/main.css" );
    }

    private Resource addResource( final String key )
        throws Exception
    {
        final ResourceKey resourceKey = ResourceKey.from( key );

        final Resource resource = Mockito.mock( Resource.class );
        Mockito.when( resource.exists() ).thenReturn( true );
        Mockito.when( resource.getKey() ).thenReturn( resourceKey );

        this.resources.put( resourceKey, resource );
        return resource;
    }

    private Resource getResource( final InvocationOnMock invocation )
    {
        final Resource res = this.resources.get( invocation.getArguments()[0] );
        return res != null ? res : this.nullResource;
    }

    @Test
    public void testOrder()
    {
        assertEquals( 0, this.handler.getOrder() );
    }

    @Test
    public void testMatch()
    {
        PortalWebRequest portalWebRequest = PortalWebRequest.create( this.request ).endpointPath( null ).build();
        assertEquals( false, this.handler.canHandle( portalWebRequest ) );

        portalWebRequest = PortalWebRequest.create( this.request ).endpointPath( "/_/other/a/b" ).build();
        assertEquals( false, this.handler.canHandle( portalWebRequest ) );

        portalWebRequest = PortalWebRequest.create( this.request ).endpointPath( "/asset/a/b" ).build();
        assertEquals( false, this.handler.canHandle( portalWebRequest ) );

        portalWebRequest = PortalWebRequest.create( this.request ).endpointPath( "/_/asset/a/b" ).build();
        assertEquals( true, this.handler.canHandle( this.request ) );
    }

    @Test
    public void testMethodNotAllowed()
        throws Exception
    {
        assertMethodNotAllowed( this.handler, HttpMethod.POST );
        assertMethodNotAllowed( this.handler, HttpMethod.DELETE );
        assertMethodNotAllowed( this.handler, HttpMethod.PUT );
        assertMethodNotAllowed( this.handler, HttpMethod.TRACE );
    }

    @Test
    public void testOptions()
        throws Exception
    {
        PortalWebRequest portalWebRequest = PortalWebRequest.create( this.request ).method( HttpMethod.OPTIONS ).build();

        final WebResponse res = this.handler.handle( portalWebRequest, this.response, null );
        assertNotNull( res );
        assertEquals( HttpStatus.OK, res.getStatus() );
        assertEquals( "GET,HEAD,OPTIONS", res.getHeaders().get( "Allow" ) );
    }

    @Test
    public void testSiteResourceFound()
        throws Exception
    {
        final Resource resource = addResource( "demo:/site/assets/css/main.css" );

        final WebResponse res = this.handler.handle( this.request, this.response, null );
        assertNotNull( res );
        assertEquals( HttpStatus.OK, res.getStatus() );
        assertEquals( MediaType.CSS_UTF_8.withoutParameters(), res.getContentType() );
        assertSame( resource, res.getBody() );
    }

    @Test
    public void testRootResourceFound()
        throws Exception
    {
        addResource( "demo:/site/assets/css/main.css" );
        final Resource resource = addResource( "demo:/assets/css/main.css" );

        final WebResponse res = this.handler.handle( this.request, this.response, null );
        assertNotNull( res );
        assertEquals( HttpStatus.OK, res.getStatus() );
        assertEquals( MediaType.CSS_UTF_8.withoutParameters(), res.getContentType() );
        assertSame( resource, res.getBody() );
    }

    @Test
    public void testResourceNotFound()
        throws Exception
    {
        try
        {
            this.handler.handle( this.request, this.response, null );
            fail( "Should throw exception" );
        }
        catch ( final WebException e )
        {
            assertEquals( HttpStatus.NOT_FOUND, e.getStatus() );
            assertEquals( "Resource [demo:/assets/css/main.css] not found", e.getMessage() );
        }
    }

    @Test
    public void testNotValidUrlPattern()
        throws Exception
    {
        PortalWebRequest portalWebRequest = PortalWebRequest.create( this.request ).endpointPath( "/_/asset/" ).build();

        try
        {
            this.handler.handle( portalWebRequest, this.response, null );
            fail( "Should throw exception" );
        }
        catch ( final WebException e )
        {
            assertEquals( HttpStatus.NOT_FOUND, e.getStatus() );
            assertEquals( "Not a valid asset url pattern", e.getMessage() );
        }
    }

    @Test
    public void testCacheHeader()
        throws Exception
    {
        addResource( "demo:/site/assets/css/main.css" );
        PortalWebRequest portalWebRequest =
            PortalWebRequest.create( this.request ).endpointPath( "/_/asset/demo:123/css/main.css" ).build();

        final WebResponse res = this.handler.handle( portalWebRequest, this.response, null );
        assertNotNull( res );
        assertEquals( HttpStatus.OK, res.getStatus() );
        assertEquals( "public, no-transform, max-age=31536000", res.getHeaders().get( "Cache-Control" ) );
    }

    @Test
    public void testNoCacheHeader()
        throws Exception
    {
        addResource( "demo:/site/assets/css/main.css" );
        PortalWebRequest portalWebRequest = PortalWebRequest.create( this.request ).mode( RenderMode.EDIT ).build();

        final WebResponse res = this.handler.handle( portalWebRequest, this.response, null );
        assertNotNull( res );
        assertEquals( HttpStatus.OK, res.getStatus() );
        assertNull( res.getHeaders().get( "Cache-Control" ) );
    }
}
