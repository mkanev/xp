package com.enonic.xp.auth;

import com.google.common.annotations.Beta;

import com.enonic.xp.app.ApplicationKey;

@Beta
public interface AuthDescriptorService
{
    AuthDescriptor getDescriptor( final ApplicationKey key );
}