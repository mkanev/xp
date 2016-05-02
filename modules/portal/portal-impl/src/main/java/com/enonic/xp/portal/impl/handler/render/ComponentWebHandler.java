package com.enonic.xp.portal.impl.handler.render;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.enonic.xp.content.ContentService;
import com.enonic.xp.page.PageDescriptorService;
import com.enonic.xp.page.PageTemplateService;
import com.enonic.xp.portal.PortalWebRequest;
import com.enonic.xp.portal.PortalWebResponse;
import com.enonic.xp.portal.handler.PortalHandler;
import com.enonic.xp.portal.postprocess.PostProcessor;
import com.enonic.xp.portal.rendering.RendererFactory;
import com.enonic.xp.region.ComponentPath;
import com.enonic.xp.web.handler.EndpointWebHandler;
import com.enonic.xp.web.handler.WebHandlerChain;
import com.enonic.xp.web.handler.WebRequest;
import com.enonic.xp.web.handler.WebResponse;

@Component(immediate = true, service = PortalHandler.class)
public final class ComponentWebHandler
    extends EndpointWebHandler
{
    private ContentService contentService;

    private RendererFactory rendererFactory;

    private PageDescriptorService pageDescriptorService;

    private PageTemplateService pageTemplateService;

    protected PostProcessor postProcessor;

    public ComponentWebHandler()
    {
        super( 25, "component" );
    }

    @Override
    public boolean canHandle( final WebRequest webRequest )
    {
        return super.canHandle( webRequest ) && webRequest instanceof PortalWebRequest;
    }

    @Override
    protected WebResponse doHandle( final WebRequest webRequest, final WebResponse webResponse, final WebHandlerChain webHandlerChain )
    {
        final String endpointSubPath = getEndpointSubPath( webRequest );

        return ComponentWebHandlerWorker.create().
            portalWebRequest( (PortalWebRequest) webRequest ).
            portalWebResponse( (PortalWebResponse) webResponse ).
            contentService( contentService ).
            pageTemplateService( pageTemplateService ).
            pageDescriptorService( pageDescriptorService ).
            componentPath( ComponentPath.from( endpointSubPath ) ).
            rendererFactory( rendererFactory ).
            postProcessor( postProcessor ).build().
            execute();
    }

    @Reference
    public void setContentService( final ContentService contentService )
    {
        this.contentService = contentService;
    }

    @Reference
    public void setRendererFactory( final RendererFactory rendererFactory )
    {
        this.rendererFactory = rendererFactory;
    }

    @Reference
    public void setPageDescriptorService( final PageDescriptorService pageDescriptorService )
    {
        this.pageDescriptorService = pageDescriptorService;
    }

    @Reference
    public void setPageTemplateService( final PageTemplateService pageTemplateService )
    {
        this.pageTemplateService = pageTemplateService;
    }

    @Reference
    public void setPostProcessor( final PostProcessor postProcessor )
    {
        this.postProcessor = postProcessor;
    }
}
