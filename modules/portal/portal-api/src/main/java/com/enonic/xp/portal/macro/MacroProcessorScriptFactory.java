package com.enonic.xp.portal.macro;

import com.google.common.annotations.Beta;

import com.enonic.xp.resource.ResourceKey;

@Beta
public interface MacroProcessorScriptFactory
{
    MacroProcessor fromDir( ResourceKey dir );

    MacroProcessor fromScript( ResourceKey script );
}
