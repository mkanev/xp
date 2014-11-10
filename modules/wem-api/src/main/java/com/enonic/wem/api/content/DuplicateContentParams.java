package com.enonic.wem.api.content;


import com.google.common.base.Preconditions;

import com.enonic.wem.api.account.UserKey;

public final class DuplicateContentParams
{
    private ContentId contentId;

    private UserKey creator;

    public DuplicateContentParams( final ContentId contentId )
    {
        this.contentId = contentId;
    }

    public ContentId getContentId()
    {
        return contentId;
    }

    public DuplicateContentParams creator( final UserKey creator )
    {
        this.creator = creator;
        return this;
    }

    public UserKey getCreator()
    {
        return creator;
    }

    public void validate()
    {
        Preconditions.checkNotNull( this.contentId, "Content id cannot be null" );
    }

    @Override
    public boolean equals( final Object o )
    {
        if ( this == o )
        {
            return true;
        }
        if ( !( o instanceof DuplicateContentParams ) )
        {
            return false;
        }

        final DuplicateContentParams that = (DuplicateContentParams) o;

        if ( !contentId.equals( that.contentId ) )
        {
            return false;
        }

        return true;
    }

    @Override
    public int hashCode()
    {
        return contentId.hashCode();
    }
}
