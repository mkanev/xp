package com.enonic.xp.module;

import java.time.Instant;

import org.osgi.framework.Bundle;

import com.google.common.annotations.Beta;

@Beta
public interface Module
{
    ModuleKey getKey();

    ModuleVersion getVersion();

    String getDisplayName();

    String getSystemVersion();

    String getMaxSystemVersion();

    String getMinSystemVersion();

    String getUrl();

    String getVendorName();

    String getVendorUrl();

    Bundle getBundle();

    Instant getModifiedTime();

    boolean isStarted();

    void checkIfStarted();

    boolean isApplication();

    boolean isSystem();
}
