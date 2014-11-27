package com.enonic.wem.script.internal;

import java.util.Map;

import javax.script.Bindings;

import com.enonic.wem.api.resource.ResourceKey;
import com.enonic.wem.script.ScriptExports;
import com.enonic.wem.script.internal.bean.BeanMapper;

final class ScriptExportsImpl
    implements ScriptExports
{
    private final ResourceKey script;

    private final ScriptExecutor executor;

    private final Bindings bindings;

    public ScriptExportsImpl( final ResourceKey script, final ScriptExecutor executor, final Bindings bindings )
    {
        this.script = script;
        this.executor = executor;
        this.bindings = bindings;
    }

    @Override
    public ResourceKey getScript()
    {
        return this.script;
    }

    @Override
    public boolean hasProperty( final String name )
    {
        return ( this.bindings != null ) && ( this.bindings.get( name ) != null );
    }

    @Override
    public Object executeMethod( final String name, final Object... args )
    {
        return this.executor.invokeMethod( this.bindings, name, args );
    }

    @Override
    public <T> T applyToBean( final T bean, final Object result )
    {
        if ( result instanceof Map )
        {
            BeanMapper.mapToBean( bean, (Map) result );
        }

        return bean;
    }
}
