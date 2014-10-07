package com.enonic.wem.portal;

import java.util.Map;

public interface PortalResponse
{
    public final static int STATUS_OK = 200;

    public final static int STATUS_METHOD_NOT_ALLOWED = 405;

    public int getStatus();

    public void setStatus( int status );

    public String getContentType();

    public void setContentType( String contentType );

    public Object getBody();

    public void setBody( Object body );

    public Map<String, String> getHeaders();

    public void header( final String name, final String value );

    public boolean isPostProcess();

    public void setPostProcess( boolean postProcess );
}
