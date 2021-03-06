package com.enonic.xp.web.jetty.impl;

import java.util.Dictionary;
import java.util.Hashtable;

import javax.servlet.ServletContext;

import org.apache.felix.http.base.internal.AbstractHttpActivator;
import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceRegistration;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;

@Component(immediate = true, service = JettyController.class, configurationPid = "com.enonic.xp.web.jetty")
public final class JettyActivator
    extends AbstractHttpActivator
    implements JettyController
{
    private BundleContext context;

    protected JettyService service;

    private JettyConfig config;

    private ServiceRegistration controllerReg;

    public JettyActivator()
    {
        System.setProperty( "org.apache.felix.http.shared_servlet_context_attributes", "true" );
    }

    @Activate
    public void activate( final BundleContext context, final JettyConfig config )
        throws Exception
    {
        this.context = context;
        fixJettyVersion();

        this.config = config;
        this.service = new JettyService();
        this.service.config = this.config;

        start( this.context );
    }

    @Override
    protected void doStart()
        throws Exception
    {
        super.doStart();
        publishController();

        this.service.dispatcherServlet = getDispatcherServlet();
        this.service.eventDispatcher = getEventDispatcher();

        this.service.start();
    }

    @Deactivate
    public void deactivate()
        throws Exception
    {
        this.controllerReg.unregister();
        this.service.stop();
        stop( this.context );
    }

    private void fixJettyVersion()
    {
        final Dictionary<String, String> headers = this.context.getBundle().getHeaders();
        final String version = headers.get( "X-Jetty-Version" );

        if ( version != null )
        {
            System.setProperty( "jetty.version", version );
        }
    }

    @Override
    public ServletContext getServletContext()
    {
        return this.service.context.getServletHandler().getServletContext();
    }

    private void publishController()
    {
        final Hashtable<String, Object> map = new Hashtable<>();
        map.put( "http.enabled", this.config.http_enabled() );
        map.put( "http.port", this.config.http_port() );

        this.controllerReg = this.context.registerService( JettyController.class, this, map );
    }
}
