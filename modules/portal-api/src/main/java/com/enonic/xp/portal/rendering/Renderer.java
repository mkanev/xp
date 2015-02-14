package com.enonic.xp.portal.rendering;

import com.enonic.wem.api.rendering.Renderable;
import com.enonic.xp.portal.PortalContext;

public interface Renderer<R extends Renderable>
{
    Class<R> getType();

    RenderResult render( R component, PortalContext context );
}