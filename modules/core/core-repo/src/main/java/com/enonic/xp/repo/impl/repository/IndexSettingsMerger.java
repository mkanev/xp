package com.enonic.xp.repo.impl.repository;

import com.enonic.xp.repository.IndexSettings;
import com.enonic.xp.util.JsonMergeHelper;

class IndexSettingsMerger
{
    public static IndexSettings merge( final IndexSettings defaultSettings, final IndexSettings settings )
    {
        return new IndexSettings( JsonMergeHelper.merge( defaultSettings.get(), settings.get() ) );
    }
}
